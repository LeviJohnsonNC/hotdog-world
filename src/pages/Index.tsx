import { Suspense, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "@/components/Globe";
import { LoadingGlobe } from "@/components/LoadingGlobe";
import { useHotdogs } from "@/hooks/useHotdogs";
import { useAuth } from "@/contexts/AuthContext";
import { useIsMobile } from "@/hooks/use-mobile";
import passportIcon from "@/assets/passport-icon.png";
import leaderboardIcon from "@/assets/leaderboard-icon.png";
import { Menu, X } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogs();
  const { user, signOut } = useAuth();
  const isMobile = useIsMobile();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        </div>
      </header>


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

      {/* Mobile Expandable Menu Panel */}
      {isMobile && (
        <>
          {/* Backdrop */}
          {isMenuOpen && (
            <div 
              className="fixed inset-0 bg-black/30 z-20 backdrop-blur-sm transition-opacity duration-300"
              onClick={() => setIsMenuOpen(false)}
            />
          )}
          
          {/* Menu Panel */}
          <div 
            className={`fixed bottom-[72px] left-0 right-0 z-30 bg-gradient-to-br from-mustard/95 via-ketchup/95 to-mustard/95 backdrop-blur-md border-t-2 border-mustard/50 rounded-t-3xl shadow-2xl transition-transform duration-300 ease-in-out ${
              isMenuOpen ? 'translate-y-0' : 'translate-y-full'
            }`}
          >
            <div className="px-4 py-6 space-y-3">
              {/* Leaderboard */}
              <button
                onClick={() => {
                  navigate("/leaderboard");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                <img src={leaderboardIcon} alt="" className="w-6 h-6 object-contain" />
                <span>Leaderboard</span>
              </button>

              {/* Passport */}
              <button
                onClick={() => {
                  navigate("/passport");
                  setIsMenuOpen(false);
                }}
                className="w-full flex items-center gap-3 px-6 py-3 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
              >
                <img src={passportIcon} alt="" className="w-7 h-7 object-contain" />
                <span>Passport</span>
              </button>

              {/* Account Settings */}
              {user && (
                <button
                  onClick={() => {
                    navigate('/settings');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="text-xl">⚙️</span>
                  <span>Account Settings</span>
                </button>
              )}

              {/* Sign In / Log Out */}
              {user ? (
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="text-xl">👋</span>
                  <span>Log Out</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    navigate('/auth');
                    setIsMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-6 py-3 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
                >
                  <span className="text-xl">🔓</span>
                  <span>Sign In</span>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-20 bg-gradient-to-r from-mustard/90 via-ketchup/90 to-mustard/90 backdrop-blur-md border-t-2 border-mustard/50 rounded-t-3xl shadow-2xl pointer-events-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3 md:py-4">
          
          {/* Mobile: Menu Toggle Button */}
          {isMobile ? (
            <div className="flex items-center justify-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-2 px-6 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
                <span>Menu</span>
              </button>
            </div>
          ) : (
            /* Desktop: All Navigation Items */
            <div className="flex items-center justify-between">
              {/* Left: Leaderboard & Passport */}
              <div className="flex items-center gap-3">
                <button
                  onClick={() => navigate("/leaderboard")}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  aria-label="View Leaderboard"
                >
                  <img src={leaderboardIcon} alt="" className="w-6 h-6 object-contain" />
                  <span>Leaderboard</span>
                </button>

                <button
                  onClick={() => navigate("/passport")}
                  className="flex items-center gap-2 px-4 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  aria-label="View My Passport"
                >
                  <img src={passportIcon} alt="" className="w-7 h-7 object-contain" />
                  <span>Passport</span>
                </button>
              </div>

              {/* Right: Account Settings & Sign In/Out */}
              <div className="flex items-center gap-3">
                {user && (
                  <button
                    onClick={() => navigate('/settings')}
                    className="flex items-center gap-2 px-6 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <span>⚙️</span>
                    <span>Account Settings</span>
                  </button>
                )}
                
                {user ? (
                  <button
                    onClick={() => signOut()}
                    className="flex items-center gap-2 px-6 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <span>👋</span>
                    <span>Log Out</span>
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/auth')}
                    className="flex items-center gap-2 px-6 py-2 bg-white/90 hover:bg-white text-foreground rounded-full font-medium transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg hover:shadow-xl"
                  >
                    <span>🔓</span>
                    <span>Sign In</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};

export default Index;
