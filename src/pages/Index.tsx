import { Suspense, useRef, useState, useMemo } from "react";
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
import spinGlobeIcon from "@/assets/spin-globe-icon.png";

const Index = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogsLight();
  const { user, signOut } = useAuth();
  const prefersReducedMotion = useReducedMotion();
  const { hasSeenFTUX, ftuxPhase, markFTUXComplete, shouldShowFTUX } = useFTUX(prefersReducedMotion);
  const globeRef = useRef<GlobeHandle>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [canSpin, setCanSpin] = useState(true);

  // Select 3 well-spaced pins for FTUX pulsing - prioritize very front-facing
  const ftuxPulsingPins = useMemo(() => {
    if (!shouldShowFTUX || hotdogs.length === 0) return new Set<string>();

    // Filter ONLY very front-facing pins (prime visibility zone)
    const frontFacing = hotdogs.filter(h => {
      const lng = h.longitude;
      const lat = h.latitude;
      // Only select pins in the VERY FRONT: narrow longitude range, avoid extreme latitudes
      return lng > -40 && lng < 40 && lat > -45 && lat < 45;
    });

    console.log('FTUX: Front-facing hotdogs:', frontFacing.map(h => `${h.name} (lng: ${h.longitude}, lat: ${h.latitude})`));

    if (frontFacing.length === 0) {
      console.warn('FTUX: No front-facing hotdogs found!');
      return new Set<string>();
    }

    // Select up to 3 geographically distributed pins
    const selected: typeof hotdogs = [];
    selected.push(frontFacing[0]);

    for (const hotdog of frontFacing) {
      if (selected.length >= 3) break;
      
      // Check if this hotdog is far enough from already selected ones
      const isFarEnough = selected.every(s => {
        const latDiff = Math.abs(s.latitude - hotdog.latitude);
        const lngDiff = Math.abs(s.longitude - hotdog.longitude);
        return latDiff > 15 || lngDiff > 15; // Moderate spacing
      });

      if (isFarEnough) {
        selected.push(hotdog);
      }
    }

    // Fallback: if we don't have 3, just take the first 3 front-facing
    while (selected.length < 3 && selected.length < frontFacing.length) {
      const next = frontFacing[selected.length];
      if (!selected.includes(next)) {
        selected.push(next);
      }
    }

    console.log('FTUX: Selected pins for pulsing:', selected.map(h => `${h.name} (lng: ${h.longitude}, lat: ${h.latitude})`));
    return new Set(selected.map(h => h.id));
  }, [shouldShowFTUX, hotdogs]);

  const handleHotdogClick = (hotdogSlug: string) => {
    markFTUXComplete();
    navigate(`/hotdog/${hotdogSlug}`);
  };

  const handleSpinClick = () => {
    if (!hotdogs.length || isSpinning || !canSpin) return;
    
    markFTUXComplete();
    
    // Select random hotdog
    const randomIndex = Math.floor(Math.random() * hotdogs.length);
    const randomHotdog = hotdogs[randomIndex];
    
    setIsSpinning(true);
    setCanSpin(false);
    globeRef.current?.spinToHotdog(randomHotdog.slug);
    
    // Reset spinning state after animation
    setTimeout(() => {
      setIsSpinning(false);
    }, 5000);
    
    // 5 second cooldown
    setTimeout(() => {
      setCanSpin(true);
    }, 5000);
  };

  const siteUrl = window.location.origin;
  const showHint = shouldShowFTUX && ftuxPhase === 'hinting';
  
  // Debug logging for FTUX
  console.log('FTUX State:', { shouldShowFTUX, ftuxPhase, showHint, pulsingPinsCount: ftuxPulsingPins.size });

  return (
    <div 
      className={`relative w-full h-screen overflow-hidden transition-opacity duration-200 ${
        shouldShowFTUX && ftuxPhase === 'loading' ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <Helmet>
        <title>Hotdogs Around the World - Discover Global Street Food Cultures</title>
        <meta 
          name="description" 
          content="Explore iconic hot dog recipes from around the world. Discover origin stories, authentic recipes, and collect stamps from global destinations." 
        />
        <link rel="canonical" href={siteUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Hotdogs Around the World - Discover Global Street Food Cultures" />
        <meta property="og:description" content="Explore iconic hot dog recipes from around the world. Discover origin stories, authentic recipes, and collect stamps from global destinations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={siteUrl} />
        <meta property="og:image" content={`${siteUrl}/images/chicago-hotdog-hero.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Hotdogs Around the World - Discover Global Street Food Cultures" />
        <meta name="twitter:description" content="Explore iconic hot dog recipes from around the world. Discover origin stories, authentic recipes, and collect stamps from global destinations." />
        <meta name="twitter:image" content={`${siteUrl}/images/chicago-hotdog-hero.png`} />

        {/* Structured Data - Organization */}
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

        {/* Structured Data - WebSite */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            "name": "Hotdogs Around the World",
            "url": siteUrl,
            "description": "Explore iconic hot dog recipes from around the world",
            "potentialAction": {
              "@type": "SearchAction",
              "target": {
                "@type": "EntryPoint",
                "urlTemplate": `${siteUrl}/hotdog/{search_term_string}`
              },
              "query-input": "required name=search_term_string"
            }
          })}
        </script>
      </Helmet>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-3 md:p-4 bg-background/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-2xl md:text-4xl font-semibold text-primary">
            Hotdogs Around the World
          </h1>
          <p className="text-xs md:text-base text-foreground/60 mt-0.5 md:mt-1">
            Click a pin to discover iconic street food from every corner of the planet
          </p>
        </div>
      </header>

      {/* Floating Icon - Spin the Globe (Upper Left) */}
      <div className="fixed top-24 left-6 sm:top-24 sm:left-4 md:top-28 md:left-6 z-20 flex flex-row items-center bg-background/40 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-border/30">
        <button
          onClick={handleSpinClick}
          disabled={isSpinning || !hotdogs.length || !canSpin}
          className={`w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-all duration-300 ${
            isSpinning || !hotdogs.length 
              ? 'opacity-50 cursor-not-allowed' 
              : 'hover:scale-110 active:scale-95 cursor-pointer'
          }`}
          aria-label="Spin the Globe"
        >
          <img 
            src={spinGlobeIcon} 
            alt="Spin the Globe" 
            className={`w-full h-full object-contain ${isSpinning ? 'animate-spin' : ''}`}
          />
        </button>
      </div>

      {/* Floating Icons - Leaderboard and Passport (Upper Right) */}
      <div className="fixed top-24 right-6 sm:top-24 sm:right-4 md:top-28 md:right-6 z-20 flex flex-row items-center gap-2 sm:gap-3 bg-background/40 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-border/30">
        {/* Leaderboard Icon */}
        <a
          href="/leaderboard"
          onClick={(e) => {
            e.preventDefault();
            navigate("/leaderboard");
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer block"
          aria-label="View Leaderboard"
        >
          <img 
            src={leaderboardIcon} 
            alt="Hot Dog Leaderboard" 
            className="w-full h-full object-contain"
          />
        </a>

        {/* Passport Icon */}
        <a
          href="/passport"
          onClick={(e) => {
            e.preventDefault();
            navigate("/passport");
          }}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer block"
          aria-label="View My Passport"
        >
          <img 
            src={passportIcon} 
            alt="Hot Dog Passport" 
            className="w-full h-full object-contain"
          />
        </a>
      </div>

      {/* Globe with Loading State */}
      <div className="absolute inset-0 pt-20 md:pt-24">
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
            />
            
            {/* FTUX Micro-hint */}
            {showHint && (
              <div 
                className="
                  fixed top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-50
                  px-6 py-3 rounded-full
                  bg-background/60 backdrop-blur-lg
                  border border-border/40
                  shadow-xl
                  text-sm md:text-base font-medium text-foreground
                  pointer-events-none
                  opacity-0
                "
                style={{
                  animation: 'fadeIn 0.5s ease-out forwards'
                }}
              >
                Spin or tap a hot dog to explore.
              </div>
            )}
            
            <style>{`
              @keyframes fadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </Suspense>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-r from-mustard/40 via-ketchup/30 to-mustard/40 backdrop-blur-md border-t-2 border-mustard/30 rounded-t-3xl shadow-lg pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-1.5 md:py-2 flex items-center justify-between">
          {/* Left: Browse All & Account Settings */}
          <div className="flex items-center gap-2">
            <a
              href="/hotdogs"
              onClick={(e) => {
                e.preventDefault();
                navigate("/hotdogs");
              }}
              className="flex items-center gap-2 px-4 md:px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs md:text-base"
            >
              <span>Browse All</span>
            </a>
            {user && (
              <a
                href="/settings"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/settings');
                }}
                className="flex items-center gap-2 px-4 md:px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs md:text-base"
              >
                <span className="hidden sm:inline">Account Settings</span>
                <span className="sm:hidden">Settings</span>
              </a>
            )}
          </div>
          
          {/* Right: Sign In / Log Out */}
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-4 md:px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs md:text-base"
            >
              <span>Log Out</span>
            </button>
          ) : (
            <a
              href="/auth"
              onClick={(e) => {
                e.preventDefault();
                navigate('/auth');
              }}
              className="flex items-center gap-2 px-4 md:px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg text-xs md:text-base"
            >
              <span>Sign In</span>
            </a>
          )}
        </div>
      </div>

    </div>
  );
};

export default Index;
