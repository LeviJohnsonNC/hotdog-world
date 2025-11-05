import { HotdogStamp } from '@/types/passport';

const STORAGE_KEY_PREFIX = 'hotdog_stamp_';

/**
 * Get a stamp for a specific hotdog
 */
export const getStamp = (hotdogId: string): HotdogStamp | null => {
  try {
    const data = localStorage.getItem(`${STORAGE_KEY_PREFIX}${hotdogId}`);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    console.error('Failed to get stamp:', error);
    return null;
  }
};

/**
 * Save a stamp for a specific hotdog
 */
export const saveStamp = (stamp: HotdogStamp): boolean => {
  try {
    localStorage.setItem(
      `${STORAGE_KEY_PREFIX}${stamp.hotdogId}`,
      JSON.stringify(stamp)
    );
    return true;
  } catch (error) {
    console.error('Failed to save stamp:', error);
    if (error instanceof Error && error.name === 'QuotaExceededError') {
      // Storage quota exceeded
      return false;
    }
    return false;
  }
};

/**
 * Delete a stamp for a specific hotdog
 */
export const deleteStamp = (hotdogId: string): void => {
  try {
    localStorage.removeItem(`${STORAGE_KEY_PREFIX}${hotdogId}`);
  } catch (error) {
    console.error('Failed to delete stamp:', error);
  }
};

/**
 * Get all stamps (for future passport page)
 */
export const getAllStamps = (): HotdogStamp[] => {
  const stamps: HotdogStamp[] = [];
  
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(STORAGE_KEY_PREFIX)) {
        const data = localStorage.getItem(key);
        if (data) {
          stamps.push(JSON.parse(data));
        }
      }
    }
  } catch (error) {
    console.error('Failed to get all stamps:', error);
  }
  
  return stamps;
};
