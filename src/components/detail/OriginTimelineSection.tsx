import { Hotdog } from "@/types/hotdog";

interface Props {
  hotdog: Pick<
    Hotdog,
    "origin_story" | "origin_timeline" | "city" | "country" | "name"
  >;
}

// Fallback headings used when we're synthesizing a timeline from paragraphs.
const FALLBACK_ERAS = [
  "The Origin",
  "The Rise",
  "The Everyday",
  "Today",
];

type Entry = { era: string; title?: string | null; body: string };

function derive(hotdog: Props["hotdog"]): Entry[] {
  if (hotdog.origin_timeline && hotdog.origin_timeline.length > 0) {
    return hotdog.origin_timeline.map((t) => ({
      era: t.era,
      title: t.title,
      body: t.body,
    }));
  }
  const story =
    hotdog.origin_story ||
    `The ${hotdog.name} is rooted in ${hotdog.city}'s street food culture.`;
  const paragraphs = story.split("\n\n").map((p) => p.trim()).filter(Boolean);
  return paragraphs.map((body, i) => ({
    era: FALLBACK_ERAS[i] ?? `Chapter ${i + 1}`,
    title: null,
    body,
  }));
}

export function OriginTimelineSection({ hotdog }: Props) {
  const entries = derive(hotdog);
  const highlightTerms = [hotdog.city, hotdog.country, hotdog.name].filter(
    Boolean,
  ) as string[];

  const highlight = (text: string) => {
    let html = text;
    highlightTerms.forEach((term) => {
      const regex = new RegExp(
        `\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`,
        "gi",
      );
      html = html.replace(
        regex,
        `<span class="font-semibold underline decoration-[hsl(var(--accent-2))]/60 decoration-2 underline-offset-2">$1</span>`,
      );
    });
    return html;
  };

  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <h2 className="stamp-label">Origin Story</h2>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Provenance
        </span>
      </div>

      <ol className="relative pl-6 md:pl-10">
        {/* vertical rail */}
        <span
          aria-hidden
          className="absolute top-2 bottom-2 left-2 md:left-3 w-px"
          style={{ background: "hsl(var(--ink) / 0.18)" }}
        />

        {entries.map((entry, i) => (
          <li key={i} className="relative pb-8 last:pb-0">
            {/* rail dot */}
            <span
              aria-hidden
              className="absolute -left-4 md:-left-[26px] top-1 h-3 w-3 rounded-full border-2"
              style={{
                background: "hsl(var(--paper))",
                borderColor: "hsl(var(--accent-2))",
                boxShadow: "0 0 0 3px hsl(var(--paper))",
              }}
            />

            {/* era chip */}
            <div
              className="inline-block text-[10px] md:text-[11px] uppercase tracking-[0.22em] font-mono px-2 py-0.5 rounded-sm border mb-2"
              style={{
                color: "hsl(var(--ink))",
                borderColor: "hsl(var(--ink) / 0.35)",
                background: "hsl(var(--paper))",
              }}
            >
              {entry.era}
            </div>

            {entry.title && (
              <h3 className="font-heading text-lg md:text-xl font-semibold text-[hsl(var(--ink))] leading-tight mb-1.5">
                {entry.title}
              </h3>
            )}

            <p
              className="text-[hsl(var(--ink))]/85 leading-relaxed text-base md:text-[17px] max-w-[64ch]"
              dangerouslySetInnerHTML={{ __html: highlight(entry.body) }}
            />
          </li>
        ))}
      </ol>
    </section>
  );
}
