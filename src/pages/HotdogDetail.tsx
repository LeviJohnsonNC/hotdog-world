import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useHotdogs } from "@/hooks/useHotdogs";
import { useRevealedFacts } from "@/hooks/useRevealedFacts";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft, ExternalLink, MapPin, ShoppingBasket, Utensils, Sparkles, BookOpen, Globe as GlobeIcon } from "lucide-react";
import { useState } from "react";
import { FactFlipCard } from "@/components/FactFlipCard";
import { PassportStamp } from "@/components/PassportStamp";
import { TechnicalNote } from "@/components/TechnicalNote";
import { formatCategoryName } from "@/lib/utils";

const HotdogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: hotdogs = [] } = useHotdogs();
  
  const hotdog = hotdogs.find((h) => h.slug === slug);
  const { revealFact, isRevealed, revealedIndices } = useRevealedFacts(hotdog?.id || '');
  
  const [checkedIngredients, setCheckedIngredients] = useState<Record<string | number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const handleRevealFact = async (index: number) => {
    await revealFact(index);
  };

  if (!hotdog) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <h1 className="text-2xl font-heading mb-4">Hot Dog Not Found</h1>
          <Button onClick={() => navigate("/")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>
        </div>
      </div>
    );
  }

  const isStructuredIngredients = hotdog.ingredients && 
    typeof hotdog.ingredients === 'object' && 
    !Array.isArray(hotdog.ingredients);
  
  const ingredientsData = isStructuredIngredients 
    ? hotdog.ingredients as Record<string, string[]>
    : null;
  
  const ingredientsArray = !isStructuredIngredients 
    ? (hotdog.ingredients as string[] || [])
    : [];

  const instructions = hotdog.instructions || [];
  const funFacts = hotdog.fun_facts || [];
  const originStory = hotdog.origin_story || '';
  const exploreLinks = hotdog.explore_links as { url: string; title: string }[] || [];

  const recipeIngredientList = isStructuredIngredients && ingredientsData
    ? Object.values(ingredientsData).flat()
    : ingredientsArray;

  const recipeInstructionList = instructions.map((instruction, index) => ({
    "@type": "HowToStep",
    name: `Step ${index + 1}`,
    text: instruction.replace(/Technique tip:.*$/is, '').trim(),
  }));

  const imageUrl = `/images/${hotdog.slug}.png`;

  return (
    <TooltipProvider>
      <Helmet>
        <title>{hotdog.name} Recipe - Hot Dog Passport</title>
        <meta name="description" content={`Discover the authentic ${hotdog.name} from ${hotdog.city}, ${hotdog.country}. ${hotdog.description.slice(0, 120)}...`} />
        <link rel="canonical" href={`https://hotdogpassport.com/hotdog/${hotdog.slug}`} />
        <meta property="og:title" content={`${hotdog.name} Recipe - Hot Dog Passport`} />
        <meta property="og:description" content={`Discover the authentic ${hotdog.name} from ${hotdog.city}, ${hotdog.country}.`} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://hotdogpassport.com/hotdog/${hotdog.slug}`} />
        <meta property="og:image" content={`https://hotdogpassport.com${imageUrl}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${hotdog.name} Recipe`} />
        <meta name="twitter:description" content={`Discover the authentic ${hotdog.name} from ${hotdog.city}, ${hotdog.country}.`} />
        <meta name="twitter:image" content={`https://hotdogpassport.com${imageUrl}`} />
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org/",
            "@type": "Recipe",
            "name": hotdog.name,
            "image": [`https://hotdogpassport.com${imageUrl}`],
            "description": hotdog.description,
            "recipeYield": hotdog.recipe_yield || "1 serving",
            "prepTime": hotdog.prep_time || "PT10M",
            "cookTime": hotdog.cook_time || "PT5M",
            "totalTime": hotdog.total_time || "PT15M",
            "recipeIngredient": recipeIngredientList,
            "recipeInstructions": recipeInstructionList,
            "recipeCategory": "Main course",
            "recipeCuisine": hotdog.country,
            "keywords": `${hotdog.name}, ${hotdog.city}, ${hotdog.country}, hot dog recipe`,
          })}
        </script>
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://hotdogpassport.com/" },
              { "@type": "ListItem", "position": 2, "name": "Hot Dogs", "item": "https://hotdogpassport.com/hotdogs" },
              { "@type": "ListItem", "position": 3, "name": hotdog.name, "item": `https://hotdogpassport.com/hotdog/${hotdog.slug}` }
            ]
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-primary/5 to-accent/5 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 hover:bg-primary/10">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>

          <div className="mb-8">
            <PassportStamp hotdogId={hotdog.id} />
          </div>

          <Card className="overflow-hidden shadow-[var(--shadow-elevated)] border-2 mb-8">
            <div className="relative h-64 md:h-96 overflow-hidden">
              <img src={imageUrl} alt={`Authentic ${hotdog.name} from ${hotdog.city}`} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <Badge variant="secondary" className="mb-3 flex items-center gap-1 w-fit">
                  <MapPin className="h-3 w-3" />
                  {hotdog.city}, {hotdog.country}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-heading font-bold mb-3 text-white">{hotdog.name}</h1>
                <p className="text-lg text-white/90 max-w-3xl">{hotdog.description}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 md:p-10 shadow-[var(--shadow-elevated)] border-2 mb-8">
            <div className="inline-block mb-8 px-4 py-2 bg-poppy text-white font-display text-lg tracking-wider shadow-md -rotate-1">RECIPE</div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* BASE - Upper Left */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBasket className="h-6 w-6 text-mustard" />
                  <h3 className="font-display text-3xl tracking-wide text-poppy">BASE</h3>
                </div>
                {isStructuredIngredients && ingredientsData?.hotdog_and_bun && (
                  <div>
                    <div className="inline-block mb-3 px-3 py-1 bg-mustard/20 text-mustard font-display text-xs tracking-wider rounded uppercase">HOTDOG AND BUN</div>
                    <ul className="space-y-3">
                      {ingredientsData.hotdog_and_bun.map((ingredient, index) => {
                        const checkboxKey = `hotdog_and_bun-${index}`;
                        return (
                          <li key={checkboxKey} className="flex items-start gap-4 group">
                            <Checkbox
                              id={`ingredient-${checkboxKey}`}
                              checked={checkedIngredients[checkboxKey] || false}
                              onCheckedChange={(checked) => setCheckedIngredients(prev => ({ ...prev, [checkboxKey]: checked as boolean }))}
                              className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                            />
                            <label htmlFor={`ingredient-${checkboxKey}`} className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${checkedIngredients[checkboxKey] ? 'line-through opacity-50' : 'text-poppy/90 group-hover:text-poppy'}`}>
                              {ingredient}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* TOPPINGS - Upper Right */}
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <ShoppingBasket className="h-6 w-6 text-mustard" />
                  <h3 className="font-display text-3xl tracking-wide text-poppy">TOPPINGS</h3>
                </div>
                {isStructuredIngredients && ingredientsData?.toppings && (
                  <div>
                    <div className="inline-block mb-3 px-3 py-1 bg-mustard/20 text-mustard font-display text-xs tracking-wider rounded uppercase">TOPPINGS</div>
                    <ul className="space-y-3">
                      {ingredientsData.toppings.map((ingredient, index) => {
                        const checkboxKey = `toppings-${index}`;
                        return (
                          <li key={checkboxKey} className="flex items-start gap-4 group">
                            <Checkbox
                              id={`ingredient-${checkboxKey}`}
                              checked={checkedIngredients[checkboxKey] || false}
                              onCheckedChange={(checked) => setCheckedIngredients(prev => ({ ...prev, [checkboxKey]: checked as boolean }))}
                              className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                            />
                            <label htmlFor={`ingredient-${checkboxKey}`} className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${checkedIngredients[checkboxKey] ? 'line-through opacity-50' : 'text-poppy/90 group-hover:text-poppy'}`}>
                              {ingredient}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </div>

              {/* INSTRUCTIONS - Full Width Below */}
              <div className="md:col-span-2 space-y-4 pt-8 border-t-2 border-dashed border-poppy/20">
                <div className="flex items-center gap-3 mb-6">
                  <Utensils className="h-6 w-6 text-relish" />
                  <h3 className="font-display text-3xl tracking-wide text-poppy">INSTRUCTIONS</h3>
                </div>
                <ol className="space-y-4">
                  {instructions.map((step, index) => {
                    const tipPattern = /(?:Technique tip|Technical note):\s*(.*?)(?=\n\n|$)/is;
                    const tipMatch = step.match(tipPattern);
                    let mainContent = step;
                    let tipContent = null;
                    if (tipMatch) {
                      mainContent = step.substring(0, tipMatch.index).trim();
                      tipContent = tipMatch[1].trim();
                    }
                    const titleMatch = mainContent.match(/^(.+?)(?:\n\n|\n)/);
                    const stepTitle = titleMatch ? titleMatch[1] : mainContent.split('\n')[0];
                    const stepBody = titleMatch ? mainContent.substring(titleMatch[0].length).trim() : '';
                    
                    return (
                      <li key={index} className="flex items-start gap-4 group">
                        <Checkbox
                          id={`step-${index}`}
                          checked={checkedSteps[index] || false}
                          onCheckedChange={(checked) => setCheckedSteps(prev => ({ ...prev, [index]: checked as boolean }))}
                          className="mt-1 data-[state=checked]:bg-relish data-[state=checked]:border-relish"
                        />
                        <label htmlFor={`step-${index}`} className={`flex-1 cursor-pointer transition-all ${checkedSteps[index] ? 'line-through opacity-50' : 'group-hover:opacity-90'}`}>
                          <div className="font-bold text-relish text-lg mb-2">{stepTitle}</div>
                          {stepBody && <div className="text-base leading-relaxed text-poppy/90 whitespace-pre-line">{stepBody}</div>}
                          {tipContent && <TechnicalNote>{tipContent}</TechnicalNote>}
                        </label>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>

            {hotdog.method_and_soul && (
              <div className="mt-12 pt-10 border-t-2 border-dashed border-mustard/30">
                <div className="inline-block mb-6 px-4 py-2 bg-relish text-white font-display text-lg tracking-wider shadow-md rotate-1">METHOD & SOUL</div>
                <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{hotdog.method_and_soul}</p>
              </div>
            )}
          </Card>

          {/* Fun Facts Section */}
          <Card className="p-6 md:p-10 shadow-[var(--shadow-elevated)] border-2 mb-8">
            <div className="inline-block mb-8 px-4 py-2 bg-carnation text-white font-display text-lg tracking-wider shadow-md -rotate-1">
              FUN FACTS
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {funFacts.map((fact, index) => (
                <FactFlipCard
                  key={index}
                  fact={fact}
                  isRevealed={isRevealed(index)}
                  onReveal={() => handleRevealFact(index)}
                />
              ))}
            </div>
            {funFacts.length > 0 && (
              <div className="mt-6">
                <Progress value={(revealedIndices.length / funFacts.length) * 100} />
              </div>
            )}
          </Card>

          {/* Origin Story Section */}
          <Card className="p-6 md:p-10 shadow-[var(--shadow-elevated)] border-2 mb-8">
            <div className="inline-block mb-8 px-4 py-2 bg-seafoam text-white font-display text-lg tracking-wider shadow-md -rotate-1">
              ORIGIN STORY
            </div>
            <div className="space-y-4">
              <GlobeIcon className="h-8 w-8 text-seafoam mb-4" />
              <p className="text-foreground/90 leading-relaxed whitespace-pre-line">{originStory}</p>
            </div>
          </Card>

          {/* Explore More Section */}
          <Card className="p-6 md:p-10 shadow-[var(--shadow-elevated)] border-2 mb-8">
            <div className="inline-block mb-8 px-4 py-2 bg-sky text-white font-display text-lg tracking-wider shadow-md -rotate-1">
              EXPLORE MORE
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {exploreLinks.map((link, index) => (
                <Button key={index} variant="secondary" asChild>
                  <a href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between w-full">
                    {link.title}
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </a>
                </Button>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </TooltipProvider>
  );
};

export default HotdogDetail;
