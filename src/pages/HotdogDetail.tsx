import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useHotdogDetail } from "@/hooks/useHotdogDetail";
import { useRevealedFacts } from "@/hooks/useRevealedFacts";
import { useRecordHotdogVisit } from "@/hooks/useVisitedHotdogs";
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
import { NutritionLabel } from "@/components/recipe/NutritionLabel";
import { OnboardingNudge } from "@/components/OnboardingNudge";
import { formatCategoryName, separateOptionalIngredients } from "@/lib/utils";
import { hotdogSeoOverrides } from "@/utils/seoOverrides";
import { EditorialDetailView } from "@/components/detail/EditorialDetailView";

const EDITORIAL_SLUGS = new Set(["perro-caliente-colombiano"]);

const HotdogDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { data: hotdog, isLoading } = useHotdogDetail(slug || "");
  const { revealFact, isRevealed, revealedIndices } = useRevealedFacts(hotdog?.id || '');
  
  // Record visit for badge tracking and get milestone info
  const { isFirstVisit, isNewVisit, visitCount } = useRecordHotdogVisit(hotdog?.id);
  
  const [checkedIngredients, setCheckedIngredients] = useState<Record<number, boolean>>({});
  const [checkedSteps, setCheckedSteps] = useState<Record<number, boolean>>({});

  const handleRevealFact = async (index: number) => {
    await revealFact(index);
  };


  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground/60">Loading hot dog details...</p>
        </div>
      </div>
    );
  }

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

  // Use actual data if available, otherwise fall back to placeholders
  // Check if ingredients is structured format or legacy array
  const isStructuredIngredients = hotdog.ingredients && 
    typeof hotdog.ingredients === 'object' && 
    !Array.isArray(hotdog.ingredients);
  
  const ingredientsData = isStructuredIngredients 
    ? hotdog.ingredients as Record<string, string[]>
    : null;
  
  const ingredientsArray = !isStructuredIngredients 
    ? (hotdog.ingredients as string[] || [
        "Premium hot dog sausage",
        "Fresh baked bun",
        "Special house sauce",
        "Crispy fried onions",
        "Fresh vegetables",
        "Secret spice blend",
      ])
    : [];

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

  const siteUrl = window.location.origin;
  const pageUrl = `${siteUrl}/hotdog/${slug}`;
  
  // Use custom SEO overrides if available, otherwise generate defaults
  const seoOverride = slug ? hotdogSeoOverrides[slug] : undefined;
  const seoTitle = seoOverride?.title || `${hotdog.name} Recipe - ${hotdog.city}, ${hotdog.country} | Hotdogs Around the World`;
  const seoDescription = seoOverride?.description || `Learn how to make authentic ${hotdog.name} from ${hotdog.city}. Get the complete recipe, ingredients, and origin story of this iconic ${hotdog.country} street food.`;
  
  // Prepare ingredients for Recipe schema
  const allIngredients = isStructuredIngredients && ingredientsData
    ? Object.values(ingredientsData).flat()
    : ingredientsArray;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-green-50 to-yellow-50">
      <Helmet>
        <title>{seoTitle}</title>
        <meta 
          name="description" 
          content={seoDescription}
        />
        <link rel="canonical" href={pageUrl} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content={seoTitle} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={hotdog.image} />
        <meta property="og:image:alt" content={`${hotdog.name} from ${hotdog.city}`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={seoTitle} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={hotdog.image} />

        {/* Structured Data - Recipe Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            "name": hotdog.name,
            "description": hotdog.description,
            "image": [hotdog.image],
            "author": {
              "@type": "Organization",
              "name": "Hotdogs Around the World",
              "url": siteUrl
            },
            "datePublished": hotdog.date_published || new Date().toISOString().split('T')[0],
            "prepTime": hotdog.prep_time || "PT10M",
            "cookTime": hotdog.cook_time || "PT5M",
            "totalTime": hotdog.total_time || "PT15M",
            "recipeYield": hotdog.recipe_yield || "Serves 1",
            "recipeCategory": "Street Food",
            "recipeCuisine": hotdog.country,
            "keywords": `${hotdog.name}, ${hotdog.city}, ${hotdog.country}, hot dog, street food, recipe`,
            "recipeIngredient": allIngredients,
            "recipeInstructions": instructions.map((step, index) => ({
              "@type": "HowToStep",
              "position": index + 1,
              "text": step,
              "name": `Step ${index + 1}`
            })),
            ...(hotdog.calories && {
              "nutrition": {
                "@type": "NutritionInformation",
                "servingSize": "1 hot dog",
                "calories": `${hotdog.calories} calories`,
                ...(hotdog.fat_total_g && { "fatContent": `${hotdog.fat_total_g}g` }),
                ...(hotdog.fat_saturated_g && { "saturatedFatContent": `${hotdog.fat_saturated_g}g` }),
                ...(hotdog.fat_trans_g && { "transFatContent": `${hotdog.fat_trans_g}g` }),
                ...(hotdog.carbs_total_g && { "carbohydrateContent": `${hotdog.carbs_total_g}g` }),
                ...(hotdog.carbs_fiber_g && { "fiberContent": `${hotdog.carbs_fiber_g}g` }),
                ...(hotdog.carbs_sugars_g && { "sugarContent": `${hotdog.carbs_sugars_g}g` }),
                ...(hotdog.protein_g && { "proteinContent": `${hotdog.protein_g}g` }),
                ...(hotdog.sodium_mg && { "sodiumContent": `${hotdog.sodium_mg}mg` }),
                ...(hotdog.cholesterol_mg && { "cholesterolContent": `${hotdog.cholesterol_mg}mg` })
              }
            }),
            ...(hotdog.video_url && {
              "video": {
                "@type": "VideoObject",
                "name": `How to Make ${hotdog.name}`,
                "description": `Watch how to make authentic ${hotdog.name}`,
                "thumbnailUrl": hotdog.image,
                "contentUrl": hotdog.video_url,
                "uploadDate": hotdog.date_published
              }
            })
          })}
        </script>

        {/* Structured Data - BreadcrumbList */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": siteUrl
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": hotdog.name,
                "item": pageUrl
              }
            ]
          })}
        </script>
      </Helmet>

      {EDITORIAL_SLUGS.has(hotdog.slug) ? (
        <>
          <EditorialDetailView hotdog={hotdog} />
          <OnboardingNudge
            isFirstVisit={isFirstVisit}
            isNewVisit={isNewVisit}
            visitCount={visitCount}
          />
        </>
      ) : (
      <>
      {/* Floating Back Button */}
      <Button
        onClick={() => navigate("/")}
        className="fixed top-6 left-6 z-50 shadow-lg rounded-full px-6"
        size="lg"
      >
        <ArrowLeft className="mr-2 h-5 w-5" />
        Back to Map
      </Button>

      {/* Passport Stamp Button */}
      <PassportStamp hotdogId={hotdog.id} hotdogName={hotdog.name} />


      {/* Hero Section */}
      <section className="relative h-[60vh] min-h-[400px] bg-gradient-to-br from-primary/20 to-accent/20 overflow-hidden">
        {/* Hero Image Background */}
        {hotdog.image && (
          <img 
            src={hotdog.image} 
            alt={hotdog.name}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              objectPosition: hotdog.slug === 'tako-san-wieners' ? 'center 20%' : 'center center' 
            }}
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
              {hotdog.description}
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
          
          {/* Ingredients Section - Two Columns */}
          <div className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <ShoppingBasket className="h-6 w-6 text-mustard" />
              <h3 className="font-display text-3xl tracking-wide text-poppy">
                INGREDIENTS
              </h3>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              {/* Left Column: Hot Dog & Bun */}
              <div className="space-y-6">
                
                {isStructuredIngredients && ingredientsData ? (
                  ingredientsData.hotdog_and_bun && (
                  <div>
                    <div className="inline-block mb-3 px-3 py-1 bg-mustard/20 text-mustard font-display text-xs tracking-wider rounded uppercase">
                      BASE
                    </div>
                    <ul className="space-y-3">
                    {ingredientsData.hotdog_and_bun.map((ingredient, index) => {
                      const checkboxKey = `base-${index}`;
                      return (
                        <li key={checkboxKey} className="flex items-start gap-4 group">
                          <Checkbox
                            id={`ingredient-${checkboxKey}`}
                            checked={checkedIngredients[checkboxKey] || false}
                            onCheckedChange={(checked) => 
                              setCheckedIngredients(prev => ({ ...prev, [checkboxKey]: checked as boolean }))
                            }
                            className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                          />
                          <label
                            htmlFor={`ingredient-${checkboxKey}`}
                            className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${
                              checkedIngredients[checkboxKey] 
                                ? 'line-through opacity-50' 
                                : 'text-poppy/90 group-hover:text-poppy'
                            }`}
                          >
                            {ingredient}
                          </label>
                        </li>
                      );
                    })}
                    </ul>
                  </div>
                  )
                ) : (
                  // Legacy array format
                  <ul className="space-y-3">
                    {ingredientsArray.map((ingredient, index) => {
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
                )}
                
                {/* Nutrition Label */}
                <NutritionLabel
                  calories={hotdog.calories}
                  fat_total_g={hotdog.fat_total_g}
                  fat_saturated_g={hotdog.fat_saturated_g}
                  fat_trans_g={hotdog.fat_trans_g}
                  carbs_total_g={hotdog.carbs_total_g}
                  carbs_fiber_g={hotdog.carbs_fiber_g}
                  carbs_sugars_g={hotdog.carbs_sugars_g}
                  protein_g={hotdog.protein_g}
                  sodium_mg={hotdog.sodium_mg}
                  cholesterol_mg={hotdog.cholesterol_mg}
                />
              </div>

              {/* Right Column: Toppings */}
              <div className="space-y-6">
                {isStructuredIngredients && ingredientsData && Object.entries(ingredientsData).map(([groupName, ingredients]) => {
                  if (groupName === 'hotdog_and_bun' || !Array.isArray(ingredients) || ingredients.length === 0) return null;
                  
                  const { required, optional } = separateOptionalIngredients(ingredients);
                  
                  return (
                    <div key={groupName} className="space-y-6">
                      {/* Required Toppings */}
                      {required.length > 0 && (
                        <div>
                          <div className="inline-block mb-3 px-3 py-1 bg-mustard/20 text-mustard font-display text-xs tracking-wider rounded uppercase">
                            {formatCategoryName(groupName)}
                          </div>
                          <ul className="space-y-3">
                            {required.map((ingredient, index) => {
                              const checkboxKey = `${groupName}-required-${index}`;
                              return (
                                <li key={checkboxKey} className="flex items-start gap-4 group">
                                  <Checkbox
                                    id={`ingredient-${checkboxKey}`}
                                    checked={checkedIngredients[checkboxKey] || false}
                                    onCheckedChange={(checked) => 
                                      setCheckedIngredients(prev => ({ ...prev, [checkboxKey]: checked as boolean }))
                                    }
                                    className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                                  />
                                  <label
                                    htmlFor={`ingredient-${checkboxKey}`}
                                    className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${
                                      checkedIngredients[checkboxKey]
                                        ? 'line-through opacity-50' 
                                        : 'text-poppy/90 group-hover:text-poppy'
                                    }`}
                                  >
                                    {ingredient}
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                      
                      {/* Optional Toppings */}
                      {optional.length > 0 && (
                        <div>
                          <div className="inline-block mb-3 px-3 py-1 bg-mustard/10 text-mustard/70 font-display text-xs tracking-wider rounded uppercase border border-dashed border-mustard/30">
                            Optional
                          </div>
                          <ul className="space-y-3">
                            {optional.map((ingredient, index) => {
                              const checkboxKey = `${groupName}-optional-${index}`;
                              return (
                                <li key={checkboxKey} className="flex items-start gap-4 group">
                                  <Checkbox
                                    id={`ingredient-${checkboxKey}`}
                                    checked={checkedIngredients[checkboxKey] || false}
                                    onCheckedChange={(checked) => 
                                      setCheckedIngredients(prev => ({ ...prev, [checkboxKey]: checked as boolean }))
                                    }
                                    className="mt-1 data-[state=checked]:bg-mustard data-[state=checked]:border-mustard"
                                  />
                                  <label
                                    htmlFor={`ingredient-${checkboxKey}`}
                                    className={`flex-1 text-base leading-relaxed cursor-pointer transition-all ${
                                      checkedIngredients[checkboxKey]
                                        ? 'line-through opacity-50' 
                                        : 'text-poppy/70 group-hover:text-poppy'
                                    }`}
                                  >
                                    {ingredient}
                                  </label>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Instructions Section - Full Width */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 mb-6">
              <Utensils className="h-6 w-6 text-relish" />
              <h3 className="font-display text-3xl tracking-wide text-poppy">
                INSTRUCTIONS
              </h3>
            </div>
                
                <ol className="space-y-4">
                  {instructions.map((step, index) => {
                    // Parse step for technique tips/technical notes
                    const tipPattern = /(?:Technique tip|Technical note):\s*(.*?)$/is;
                    const tipMatch = step.match(tipPattern);
                    
                    // Extract main content and tip if present
                    let mainContent = step;
                    let tipContent = null;
                    
                    if (tipMatch) {
                      mainContent = step.substring(0, tipMatch.index).trim();
                      tipContent = tipMatch[1].trim();
                    }
                    
                    // Parse step title - everything up to and including the first colon
                    // e.g., "1. Heat the dog the Chicago way:"
                    const titleMatch = mainContent.match(/^(\d+\.\s+[^:]+:)/);
                    const stepTitle = titleMatch ? titleMatch[1] : mainContent.split(':')[0] + ':';
                    const stepBody = titleMatch 
                      ? mainContent.substring(titleMatch[0].length).trim() 
                      : mainContent.substring(mainContent.indexOf(':') + 1).trim();
                    
                    return (
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
                          className={`flex-1 cursor-pointer transition-all ${
                            checkedSteps[index] 
                              ? 'line-through opacity-50' 
                              : 'group-hover:opacity-90'
                          }`}
                        >
                          <div className="font-bold text-relish text-lg mb-2">
                            {stepTitle}
                          </div>
                          {stepBody && (
                            <div className="text-base leading-relaxed text-poppy/90">
                              {stepBody}
                            </div>
                          )}
                          {tipContent && <TechnicalNote>{tipContent}</TechnicalNote>}
                        </label>
                      </li>
                    );
                  })}
            </ol>
          </div>

            {/* Method and Soul Section - Inside Recipe Card */}
            {hotdog.method_and_soul && (
              <div className="mt-12 pt-10 border-t-2 border-dashed border-mustard/30">
                <div className="inline-block mb-6 px-4 py-2 bg-relish text-white font-display text-lg tracking-wider shadow-md rotate-1">
                  METHOD & SOUL
                </div>
                
                <div className="prose prose-lg max-w-none">
                  {hotdog.method_and_soul.split('\n\n').map((paragraph, index) => (
                    <p 
                      key={index}
                      className="text-poppy/80 leading-relaxed mb-4 last:mb-0 text-base md:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            )}
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
                  {revealedIndices.length} / {funFacts.length} discovered
                </span>
                <Progress 
                  value={(revealedIndices.length / funFacts.length) * 100} 
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
                isRevealed={isRevealed(index)}
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

            {/* Story Sections with Natural Flow */}
            <div className="prose prose-lg max-w-none space-y-6">
              {originStory.split('\n\n').map((paragraph, index) => {
                // Define generic section metadata that works for any hotdog
                const sections = [
                  { icon: "🌟", heading: "The Beginning" },
                  { icon: "🌆", heading: "The Era" },
                  { icon: "🌭", heading: "The Evolution" },
                  { icon: "❤️", heading: "The Legacy" },
                ];
                
                const section = sections[index] || { icon: "📖", heading: `Chapter ${index + 1}` };
                
                // Detect and highlight key location/cultural terms dynamically
                let highlightedParagraph = paragraph;
                const cityTerms = [hotdog.city, hotdog.country, hotdog.name];
                
                cityTerms.forEach((term) => {
                  if (term) {
                    const regex = new RegExp(`\\b(${term})\\b`, "gi");
                    highlightedParagraph = highlightedParagraph.replace(
                      regex,
                      `<span class="font-medium text-primary/90 underline decoration-primary/30">$1</span>`
                    );
                  }
                });

                return (
                  <div key={index} className="mb-6 last:mb-0">
                    <h3 className="flex items-center gap-2 font-display text-lg font-bold text-foreground mb-3">
                      <span className="text-2xl">{section.icon}</span>
                      {section.heading}
                    </h3>
                    <div 
                      className="text-foreground/80 leading-relaxed text-base pl-8"
                      dangerouslySetInnerHTML={{ __html: highlightedParagraph }}
                    />
                  </div>
                );
              })}
            </div>

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

      </div>

      {/* Onboarding Nudges */}
      <OnboardingNudge 
        isFirstVisit={isFirstVisit}
        isNewVisit={isNewVisit}
        visitCount={visitCount}
      />
    </div>
  );
};

export default HotdogDetail;
