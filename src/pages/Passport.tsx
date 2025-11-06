import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

const Passport = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen bg-background">
      {/* Back to Map Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-40 shadow-lg rounded-full"
        size="lg"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Map
      </Button>

      {/* Passport Content - Coming Soon */}
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">
            My Hot Dog Passport
          </h1>
          <p className="text-muted-foreground">
            Your passport collection will appear here
          </p>
        </div>
      </div>
    </div>
  );
};

export default Passport;
