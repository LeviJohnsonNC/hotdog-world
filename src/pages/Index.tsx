import { Suspense } from "react";
import { useNavigate } from "react-router-dom";
import { Globe } from "@/components/Globe";
import { LoadingGlobe } from "@/components/LoadingGlobe";
import { useHotdogs } from "@/hooks/useHotdogs";

const Index = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogs();

  const handleHotdogClick = (hotdogId: string) => {
    navigate(`/hotdog/${hotdogId}`);
  };

  return (
    <div className="relative w-full h-screen overflow-hidden">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-10 p-4 md:p-6 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="text-center md:text-left">
            <h1 className="font-heading text-2xl md:text-4xl font-bold text-primary">
              Hotdogs Around the World
            </h1>
            <p className="text-xs md:text-base text-muted-foreground mt-0.5 md:mt-1">
              Click a pin to discover iconic street food from every corner of the planet
            </p>
          </div>
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
