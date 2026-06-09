import { Hotdog } from "@/types/hotdog";

interface Props {
  hotdog: Pick<Hotdog, "origin_story" | "city" | "country" | "name">;
}

const SECTIONS = [
  { icon: "🌟", heading: "The Beginning" },
  { icon: "🌆", heading: "The Era" },
  { icon: "🌭", heading: "The Evolution" },
  { icon: "❤️", heading: "The Legacy" },
];

export function OriginTimelineSection({ hotdog }: Props) {
  const story =
    hotdog.origin_story ||
    `The ${hotdog.name} has a rich history rooted in ${hotdog.city}'s street food culture.`;

  const paragraphs = story.split("\n\n").filter(Boolean);
  const highlightTerms = [hotdog.city, hotdog.country, hotdog.name].filter(Boolean) as string[];

  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-8 flex-wrap gap-3">
        <div className="stamp-label">Origin Story</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Field notes
        </span>
      </div>

      <div className="space-y-7 max-w-[68ch]">
        {paragraphs.map((paragraph, index) => {
          const section = SECTIONS[index] || {
            icon: "📖",
            heading: `Chapter ${index + 1}`,
          };
          let html = paragraph;
          highlightTerms.forEach((term) => {
            const regex = new RegExp(`\\b(${term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})\\b`, "gi");
            html = html.replace(
              regex,
              `<span class="font-semibold underline decoration-[hsl(var(--accent-2))]/60 decoration-2 underline-offset-2">$1</span>`,
            );
          });
          return (
            <div key={index}>
              <h3 className="flex items-center gap-2 font-heading text-lg font-semibold text-[hsl(var(--ink))] mb-2">
                <span className="text-2xl" aria-hidden>
                  {section.icon}
                </span>
                {section.heading}
              </h3>
              <p
                className="text-[hsl(var(--ink))]/85 leading-relaxed text-base md:text-lg pl-9"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
