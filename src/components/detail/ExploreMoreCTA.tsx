import { Link } from "react-router-dom";
import { Stamp, Globe as GlobeIcon, ArrowRight } from "lucide-react";
import { Hotdog } from "@/types/hotdog";
import { getRelatedCaption } from "@/utils/relatedCaptions";

interface Props {
  hotdog: Hotdog;
  related: Hotdog[];
  onStampClick: () => void;
}

export function ExploreMoreCTA({ hotdog, related, onStampClick }: Props) {
  return (
    <section className="paper-card p-6 md:p-10">
      <div className="text-center mb-8">
        <div className="inline-block stamp-label mb-4">Keep Exploring</div>
        <h2 className="font-heading text-2xl md:text-3xl font-bold text-[hsl(var(--ink))]">
          Stamp {hotdog.city} in your passport
        </h2>
        <div className="mt-5 flex flex-wrap gap-3 justify-center">
          <button onClick={onStampClick} className="brass-button text-base flex items-center gap-2">
            <Stamp className="h-4 w-4" /> Stamp My Passport
          </button>
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-base font-medium px-5 py-2.5 rounded-md border-2"
            style={{
              borderColor: "hsl(var(--ink) / 0.25)",
              color: "hsl(var(--ink))",
            }}
          >
            <GlobeIcon className="h-4 w-4" /> Spin the Globe
          </Link>
        </div>
      </div>

      {related.length > 0 && (
        <>
          <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/55 text-center mb-4">
            Try another dog
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {related.slice(0, 3).map((r) => {
              const caption =
                getRelatedCaption(hotdog.slug, r.slug) ??
                `${r.city}, ${r.country}`;
              return (
                <Link
                  key={r.id}
                  to={`/hotdog/${r.slug}`}
                  className="group block paper-card overflow-hidden hover:-translate-y-1 transition-transform"
                >
                  {r.image && (
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={r.image}
                        alt={r.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <div className="text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/60">
                      {r.city}, {r.country}
                    </div>
                    <div className="font-heading font-semibold text-[hsl(var(--ink))] mt-1 flex items-center justify-between gap-2">
                      <span>{r.name}</span>
                      <ArrowRight className="h-4 w-4 opacity-60 group-hover:translate-x-1 transition-transform shrink-0" />
                    </div>
                    <div className="mt-2 text-[13px] italic text-[hsl(var(--ink))]/70 leading-snug">
                      {caption}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
