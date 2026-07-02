import { Hotdog } from "@/types/hotdog";

interface Props {
  flavorProfile: NonNullable<Hotdog["flavor_profile"]>;
}

const LABELS: Array<{ key: keyof NonNullable<Hotdog["flavor_profile"]>; label: string }> = [
  { key: "mess", label: "Napkin Risk" },
  { key: "heat", label: "Heat" },
  { key: "crunch", label: "Crunch" },
  { key: "sauce", label: "Sauce Load" },
  { key: "boldness", label: "Swagger" },
  { key: "distinctiveness", label: "Local Oddness" },
];

const TICKS = ["low", "medium", "dangerous"] as const;

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
                  // Ketchup-red gradient: light → dark
                  const stops = [
                    "hsl(var(--ketchup-red) / 0.25)",
                    "hsl(var(--ketchup-red) / 0.45)",
                    "hsl(var(--ketchup-red) / 0.65)",
                    "hsl(var(--ketchup-red) / 0.85)",
                    "hsl(var(--ketchup-red))",
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
      <div className="mt-5 flex justify-between text-[10px] uppercase tracking-[0.2em] text-[hsl(var(--ink))]/45 font-mono max-w-[220px]">
        {TICKS.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
    </section>
  );
}
