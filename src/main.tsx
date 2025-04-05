
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { Toaster } from '@/components/ui/toaster';
import { toast } from '@/hooks/use-toast';

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

// Register service worker for offline capabilities
serviceWorkerRegistration.register({
  onSuccess: (registration) => {
    console.log('ServiceWorker registration successful with scope: ', registration.scope);
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
      description: "Some features may be limited",
      variant: "destructive",
    });
  },
  onOnline: () => {
    toast({
      title: "You're back online",
      description: "All features are now available",
      variant: "default",
    });
  }
});
