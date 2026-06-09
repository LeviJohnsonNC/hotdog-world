interface Props {
  body: string;
  pullQuote?: string | null;
}

export function MethodAndSoulSection({ body, pullQuote }: Props) {
  // Auto-derive pull quote: first sentence of body if not provided
  const quote =
    pullQuote ||
    (body.split(/(?<=[.!?])\s+/).find((s) => s.length > 40 && s.length < 180) ??
      null);

  const paragraphs = body.split("\n\n").filter(Boolean);

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

        <div className="space-y-4 max-w-[68ch]">
          {paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-[hsl(var(--ink))]/85 leading-relaxed text-base md:text-lg"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
