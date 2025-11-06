import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const STORAGE_KEY_PREFIX = 'hotdog_revealed_';

/**
 * Unified hook for managing revealed facts - uses localStorage for anonymous users,
 * database for authenticated users
 */
export const useRevealedFacts = (hotdogId: string) => {
  const { user } = useAuth();
  const [revealedIndices, setRevealedIndices] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);

  // Load revealed facts based on auth state
  useEffect(() => {
    const loadRevealed = async () => {
      setLoading(true);
      
      if (user) {
        // Load from database
        const { data, error } = await supabase
          .from('revealed_facts')
          .select('fact_index')
          .eq('user_id', user.id)
          .eq('hotdog_id', hotdogId);

        if (!error && data) {
          setRevealedIndices(data.map(d => d.fact_index));
        }
      } else {
        // Load from localStorage
        try {
          const stored = localStorage.getItem(`${STORAGE_KEY_PREFIX}${hotdogId}`);
          if (stored) {
            setRevealedIndices(JSON.parse(stored));
          }
        } catch (error) {
          console.error('Failed to load revealed facts:', error);
        }
      }
      
      setLoading(false);
    };

    loadRevealed();
  }, [user, hotdogId]);

  const revealFact = async (index: number): Promise<boolean> => {
    if (revealedIndices.includes(index)) {
      return true;
    }

    const newIndices = [...revealedIndices, index];

    if (user) {
      // Save to database
      const { error } = await supabase
        .from('revealed_facts')
        .insert({
          user_id: user.id,
          hotdog_id: hotdogId,
          fact_index: index
        });

      if (!error) {
        setRevealedIndices(newIndices);
        return true;
      }
      return false;
    } else {
      // Save to localStorage
      try {
        localStorage.setItem(
          `${STORAGE_KEY_PREFIX}${hotdogId}`,
          JSON.stringify(newIndices)
        );
        setRevealedIndices(newIndices);
        return true;
      } catch (error) {
        console.error('Failed to save revealed fact:', error);
        return false;
      }
    }
  };

  const isRevealed = (index: number): boolean => {
    return revealedIndices.includes(index);
  };

  return {
    revealedIndices,
    loading,
    revealFact,
    isRevealed
  };
};
