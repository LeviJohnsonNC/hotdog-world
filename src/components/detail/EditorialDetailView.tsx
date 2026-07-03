import { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Hotdog } from "@/types/hotdog";
import { useRevealedFacts } from "@/hooks/useRevealedFacts";
import { useHotdogsLight } from "@/hooks/useHotdogsLight";
import { PassportStamp } from "@/components/PassportStamp";
import { HeroSection } from "@/components/detail/HeroSection";
import { StickyPassportBar, MobileActionBar } from "@/components/detail/StickyPassportBar";
import { FlavorProfileCard } from "@/components/detail/FlavorProfileCard";
import { AnatomySection } from "@/components/detail/AnatomySection";
import { BuildSection } from "@/components/detail/BuildSection";
import { InstructionsSection } from "@/components/detail/InstructionsSection";
import { BuildRail } from "@/components/detail/BuildRail";
import { StepsSection } from "@/components/detail/StepsSection";
import { MethodAndSoulSection } from "@/components/detail/MethodAndSoulSection";
import { TriviaPostcards } from "@/components/detail/TriviaPostcards";
import { OriginTimelineSection } from "@/components/detail/OriginTimelineSection";
import { ExploreMoreCTA } from "@/components/detail/ExploreMoreCTA";
import { NutritionDamage } from "@/components/detail/NutritionDamage";


interface Props {
  hotdog: Hotdog;
}

export function EditorialDetailView({ hotdog }: Props) {
  const location = useLocation();
  const { isRevealed, revealFact, revealedIndices } = useRevealedFacts(hotdog.id);
  const { data: allHotdogs = [] } = useHotdogsLight();
  const stampRef = useRef<HTMLDivElement>(null);

  const funFacts = hotdog.fun_facts || [];

  // If the user arrived from Browse All, send them back there instead of the globe.
  const cameFromBrowse = location.state?.from === '/hotdogs';
  const backTo = cameFromBrowse ? { path: "/hotdogs", label: "Browse All" } : undefined;

  // Auto-derive related: explicit list, else shared region/tags
  const related = useMemo<Hotdog[]>(() => {
    if (!allHotdogs.length) return [];
    const others = allHotdogs.filter((h) => h.slug !== hotdog.slug);
    if (hotdog.related_slugs?.length) {
      const map = new Map(others.map((h) => [h.slug, h]));
      return hotdog.related_slugs
        .map((s) => map.get(s))
        .filter(Boolean) as Hotdog[];
    }
    const tagSet = new Set(hotdog.tags || []);
    return others
      .map((h) => {
        const sharedTags = (h.tags || []).filter((t) => tagSet.has(t)).length;
        const sameRegion = h.region && h.region === hotdog.region ? 1 : 0;
        return { h, score: sharedTags * 2 + sameRegion };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((x) => x.h);
  }, [allHotdogs, hotdog.slug, hotdog.related_slugs, hotdog.tags, hotdog.region]);

  const scrollToStamp = () => {
    stampRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  // Per-page accent palette via CSS variables
  const accentStyle: React.CSSProperties = hotdog.accent_palette
    ? ({
        "--accent-1": hotdog.accent_palette.primary || "var(--mustard-yellow)",
        "--accent-2": hotdog.accent_palette.secondary || "var(--ketchup-red)",
      } as React.CSSProperties)
    : {};

  const hasStructuredRecipe =
    !!hotdog.recipe_steps?.length && !!hotdog.recipe_ingredients?.length;

  return (
    <div className="bg-paper min-h-screen pb-32 md:pb-12" style={accentStyle}>
      <StickyPassportBar
        hotdog={hotdog}
        revealedCount={revealedIndices.length}
        totalFacts={funFacts.length}
        onStampClick={scrollToStamp}
        backTo={backTo}
      />

      <HeroSection hotdog={hotdog} />

      <div
        className={`${
          hasStructuredRecipe ? "max-w-[1240px]" : "max-w-[1140px]"
        } mx-auto px-4 md:px-6 mt-10 md:mt-14 space-y-8 md:space-y-10`}
      >
        {hotdog.flavor_profile && (
          <FlavorProfileCard flavorProfile={hotdog.flavor_profile} />
        )}

        {hotdog.anatomy && hotdog.anatomy.length > 0 && (
          <AnatomySection anatomy={hotdog.anatomy} whyItWorks={hotdog.why_it_works} slug={hotdog.slug} name={hotdog.name} />
        )}

        {/* "The Damage" — quiet nutrition summary; full label in modal */}
        <NutritionDamage hotdog={hotdog} />

        {hasStructuredRecipe ? (
          // Asymmetric grid: compact sticky Build rail + wide Steps column
          <div className="grid lg:grid-cols-[360px_1fr] gap-6 md:gap-8 items-start">
            <BuildRail hotdog={hotdog} />
            <StepsSection hotdog={hotdog} />
          </div>
        ) : (
          // Legacy layout for dogs not yet migrated
          <div className="grid lg:grid-cols-2 gap-8 md:gap-10">
            <BuildSection hotdog={hotdog} />
            <InstructionsSection instructions={hotdog.instructions || []} />
          </div>
        )}

        {hotdog.method_and_soul && (
          <MethodAndSoulSection
            body={hotdog.method_and_soul}
            pullQuote={hotdog.pull_quote}
          />
        )}

        {funFacts.length > 0 && (
          <TriviaPostcards
            facts={funFacts}
            isRevealed={isRevealed}
            onReveal={(i) => revealFact(i)}
            revealedCount={revealedIndices.length}
          />
        )}

        {hotdog.origin_story && (
          <OriginTimelineSection hotdog={hotdog} />
        )}


        <ExploreMoreCTA
          hotdog={hotdog}
          related={related}
          onStampClick={scrollToStamp}
        />

        {/* Inline passport stamp anchor (replaces floating button) */}
        <div ref={stampRef} className="pt-2">
          <PassportStamp hotdogId={hotdog.id} hotdogName={hotdog.name} />
        </div>
      </div>

      <MobileActionBar onStampClick={scrollToStamp} />
    </div>
  );
}
