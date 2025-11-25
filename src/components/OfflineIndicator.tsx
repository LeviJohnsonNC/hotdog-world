import { useEffect } from 'react';
import { WifiOff, Wifi } from 'lucide-react';
import { useOnlineStatus } from '@/hooks/useOnlineStatus';
import { useToast } from '@/hooks/use-toast';

/**
 * Component that monitors online/offline status and notifies user
 */
export const OfflineIndicator = () => {
  const { isOnline, wasOffline } = useOnlineStatus();
  const { toast } = useToast();

  useEffect(() => {
    if (!isOnline) {
      toast({
        title: "You're offline",
        description: "Some features may not work. Changes will be saved when you reconnect.",
        variant: "destructive",
        duration: Infinity,
        action: (
          <div className="flex items-center gap-2">
            <WifiOff className="h-4 w-4" />
          </div>
        ),
      });
    } else if (wasOffline) {
      toast({
        title: "Back online!",
        description: "Your connection has been restored.",
        action: (
          <div className="flex items-center gap-2">
            <Wifi className="h-4 w-4" />
          </div>
        ),
      });
    }
  }, [isOnline, wasOffline, toast]);

  return null;
};
