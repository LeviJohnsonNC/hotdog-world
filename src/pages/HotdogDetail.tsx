import { useParams, useNavigate } from "react-router-dom";
import { useHotdogs } from "@/hooks/useHotdogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ExternalLink, MapPin, ShoppingBasket, Utensils, Sparkles, BookOpen, Globe as GlobeIcon, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { FactFlipCard } from "@/components/FactFlipCard";
import { toast } from "@/hooks/use-toast";

const HotdogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hotdogs = [] } = useHotdogs();
  
  const hotdog = hotdogs.find((h) => h.id === id);
  
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});
  const [revealedFacts, setRevealedFacts] = useState<Set<number>>(new Set());
  const [storyCompleted, setStoryCompleted] = useState(false);
  const [showScrollCue, setShowScrollCue] = useState(true);

  useEffect(() => {
    // Load revealed facts from localStorage
    if (hotdog) {
      const saved = localStorage.getItem(`hotdog_facts_revealed_${hotdog.id}`);
      if (saved) {
        setRevealedFacts(new Set(JSON.parse(saved)));
      }
      
      const completed = localStorage.getItem(`hotdog_story_completed_${hotdog.id}`);
      if (completed === "true") {
        setStoryCompleted(true);
      }
    }
  }, [hotdog]);

  const handleRevealFact = (index: number) => {
    if (!hotdog) return;
    
    const newRevealed = new Set(revealedFacts);
    newRevealed.add(index);
    setRevealedFacts(newRevealed);
    
    localStorage.setItem(
      `hotdog_facts_revealed_${hotdog.id}`,
      JSON.stringify(Array.from(newRevealed))
    );
  };

  useEffect(() => {
    if (!hotdog || storyCompleted) return;

    const handleScroll = () => {
      const storySection = document.getElementById("origin-story");
      if (!storySection) return;

      const rect = storySection.getBoundingClientRect();
      const scrolledToBottom = rect.bottom <= window.innerHeight + 100;

      if (scrolledToBottom && !storyCompleted) {
        setStoryCompleted(true);
        localStorage.setItem(`hotdog_story_completed_${hotdog.id}`, "true");
        
        toast({
          title: "🎉 Origin Story Unlocked!",
          description: `You've discovered the complete history of the ${hotdog.name}!`,
        });
      }

      // Hide scroll cue after first scroll
      if (window.scrollY > 100) {
        setShowScrollCue(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hotdog, storyCompleted]);

  if (!hotdog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <h2 className="text-2xl font-heading mb-4">Hot dog not found</h2>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </div>
      </div>
    );
  }

  // Use actual data if available, otherwise fall back to placeholders
  const ingredients = hotdog.ingredients || [
    "Premium hot dog sausage",
    "Fresh baked bun",
    "Special house sauce",
    "Crispy fried onions",
    "Fresh vegetables",
    "Secret spice blend",
  ];

  const instructions = hotdog.instructions || [
    "Grill the sausage until perfectly charred and juicy",
    "Toast the bun until golden and slightly crispy",
    "Layer the special sauce generously on the bun",
    "Place the hot sausage in the bun",
    "Add toppings in the traditional order",
    "Serve immediately while hot and enjoy!",
  ];

  const funFacts = hotdog.fun_facts || [
    `This hot dog is a beloved street food staple in ${hotdog.city}`,
    "Locals often enjoy it as a late-night snack after celebrations",
    "The recipe has been passed down through generations",
    "Over 1 million of these are sold annually in the city",
    "It's featured in numerous food documentaries",
  ];

  const originStory = hotdog.origin_story || `The ${hotdog.name} has a rich history deeply rooted in ${hotdog.city}'s vibrant street food culture. This iconic dish emerged in the early 20th century when local vendors began experimenting with traditional recipes, creating something entirely unique to the region.

What makes this hot dog distinctive is its perfect blend of local ingredients and international influences. Over the decades, it has evolved from a simple street snack to a cultural icon, representing the spirit and flavor of ${hotdog.country}. Today, it remains a must-try for food lovers visiting ${hotdog.city}, with countless vendors each adding their own special twist to this beloved classic.`;

  const exploreLinks = hotdog.explore_links || [
    { title: "Watch How It's Made", url: "#" },
    { title: "Best Places to Try", url: "#" },
    { title: "Recipe Video Tutorial", url: "#" },
    { title: "Cultural History", url: "#" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      {/* Floating Back Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 shadow-lg rounded-full px-6"
        size="lg"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Map
      </Button>

      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {/* Hero Image Background */}
        {hotdog.image && (
          <img 
            src={hotdog.image} 
            alt={hotdog.name}
            className="absolute inset-0 w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white z-10 px-4">
            <Badge className="mb-4 text-lg px-6 py-2 bg-white/90 text-primary hover:bg-white">
              <MapPin className="mr-2 h-4 w-4" />
              {hotdog.city}, {hotdog.country}
            </Badge>
            <h1 className="font-heading text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg">
              {hotdog.name}
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto drop-shadow-md">
              🌭 {hotdog.description}
            </p>
          </div>
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/40" />
        </div>
      </section>

      {/* Content Container */}
      <div className="max-w-4xl mx-auto px-4 py-12 space-y-12">
        
        {/* Recipe Section */}
        <Card className="relative p-10 md:p-12 shadow-[0_4px_20px_rgba(0,0,0,0.08)] bg-bun">
          {/* Location Flag Badge - Stamp Style */}
          <div className="absolute top-4 right-4 rotate-6 bg-tomato text-white px-4 py-2 rounded-lg shadow-lg font-display text-sm tracking-wider">
            {hotdog.city.toUpperCase()}
          </div>
          
          {/* Recipe Label - Compact Stamp Style */}
          <div className="inline-block mb-8 px-4 py-2 bg-poppy text-white font-display text-lg tracking-wider shadow-md -rotate-1">
            RECIPE
          </div>
          
          <TooltipProvider>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Ingredients Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBasket className="h-6 w-6 text-mustard" />
                  <h3 className="font-display text-3xl tracking-wide text-poppy">
                    INGREDIENTS
                  </h3>
                </div>
                
                <ul className="space-y-3">
                  {ingredients.map((ingredient, index) => {
                    const needsTooltip = ingredient.toLowerCase().includes('sport pepper');
                    const ingredientItem = (
                      <li key={index} className="flex items-start gap-4 group">
                        <Checkbox
                          id={`ingredient-${index}`}
                          checked={checkedIngredients[index] || false}
                          onCheckedChange={(checked) => 
                            setCheckedIngredients(prev => ({ ...prev, [index]: checked as boolean }))
                          }
                          className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                        />
                        <label
                          htmlFor={`ingredient-${index}`}
                          className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${
                            checkedIngredients[index] 
                              ? 'line-through opacity-50' 
                              : 'text-poppy/90 group-hover:text-poppy'
                          }`}
                        >
                          {ingredient}
                        </label>
                      </li>
                    );

                    if (needsTooltip) {
                      return (
                        <Tooltip key={index}>
                          <TooltipTrigger asChild>
                            {ingredientItem}
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p className="text-sm">Small pickled peppers commonly used in Chicago-style hot dogs</p>
                          </TooltipContent>
                        </Tooltip>
                      );
                    }

                    return ingredientItem;
                  })}
                </ul>
              </div>

              {/* Instructions Column */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <Utensils className="h-6 w-6 text-relish" />
                  <h3 className="font-display text-3xl tracking-wide text-poppy">
                    INSTRUCTIONS
                  </h3>
                </div>
                
                <ol className="space-y-4">
                  {instructions.map((step, index) => (
                    <li key={index} className="flex items-start gap-4 group">
                      <Checkbox
                        id={`step-${index}`}
                        checked={checkedSteps[index] || false}
                        onCheckedChange={(checked) => 
                          setCheckedSteps(prev => ({ ...prev, [index]: checked as boolean }))
                        }
                        className="mt-1 data-[state=checked]:bg-relish data-[state=checked]:border-relish"
                      />
                      <label
                        htmlFor={`step-${index}`}
                        className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${
                          checkedSteps[index] 
                            ? 'line-through opacity-50' 
                            : 'text-poppy/90 group-hover:text-poppy'
                        }`}
                      >
                        <span className="font-semibold text-relish mr-2">{index + 1}.</span>
                        {step}
                      </label>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </TooltipProvider>
        </Card>

        {/* Fun Facts Section - Interactive Flip Cards */}
        <Card className="p-6 md:p-8 shadow-xl border-4 border-accent/10 bg-gradient-to-br from-bun to-mustard/10">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
              <div className="inline-block px-4 py-2 bg-poppy text-white font-display text-lg tracking-wider shadow-md -rotate-1">
                FUN FACTS & TRIVIA
              </div>
              
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground">
                  {revealedFacts.size} / {funFacts.length} discovered
                </span>
                <Progress 
                  value={(revealedFacts.size / funFacts.length) * 100} 
                  className="w-24 h-2"
                />
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground font-display tracking-wide">
              Tap cards to reveal facts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
            {funFacts.map((fact, index) => (
              <FactFlipCard
                key={index}
                fact={fact}
                index={index}
                isRevealed={revealedFacts.has(index)}
                onReveal={() => handleRevealFact(index)}
              />
            ))}
          </div>
        </Card>

        {/* Origin Story Section - Timeline Narrative */}
        <Card 
          id="origin-story"
          className="relative p-6 md:p-8 shadow-xl border-4 border-primary/10 overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(var(--bun)) 0%, hsl(var(--background)) 100%)",
          }}
        >
          {/* Vintage Paper Texture Overlay */}
          <div 
            className="absolute inset-0 opacity-5 pointer-events-none"
            style={{
              backgroundImage: "repeating-linear-gradient(0deg, transparent, transparent 2px, hsl(var(--foreground)) 3px)",
            }}
          />
          
          <div className="relative z-10">
            <div className="inline-block mb-8 px-4 py-2 bg-poppy text-white font-display text-lg tracking-wider shadow-md -rotate-1">
              ORIGIN STORY
            </div>

            {/* Timeline */}
            <div className="relative mb-12">
              <div className="flex justify-between items-center px-4">
                {["1930s", "1950s", "Today"].map((year, idx) => (
                  <div key={year} className="flex flex-col items-center">
                    <div 
                      className={`timeline-dot ${idx === 0 ? "active" : ""}`}
                      aria-label={`Timeline milestone: ${year}`}
                    />
                    <span className="mt-2 text-sm font-semibold text-foreground/70 font-display">
                      {year}
                    </span>
                  </div>
                ))}
              </div>
              <div className="absolute top-2 left-0 right-0 h-0.5 bg-border -z-10" />
            </div>

            {/* Story Segments */}
            <div className="space-y-8">
              {originStory.split('\n\n').map((paragraph, index) => {
                const icons = ["🌱", "📈", "🌭"];
                const eras = ["Birth", "Evolution", "Today"];
                
                // Highlight key terms
                let highlightedParagraph = paragraph;
                const keyTerms = [
                  { term: "Great Depression", color: "text-tomato" },
                  { term: "Vienna Beef", color: "text-mustard" },
                  { term: "World's Fair", color: "text-relish" },
                  { term: "Chicago", color: "text-poppy" },
                  { term: "Maxwell Street", color: "text-mustard" },
                ];
                
                keyTerms.forEach(({ term, color }) => {
                  const regex = new RegExp(`(${term})`, "gi");
                  highlightedParagraph = highlightedParagraph.replace(
                    regex,
                    `<span class="font-semibold ${color}">$1</span>`
                  );
                });

                return (
                  <div 
                    key={index}
                    className="story-segment visible"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-mustard/20 to-tomato/20 rounded-full flex items-center justify-center text-2xl">
                        {icons[index] || "📖"}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-bold text-foreground mb-3">
                          {eras[index] || `Chapter ${index + 1}`}
                        </h3>
                        <p 
                          className="text-foreground/80 leading-loose text-base"
                          dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Scroll Cue */}
            {showScrollCue && !storyCompleted && (
              <div className="flex justify-center mt-8 animate-bounce">
                <div className="flex flex-col items-center text-muted-foreground">
                  <span className="text-sm mb-1">Scroll to continue</span>
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Explore More Section */}
        <Card className="p-6 md:p-8 shadow-xl border-4 border-accent/10 bg-white">
          <div className="inline-block mb-6 px-4 py-2 bg-poppy text-white font-display text-lg tracking-wider shadow-md -rotate-1">
            EXPLORE MORE
          </div>
          
          <div className="grid md:grid-cols-2 gap-4">
            {exploreLinks.map((link, index) => {
              // Determine icon based on title or URL
              let icon = "🌐";
              if (link.title.toLowerCase().includes("video") || link.title.toLowerCase().includes("youtube")) icon = "🎥";
              else if (link.title.toLowerCase().includes("watch")) icon = "📺";
              else if (link.title.toLowerCase().includes("place") || link.title.toLowerCase().includes("map")) icon = "📍";
              else if (link.title.toLowerCase().includes("recipe")) icon = "👨‍🍳";
              else if (link.title.toLowerCase().includes("history") || link.title.toLowerCase().includes("wikipedia")) icon = "📚";
              
              return (
                <a
                  key={index}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg border-2 border-primary/10 hover:border-primary/30 transition-all hover:shadow-lg hover:-translate-y-1">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="text-3xl">{icon}</span>
                        <span className="font-semibold text-foreground group-hover:text-primary transition-colors">
                          {link.title}
                        </span>
                      </div>
                      <ExternalLink className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </Card>

        {/* Bottom Navigation */}
        <div className="text-center pt-8 pb-12">
          <Button
            onClick={() => navigate("/")}
            size="lg"
            className="shadow-xl text-lg px-8 py-6"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Explore More Hot Dogs Around the World
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HotdogDetail;
