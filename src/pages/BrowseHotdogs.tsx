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
    let list = [...hotdogs].sort((a, b) => a.name.localeCompare(b.name));

    if (pantryOnly && !pantryEmpty) {
      list = list.filter((h) => canMakeHotdog(h, pantry));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      list = list.filter((hotdog) => {
        const nameMatch = hotdog.name.toLowerCase().includes(query);
        const locationMatch = `${hotdog.city}, ${hotdog.country}`.toLowerCase().includes(query);
        return nameMatch || locationMatch;
      });
    }

    return list;
  }, [hotdogs, searchQuery, pantryOnly, pantryEmpty, pantry]);

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
          
          <Link to="/pantry">
            <Button variant="outline" size="sm" className="gap-2">
              <ChefHat className="h-4 w-4 text-mustard" />
              <span className="hidden sm:inline">My Pantry</span>
            </Button>
          </Link>
        </div>
      </header>

      {/* Search + pantry filter */}
      <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col sm:flex-row gap-4 sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-card border-border focus:border-primary shadow-sm"
          />
        </div>

        <div className="flex items-center gap-3 bg-card/70 border border-border/60 rounded-full px-4 py-2 shadow-sm">
          <ChefHat className="h-4 w-4 text-mustard" />
          <Label htmlFor="pantry-only" className="text-sm cursor-pointer select-none">
            Only what I can make
            {!pantryEmpty && (
              <span className="ml-2 text-xs text-muted-foreground tabular-nums">
                ({readyCount} ready)
              </span>
            )}
          </Label>
          <Switch
            id="pantry-only"
            checked={pantryOnly}
            onCheckedChange={setPantryOnly}
            disabled={pantryEmpty}
          />
        </div>
      </div>

      {pantryOnly && pantryEmpty && (
        <div className="max-w-7xl mx-auto px-4">
          <div className="rounded-lg border border-dashed border-mustard/50 bg-mustard/5 p-4 text-sm text-foreground/80 flex items-center justify-between gap-3">
            <span>
              Your pantry is empty. {isSignedIn ? "" : "Sign in and "}Check off what's in your kitchen to filter.
            </span>
            <Link to="/pantry">
              <Button size="sm" variant="outline">Open pantry</Button>
            </Link>
          </div>
        </div>
      )}

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
          {filteredHotdogs.map((hotdog) => {
            const ready = !pantryEmpty && canMakeHotdog(hotdog, pantry);
            const miss = !pantryEmpty && !ready ? missingCount(hotdog, pantry) : null;
            const oneAway = !!(miss && miss.total === 1);
            return (
              <a
                key={hotdog.id}
                href={`/hotdog/${hotdog.slug}`}
                onClick={(e) => handleHotdogClick(e, hotdog.slug)}
                className="group block"
              >
                <Card className="relative overflow-hidden bg-card/40 backdrop-blur-sm border-border/30 hover:border-primary/50 transition-all duration-300 hover:scale-105 hover:shadow-xl h-full">
                  {ready && (
                    <Badge className="absolute top-3 right-3 z-10 bg-mustard text-background dark:text-foreground border-mustard shadow-md gap-1">
                      <Check className="h-3 w-3" strokeWidth={3} />
                      Ready to cook
                    </Badge>
                  )}
                  {oneAway && (
                    <Badge
                      variant="outline"
                      className="absolute top-3 right-3 z-10 bg-background/90 backdrop-blur border-mustard/60 text-foreground shadow-sm"
                    >
                      1 away
                    </Badge>
                  )}
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
            );
          })}
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
