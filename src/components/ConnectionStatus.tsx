
import { useEffect } from 'react';
import { useOnlineSync } from '@/hooks/use-online-sync';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Wifi, WifiOff, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
  showSyncButton?: boolean;
}

const ConnectionStatus = ({ 
  className = '', 
  showSyncButton = true 
}: ConnectionStatusProps) => {
  const { isOnline, hasPendingChanges, pendingSyncCount, isSyncing, syncNow } = useOnlineSync();
  const { toast } = useToast();

  // Show a visual indicator when the connection status changes
  useEffect(() => {
    // This will only run on connection status changes after the initial render
    return () => {
      if (isOnline) {
        toast({
          title: "Connected",
          description: "You're now online",
          variant: "default",
        });
      } else {
        toast({
          title: "Disconnected",
          description: "You're now offline. Don't worry, your changes will be saved locally.",
          variant: "destructive",
        });
      }
    };
  }, [isOnline]);

  const handleSyncClick = async () => {
    if (isSyncing) return;
    
    const success = await syncNow();
    
    if (success) {
      toast({
        title: "Sync successful",
        description: "Your data has been synchronized",
        variant: "default",
      });
    } else {
      toast({
        title: "Sync failed",
        description: isOnline 
          ? "There was an error synchronizing your data. Please try again."
          : "You're offline. Data will be synced when you're back online.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex items-center">
        {isOnline ? (
          <Wifi className="h-4 w-4 text-green-500" />
        ) : (
          <WifiOff className="h-4 w-4 text-red-500" />
        )}
        
        <span className="ml-2 text-sm">
          {isOnline ? "Online" : "Offline"}
        </span>
        
        {isOnline && hasPendingChanges && (
          <span className="ml-2 text-xs bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-2 py-0.5 rounded-full">
            {pendingSyncCount} pending
          </span>
        )}
      </div>
      
      {showSyncButton && isOnline && hasPendingChanges && (
        <Button 
          size="sm" 
          variant="outline" 
          className="flex items-center gap-1 h-7 px-2 py-0" 
          onClick={handleSyncClick}
          disabled={isSyncing}
        >
          <RefreshCw className={`h-3 w-3 ${isSyncing ? 'animate-spin' : ''}`} />
          <span className="text-xs">Sync</span>
        </Button>
      )}
    </div>
  );
};

export default ConnectionStatus;
