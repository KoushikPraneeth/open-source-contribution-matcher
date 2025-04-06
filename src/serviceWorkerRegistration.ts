// This optional code is used to register a service worker.
// register() is not called by default.

const isLocalhost = Boolean(
  window.location.hostname === 'localhost' ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === '[::1]' ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
);

type Config = {
  onSuccess?: (registration: ServiceWorkerRegistration) => void;
  onUpdate?: (registration: ServiceWorkerRegistration) => void;
  onOffline?: () => void;
  onOnline?: () => void;
  onMessage?: (event: MessageEvent) => void;
};

export function register(config?: Config) {
  if (('serviceWorker' in navigator)) {
    // The URL constructor is available in all browsers that support SW.
    const publicUrl = new URL(import.meta.env.BASE_URL || '', window.location.href);
    if (publicUrl.origin !== window.location.origin) {
      // Our service worker won't work if PUBLIC_URL is on a different origin
      // from what our page is served on. This might happen if a CDN is used to
      // serve assets; see https://github.com/facebook/create-react-app/issues/2374
      return;
    }

    window.addEventListener('load', () => {
      const swUrl = `/service-worker.js`;

      if (isLocalhost) {
        // This is running on localhost. Let's check if a service worker still exists or not.
        checkValidServiceWorker(swUrl, config);
      } else {
        // Is not localhost. Just register service worker
        registerValidSW(swUrl, config);
      }
      
      // Set up online/offline listeners
      setupConnectivityListeners(config);
      
      // Set up service worker message listener
      if (config && config.onMessage && navigator.serviceWorker.controller) {
        navigator.serviceWorker.addEventListener('message', config.onMessage);
      }
    });
  }
}

function registerValidSW(swUrl: string, config?: Config) {
  navigator.serviceWorker
    .register(swUrl)
    .then((registration) => {
      // Listen for messages from the service worker
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Message from service worker:', event.data);
        
        if (event.data && event.data.type === 'SYNC_COMPLETE') {
          console.log(`Data sync completed for ${event.data.feature} at ${event.data.timestamp}`);
          
          // Trigger refresh for specific content types after sync
          if (event.data.feature === 'user-data') {
            window.dispatchEvent(new CustomEvent('user-data-synced'));
          }
          
          if (event.data.feature === 'contributions') {
            window.dispatchEvent(new CustomEvent('contributions-synced'));
          }
        }
        
        // Call the onMessage handler if provided
        if (config && config.onMessage) {
          config.onMessage(event);
        }
      });
      
      registration.onupdatefound = () => {
        const installingWorker = registration.installing;
        if (installingWorker == null) {
          return;
        }
        installingWorker.onstatechange = () => {
          if (installingWorker.state === 'installed') {
            if (navigator.serviceWorker.controller) {
              // At this point, the updated precached content has been fetched,
              // but the previous service worker will still serve the older
              // content until all client tabs are closed.
              console.log(
                'New content is available and will be used when all ' +
                  'tabs for this page are closed.'
              );

              // Execute callback
              if (config && config.onUpdate) {
                config.onUpdate(registration);
              }
            } else {
              // At this point, everything has been precached.
              // It's the perfect time to display a
              // "Content is cached for offline use." message.
              console.log('Content is cached for offline use.');

              // Execute callback
              if (config && config.onSuccess) {
                config.onSuccess(registration);
              }
            }
          }
        };
      };
    })
    .catch((error) => {
      console.error('Error during service worker registration:', error);
    });
}

function checkValidServiceWorker(swUrl: string, config?: Config) {
  // Check if the service worker can be found. If it can't reload the page.
  fetch(swUrl, {
    headers: { 'Service-Worker': 'script' },
  })
    .then((response) => {
      // Ensure service worker exists, and that we really are getting a JS file.
      const contentType = response.headers.get('content-type');
      if (
        response.status === 404 ||
        (contentType != null && contentType.indexOf('javascript') === -1)
      ) {
        // No service worker found. Probably a different app. Reload the page.
        navigator.serviceWorker.ready.then((registration) => {
          registration.unregister().then(() => {
            window.location.reload();
          });
        });
      } else {
        // Service worker found. Proceed as normal.
        registerValidSW(swUrl, config);
      }
    })
    .catch(() => {
      console.log('No internet connection found. App is running in offline mode.');
      if (config && config.onOffline) {
        config.onOffline();
      }
    });
}

function setupConnectivityListeners(config?: Config) {
  // Handle online event
  window.addEventListener('online', () => {
    console.log('Application is online. Syncing data...');
    if (config && config.onOnline) {
      config.onOnline();
    }
    
    // Trigger sync events when going back online
    if ('serviceWorker' in navigator && 'SyncManager' in window) {
      navigator.serviceWorker.ready.then((registration) => {
        // @ts-ignore - TypeScript doesn't recognize SyncManager yet
        registration.sync.register('sync-user-data');
        // @ts-ignore
        registration.sync.register('sync-contributions');
      });
    }
    
    // Consider registering periodic sync if supported
    if ('serviceWorker' in navigator && 'periodicSync' in ServiceWorkerRegistration.prototype) {
      navigator.serviceWorker.ready.then(async (registration) => {
        try {
          // @ts-ignore - TypeScript doesn't recognize periodicSync yet
          const status = await navigator.permissions.query({
            // @ts-ignore - TypeScript doesn't know this permission name yet
            name: 'periodic-background-sync',
          });
          
          if (status.state === 'granted') {
            // @ts-ignore
            await registration.periodicSync.register('update-content', {
              // Update every 12 hours
              minInterval: 12 * 60 * 60 * 1000,
            });
            console.log('Periodic background sync registered');
          }
        } catch (error) {
          console.log('Periodic background sync not supported', error);
        }
      });
    }
  });
  
  // Handle offline event
  window.addEventListener('offline', () => {
    console.log('Application is offline. Some features may be limited.');
    if (config && config.onOffline) {
      config.onOffline();
    }
  });
}

export function unregister() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister();
      })
      .catch((error) => {
        console.error(error.message);
      });
  }
}

// Helper function to check if we're currently offline
export function isOffline(): boolean {
  return typeof navigator !== 'undefined' ? !navigator.onLine : false;
}

// Helper function to trigger a manual sync
export function triggerSync(syncType: 'user-data' | 'contributions'): Promise<void> {
  if (!('serviceWorker' in navigator) || !('SyncManager' in window)) {
    return Promise.reject(new Error('Background sync not supported'));
  }
  
  return navigator.serviceWorker.ready.then((registration) => {
    // @ts-ignore - TypeScript doesn't recognize SyncManager yet
    return registration.sync.register(`sync-${syncType}`);
  });
}
