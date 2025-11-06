import { supabase } from '@/integrations/supabase/client';
import { getAllStamps } from './stampStorage';

const REVEALED_FACTS_PREFIX = 'hotdog_revealed_';

/**
 * Migrate localStorage data to database when user signs in
 */
export const migrateLocalStorageToDatabase = async (userId: string): Promise<void> => {
  try {
    // Migrate stamps
    const stamps = getAllStamps();
    
    if (stamps.length > 0) {
      const stampData = stamps.map(stamp => ({
        user_id: userId,
        hotdog_id: stamp.hotdogId,
        tried: stamp.tried,
        rating: stamp.rating || null,
        review: stamp.review || null,
        photo_url: stamp.photoDataUrl || null,
        timestamp: stamp.timestamp,
        last_modified: stamp.lastModified
      }));

      // Insert stamps (using upsert to handle duplicates)
      const { error: stampsError } = await supabase
        .from('hotdog_stamps')
        .upsert(stampData, { onConflict: 'user_id,hotdog_id' });

      if (stampsError) {
        console.error('Failed to migrate stamps:', stampsError);
      } else {
        // Clear localStorage stamps after successful migration
        stamps.forEach(stamp => {
          localStorage.removeItem(`hotdog_stamp_${stamp.hotdogId}`);
        });
      }
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
              revealedFacts.push({
                user_id: userId,
                hotdog_id: hotdogId,
                fact_index: index
              });
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

      if (factsError) {
        console.error('Failed to migrate revealed facts:', factsError);
      } else {
        // Clear localStorage revealed facts after successful migration
        for (let i = localStorage.length - 1; i >= 0; i--) {
          const key = localStorage.key(i);
          if (key?.startsWith(REVEALED_FACTS_PREFIX)) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  } catch (error) {
    console.error('Migration failed:', error);
  }
};
