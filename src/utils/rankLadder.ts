import { LEVEL_BADGES, LevelBadge } from "./levelBadgeConfig";

export interface RankTier extends LevelBadge {
  index: number;
}

export const RANK_LADDER: RankTier[] = LEVEL_BADGES.map((b, i) => ({ ...b, index: i }));

export function getRankForCount(count: number): RankTier {
  for (let i = RANK_LADDER.length - 1; i >= 0; i--) {
    if (count >= RANK_LADDER[i].dogsTried) return RANK_LADDER[i];
  }
  return RANK_LADDER[0];
}

export function getNextRank(count: number): RankTier | null {
  const current = getRankForCount(count);
  const next = RANK_LADDER[current.index + 1];
  return next ?? null;
}

export function getProgressToNext(count: number): number {
  const current = getRankForCount(count);
  const next = getNextRank(count);
  if (!next) return 1;
  const span = next.dogsTried - current.dogsTried;
  if (span <= 0) return 1;
  return Math.min(1, Math.max(0, (count - current.dogsTried) / span));
}
