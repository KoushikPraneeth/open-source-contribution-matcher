import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

// Constants for app version tracking
const APP_VERSION = '1.0.0';
const APP_VERSION_KEY = 'app-version';

const root = document.getElementById("root");

if (!root) {
  throw new Error("Root element not found");
}

createRoot(root).render(
  <>
    <App />
    <Toaster />
  </>
);

// Track app version to show what's new on updates
const handleAppVersionUpdate = () => {
  const previousVersion = localStorage.getItem(APP_VERSION_KEY);
  
  if (previousVersion && previousVersion !== APP_VERSION) {
    // Show "what's new" toast on version change
    toast({
      title: "App Updated",
      description: `Updated to version ${APP_VERSION} with new features!`,
      variant: "default",
      duration: 6000,
    });
  }
  
  // Store current version
  localStorage.setItem(APP_VERSION_KEY, APP_VERSION);
};

// Check app version on startup
handleAppVersionUpdate();

// Register service worker for offline capabilities
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
    
    // Request notification permission if not already granted
    if ('Notification' in window && Notification.permission !== 'granted' && Notification.permission !== 'denied') {
      setTimeout(() => {
        toast({
          title: "Enable Notifications",
          description: "Stay updated on your contributions and matched opportunities",
          variant: "default",
          duration: 10000,
          action: (
            <button
              onClick={() => {
                Notification.requestPermission().then(permission => {
                  if (permission === 'granted') {
                    toast({
                      title: "Notifications enabled",
                      description: "You'll now receive updates on your contributions",
                    });
                  }
                });
              }}
              className="rounded bg-primary px-3 py-2 text-white hover:bg-primary/90"
            >
              Enable
            </button>
          ),
        });
      }, 3000);
    }
  },
  onUpdate: (registration) => {
    toast({
      title: "New version available",
      description: "Reload the page to see the latest updates",
      variant: "default",
      action: (
        <button
          onClick={() => {
            if (registration.waiting) {
              registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
            window.location.reload();
          }}
          className="rounded bg-primary px-3 py-2 text-white hover:bg-primary/90"
        >
          Reload
        </button>
      ),
    });
  },
  onOffline: () => {
    toast({
      title: "You're offline",
      description: "Some features may be limited, but you can still browse your saved content",
      variant: "destructive",
    });
    
    // Sync local storage data when back online
    window.addEventListener('online', () => {
      // Try to sync any locally saved data
      if ('serviceWorker' in navigator && 'SyncManager' in window) {
        navigator.serviceWorker.ready.then(registration => {
          // @ts-ignore - TypeScript doesn't recognize SyncManager yet
          registration.sync.register('sync-user-data');
        });
      }
    }, { once: true });
  },
  onOnline: () => {
    toast({
      title: "You're back online",
      description: "Syncing your latest updates",
      variant: "default",
    });
  },
  onMessage: (event) => {
    // Handle messages from service worker
    if (event.data && event.data.type === 'SYNC_COMPLETE') {
      console.log(`Sync completed for ${event.data.feature}`);
      
      // Show toast notification for specific sync types
      if (event.data.feature === 'user-data') {
        toast({
          title: "Data synchronized",
          description: "Your profile data has been updated",
          variant: "default",
        });
      }
    }
  }
});

// Listen for browser storage events to keep multiple tabs in sync
window.addEventListener('storage', (event) => {
  if (event.key && event.key.startsWith('user-')) {
    // Dispatch custom event for user data changes
    window.dispatchEvent(new CustomEvent('user-data-changed', {
      detail: { key: event.key, newValue: event.newValue }
    }));
  }
});
