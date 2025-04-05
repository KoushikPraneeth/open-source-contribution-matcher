
// This is a comprehensive service worker for offline access and caching
const CACHE_NAME = 'contribspark-cache-v2';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico'
];

// Dynamic assets we want to cache for offline use
const DYNAMIC_CACHE_URLS = [
  '/api/user-profile',
  '/api/skills',
  '/api/recommendations'
];

// Install event - cache static assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting()) // Force activation on all clients
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Removing old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim()) // Take control of clients ASAP
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Don't intercept module script requests - this fixes the loading issue
  if (event.request.url.endsWith('.js') && event.request.destination === 'script') {
    return;
  }
  
  // For API requests, use network first, then cache
  if (DYNAMIC_CACHE_URLS.some(url => event.request.url.includes(url))) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // For other requests, use cache first, then network
  event.respondWith(cacheFirstStrategy(event.request));
});

// Cache-first strategy for static assets
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
      return caches.match(request) || new Response(JSON.stringify({error: 'You are offline'}), {
        headers: {'Content-Type': 'application/json'}
      });
    });
}

// Helper function to fetch and cache
function fetchAndCache(request) {
  return fetch(request).then(response => {
    // Only cache valid responses
    if (!response || response.status !== 200 || response.type !== 'basic') {
      return response;
    }
    
    const responseToCache = response.clone();
    caches.open(CACHE_NAME)
      .then(cache => {
        cache.put(request, responseToCache);
      });
      
    return response;
  });
}

// Update cache in background
function updateCacheInBackground(request) {
  setTimeout(() => {
    fetch(request).then(response => {
      if (!response || response.status !== 200 || response.type !== 'basic') {
        return;
      }
      
      caches.open(CACHE_NAME)
        .then(cache => {
          cache.put(request, response);
        });
    }).catch(() => {
      // Silently fail on background update
    });
  }, 1000);
}

// Handle sync events for offline data
self.addEventListener('sync', event => {
  if (event.tag === 'sync-user-data') {
    event.waitUntil(syncUserData());
  }
});

// Sync user data when back online
function syncUserData() {
  return self.clients.matchAll().then(clients => {
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        timestamp: new Date().toISOString()
      });
    });
  });
}
