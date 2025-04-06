
import { useEffect, useState } from 'react';
import { useOnlineSync } from '@/hooks/use-online-sync';
import { WifiOff, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { hasUnsyncedData } from '@/utils/dataPersistence';

const OfflineBanner = () => {
  const { isOnline } = useOnlineSync();
  const [isVisible, setIsVisible] = useState(false);
  const [hasPendingData, setHasPendingData] = useState(false);

  useEffect(() => {
    // Check if there's any data that needs to be synced
    const checkUnsyncedData = () => {
      setHasPendingData(hasUnsyncedData());
    };
    
    checkUnsyncedData();
    
    // Only show the banner after being offline for 2 seconds
    // to prevent flashing on temporary connection drops
    let timeoutId: number;
    
    if (!isOnline) {
      timeoutId = window.setTimeout(() => {
        setIsVisible(true);
        checkUnsyncedData();
      }, 2000);
    } else {
      setIsVisible(false);
    }
    
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isOnline]);

  if (isOnline || !isVisible) {
    return null;
  }

  return (
    <Alert 
      variant="destructive" 
      className="fixed bottom-4 right-4 w-auto max-w-md z-50 flex flex-col sm:flex-row items-start sm:items-center gap-2"
    >
      <WifiOff className="h-4 w-4 mt-0.5" />
      <div className="flex-1">
        <AlertTitle>You're offline</AlertTitle>
        <AlertDescription className="text-xs mt-1">
          {hasPendingData 
            ? "Your changes are being saved locally and will sync when you're back online."
            : "You can still browse previously loaded content."}
        </AlertDescription>
      </div>
      {hasPendingData && (
        <Button size="sm" variant="outline" className="mt-2 sm:mt-0 flex items-center gap-1">
          <Database className="h-3 w-3" />
          <span className="text-xs">{isOnline ? "Sync Now" : "Stored"}</span>
        </Button>
      )}
    </Alert>
  );
};

export default OfflineBanner;
