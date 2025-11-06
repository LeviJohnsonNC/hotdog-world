import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HotdogStamp } from '@/types/passport';
import * as localStampStorage from '@/utils/stampStorage';

/**
 * Unified hook for managing stamps - uses localStorage for anonymous users,
 * database for authenticated users
 */
export const useStamps = () => {
  const { user } = useAuth();
  const [stamps, setStamps] = useState<HotdogStamp[]>([]);
  const [loading, setLoading] = useState(true);

  // Load stamps based on auth state
  useEffect(() => {
    const loadStamps = async () => {
      setLoading(true);
      
      if (user) {
        // Load from database
        const { data, error } = await supabase
          .from('hotdog_stamps')
          .select('*')
          .eq('user_id', user.id);

        if (!error && data) {
          const mappedStamps: HotdogStamp[] = data.map(stamp => ({
            hotdogId: stamp.hotdog_id,
            tried: stamp.tried,
            rating: stamp.rating || undefined,
            review: stamp.review || undefined,
            photoDataUrl: stamp.photo_url || undefined,
            timestamp: stamp.timestamp,
            lastModified: stamp.last_modified
          }));
          setStamps(mappedStamps);
        }
      } else {
        // Load from localStorage
        setStamps(localStampStorage.getAllStamps());
      }
      
      setLoading(false);
    };

    loadStamps();
  }, [user]);

  const getStamp = (hotdogId: string): HotdogStamp | null => {
    return stamps.find(s => s.hotdogId === hotdogId) || null;
  };

  const saveStamp = async (stamp: HotdogStamp): Promise<boolean> => {
    if (user) {
      // Save to database
      const { error } = await supabase
        .from('hotdog_stamps')
        .upsert({
          user_id: user.id,
          hotdog_id: stamp.hotdogId,
          tried: stamp.tried,
          rating: stamp.rating || null,
          review: stamp.review || null,
          photo_url: stamp.photoDataUrl || null,
          timestamp: stamp.timestamp,
          last_modified: stamp.lastModified
        }, { onConflict: 'user_id,hotdog_id' });

      if (!error) {
        setStamps(prev => {
          const filtered = prev.filter(s => s.hotdogId !== stamp.hotdogId);
          return [...filtered, stamp];
        });
        return true;
      }
      return false;
    } else {
      // Save to localStorage
      const success = localStampStorage.saveStamp(stamp);
      if (success) {
        setStamps(prev => {
          const filtered = prev.filter(s => s.hotdogId !== stamp.hotdogId);
          return [...filtered, stamp];
        });
      }
      return success;
    }
  };

  const deleteStamp = async (hotdogId: string): Promise<boolean> => {
    if (user) {
      // Delete from database
      const { error } = await supabase
        .from('hotdog_stamps')
        .delete()
        .eq('user_id', user.id)
        .eq('hotdog_id', hotdogId);

      if (!error) {
        setStamps(prev => prev.filter(s => s.hotdogId !== hotdogId));
        return true;
      }
      return false;
    } else {
      // Delete from localStorage
      localStampStorage.deleteStamp(hotdogId);
      setStamps(prev => prev.filter(s => s.hotdogId !== hotdogId));
      return true;
    }
  };

  return {
    stamps,
    loading,
    getStamp,
    saveStamp,
    deleteStamp
  };
};
