import { Hotdog } from "@/types/hotdog";

interface Props {
  anatomy: NonNullable<Hotdog["anatomy"]>;
  whyItWorks?: string | null;
}

// Layered cross-section diagram. Top of the list = top of the stack.
// Rendered as a stylized SVG so it reads like a field-guide illustration
// rather than a numbered list.

const LAYER_STYLES: Array<{ fill: string; stroke: string; label: string }> = [
  { fill: "hsl(45 92% 74%)", stroke: "hsl(35 55% 42%)", label: "Top bun" },
  { fill: "hsl(10 78% 58%)", stroke: "hsl(10 55% 32%)", label: "Sauce" },
  { fill: "hsl(45 30% 92%)", stroke: "hsl(35 20% 55%)", label: "Spread" },
  { fill: "hsl(100 35% 55%)", stroke: "hsl(100 40% 28%)", label: "Greens" },
  { fill: "hsl(20 55% 40%)", stroke: "hsl(20 55% 22%)", label: "Sausage" },
  { fill: "hsl(35 60% 55%)", stroke: "hsl(35 50% 32%)", label: "Bottom bun" },
];

function styleFor(i: number, total: number) {
  // Map layer index (0 = top of the ordered list, which we render on top) to
  // a palette slot. Fall back to a neutral tone.
  if (i === 0) return LAYER_STYLES[0];
  if (i === total - 1) return LAYER_STYLES[LAYER_STYLES.length - 1];
  return LAYER_STYLES[(i % (LAYER_STYLES.length - 2)) + 1];
}

export function AnatomySection({ anatomy, whyItWorks }: Props) {
  const layers = anatomy;
  const H = 260;
  const W = 260;
  const padY = 24;
  const rowH = (H - padY * 2) / Math.max(layers.length, 1);

  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="stamp-label">Anatomy of the Dog</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Cross section, top to bottom
        </span>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8 lg:gap-10 items-start">
        {/* Diagram */}
        <div className="relative mx-auto lg:mx-0" style={{ width: W }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            width={W}
            height={H}
            role="img"
            aria-label="Layered cross section of the hot dog"
            className="drop-shadow-[0_6px_10px_hsl(var(--ink)/0.15)]"
          >
            {/* Backdrop paper tint */}
            <rect
              x={0}
              y={0}
              width={W}
              height={H}
              fill="hsl(var(--paper))"
              opacity={0.4}
            />

            {layers.map((_, i) => {
              const s = styleFor(i, layers.length);
              const y = padY + i * rowH;
              const isTop = i === 0;
              const isBottom = i === layers.length - 1;
              const rTop = isTop ? Math.min(rowH * 0.9, 44) : 6;
              const rBottom = isBottom ? Math.min(rowH * 0.9, 44) : 6;

              // Build a rounded-corner path per layer so top & bottom get
              // bun-like curves and middle layers are straight bands.
              const x = 32;
              const w = W - 64;
              const path = `
                M ${x + rTop} ${y}
                H ${x + w - rTop}
                Q ${x + w} ${y} ${x + w} ${y + rTop}
                V ${y + rowH - rBottom}
                Q ${x + w} ${y + rowH} ${x + w - rBottom} ${y + rowH}
                H ${x + rBottom}
                Q ${x} ${y + rowH} ${x} ${y + rowH - rBottom}
                V ${y + rTop}
                Q ${x} ${y} ${x + rTop} ${y}
                Z
              `;

              return (
                <g key={i}>
                  <path
                    d={path}
                    fill={s.fill}
                    stroke={s.stroke}
                    strokeWidth={1.25}
                    opacity={0.95}
                  />
                  {/* subtle texture line */}
                  <line
                    x1={x + 8}
                    x2={x + w - 8}
                    y1={y + rowH / 2}
                    y2={y + rowH / 2}
                    stroke={s.stroke}
                    strokeOpacity={0.18}
                    strokeDasharray="2 4"
                  />
                  {/* Callout leader dot */}
                  <circle
                    cx={x + w + 6}
                    cy={y + rowH / 2}
                    r={3}
                    fill="hsl(var(--ink))"
                    opacity={0.55}
                  />
                </g>
              );
            })}
          </svg>
        </div>

        {/* Callout list */}
        <ol className="relative">
          {layers.map((item, i) => {
            const s = styleFor(i, layers.length);
            return (
              <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                {i < layers.length - 1 && (
                  <span
                    className="absolute left-[13px] top-8 bottom-0 w-px"
                    style={{ background: "hsl(var(--ink) / 0.15)" }}
                  />
                )}
                <div
                  className="relative z-10 mt-1 h-6 w-6 shrink-0 rounded-full border-2 flex items-center justify-center font-mono text-[10px] font-semibold"
                  style={{
                    background: s.fill,
                    borderColor: s.stroke,
                    color: "hsl(var(--ink))",
                  }}
                  aria-hidden
                >
                  {i + 1}
                </div>
                <div>
                  <div className="font-heading font-semibold text-[hsl(var(--ink))] text-base md:text-lg leading-tight">
                    {item.layer}
                  </div>
                  {item.note && (
                    <p className="text-sm text-[hsl(var(--ink))]/70 mt-1 leading-relaxed">
                      {item.note}
                    </p>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </div>

      {whyItWorks && (
        <aside
          className="mt-8 rounded-md p-5 border-l-4"
          style={{
            borderColor: "hsl(var(--cilantro))",
            background: "hsl(var(--cilantro) / 0.08)",
          }}
        >
          <div className="text-[11px] uppercase tracking-[0.2em] font-mono text-[hsl(var(--cilantro))] font-semibold mb-2">
            Why it works
          </div>
          <p className="text-[hsl(var(--ink))]/85 text-sm md:text-base leading-relaxed">
            {whyItWorks}
          </p>
        </aside>
      )}
    </section>
  );
}
