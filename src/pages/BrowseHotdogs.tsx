import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useHotdogsLight } from "@/hooks/useHotdogsLight";
import { ArrowLeft, Search, ChefHat, Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo, useEffect } from "react";
import { usePantry, canMakeHotdog, missingCount } from "@/hooks/usePantry";

const BrowseHotdogs = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: hotdogs = [], isLoading } = useHotdogsLight();
  const { pantry, isSignedIn } = usePantry();
  const siteUrl = window.location.origin;
  const [searchQuery, setSearchQuery] = useState("");
  const [pantryOnly, setPantryOnly] = useState(searchParams.get("filter") === "pantry");

  useEffect(() => {
    const next = new URLSearchParams(searchParams);
    if (pantryOnly) next.set("filter", "pantry");
    else next.delete("filter");
    setSearchParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pantryOnly]);

  const handleHotdogClick = (e: React.MouseEvent<HTMLAnchorElement>, hotdogSlug: string) => {
    e.preventDefault();
    navigate(`/hotdog/${hotdogSlug}`, { state: { from: '/hotdogs' } });
  };

  const pantryEmpty = pantry.ingredient_ids.length === 0 && pantry.equipment_ids.length === 0;
  const readyCount = useMemo(
    () => hotdogs.filter((h) => canMakeHotdog(h, pantry)).length,
    [hotdogs, pantry]
  );


  // Sort alphabetically and filter by search query + pantry filter
  const filteredHotdogs = useMemo(() => {
    const sorted = [...hotdogs].sort((a, b) => a.name.localeCompare(b.name));
    
    if (!searchQuery.trim()) {
      return sorted;
    }
    
    const query = searchQuery.toLowerCase();
    return sorted.filter((hotdog) => {
      const nameMatch = hotdog.name.toLowerCase().includes(query);
      const locationMatch = `${hotdog.city}, ${hotdog.country}`.toLowerCase().includes(query);
      return nameMatch || locationMatch;
    });
  }, [hotdogs, searchQuery]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-mustard/10 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-heading text-primary mb-4">Browse All Hotdogs</h1>
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
              Browse All Hotdogs
            </h1>
            <p className="text-sm text-muted-foreground">
              {hotdogs.length} iconic recipes from around the world
            </p>
          </div>
          
          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Search Bar */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary shadow-sm"
          />
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">

        {/* Results Count */}
        {searchQuery && (
          <p className="text-sm text-muted-foreground mb-4">
            Showing {filteredHotdogs.length} of {hotdogs.length} hotdogs
          </p>
        )}

        {/* Hotdog Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredHotdogs.map((hotdog) => (
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
