import { Hotdog } from "@/types/hotdog";

interface Props {
  anatomy: NonNullable<Hotdog["anatomy"]>;
  whyItWorks?: string | null;
  slug?: string;
  name?: string;
}

// Slugs that have a hand-drawn exploded-view illustration in /public/anatomy/.
const ANATOMY_ILLUSTRATIONS = new Set([
  "atlanta-slaw-dog",
  "aussie-dog",
  "bangkok-spicy-street-dog",
  "boerewors-roll",
  "bombay-hot-dog",
  "cachorro-quente-paulista",
  "chapli-kebab-dog",
  "chicago-style-hot-dog",
  "completo",
  "coney-island-hot-dog",
  "currywurst",
  "dagwood-dog",
]);

// Rotating palette for the numbered layer dots so the list still reads as a
// visual stack. Top of the ordered list = top of the dog.
const DOT_PALETTE = [
  { fill: "hsl(45 92% 74%)", stroke: "hsl(35 55% 42%)" },
  { fill: "hsl(45 30% 92%)", stroke: "hsl(35 20% 55%)" },
  { fill: "hsl(100 35% 55%)", stroke: "hsl(100 40% 28%)" },
  { fill: "hsl(20 55% 40%)", stroke: "hsl(20 55% 22%)" },
  { fill: "hsl(10 78% 58%)", stroke: "hsl(10 55% 32%)" },
  { fill: "hsl(35 60% 55%)", stroke: "hsl(35 50% 32%)" },
];

function dotStyle(i: number, total: number) {
  if (i === 0) return DOT_PALETTE[0];
  if (i === total - 1) return DOT_PALETTE[DOT_PALETTE.length - 1];
  return DOT_PALETTE[(i % (DOT_PALETTE.length - 2)) + 1];
}

export function AnatomySection({ anatomy, whyItWorks, slug, name }: Props) {
  const hasIllustration = slug && ANATOMY_ILLUSTRATIONS.has(slug);
  const whyItWorksBlock = whyItWorks ? (
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
  ) : null;

  return (
    <section className="paper-card p-6 md:p-10">
      <div className="stamp-label mb-6">Anatomy of the Dog</div>

      <div className={hasIllustration ? "grid gap-8 md:grid-cols-[1fr_1.25fr] md:items-start" : ""}>
        <div className={hasIllustration ? "max-w-[52ch]" : "max-w-[52ch]"}>
          <ol className="relative">
            {anatomy.map((item, i) => {
              const s = dotStyle(i, anatomy.length);
              return (
                <li key={i} className="relative flex gap-4 pb-5 last:pb-0">
                  {i < anatomy.length - 1 && (
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
          {hasIllustration && whyItWorksBlock}
        </div>

        {hasIllustration && (
          <figure className="flex items-center justify-center p-2">
            <img
              src={`/anatomy/${slug}.png`}
              alt={`Exploded view of the ${name ?? "hot dog"} layers`}
              loading="lazy"
              className="w-full h-auto max-h-[520px] object-contain mix-blend-multiply"
            />
          </figure>
        )}
      </div>

      {!hasIllustration && whyItWorksBlock}
    </section>
  );
}

