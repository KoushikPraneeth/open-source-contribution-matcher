
// This is a comprehensive service worker for offline access and caching
const CACHE_NAME = 'contribspark-cache-v3';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/offline.html'
];

// Dynamic assets we want to cache for offline use
const DYNAMIC_CACHE_URLS = [
  '/api/user-profile',
  '/api/skills',
  '/api/recommendations'
];

// App shell URLs that should always be available
const APP_SHELL = [
  '/signin',
  '/onboarding',
  '/recommendations'
];

// Set this to true to enable extensive logging
const DEBUG = false;

function log(...args) {
  if (DEBUG) {
    console.log('[ServiceWorker]', ...args);
  }
}

// Install event - cache static assets
self.addEventListener('install', event => {
  log('Installing service worker');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force activation on all clients
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  log('Activating service worker');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            log('Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      log('Service worker activated - claiming clients');
      return self.clients.claim(); // Take control of clients ASAP
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Don't intercept module script requests - this fixes the loading issue
  if (event.request.url.endsWith('.js') && event.request.destination === 'script') {
    return;
  }
  
  // For API requests, use network first, then cache
  if (DYNAMIC_CACHE_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // For app shell routes, use cache first with network fallback
  if (isAppShellRoute(event.request.url)) {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // For other requests, use stale-while-revalidate approach
  event.respondWith(staleWhileRevalidateStrategy(event.request));
});

// Check if URL is part of app shell
function isAppShellRoute(url) {
  const urlObj = new URL(url);
  return APP_SHELL.some(route => urlObj.pathname === route);
}

// Cache-first strategy for static assets and app shell
function cacheFirstStrategy(request) {
  return caches.match(request)
    .then(cachedResponse => {
      if (cachedResponse) {
        // Return cached response and update cache in background
        updateCacheInBackground(request);
        return cachedResponse;
      }
      
      // If not in cache, fetch from network
      return fetchAndCache(request);
    })
    .catch(() => {
      // If both cache and network fail, return offline fallback
      return caches.match('/offline.html') || new Response('You are offline');
    });
}

// Network-first strategy for API requests
function networkFirstStrategy(request) {
  return fetchAndCache(request)
    .catch(() => {
      return caches.match(request) || 
        new Response(
          JSON.stringify({
            error: 'You are offline',
            isOffline: true,
            timestamp: new Date().toISOString()
          }), 
          {
            headers: {'Content-Type': 'application/json'}
          }
        );
    });
}

// Stale-while-revalidate strategy
function staleWhileRevalidateStrategy(request) {
  return caches.match(request)
    .then(cachedResponse => {
      // Return cached response immediately if available
      const fetchPromise = fetch(request)
        .then(networkResponse => {
          // Update cache with fresh response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(request, responseToCache);
              });
          }
          return networkResponse;
        })
        .catch(error => {
          log('Fetch failed:', error);
          // If network fetch fails, return the error for handling
          throw error;
        });
      
      return cachedResponse || fetchPromise;
    })
    .catch(() => {
      // If both cache and network fail, return offline fallback
      if (request.headers.get('Accept')?.includes('text/html')) {
        return caches.match('/offline.html');
      }
      return new Response('Network error occurred', { status: 503 });
    });
}

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request).then(response => {
    // Only cache valid responses
    if (!response || response.status !== 200) {
      return response;
    }
    
    const responseToCache = response.clone();
    caches.open(CACHE_NAME)
      .then(cache => {
        cache.put(request, responseToCache);
        log('Cached response for', request.url);
      });
      
    return response;
  });
}

// Update cache in background
function updateCacheInBackground(request) {
  setTimeout(() => {
    fetch(request).then(response => {
      if (!response || response.status !== 200) {
        return;
      }
      
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, response);
          log('Updated cache for', request.url);
        });
    }).catch(() => {
      // Silently fail on background update
    });
  }, 1000);
}

// Handle sync events for offline data
self.addEventListener('sync', event => {
  log('Sync event triggered', event.tag);
  
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  } else if (event.tag === 'sync-contributions') {
    event.waitUntil(syncContributionData());
  }
});

// Handle push notifications
self.addEventListener('push', event => {
  log('Push event received');
  
  const data = event.data?.json() || { title: 'New notification', body: 'Check your updates' };
  
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/logo192.png',
      badge: '/favicon.ico',
      data: data.url ? { url: data.url } : null
    })
  );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
  log('Notification click handled');
  
  event.notification.close();
  
  if (event.notification.data?.url) {
    event.waitUntil(
      clients.openWindow(event.notification.data.url)
    );
  } else {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});

// Sync user data when back online
function syncUserData() {
  log('Syncing user data');
  
  // Check if there's any pending user data in IndexedDB to sync
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        feature: 'user-data',
        timestamp: new Date().toISOString()
      });
    });
  });
}

// Sync contribution data when back online
function syncContributionData() {
  log('Syncing contribution data');
  
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        feature: 'contributions',
        timestamp: new Date().toISOString()
      });
    });
  });
}

// Periodic background sync for regular updates (if browser supports it)
if ('periodicSync' in self.registration) {
  self.addEventListener('periodicsync', event => {
    log('Periodic sync event', event.tag);
    
    if (event.tag === 'update-content') {
      event.waitUntil(updateBackgroundContent());
    }
  });
}

// Update content in the background
async function updateBackgroundContent() {
  log('Updating background content');
  
  try {
    // Fetch latest recommendations data
    const recommendationsResponse = await fetch('/api/recommendations');
    if (recommendationsResponse.ok) {
      const cache = await caches.open(CACHE_NAME);
      await cache.put('/api/recommendations', recommendationsResponse);
      log('Updated recommendations cache');
    }
  } catch (error) {
    log('Background update failed', error);
  }
}
