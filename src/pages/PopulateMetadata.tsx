import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, CheckCircle, XCircle } from "lucide-react";

export default function PopulateMetadata() {
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const handlePopulate = async () => {
    setIsLoading(true);
    setResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('populate-recipe-metadata');

      if (error) {
        throw error;
      }

      setResults(data);
      toast({
        title: "Processing Started!",
        description: data.note || "Recipe metadata is being populated in the background. This will take 2-3 minutes. Check the edge function logs for progress.",
        duration: 10000,
      });
    } catch (error) {
      console.error("Error populating metadata:", error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to populate metadata",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-heading font-bold mb-2">Populate Recipe Metadata</h1>
          <p className="text-muted-foreground">
            Use AI to intelligently populate prep time, cook time, calories, and yield for all hotdogs
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>AI-Powered Metadata Generation</CardTitle>
            <CardDescription>
              This will analyze each hotdog's ingredients and instructions to generate accurate recipe metadata
              for Google's Recipe structured data. The process uses Lovable AI to provide realistic estimates.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handlePopulate} 
              disabled={isLoading}
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Populate All Hotdogs"
              )}
            </Button>

            {results && (
              <div className="mt-6 space-y-4">
                {results.message?.includes("All nutrition data is current") || results.total === 0 ? (
                  <div className="border rounded-lg p-4 bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900">
                    <div className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-green-600 dark:text-green-400 mt-0.5 flex-shrink-0" />
                      <div>
                        <h3 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                          All Nutrition Data is Up-to-Date!
                        </h3>
                        <p className="text-sm text-green-800 dark:text-green-200">
                          All {results.total || 40} hotdogs already have complete nutrition information. No updates needed.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-lg p-4 bg-muted/50">
                    <h3 className="font-semibold mb-2">Processing Status</h3>
                    <p className="text-sm text-muted-foreground mb-2">
                      {results.message}
                    </p>
                    <p className="text-sm">
                      Processing <strong>{results.total}</strong> hotdogs in the background.
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      💡 Check the edge function logs below for real-time progress. Refresh this page in 2-3 minutes to see updated nutrition data.
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>What This Does</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p><strong>Prep Time:</strong> Analyzes ingredient complexity and preparation steps</p>
            <p><strong>Cook Time:</strong> Considers cooking method (grilling, steaming, etc.)</p>
            <p><strong>Total Time:</strong> Sum of prep and cook time</p>
            <p><strong>Recipe Yield:</strong> Usually "Serves 1" for individual hotdogs</p>
            <p><strong>Calories:</strong> Realistic estimate based on sausage, bun, and all toppings</p>
            <p className="pt-2 text-muted-foreground">
              All times are formatted as ISO 8601 durations (e.g., PT15M for 15 minutes) for Google's Recipe schema.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
