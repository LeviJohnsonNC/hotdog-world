interface Props {
  instructions: string[];
}

function parseStep(raw: string) {
  // Strip leading numbering "1. " and split title:body if present
  const cleaned = raw.replace(/^\d+\.\s*/, "").trim();
  const tipMatch = cleaned.match(/(Technique tip|Technical note):\s*(.*)$/is);
  let main = cleaned;
  let tip: string | null = null;
  if (tipMatch && tipMatch.index !== undefined) {
    main = cleaned.substring(0, tipMatch.index).trim();
    tip = tipMatch[2].trim();
  }
  const colonIdx = main.indexOf(":");
  const title = colonIdx > 0 ? main.substring(0, colonIdx).trim() : main;
  const body = colonIdx > 0 ? main.substring(colonIdx + 1).trim() : "";
  return { title, body, tip };
}

export function InstructionsSection({ instructions }: Props) {
  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div className="stamp-label">The Build, Step by Step</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          {instructions.length} steps
        </span>
      </div>

      <ol className="grid md:grid-cols-2 gap-4 md:gap-5">
        {instructions.map((raw, i) => {
          const { title, body, tip } = parseStep(raw);
          return (
            <li
              key={i}
              className="rounded-lg p-5 border bg-white/40"
              style={{ borderColor: "hsl(var(--paper-edge) / 0.6)" }}
            >
              <div className="flex items-start gap-3 mb-2">
                <span
                  className="shrink-0 inline-flex items-center justify-center h-8 w-8 rounded-full font-display text-base"
                  style={{
                    background: "hsl(var(--accent-1))",
                    color: "hsl(var(--ink))",
                  }}
                >
                  {i + 1}
                </span>
                <h3 className="font-heading font-semibold text-[hsl(var(--ink))] text-lg leading-tight pt-0.5">
                  {title}
                </h3>
              </div>
              {body && (
                <p className="text-[hsl(var(--ink))]/80 text-sm leading-relaxed pl-11">
                  {body}
                </p>
              )}
              {tip && (
                <div
                  className="mt-3 ml-11 pl-3 py-2 border-l-2 text-xs text-[hsl(var(--ink))]/75 italic"
                  style={{ borderColor: "hsl(var(--cilantro))" }}
                >
                  <span className="not-italic font-semibold uppercase tracking-wider text-[10px] text-[hsl(var(--cilantro))] mr-1.5">
                    Vendor tip
                  </span>
                  {tip}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </section>
  );
}
