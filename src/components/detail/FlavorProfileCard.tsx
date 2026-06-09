import { Hotdog } from "@/types/hotdog";

interface Props {
  flavorProfile: NonNullable<Hotdog["flavor_profile"]>;
}

const LABELS: Array<{ key: keyof NonNullable<Hotdog["flavor_profile"]>; label: string }> = [
  { key: "sweet", label: "Sweet" },
  { key: "salty", label: "Salty" },
  { key: "crunch", label: "Crunch" },
  { key: "creamy", label: "Creamy" },
  { key: "heat", label: "Heat" },
  { key: "mess", label: "Mess Factor" },
];

// Normalize legacy 0–3 values to 1–5 if needed
function normalize(v: number | undefined): number {
  if (v == null) return 0;
  if (v <= 3) return Math.round((v / 3) * 5);
  return Math.min(5, Math.max(0, Math.round(v)));
}

export function FlavorProfileCard({ flavorProfile }: Props) {
  return (
    <section className="paper-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="stamp-label">At a Glance</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Flavor profile · 1–5
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        {LABELS.map(({ key, label }) => {
          const v = normalize(flavorProfile[key]);
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-semibold text-[hsl(var(--ink))]">{label}</span>
                <span className="text-[11px] font-mono text-[hsl(var(--ink))]/65">
                  {v}/5
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2, 3, 4].map((i) => {
                  // Gradient stops across the 5 segments
                  const stops = [
                    "hsl(var(--accent-1))",
                    "hsl(var(--accent-1))",
                    "hsl(var(--pineapple))",
                    "hsl(var(--accent-2))",
                    "hsl(var(--stamp-red))",
                  ];
                  return (
                    <span
                      key={i}
                      className="h-2 flex-1 rounded-full transition-colors"
                      style={{
                        background:
                          i < v ? stops[i] : "hsl(var(--ink) / 0.10)",
                      }}
                    />
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
