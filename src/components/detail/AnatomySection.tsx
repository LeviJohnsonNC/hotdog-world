import { Hotdog } from "@/types/hotdog";

interface Props {
  anatomy: NonNullable<Hotdog["anatomy"]>;
  whyItWorks?: string | null;
}

export function AnatomySection({ anatomy, whyItWorks }: Props) {
  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="stamp-label">Anatomy of the Dog</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Bottom up
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_280px] gap-8 items-start">
        <ol className="relative">
          {anatomy.map((item, i) => (
            <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
              {/* Connector line */}
              {i < anatomy.length - 1 && (
                <span
                  className="absolute left-[18px] top-9 bottom-0 w-px"
                  style={{ background: "hsl(var(--ink) / 0.18)" }}
                />
              )}
              <div
                className="relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-display text-base"
                style={{
                  background: "hsl(var(--accent-2))",
                  color: "hsl(var(--paper))",
                  boxShadow: "0 2px 0 hsl(var(--ink) / 0.18)",
                }}
              >
                {anatomy.length - i}
              </div>
              <div className="pt-1">
                <div className="font-heading font-semibold text-[hsl(var(--ink))] text-lg leading-tight">
                  {item.layer}
                </div>
                {item.note && (
                  <p className="text-sm text-[hsl(var(--ink))]/75 mt-1 leading-relaxed">
                    {item.note}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>

        {whyItWorks && (
          <aside
            className="rounded-lg p-5 border-l-4"
            style={{
              borderColor: "hsl(var(--cilantro))",
              background: "hsl(var(--accent-1) / 0.10)",
            }}
          >
            <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--cilantro))] font-semibold mb-2">
              Why it works
            </div>
            <p className="text-[hsl(var(--ink))]/85 text-sm leading-relaxed italic">
              {whyItWorks}
            </p>
          </aside>
        )}
      </div>
    </section>
  );
}
