import { HotdogStamp, PassportStats, StampedHotdog } from '@/types/passport';
import { Hotdog } from '@/types/hotdog';
import { getAllStamps } from './stampStorage';

/**
 * Combine hotdog data with stamp data to create enriched objects
 */
export const combineHotdogsWithStamps = (hotdogs: Hotdog[]): StampedHotdog[] => {
  const stamps = getAllStamps();
  
  return hotdogs.map(hotdog => {
    const stamp = stamps.find(s => s.hotdogId === hotdog.id) || null;
    
    return {
      ...hotdog,
      stamp,
      isStamped: stamp !== null
    };
  });
};

/**
 * Calculate passport statistics
 */
export const calculatePassportStats = (stampedHotdogs: StampedHotdog[]): PassportStats => {
  const stamped = stampedHotdogs.filter(h => h.isStamped);
  const ratingsWithValues = stamped
    .map(h => h.stamp?.rating)
    .filter((r): r is number => r !== undefined && r !== null);
  
  const avgRating = ratingsWithValues.length > 0
    ? ratingsWithValues.reduce((sum, r) => sum + r, 0) / ratingsWithValues.length
    : 0;
  
  const countriesVisited = new Set(stamped.map(h => h.country)).size;
  
  return {
    total: stampedHotdogs.length,
    stamped: stamped.length,
    percentage: (stamped.length / stampedHotdogs.length) * 100,
    avgRating: Math.round(avgRating * 10) / 10,
    countriesVisited
  };
};

/**
 * Group hotdogs by country
 */
export const groupByCountry = (stampedHotdogs: StampedHotdog[]): Record<string, StampedHotdog[]> => {
  return stampedHotdogs.reduce((acc, hotdog) => {
    if (!acc[hotdog.country]) {
      acc[hotdog.country] = [];
    }
    acc[hotdog.country].push(hotdog);
    return acc;
  }, {} as Record<string, StampedHotdog[]>);
};

/**
 * Sort hotdogs: stamped first (by timestamp), then unstamped (alphabetically)
 */
export const sortHotdogs = (stampedHotdogs: StampedHotdog[]): StampedHotdog[] => {
  return [...stampedHotdogs].sort((a, b) => {
    // Stamped first
    if (a.isStamped && !b.isStamped) return -1;
    if (!a.isStamped && b.isStamped) return 1;
    
    // If both stamped, sort by timestamp (newest first)
    if (a.isStamped && b.isStamped) {
      return (b.stamp?.timestamp || 0) - (a.stamp?.timestamp || 0);
    }
    
    // If both unstamped, sort alphabetically
    return a.name.localeCompare(b.name);
  });
};
