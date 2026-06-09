import { MapPin } from "lucide-react";
import { Hotdog } from "@/types/hotdog";

interface HeroSectionProps {
  hotdog: Hotdog;
}

export function HeroSection({ hotdog }: HeroSectionProps) {
  const subtitle = hotdog.hero_subtitle || hotdog.description;
  const chips = [
    hotdog.region,
    ...(hotdog.tags || []).slice(0, 3),
  ].filter(Boolean) as string[];

  return (
    <section className="relative h-[68vh] min-h-[460px] overflow-hidden">
      {hotdog.image && (
        <img
          src={hotdog.image}
          alt={hotdog.name}
          className="absolute inset-0 w-full h-full object-cover"
        />
      )}
      {/* Stronger bottom gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30" />
      {/* Subtle grain */}
      <div
        className="absolute inset-0 opacity-[0.12] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "3px 3px",
        }}
      />

      <div className="absolute inset-x-0 bottom-0 px-6 md:px-12 pb-10 md:pb-16">
        <div className="max-w-[1140px] mx-auto">
          <div className="visa-pill mb-5">
            <MapPin className="h-3.5 w-3.5" />
            {hotdog.city}, {hotdog.country}
          </div>
          <h1 className="font-heading text-white text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] mb-5 max-w-3xl drop-shadow-[0_3px_12px_rgba(0,0,0,0.55)]">
            {hotdog.name}
          </h1>
          <p className="text-white/90 text-lg md:text-xl max-w-2xl leading-relaxed mb-6 drop-shadow">
            {subtitle}
          </p>
          {chips.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {chips.map((chip) => (
                <span
                  key={chip}
                  className="text-[11px] uppercase tracking-[0.18em] font-semibold text-white/95 bg-white/10 backdrop-blur-sm border border-white/25 rounded-full px-3 py-1.5"
                >
                  {chip}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
