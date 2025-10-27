import { useNavigate } from "react-router-dom";
import { Globe } from "@/components/Globe";
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
      <header className="absolute top-0 left-0 right-0 z-10 p-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl md:text-4xl font-bold text-primary">
              🌭 Hotdogs Around the World
            </h1>
            <p className="text-sm md:text-base text-muted-foreground mt-1">
              Click a pin to discover iconic street food from every corner of the planet
            </p>
          </div>
        </div>
      </header>

      {/* Globe */}
      <div className="absolute inset-0 pt-24">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-muted-foreground">Loading hot dogs from around the world...</p>
          </div>
        ) : (
          <Globe hotdogs={hotdogs} onHotdogClick={handleHotdogClick} />
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
