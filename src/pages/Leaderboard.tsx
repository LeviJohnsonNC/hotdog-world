import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Leaderboard = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            onClick={() => navigate("/")}
            variant="ghost"
            size="sm"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
          
          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Hot Dog Leaderboard
            </h1>
            <p className="text-sm text-muted-foreground">
              Top explorers from around the world
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16 space-y-4">
          <div className="text-6xl mb-4">🏆</div>
          <h2 className="text-2xl font-bold text-foreground">
            Coming Soon!
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The leaderboard is being prepared. Soon you'll be able to see
            how your hot dog journey ranks against other explorers!
          </p>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
