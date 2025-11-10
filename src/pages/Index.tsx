import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "@/components/Globe";
import { LoadingGlobe } from "@/components/LoadingGlobe";
import { useHotdogs } from "@/hooks/useHotdogs";
import { useAuth } from "@/contexts/AuthContext";
import passportIcon from "@/assets/passport-icon.png";
import leaderboardIcon from "@/assets/leaderboard-icon.png";

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

      {/* Floating Icons - Leaderboard and Passport */}
      <div className="fixed top-24 right-6 sm:top-24 sm:right-4 md:top-28 md:right-6 z-20 flex flex-row items-center gap-2 sm:gap-3 bg-background/40 backdrop-blur-lg rounded-2xl p-3 shadow-lg border border-border/30">
        {/* Leaderboard Icon */}
        <button
          onClick={() => navigate("/leaderboard")}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="View Leaderboard"
          role="button"
        >
          <img 
            src={leaderboardIcon} 
            alt="Hot Dog Leaderboard" 
            className="w-full h-full object-contain"
          />
        </button>

        {/* Passport Icon */}
        <button
          onClick={() => navigate("/passport")}
          className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer"
          aria-label="View My Passport"
          role="button"
        >
          <img 
            src={passportIcon} 
            alt="Hot Dog Passport" 
            className="w-full h-full object-contain"
          />
        </button>
      </div>

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

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-10 bg-gradient-to-r from-mustard/40 via-ketchup/30 to-mustard/40 backdrop-blur-md border-t-2 border-mustard/30 rounded-t-3xl shadow-lg pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-1.5 md:py-2 flex items-center justify-between">
          {/* Left: Account Settings */}
          {user && (
            <button
              onClick={() => navigate('/settings')}
              className="flex items-center gap-2 px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <span className="hidden sm:inline">Account Settings</span>
              <span className="sm:hidden">Settings</span>
            </button>
          )}
          {!user && <div />} {/* Spacer when logged out */}
          
          {/* Right: Sign In / Log Out */}
          {user ? (
            <button
              onClick={() => signOut()}
              className="flex items-center gap-2 px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <span>Log Out</span>
            </button>
          ) : (
            <button
              onClick={() => navigate('/auth')}
              className="flex items-center gap-2 px-6 py-2 bg-card hover:bg-card/90 text-card-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
            >
              <span>Sign In</span>
            </button>
          )}
        </div>
      </div>

    </div>
  );
};

export default Index;
