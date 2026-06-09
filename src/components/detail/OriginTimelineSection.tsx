import { Hotdog } from "@/types/hotdog";

interface Props {
  timeline: NonNullable<Hotdog["origin_timeline"]>;
}

export function OriginTimelineSection({ timeline }: Props) {
  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <div className="stamp-label">Origin Story</div>
        <span className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
          Field notes
        </span>
      </div>

      <ol className="relative pl-8 md:pl-10">
        <span
          className="absolute left-[10px] md:left-[14px] top-2 bottom-2 w-px"
          style={{ background: "hsl(var(--ink) / 0.22)" }}
        />
        {timeline.map((entry, i) => (
          <li key={i} className="relative pb-8 last:pb-0">
            <span
              className="absolute -left-[2px] md:-left-[6px] top-1 h-4 w-4 rounded-full border-2"
              style={{
                background: "hsl(var(--paper))",
                borderColor: "hsl(var(--accent-2))",
                boxShadow: "0 0 0 3px hsl(var(--paper))",
              }}
            />
            <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--accent-2))] font-bold mb-1">
              {entry.era}
            </div>
            <h3 className="font-heading text-xl font-semibold text-[hsl(var(--ink))] mb-2 leading-tight">
              {entry.title}
            </h3>
            <p className="text-[hsl(var(--ink))]/80 leading-relaxed text-base max-w-[65ch]">
              {entry.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}
