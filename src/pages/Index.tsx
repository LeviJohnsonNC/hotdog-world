import { useState } from "react";
import { Globe } from "@/components/Globe";
import { HotdogDetail } from "@/components/HotdogDetail";
import { hotdogs } from "@/data/hotdogs";
import { Hotdog } from "@/types/hotdog";

const Index = () => {
  const [selectedHotdog, setSelectedHotdog] = useState<Hotdog | null>(null);

  const handleHotdogClick = (hotdogId: string) => {
    const hotdog = hotdogs.find((h) => h.id === hotdogId);
    if (hotdog) {
      setSelectedHotdog(hotdog);
    }
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
        <Globe onHotdogClick={handleHotdogClick} />
      </div>

      {/* Info Footer */}
      <footer className="absolute bottom-0 left-0 right-0 z-10 p-6 pointer-events-none">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-sm text-muted-foreground bg-background/60 backdrop-blur-sm rounded-full px-4 py-2 inline-block">
            🌍 Rotate • 🔍 Zoom • 🖱️ Click pins to explore
          </p>
        </div>
      </footer>

      {/* Hotdog Detail Modal */}
      {selectedHotdog && (
        <HotdogDetail
          hotdog={selectedHotdog}
          onClose={() => setSelectedHotdog(null)}
        />
      )}
    </div>
  );
};

export default Index;
