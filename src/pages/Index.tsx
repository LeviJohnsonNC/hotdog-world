import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "@/components/Globe";
import { LoadingGlobe } from "@/components/LoadingGlobe";
import { useHotdogs } from "@/hooks/useHotdogs";
import { useAuth } from "@/contexts/AuthContext";
import passportIcon from "@/assets/passport-icon.png";

const Index = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogs();
  const { user, signOut } = useAuth();

  const handleHotdogClick = (hotdogId: string) => {
    navigate(`/hotdog/${hotdogId}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-heading text-2xl md:text-4xl font-bold text-primary">
            Hotdogs Around the World
          </h1>
          <p className="text-xs md:text-base text-muted-foreground mt-0.5 md:mt-1">
            Click a pin to discover iconic street food from every corner of the planet
          </p>
          {user ? (
            <button
              onClick={() => signOut()}
              className="absolute bottom-4 right-4 md:top-6 md:right-6 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Log Out
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="absolute bottom-4 right-4 md:top-6 md:right-6 text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </header>

      {/* Floating Passport Icon */}
      <button
        onClick={() => navigate("/passport")}
        className="fixed top-24 right-6 sm:top-24 sm:right-4 md:top-28 md:right-6 z-20 w-24 h-24 sm:w-24 sm:h-24 md:w-32 md:h-32 transition-all duration-300 hover:scale-110 active:scale-95 hover:drop-shadow-[0_0_15px_rgba(255,165,0,0.5)] drop-shadow-2xl cursor-pointer"
        aria-label="View My Passport"
        role="button"
      >
        <img 
          src={passportIcon} 
          alt="Hot Dog Passport" 
          className="w-full h-full object-contain"
        />
      </button>

      {/* Globe with Loading State */}
      <div className="absolute inset-0 pt-20 md:pt-24">
        {isLoading ? (
          <LoadingGlobe />
        ) : (
          <Suspense fallback={<LoadingGlobe />}>
            <Globe hotdogs={hotdogs} onHotdogClick={handleHotdogClick} />
          </Suspense>
        )}
      </div>

      {/* Info Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            🌍 Rotate • 🔍 Zoom • 🖱️ Click pins to explore
          </p>
        </div>
      </footer>

    </div>
  );
};

export default Index;
