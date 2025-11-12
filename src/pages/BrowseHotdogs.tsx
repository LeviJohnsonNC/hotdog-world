import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useHotdogs } from "@/hooks/useHotdogs";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";

const BrowseHotdogs = () => {
  const navigate = useNavigate();
  const { data: hotdogs = [], isLoading } = useHotdogs();
  const siteUrl = window.location.origin;

  const handleHotdogClick = (e: React.MouseEvent<HTMLAnchorElement>, hotdogSlug: string) => {
    e.preventDefault();
    navigate(`/hotdog/${hotdogSlug}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-mustard/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-foreground/60">Loading hotdogs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-mustard/10">
      <Helmet>
        <title>Browse All Hotdogs - Hotdogs Around the World</title>
        <meta 
          name="description" 
          content="Browse all iconic hot dog recipes from around the world. Explore street food from New York, Chicago, Tokyo, Seoul, and dozens of other global destinations." 
        />
        <link rel="canonical" href={`${siteUrl}/hotdogs`} />
        
        <meta property="og:title" content="Browse All Hotdogs - Hotdogs Around the World" />
        <meta property="og:description" content="Browse all iconic hot dog recipes from around the world. Explore street food from New York, Chicago, Tokyo, Seoul, and dozens of other global destinations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/hotdogs`} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Browse All Hotdogs - Hotdogs Around the World" />
        <meta name="twitter:description" content="Browse all iconic hot dog recipes from around the world." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-md border-b border-border/30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
              aria-label="Back to Globe"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Globe</span>
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="font-heading text-4xl md:text-5xl font-bold text-primary mb-3">
            Browse All Hotdogs
          </h1>
          <p className="text-foreground/70 text-lg max-w-2xl mx-auto">
            Explore {hotdogs.length} iconic hot dog recipes from around the world
          </p>
        </div>

        {/* Hotdog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {hotdogs.map((hotdog) => (
            <a
              key={hotdog.id}
              href={`/hotdog/${hotdog.slug}`}
              onClick={(e) => handleHotdogClick(e, hotdog.slug)}
              className="group block"
            >
              <Card className="overflow-hidden bg-card/40 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl h-full">
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  <img
                    src={hotdog.image}
                    alt={`${hotdog.name} from ${hotdog.city}, ${hotdog.country}`}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    loading="lazy"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-heading text-xl font-semibold text-foreground mb-1 group-hover:text-primary transition-colors">
                    {hotdog.name}
                  </h2>
                  <p className="text-sm text-foreground/60">
                    {hotdog.city}, {hotdog.country}
                  </p>
                </div>
              </Card>
            </a>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-border/30 bg-background/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-center gap-6 text-sm">
            <a
              href="/"
              onClick={(e) => {
                e.preventDefault();
                navigate("/");
              }}
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Globe
            </a>
            <a
              href="/hotdogs"
              onClick={(e) => {
                e.preventDefault();
                navigate("/hotdogs");
              }}
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Browse All
            </a>
            <a
              href="/passport"
              onClick={(e) => {
                e.preventDefault();
                navigate("/passport");
              }}
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Passport
            </a>
            <a
              href="/leaderboard"
              onClick={(e) => {
                e.preventDefault();
                navigate("/leaderboard");
              }}
              className="text-foreground/70 hover:text-primary transition-colors"
            >
              Leaderboard
            </a>
          </div>
          <p className="text-center text-xs text-foreground/50 mt-6">
            © 2025 Hotdogs Around the World. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default BrowseHotdogs;
