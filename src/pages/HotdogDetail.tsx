import { useParams, useNavigate } from "react-router-dom";
import { useHotdogs } from "@/hooks/useHotdogs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, MapPin, ChefHat, Sparkles, BookOpen, Globe as GlobeIcon } from "lucide-react";

const HotdogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: hotdogs = [] } = useHotdogs();
  
  const hotdog = hotdogs.find((h) => h.id === id);

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
        <Card className="p-8 shadow-xl border-4 border-primary/10 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-orange-400 to-red-500 rounded-full">
              <ChefHat className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary">Recipe</h2>
          </div>
          
          <div className="space-y-6">
            <div>
              <h3 className="font-heading text-xl font-semibold mb-4 text-accent">
                🛒 Ingredients
              </h3>
              <ul className="space-y-2">
                {ingredients.map((ingredient, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 text-primary text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-foreground/80">{ingredient}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="font-heading text-xl font-semibold mb-4 text-accent">
                👨‍🍳 Instructions
              </h3>
              <ol className="space-y-3">
                {instructions.map((step, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-blue-500 text-white text-sm flex items-center justify-center font-bold">
                      {index + 1}
                    </span>
                    <span className="text-foreground/80 pt-1">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </Card>

        {/* Fun Facts Section */}
        <Card className="p-8 shadow-xl border-4 border-accent/10 bg-gradient-to-br from-yellow-50 to-orange-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary">Fun Facts & Trivia</h2>
          </div>
          
          <div className="grid gap-4">
            {funFacts.map((fact, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border-l-4 border-accent shadow-sm hover:shadow-md transition-shadow"
              >
                <p className="text-foreground/80 flex items-start gap-3">
                  <span className="text-2xl">✨</span>
                  <span>{fact}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Origin Story Section */}
        <Card className="p-8 shadow-xl border-4 border-primary/10 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary">Origin Story</h2>
          </div>
          
          <div className="prose prose-lg max-w-none">
            {originStory.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-foreground/80 leading-relaxed mb-4">
                {paragraph}
              </p>
            ))}
          </div>
        </Card>

        {/* Explore More Section */}
        <Card className="p-8 shadow-xl border-4 border-accent/10 bg-white">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full">
              <GlobeIcon className="h-6 w-6 text-white" />
            </div>
            <h2 className="font-heading text-3xl font-bold text-primary">Explore More</h2>
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
