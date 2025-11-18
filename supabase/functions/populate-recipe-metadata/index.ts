import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.76.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create a simple hash from ingredients
function hashIngredients(ingredients: any): string {
  return btoa(JSON.stringify(ingredients || {}));
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: "Missing authorization header" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    // Verify user authentication
    const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      global: { headers: { Authorization: authHeader } }
    });

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
    
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Unauthorized" }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Check if user is admin
    if (user.email !== 'levijohnson@gmail.com') {
      return new Response(
        JSON.stringify({ error: "Forbidden: Admin access required" }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Fetch all hotdogs with nutrition data
    const { data: hotdogs, error: fetchError } = await supabase
      .from('hotdogs')
      .select('id, name, description, ingredients, instructions, calories, fat_total_g, ingredients_hash');

    if (fetchError) {
      console.error("Error fetching hotdogs:", fetchError);
      throw new Error("Failed to fetch hotdogs");
    }

    console.log(`Processing ${hotdogs?.length || 0} hotdogs`);

    const results = [];

    for (const hotdog of hotdogs || []) {
      try {
        // Calculate current ingredients hash
        const currentHash = hashIngredients(hotdog.ingredients);
        
        // Skip if nutrition data exists and ingredients haven't changed
        if (hotdog.calories && hotdog.fat_total_g && hotdog.ingredients_hash === currentHash) {
          console.log(`Skipping ${hotdog.name} - nutrition data is current`);
          results.push({ 
            id: hotdog.id, 
            name: hotdog.name, 
            skipped: true,
            reason: "Nutrition data is current"
          });
          continue;
        }

        // Prepare ingredients text
        let ingredientsText = "";
        if (Array.isArray(hotdog.ingredients)) {
          ingredientsText = hotdog.ingredients.join(", ");
        } else if (hotdog.ingredients?.hotdog_and_bun || hotdog.ingredients?.toppings) {
          const bunItems = hotdog.ingredients.hotdog_and_bun || [];
          const toppingItems = hotdog.ingredients.toppings || [];
          ingredientsText = [...bunItems, ...toppingItems].join(", ");
        }

        const instructionsText = Array.isArray(hotdog.instructions) 
          ? hotdog.instructions.join(" ") 
          : "";

        const userMessage = `Analyze this hotdog recipe and extract accurate cooking times and detailed nutritional information:

**Recipe Name:** ${hotdog.name}
**Description:** ${hotdog.description}
**Ingredients:** ${ingredientsText}
**Instructions:** ${instructionsText}

Please provide:
- Prep time (how long to prepare ingredients before cooking)
- Cook time (actual cooking/grilling time)
- Total time (prep + cook)
- Recipe yield (usually "Serves 1" for a single hotdog)
- Detailed nutritional information PER HOT DOG:
  * Total calories
  * Total fat (g)
  * Saturated fat (g)
  * Trans fat (g)
  * Total carbohydrates (g)
  * Dietary fiber (g)
  * Sugars (g)
  * Protein (g)
  * Sodium (mg)
  * Cholesterol (mg)

Consider all ingredients including the sausage, bun, and toppings. Be realistic and accurate based on typical portions.
Format times as ISO 8601 durations (e.g., PT15M for 15 minutes, PT1H30M for 1 hour 30 minutes).`;

        // Call Lovable AI with tool calling
        const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${LOVABLE_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-2.5-flash",
            messages: [
              {
                role: "system",
                content: "You are a culinary and nutrition expert analyzing hotdog recipes. Extract accurate preparation times, cooking times, and detailed nutritional information based on the ingredients and cooking methods described. Be precise and realistic with nutrition values."
              },
              {
                role: "user",
                content: userMessage
              }
            ],
            tools: [
              {
                type: "function",
                function: {
                  name: "extract_recipe_metadata",
                  description: "Extract cooking times and detailed nutritional information from a hotdog recipe",
                  parameters: {
                    type: "object",
                    properties: {
                      prep_time: {
                        type: "string",
                        description: "Preparation time in ISO 8601 format (e.g., PT15M for 15 minutes)"
                      },
                      cook_time: {
                        type: "string",
                        description: "Cooking time in ISO 8601 format (e.g., PT8M for 8 minutes)"
                      },
                      total_time: {
                        type: "string",
                        description: "Total time in ISO 8601 format (prep + cook)"
                      },
                      recipe_yield: {
                        type: "string",
                        description: "How many servings (e.g., 'Serves 1')"
                      },
                      calories: {
                        type: "number",
                        description: "Total calories per hot dog"
                      },
                      fat_total_g: {
                        type: "number",
                        description: "Total fat in grams"
                      },
                      fat_saturated_g: {
                        type: "number",
                        description: "Saturated fat in grams"
                      },
                      fat_trans_g: {
                        type: "number",
                        description: "Trans fat in grams"
                      },
                      carbs_total_g: {
                        type: "number",
                        description: "Total carbohydrates in grams"
                      },
                      carbs_fiber_g: {
                        type: "number",
                        description: "Dietary fiber in grams"
                      },
                      carbs_sugars_g: {
                        type: "number",
                        description: "Sugars in grams"
                      },
                      protein_g: {
                        type: "number",
                        description: "Protein in grams"
                      },
                      sodium_mg: {
                        type: "number",
                        description: "Sodium in milligrams"
                      },
                      cholesterol_mg: {
                        type: "number",
                        description: "Cholesterol in milligrams"
                      }
                    },
                    required: [
                      "prep_time", "cook_time", "total_time", "recipe_yield", 
                      "calories", "fat_total_g", "fat_saturated_g", "fat_trans_g",
                      "carbs_total_g", "carbs_fiber_g", "carbs_sugars_g", 
                      "protein_g", "sodium_mg", "cholesterol_mg"
                    ],
                    additionalProperties: false
                  }
                }
              }
            ],
            tool_choice: {
              type: "function",
              function: { name: "extract_recipe_metadata" }
            }
          }),
        });

        if (!aiResponse.ok) {
          const errorText = await aiResponse.text();
          console.error(`AI API error for ${hotdog.name}:`, aiResponse.status, errorText);
          
          if (aiResponse.status === 429) {
            results.push({ id: hotdog.id, name: hotdog.name, error: "Rate limit exceeded" });
            continue;
          }
          if (aiResponse.status === 402) {
            results.push({ id: hotdog.id, name: hotdog.name, error: "Payment required" });
            continue;
          }
          
          results.push({ id: hotdog.id, name: hotdog.name, error: "AI request failed" });
          continue;
        }

        const aiData = await aiResponse.json();
        console.log(`AI response for ${hotdog.name}:`, JSON.stringify(aiData));

        // Extract tool call response
        const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
        if (!toolCall || toolCall.function?.name !== "extract_recipe_metadata") {
          console.error(`No valid tool call for ${hotdog.name}`);
          results.push({ id: hotdog.id, name: hotdog.name, error: "No tool call in response" });
          continue;
        }

        const metadata = JSON.parse(toolCall.function.arguments);

        // Update database with all nutrition fields
        const { error: updateError } = await supabase
          .from('hotdogs')
          .update({
            prep_time: metadata.prep_time,
            cook_time: metadata.cook_time,
            total_time: metadata.total_time,
            recipe_yield: metadata.recipe_yield,
            calories: metadata.calories,
            fat_total_g: metadata.fat_total_g,
            fat_saturated_g: metadata.fat_saturated_g,
            fat_trans_g: metadata.fat_trans_g,
            carbs_total_g: metadata.carbs_total_g,
            carbs_fiber_g: metadata.carbs_fiber_g,
            carbs_sugars_g: metadata.carbs_sugars_g,
            protein_g: metadata.protein_g,
            sodium_mg: metadata.sodium_mg,
            cholesterol_mg: metadata.cholesterol_mg,
            ingredients_hash: currentHash
          })
          .eq('id', hotdog.id);

        if (updateError) {
          console.error(`Error updating ${hotdog.name}:`, updateError);
          results.push({ id: hotdog.id, name: hotdog.name, error: updateError.message });
        } else {
          console.log(`Successfully updated ${hotdog.name} with nutrition data`);
          results.push({ 
            id: hotdog.id, 
            name: hotdog.name, 
            success: true,
            metadata 
          });
        }

        // Small delay to avoid rate limits
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error) {
        console.error(`Error processing ${hotdog.name}:`, error);
        results.push({ 
          id: hotdog.id, 
          name: hotdog.name, 
          error: error instanceof Error ? error.message : "Unknown error" 
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const errorCount = results.filter(r => r.error).length;
    const skippedCount = results.filter(r => r.skipped).length;

    return new Response(
      JSON.stringify({ 
        success: true,
        total: hotdogs?.length || 0,
        successCount,
        errorCount,
        skippedCount,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : "Unknown error" 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
