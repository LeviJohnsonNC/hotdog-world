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
        title: "Success!",
        description: `Updated ${data.successCount} of ${data.total} hotdogs`,
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
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>{results.successCount} successful</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-600" />
                    <span>{results.errorCount} errors</span>
                  </div>
                </div>

                <div className="border rounded-lg p-4 max-h-96 overflow-y-auto">
                  <h3 className="font-semibold mb-2">Results:</h3>
                  <div className="space-y-2">
                    {results.results?.map((result: any, index: number) => (
                      <div 
                        key={index} 
                        className={`p-2 rounded text-sm ${
                          result.success ? 'bg-green-50 dark:bg-green-950' : 'bg-red-50 dark:bg-red-950'
                        }`}
                      >
                        <div className="font-medium">{result.name}</div>
                        {result.success && result.metadata && (
                          <div className="text-xs text-muted-foreground mt-1">
                            Prep: {result.metadata.prep_time}, Cook: {result.metadata.cook_time}, 
                            Calories: {result.metadata.calories}
                          </div>
                        )}
                        {result.error && (
                          <div className="text-xs text-red-600 mt-1">Error: {result.error}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
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
