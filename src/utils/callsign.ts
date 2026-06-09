// Deterministic anonymous explorer callsign from user_id hash.
const ADJECTIVES = [
  "Roaming", "Smoked", "Charred", "Wandering", "Midnight", "Salted", "Glazed",
  "Vagabond", "Hungry", "Lonesome", "Spiced", "Crispy", "Sizzling", "Curious",
  "Iron", "Velvet", "Brassy", "Dusty", "Golden", "Steady",
];

const NOUNS = [
  "Frank", "Bun", "Skewer", "Cart", "Tongs", "Relish", "Mustard", "Snap",
  "Casing", "Onion", "Embers", "Coals", "Postcard", "Compass", "Atlas",
  "Pilgrim", "Drifter", "Scout", "Mariner", "Nomad",
];

function hash(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = (h * 16777619) >>> 0;
  }
  return h >>> 0;
}

export function callsignFor(userId: string): string {
  const h = hash(userId);
  const a = ADJECTIVES[h % ADJECTIVES.length];
  const n = NOUNS[(h >>> 8) % NOUNS.length];
  const num = (h >>> 16) % 90 + 10;
  return `${a} ${n} ${num}`;
}

export function displayNameFor(userId: string, displayName: string | null): string {
  const trimmed = displayName?.trim();
  return trimmed && trimmed.length > 0 ? trimmed : callsignFor(userId);
}
