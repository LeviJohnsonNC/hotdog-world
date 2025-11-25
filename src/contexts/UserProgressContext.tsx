import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { HotdogStamp } from '@/types/passport';
import * as localStampStorage from '@/utils/stampStorage';
import { useToast } from '@/hooks/use-toast';

// Error classification helpers
const isNetworkError = (error: any): boolean => {
  return (
    error?.message?.includes('fetch') ||
    error?.message?.includes('network') ||
    error?.code === 'NETWORK_ERROR' ||
    !navigator.onLine
  );
};

const isAuthError = (error: any): boolean => {
  return (
    error?.message?.includes('JWT') ||
    error?.message?.includes('auth') ||
    error?.code === 'PGRST301'
  );
};

const getUserFriendlyError = (error: any): string => {
  if (isNetworkError(error)) {
    return 'Network connection issue. Please check your internet and try again.';
  }
  if (isAuthError(error)) {
    return 'Session expired. Please sign in again.';
  }
  if (error?.message?.includes('row-level security')) {
    return 'Permission denied. Please ensure you are signed in.';
  }
  return error instanceof Error ? error.message : 'An unexpected error occurred';
};

interface MigrationStatus {
  isInProgress: boolean;
  hasFailed: boolean;
  error?: string;
  itemsMigrated: {
    stamps: number;
    revealedFacts: number;
    visitedHotdogs: number;
    triviaClicks: number;
  };
}

interface UserProgressContextType {
  // Stamps
  stamps: HotdogStamp[];
  stampsLoading: boolean;
  getStamp: (hotdogId: string) => HotdogStamp | null;
  saveStamp: (stamp: HotdogStamp) => Promise<{ success: boolean; error?: string }>;
  deleteStamp: (hotdogId: string) => Promise<{ success: boolean; error?: string }>;
  
  // Visited Hotdogs
  visitedHotdogs: Set<string>;
  visitedHotdogsLoading: boolean;
  recordVisit: (hotdogId: string) => Promise<{ isNewVisit: boolean; visitCount: number }>;
  
  // Revealed Facts
  getRevealedFacts: (hotdogId: string) => number[];
  revealedFactsLoading: boolean;
  revealFact: (hotdogId: string, index: number) => Promise<{ success: boolean; error?: string }>;
  
  // Trivia Clicks
  triviaClickCount: number;
  incrementTriviaClick: () => Promise<{ success: boolean; newCount: number; error?: string }>;
  
  // Migration
  migrationStatus: MigrationStatus;
  clearAllUserData: () => Promise<void>;
}

const UserProgressContext = createContext<UserProgressContextType | undefined>(undefined);

const VISITED_HOTDOGS_KEY = 'visited_hotdogs';
const REVEALED_FACTS_PREFIX = 'hotdog_revealed_';
const TRIVIA_CLICKS_KEY = 'trivia_clicks_count';

export const UserProgressProvider = ({ children }: { children: ReactNode }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  
  // State
  const [stamps, setStamps] = useState<HotdogStamp[]>([]);
  const [stampsLoading, setStampsLoading] = useState(true);
  
  const [visitedHotdogs, setVisitedHotdogs] = useState<Set<string>>(new Set());
  const [visitedHotdogsLoading, setVisitedHotdogsLoading] = useState(true);
  
  const [revealedFactsMap, setRevealedFactsMap] = useState<Map<string, number[]>>(new Map());
  const [revealedFactsLoading, setRevealedFactsLoading] = useState(true);
  
  const [triviaClickCount, setTriviaClickCount] = useState(0);
  
  const [migrationStatus, setMigrationStatus] = useState<MigrationStatus>({
    isInProgress: false,
    hasFailed: false,
    itemsMigrated: { stamps: 0, revealedFacts: 0, visitedHotdogs: 0, triviaClicks: 0 }
  });

  // Load all data on mount or user change
  useEffect(() => {
    loadAllData();
  }, [user]);

  const loadAllData = async () => {
    await Promise.all([
      loadStamps(),
      loadVisitedHotdogs(),
      loadRevealedFacts(),
      loadTriviaClicks()
    ]);
  };

  // ============= STAMPS =============
  const loadStamps = async () => {
    setStampsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('hotdog_stamps')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        
        const mappedStamps: HotdogStamp[] = (data || []).map(stamp => ({
          hotdogId: stamp.hotdog_id,
          tried: stamp.tried ?? false,
          rating: stamp.rating ?? undefined,
          review: stamp.review ?? undefined,
          photoDataUrl: stamp.photo_url ?? undefined,
          timestamp: stamp.timestamp,
          lastModified: stamp.last_modified
        }));
        setStamps(mappedStamps);
      } else {
        setStamps(localStampStorage.getAllStamps());
      }
    } catch (error) {
      console.error('Failed to load stamps:', error);
      setStamps([]);
    } finally {
      setStampsLoading(false);
    }
  };

  const getStamp = (hotdogId: string): HotdogStamp | null => {
    return stamps.find(s => s.hotdogId === hotdogId) || null;
  };

  const saveStamp = async (stamp: HotdogStamp): Promise<{ success: boolean; error?: string }> => {
    // Check offline status
    if (!navigator.onLine) {
      return {
        success: false,
        error: 'You are offline. Changes will be saved when you reconnect.'
      };
    }

    try {
      if (user) {
        const { error } = await supabase
          .from('hotdog_stamps')
          .upsert({
            user_id: user.id,
            hotdog_id: stamp.hotdogId,
            tried: stamp.tried,
            rating: stamp.rating ?? null,
            review: stamp.review ?? null,
            photo_url: stamp.photoDataUrl ?? null,
            timestamp: stamp.timestamp,
            last_modified: stamp.lastModified
          }, { onConflict: 'user_id,hotdog_id' });

        if (error) throw error;
      } else {
        const success = localStampStorage.saveStamp(stamp);
        if (!success) throw new Error('Failed to save to localStorage');
      }

      setStamps(prev => {
        const filtered = prev.filter(s => s.hotdogId !== stamp.hotdogId);
        return [...filtered, stamp];
      });

      return { success: true };
    } catch (error) {
      const errorMessage = getUserFriendlyError(error);
      console.error('Save stamp error:', error);
      return { success: false, error: errorMessage };
    }
  };

  const deleteStamp = async (hotdogId: string): Promise<{ success: boolean; error?: string }> => {
    if (!navigator.onLine) {
      return {
        success: false,
        error: 'You are offline. Please try again when connected.'
      };
    }

    try {
      if (user) {
        const { error } = await supabase
          .from('hotdog_stamps')
          .delete()
          .eq('user_id', user.id)
          .eq('hotdog_id', hotdogId);

        if (error) throw error;
      } else {
        localStampStorage.deleteStamp(hotdogId);
      }

      setStamps(prev => prev.filter(s => s.hotdogId !== hotdogId));
      return { success: true };
    } catch (error) {
      const errorMessage = getUserFriendlyError(error);
      console.error('Delete stamp error:', error);
      return { success: false, error: errorMessage };
    }
  };

  // ============= VISITED HOTDOGS =============
  const loadVisitedHotdogs = async () => {
    setVisitedHotdogsLoading(true);
    try {
      const stored = localStorage.getItem(VISITED_HOTDOGS_KEY);
      setVisitedHotdogs(stored ? new Set(JSON.parse(stored)) : new Set());
    } catch (error) {
      console.error('Failed to load visited hotdogs:', error);
      setVisitedHotdogs(new Set());
    } finally {
      setVisitedHotdogsLoading(false);
    }
  };

  const recordVisit = async (hotdogId: string): Promise<{ isNewVisit: boolean; visitCount: number }> => {
    try {
      const isNewVisit = !visitedHotdogs.has(hotdogId);
      const newSet = new Set(visitedHotdogs).add(hotdogId);
      setVisitedHotdogs(newSet);
      localStorage.setItem(VISITED_HOTDOGS_KEY, JSON.stringify(Array.from(newSet)));
      return { isNewVisit, visitCount: newSet.size };
    } catch (error) {
      console.error('Failed to record visit:', error);
      return { isNewVisit: false, visitCount: visitedHotdogs.size };
    }
  };

  // ============= REVEALED FACTS =============
  const loadRevealedFacts = async () => {
    setRevealedFactsLoading(true);
    try {
      if (user) {
        const { data, error } = await supabase
          .from('revealed_facts')
          .select('hotdog_id, fact_index')
          .eq('user_id', user.id);

        if (error) throw error;

        const map = new Map<string, number[]>();
        (data || []).forEach(item => {
          if (!map.has(item.hotdog_id)) {
            map.set(item.hotdog_id, []);
          }
          map.get(item.hotdog_id)!.push(item.fact_index);
        });
        setRevealedFactsMap(map);
      } else {
        const map = new Map<string, number[]>();
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key?.startsWith(REVEALED_FACTS_PREFIX)) {
            const hotdogId = key.replace(REVEALED_FACTS_PREFIX, '');
            const data = localStorage.getItem(key);
            if (data) {
              try {
                map.set(hotdogId, JSON.parse(data));
              } catch (e) {
                console.error('Failed to parse revealed facts:', e);
              }
            }
          }
        }
        setRevealedFactsMap(map);
      }
    } catch (error) {
      console.error('Failed to load revealed facts:', error);
      setRevealedFactsMap(new Map());
    } finally {
      setRevealedFactsLoading(false);
    }
  };

  const getRevealedFacts = (hotdogId: string): number[] => {
    return revealedFactsMap.get(hotdogId) || [];
  };

  const revealFact = async (hotdogId: string, index: number): Promise<{ success: boolean; error?: string }> => {
    try {
      const current = getRevealedFacts(hotdogId);
      if (current.includes(index)) {
        return { success: true };
      }

      const updated = [...current, index];

      if (user) {
        if (!navigator.onLine) {
          return {
            success: false,
            error: 'You are offline. Fact will be revealed when you reconnect.'
          };
        }

        const { error } = await supabase
          .from('revealed_facts')
          .insert({
            user_id: user.id,
            hotdog_id: hotdogId,
            fact_index: index
          });

        if (error) throw error;
      } else {
        localStorage.setItem(`${REVEALED_FACTS_PREFIX}${hotdogId}`, JSON.stringify(updated));
      }

      setRevealedFactsMap(prev => new Map(prev).set(hotdogId, updated));
      return { success: true };
    } catch (error) {
      const errorMessage = getUserFriendlyError(error);
      console.error('Reveal fact error:', error);
      return { success: false, error: errorMessage };
    }
  };

  // ============= TRIVIA CLICKS =============
  const loadTriviaClicks = async () => {
    try {
      const stored = localStorage.getItem(TRIVIA_CLICKS_KEY);
      setTriviaClickCount(stored ? parseInt(stored, 10) : 0);
    } catch (error) {
      console.error('Failed to load trivia clicks:', error);
      setTriviaClickCount(0);
    }
  };

  const incrementTriviaClick = async (): Promise<{ success: boolean; newCount: number; error?: string }> => {
    try {
      const newCount = triviaClickCount + 1;
      localStorage.setItem(TRIVIA_CLICKS_KEY, newCount.toString());
      setTriviaClickCount(newCount);
      return { success: true, newCount };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to increment trivia click';
      console.error('Increment trivia click error:', error);
      return { success: false, newCount: triviaClickCount, error: errorMessage };
    }
  };

  // ============= MIGRATION =============
  const migrateLocalStorageToDatabase = async (userId: string): Promise<void> => {
    setMigrationStatus({
      isInProgress: true,
      hasFailed: false,
      itemsMigrated: { stamps: 0, revealedFacts: 0, visitedHotdogs: 0, triviaClicks: 0 }
    });

    const migrated = { stamps: 0, revealedFacts: 0, visitedHotdogs: 0, triviaClicks: 0 };

    try {
      // Migrate stamps
      const localStamps = localStampStorage.getAllStamps();
      if (localStamps.length > 0) {
        const stampData = localStamps.map(stamp => ({
          user_id: userId,
          hotdog_id: stamp.hotdogId,
          tried: stamp.tried,
          rating: stamp.rating ?? null,
          review: stamp.review ?? null,
          photo_url: stamp.photoDataUrl ?? null,
          timestamp: stamp.timestamp,
          last_modified: stamp.lastModified
        }));

        const { error: stampsError } = await supabase
          .from('hotdog_stamps')
          .upsert(stampData, { onConflict: 'user_id,hotdog_id' });

        if (stampsError) throw new Error(`Stamps migration failed: ${stampsError.message}`);

        localStamps.forEach(stamp => {
          localStorage.removeItem(`hotdog_stamp_${stamp.hotdogId}`);
        });
        migrated.stamps = localStamps.length;
      }

      // Migrate revealed facts
      const revealedFacts: Array<{ user_id: string; hotdog_id: string; fact_index: number }> = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(REVEALED_FACTS_PREFIX)) {
          const hotdogId = key.replace(REVEALED_FACTS_PREFIX, '');
          const data = localStorage.getItem(key);
          if (data) {
            try {
              const indices = JSON.parse(data) as number[];
              indices.forEach(index => {
                revealedFacts.push({ user_id: userId, hotdog_id: hotdogId, fact_index: index });
              });
            } catch (e) {
              console.error('Failed to parse revealed facts:', e);
            }
          }
        }
      }

      if (revealedFacts.length > 0) {
        const { error: factsError } = await supabase
          .from('revealed_facts')
          .upsert(revealedFacts, { onConflict: 'user_id,hotdog_id,fact_index' });

        if (factsError) throw new Error(`Facts migration failed: ${factsError.message}`);

        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(REVEALED_FACTS_PREFIX)) {
            localStorage.removeItem(key);
          }
        }
        migrated.revealedFacts = revealedFacts.length;
      }

      setMigrationStatus({
        isInProgress: false,
        hasFailed: false,
        itemsMigrated: migrated
      });

      // Show success toast if any data was migrated
      const totalMigrated = migrated.stamps + migrated.revealedFacts;
      if (totalMigrated > 0) {
        toast({
          title: "Welcome back!",
          description: `Successfully synced your hotdog collection (${migrated.stamps} stamps, ${migrated.revealedFacts} facts)`,
        });
      }

      // Reload all data after migration
      await loadAllData();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown migration error';
      console.error('Migration failed:', error);
      
      setMigrationStatus({
        isInProgress: false,
        hasFailed: true,
        error: errorMessage,
        itemsMigrated: migrated
      });

      toast({
        title: "Sync Failed",
        description: "Unable to sync your data. Your local data is safe and will be retried on next login.",
        variant: "destructive"
      });
    }
  };

  // Auto-migrate on user sign-in
  useEffect(() => {
    if (user && !migrationStatus.isInProgress) {
      // Check if there's any local data to migrate
      const localStamps = localStampStorage.getAllStamps();
      const hasLocalData = localStamps.length > 0;

      if (hasLocalData) {
        migrateLocalStorageToDatabase(user.id);
      }
    }
  }, [user]);

  // ============= CLEAR DATA =============
  const clearAllUserData = async () => {
    try {
      if (user) {
        // Clear database data
        await Promise.all([
          supabase.from('hotdog_stamps').delete().eq('user_id', user.id),
          supabase.from('revealed_facts').delete().eq('user_id', user.id)
        ]);
      }

      // Clear localStorage
      const stampsToDelete = localStampStorage.getAllStamps();
      stampsToDelete.forEach(stamp => {
        localStorage.removeItem(`hotdog_stamp_${stamp.hotdogId}`);
      });

      for (let i = localStorage.length - 1; i >= 0; i--) {
        const key = localStorage.key(i);
        if (key?.startsWith(REVEALED_FACTS_PREFIX)) {
          localStorage.removeItem(key);
        }
      }

      localStorage.removeItem(VISITED_HOTDOGS_KEY);
      localStorage.removeItem(TRIVIA_CLICKS_KEY);
      localStorage.removeItem('first_trivia_badge_shown');

      // Reset state
      setStamps([]);
      setVisitedHotdogs(new Set());
      setRevealedFactsMap(new Map());
      setTriviaClickCount(0);
    } catch (error) {
      console.error('Failed to clear user data:', error);
      throw error;
    }
  };

  const value: UserProgressContextType = {
    stamps,
    stampsLoading,
    getStamp,
    saveStamp,
    deleteStamp,
    visitedHotdogs,
    visitedHotdogsLoading,
    recordVisit,
    getRevealedFacts,
    revealedFactsLoading,
    revealFact,
    triviaClickCount,
    incrementTriviaClick,
    migrationStatus,
    clearAllUserData
  };

  return (
    <UserProgressContext.Provider value={value}>
      {children}
    </UserProgressContext.Provider>
  );
};

export const useUserProgress = () => {
  const context = useContext(UserProgressContext);
  if (context === undefined) {
    throw new Error('useUserProgress must be used within a UserProgressProvider');
  }
  return context;
};
