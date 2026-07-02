interface Props {
  body: string;
  pullQuote?: string | null;
}

// Labels for up to 3 paragraph-derived micro-cards. Rendered only when we have
// enough content — no empty states.
const BLOCK_LABELS = ["Field Note", "The Move", "Why It Works"] as const;

export function MethodAndSoulSection({ body, pullQuote }: Props) {
  const paragraphs = body.split("\n\n").map((s) => s.trim()).filter(Boolean);

  // Auto-derive pull quote: first sentence of body if not provided
  const quote =
    pullQuote ||
    (body.split(/(?<=[.!?])\s+/).find((s) => s.length > 40 && s.length < 180) ??
      null);

  // Split into up to 3 labeled blocks. If only one paragraph, render a single
  // "Field Note" card (no forced empties).
  const blocks = paragraphs.slice(0, 3).map((text, i) => ({
    label: BLOCK_LABELS[i],
    text,
  }));

  return (
    <section
      className="paper-card p-6 md:p-10 relative overflow-hidden"
      style={{
        background:
          "linear-gradient(180deg, hsl(var(--cilantro) / 0.07) 0%, hsl(var(--paper)) 100%)",
      }}
    >
      <span
        aria-hidden
        className="absolute left-0 top-0 bottom-0 w-1.5"
        style={{ background: "hsl(var(--cilantro))" }}
      />
      <div className="pl-3">
        <div className="stamp-label mb-6">Method &amp; Soul</div>

        {quote && (
          <blockquote
            className="my-6 border-l-4 pl-5 py-1 font-heading text-2xl md:text-3xl leading-tight text-[hsl(var(--ink))]"
            style={{ borderColor: "hsl(var(--accent-2))" }}
          >
            “{quote.replace(/^["']|["']$/g, "")}”
          </blockquote>
        )}

        <div
          className={`grid gap-4 md:gap-5 mt-6 ${
            blocks.length === 1 ? "grid-cols-1" : "md:grid-cols-3"
          }`}
        >
          {blocks.map((b, i) => (
            <div
              key={i}
              className="rounded-md border p-4 md:p-5 bg-[hsl(var(--paper))]"
              style={{ borderColor: "hsl(var(--ink) / 0.14)" }}
            >
              <div className="text-[10px] uppercase tracking-[0.22em] font-mono text-[hsl(var(--ink))]/55 mb-2">
                {b.label}
              </div>
              <p className="text-[hsl(var(--ink))]/85 leading-relaxed text-[15px] md:text-base">
                {b.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
