
import { useState, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';
import { 
  subscribeToOnlineStatus, 
  hasUnsyncedData, 
  syncData,
  getPendingSyncs
} from '@/utils/dataPersistence';

/**
 * Hook to manage online status and data synchronization
 * Returns:
 * - isOnline: current online status
 * - hasPendingChanges: whether there are pending changes to sync
 * - pendingSyncCount: number of items waiting to be synced
 * - syncNow: function to manually trigger synchronization
 */
export function useOnlineSync() {
  const [isOnline, setIsOnline] = useState<boolean>(
    typeof navigator !== 'undefined' ? navigator.onLine : true
  );
  const [hasPendingChanges, setHasPendingChanges] = useState<boolean>(hasUnsyncedData());
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(getPendingSyncs().length);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  // Update pending sync status periodically
  useEffect(() => {
    const checkPendingChanges = () => {
      const pendingSyncs = getPendingSyncs();
      setHasPendingChanges(pendingSyncs.length > 0);
      setPendingSyncCount(pendingSyncs.length);
    };

    checkPendingChanges();
    const interval = setInterval(checkPendingChanges, 5000);

    return () => clearInterval(interval);
  }, []);

  // Subscribe to online status changes
  useEffect(() => {
    const unsubscribe = subscribeToOnlineStatus((online) => {
      setIsOnline(online);
      
      if (online) {
        toast({
          title: "You're back online",
          description: "Syncing your latest updates",
          variant: "default",
        });
        
        if (hasUnsyncedData()) {
          syncNow();
        }
      } else {
        toast({
          title: "You're offline",
          description: "Your changes will be saved locally and synced when you're back online",
          variant: "destructive",
        });
      }
    });

    return unsubscribe;
  }, []);

  // Function to manually trigger sync
  const syncNow = async () => {
    if (!isOnline || isSyncing) return false;
    
    setIsSyncing(true);
    try {
      const success = await syncData();
      if (success) {
        const pendingSyncs = getPendingSyncs();
        setHasPendingChanges(pendingSyncs.length > 0);
        setPendingSyncCount(pendingSyncs.length);
        
        if (pendingSyncCount > 0 && pendingSyncs.length === 0) {
          toast({
            title: "Sync completed",
            description: "All your changes have been synchronized",
            variant: "default",
          });
        }
      }
      return success;
    } catch (error) {
      console.error('Error syncing data:', error);
      return false;
    } finally {
      setIsSyncing(false);
    }
  };

  return {
    isOnline,
    hasPendingChanges,
    pendingSyncCount,
    isSyncing,
    syncNow
  };
}
