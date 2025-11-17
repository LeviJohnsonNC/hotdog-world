import { StampedHotdog } from "@/types/passport";
import { BADGES } from "./badgeConfig";

export interface BadgeProgress {
  badgeId: string;
  earned: boolean;
  current: number;
  required: number;
}

const REGIONS = [
  "North America",
  "South America",
  "Europe",
  "Asia",
  "Africa",
  "Oceania",
];

export const calculateBadgeProgress = (
  stampedHotdogs: StampedHotdog[]
): BadgeProgress[] => {
  const stampedDogs = stampedHotdogs.filter((h) => h.isStamped);

  return BADGES.map((badge) => {
    let current = 0;

    switch (badge.id) {
      case "chili-cowboy":
        current = stampedDogs.filter((h) => h.tags?.includes("chili")).length;
        break;

      case "firebreather":
        current = stampedDogs.filter((h) => h.tags?.includes("spicy")).length;
        break;

      case "archivist":
        current = stampedDogs.filter(
          (h) => h.stamp?.review && h.stamp.review.trim().length > 0
        ).length;
        break;

      case "cartographer":
        const uniqueRegions = new Set(
          stampedDogs.map((h) => h.region).filter((r) => r && REGIONS.includes(r))
        );
        current = uniqueRegions.size;
        break;

      case "purist":
        current = stampedDogs.filter((h) => h.tags?.includes("classic")).length;
        break;

      case "international-rebel":
        current = stampedDogs.filter((h) => h.tags?.includes("fusion")).length;
        break;

      case "photojournalist":
        current = stampedDogs.filter(
          (h) => h.stamp?.photoDataUrl && h.stamp.photoDataUrl.length > 0
        ).length;
        break;

      case "flavor-detective":
        current = stampedDogs.filter((h) => h.tags?.includes("uncommon")).length;
        break;

      case "tailgater":
        current = stampedDogs.filter((h) => h.tags?.includes("grilled")).length;
        break;

      case "globetrotter":
        const uniqueCountries = new Set(stampedDogs.map((h) => h.country));
        current = uniqueCountries.size;
        break;

      default:
        current = 0;
    }

    return {
      badgeId: badge.id,
      earned: current >= badge.requirement,
      current: Math.min(current, badge.requirement),
      required: badge.requirement,
    };
  });
};
