import { Suspense, useRef, useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Globe, GlobeHandle } from "@/components/Globe";
import { LoadingGlobe } from "@/components/LoadingGlobe";
import { useHotdogsLight } from "@/hooks/useHotdogsLight";
import { useAuth } from "@/contexts/AuthContext";
import { useFTUX } from "@/hooks/useFTUX";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import passportIcon from "@/assets/passport-icon.png";
import leaderboardIcon from "@/assets/leaderboard-icon.png";


const Index = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogsLight();
  const { user, signOut } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const { ftuxPhase, markFTUXComplete, shouldShowFTUX } = useFTUX(prefersReducedMotion);
  const globeRef = useRef<GlobeHandle>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Pulse ALL hotdogs during FTUX
  const ftuxPulsingPins = useMemo(() => {
    if (!shouldShowFTUX || hotdogs.length === 0) return new Set<string>();
    return new Set(hotdogs.map(h => h.id));
  }, [shouldShowFTUX, hotdogs]);

  const handleHotdogClick = (hotdogSlug: string) => {
    markFTUXComplete();
    setHasInteracted(true);
    navigate(`/hotdog/${hotdogSlug}`);
  };

  const handleSpinClick = () => {
    if (!hotdogs.length || isSpinning || !canSpin) return;
    markFTUXComplete();
    setHasInteracted(true);
    const randomIndex = Math.floor(Math.random() * hotdogs.length);
    const randomHotdog = hotdogs[randomIndex];
    setIsSpinning(true);
    setCanSpin(false);
    globeRef.current?.spinToHotdog(randomHotdog.slug);
    setTimeout(() => setIsSpinning(false), 5000);
    setTimeout(() => setCanSpin(true), 5000);
  };

  const siteUrl = typeof window !== "undefined" ? window.location.origin : "";

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a1420]">
      <Helmet>
        <title>Hot Dog World — A World Map of Hot Dog Styles</title>
        <meta
          name="description"
          content="Explore hot dogs from every corner of the globe. An interactive map and guide to 60+ regional hot dog styles — from Iceland's pylsa to the Filipino waffle dog."
        />
        <link rel="canonical" href={siteUrl} />
        <meta property="og:title" content="Hot Dog World — A World Map of Hot Dog Styles" />
        <meta property="og:description" content="Explore hot dogs from every corner of the globe. An interactive map and guide to 60+ regional hot dog styles — from Iceland's pylsa to the Filipino waffle dog." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/images/chicago-hotdog-hero.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hot Dog World — A World Map of Hot Dog Styles" />
        <meta name="twitter:description" content="Explore hot dogs from every corner of the globe. An interactive map and guide to 60+ regional hot dog styles — from Iceland's pylsa to the Filipino waffle dog." />
        <meta name="twitter:image" content={`${siteUrl}/images/chicago-hotdog-hero.png`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "Hotdogs Around the World",
            "url": siteUrl,
            "logo": `${siteUrl}/images/chicago-hotdog-hero.png`,
            "description": "A global exploration of iconic hot dog recipes and street food cultures"
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hotdogs Around the World",
            "url": siteUrl,
            "potentialAction": {
              "@type": "SearchAction",
              "target": { "@type": "EntryPoint", "urlTemplate": `${siteUrl}/hotdog/{search_term_string}` },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* Globe canvas — full bleed */}
      <div className="absolute inset-0">
        {isLoading ? (
          <LoadingGlobe />
        ) : (
          <Suspense fallback={<LoadingGlobe />}>
            <Globe
              ref={globeRef}
              hotdogs={hotdogs}
              onHotdogClick={handleHotdogClick}
              enableAutoRotation={!shouldShowFTUX || ftuxPhase !== 'static'}
              ftuxPulsingPins={ftuxPulsingPins}
              ftuxPhase={ftuxPhase}
            />
          </Suspense>
        )}
      </div>

      {/* Top vignette + title — overlays the globe directly */}
      <div className="pointer-events-none absolute top-0 left-0 right-0 z-10 pt-5 md:pt-7 pb-10 bg-gradient-to-b from-black/55 via-black/25 to-transparent">
        <div className="max-w-5xl mx-auto text-center px-4 animate-fade-in-down">
          <p className="text-[10px] md:text-xs tracking-[0.32em] uppercase text-white/55 font-medium mb-2 md:mb-3">
            An Interactive Atlas of Street Food
          </p>
          <h1 className="font-heading text-3xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.05] text-white">
            Hotdogs{" "}
            <span className="bg-gradient-to-r from-[hsl(var(--mustard-yellow))] via-[hsl(var(--papaya-pink))] to-[hsl(var(--ketchup-red))] bg-clip-text text-transparent">
              Around the World
            </span>
          </h1>
        </div>
      </div>

      {/* Leaderboard Ranks — upper left glass card */}
      <div className="fixed top-28 left-4 md:top-32 md:left-6 z-20">
        <a
          href="/leaderboard"
          onClick={(e) => { e.preventDefault(); navigate("/leaderboard"); }}
          className="group relative flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl
            bg-white/5 backdrop-blur-xl border border-white/15
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
            transition-all duration-300
            hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_hsl(var(--ketchup-red)/0.5)] active:scale-95"
          aria-label="View Leaderboard"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl bg-[hsl(var(--ketchup-red))]/30 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
          <img src={leaderboardIcon} alt="" className="w-11 h-11 md:w-12 md:h-12 object-contain" />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-white/85 mt-1">Ranks</span>
        </a>
      </div>

      {/* Passport — upper right glass card */}
      <div className="fixed top-28 right-4 md:top-32 md:right-6 z-20">
        <a
          href="/passport"
          onClick={(e) => { e.preventDefault(); navigate("/passport"); }}
          className="group relative flex flex-col items-center justify-center w-20 h-20 md:w-24 md:h-24 rounded-2xl
            bg-white/5 backdrop-blur-xl border border-white/15
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]
            transition-all duration-300
            hover:bg-white/10 hover:border-white/25 hover:-translate-y-0.5 hover:shadow-[0_15px_50px_-10px_hsl(var(--sky-blue)/0.5)] active:scale-95"
          aria-label="View My Passport"
        >
          <div className="absolute inset-0 -z-10 rounded-2xl bg-[hsl(var(--sky-blue))]/30 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />
          <img src={passportIcon} alt="" className="w-11 h-11 md:w-12 md:h-12 object-contain" />
          <span className="text-[10px] font-semibold tracking-wider uppercase text-white/85 mt-1">Passport</span>
        </a>
      </div>

      {/* Hero CTA — primary first-touch action */}
      {!hasInteracted && !isLoading && (
        <div className="pointer-events-none absolute left-1/2 -translate-x-1/2 bottom-24 md:bottom-28 z-20 flex flex-col items-center gap-2 animate-fade-in">
          <button
            onClick={handleSpinClick}
            disabled={isSpinning || !hotdogs.length || !canSpin}
            className="pointer-events-auto group relative px-7 md:px-9 py-3.5 md:py-4 rounded-full
              bg-gradient-to-r from-[hsl(var(--ketchup-red))] to-[hsl(var(--mustard-yellow))]
              text-white font-semibold text-sm md:text-base tracking-wide
              shadow-[0_10px_40px_-5px_hsl(var(--ketchup-red)/0.6)]
              hover:shadow-[0_15px_50px_-5px_hsl(var(--mustard-yellow)/0.7)]
              hover:-translate-y-0.5 active:scale-95 transition-all duration-300
              before:absolute before:inset-0 before:rounded-full before:bg-white/20 before:opacity-0 before:hover:opacity-100 before:transition-opacity
              cta-pulse"
          >
            <span className="relative flex items-center gap-2">
              Spin the Globe
              <span className="text-lg leading-none transition-transform group-hover:translate-x-0.5">→</span>
            </span>
          </button>
          <p className="text-xs md:text-sm text-white/60 font-medium">
            or click any pin to explore 60+ regional styles
          </p>
        </div>
      )}

      {/* Bottom nav — slim glass */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-black/30 backdrop-blur-xl border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-2 md:py-2.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <a
              href="/hotdogs"
              onClick={(e) => { e.preventDefault(); navigate("/hotdogs"); }}
              className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 border border-white/10"
            >
              Browse All
            </a>
            <a
              href="/pantry"
              onClick={(e) => { e.preventDefault(); navigate("/pantry"); }}
              className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 border border-white/10"
            >
              Pantry
            </a>
            {user && (
              <a
                href="/settings"
                onClick={(e) => { e.preventDefault(); navigate('/settings'); }}
                className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 border border-white/10"
              >
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Settings</span>
              </a>
            )}
          </div>
          {user ? (
            <button
              onClick={() => signOut()}
              className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 border border-white/10"
            >
              Log Out
            </button>
          ) : (
            <a
              href="/auth"
              onClick={(e) => { e.preventDefault(); navigate('/auth'); }}
              className="px-4 md:px-5 py-1.5 md:py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs md:text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 border border-white/10"
            >
              Sign In
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
