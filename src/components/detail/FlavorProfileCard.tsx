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

const wordFor = (n: number) =>
  n >= 3 ? "Legendary" : n === 2 ? "High" : n === 1 ? "Hint" : "—";

export function FlavorProfileCard({ flavorProfile }: Props) {
  return (
    <section className="paper-card p-6 md:p-8">
      <div className="flex items-center justify-between mb-5">
        <div className="stamp-label">At a Glance</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Flavor profile
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-4">
        {LABELS.map(({ key, label }) => {
          const v = flavorProfile[key] ?? 0;
          return (
            <div key={key}>
              <div className="flex items-baseline justify-between mb-1.5">
                <span className="text-sm font-semibold text-[hsl(var(--ink))]">{label}</span>
                <span className="text-[11px] uppercase tracking-wider text-[hsl(var(--ink))]/65">
                  {wordFor(v)}
                </span>
              </div>
              <div className="flex gap-1">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="h-2 flex-1 rounded-full"
                    style={{
                      background:
                        i < v
                          ? "hsl(var(--accent-1))"
                          : "hsl(var(--ink) / 0.10)",
                    }}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
