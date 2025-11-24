import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2, RotateCcw } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const AccountSettings = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [displayName, setDisplayName] = useState("");
  const [originalDisplayName, setOriginalDisplayName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isClearingData, setIsClearingData] = useState(false);
  const [isPopulatingMetadata, setIsPopulatingMetadata] = useState(false);
  const [metadataResults, setMetadataResults] = useState<any>(null);

  const isAdmin = user?.email === 'levijohnson@gmail.com';

  useEffect(() => {
    if (!user) {
      navigate("/auth");
      return;
    }

    // Fetch current display name
    const fetchProfile = async () => {
      const { data, error } = await supabase
        .from("user_profiles")
        .select("display_name")
        .eq("user_id", user.id)
        .maybeSingle();

      if (data && !error) {
        setDisplayName(data.display_name || "");
        setOriginalDisplayName(data.display_name || "");
      }
    };

    fetchProfile();
  }, [user, navigate]);

  const handleSaveDisplayName = async () => {
    if (!user) return;

    if (!displayName.trim()) {
      toast({
        title: "Invalid name",
        description: "Display name cannot be empty.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    const { error } = await supabase
      .from("user_profiles")
      .upsert({ 
        user_id: user.id,
        display_name: displayName.trim() 
      }, {
        onConflict: "user_id"
      });

    if (error) {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      setOriginalDisplayName(displayName.trim());
      toast({
        title: "Display name updated!",
        description: "Your display name has been successfully changed.",
      });
    }

    setIsLoading(false);
  };

  const handleClearAllData = async () => {
    if (!user) return;

    setIsClearingData(true);

    try {
      // Delete all stamps for this user
      const { error: stampsError } = await supabase
        .from("hotdog_stamps")
        .delete()
        .eq("user_id", user.id);

      if (stampsError) throw stampsError;

      // Delete all revealed facts for this user
      const { error: factsError } = await supabase
        .from("revealed_facts")
        .delete()
        .eq("user_id", user.id);

      if (factsError) throw factsError;

      // Clear localStorage data for badges and onboarding
      try {
        localStorage.removeItem('visited_hotdogs');
        localStorage.removeItem('onboarding_first_badge_shown');
        localStorage.removeItem('onboarding_progress_3_shown');
        localStorage.removeItem('onboarding_progress_7_session');
        localStorage.removeItem('onboarding_progress_nudges_enabled');
        localStorage.removeItem('trivia_clicks_count');
        localStorage.removeItem('first_trivia_badge_shown');
        localStorage.removeItem('onboarding_first_stamp_badge_shown');
        localStorage.removeItem('shown_badge_celebration_toasts');
      } catch (error) {
        console.error('Failed to clear localStorage:', error);
      }

      toast({
        title: "Data cleared!",
        description: "All your stamps and data have been removed.",
      });

      // Redirect to home
      navigate("/");
    } catch (error: any) {
      toast({
        title: "Failed to clear data",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsClearingData(false);
    }
  };

  const handlePopulateMetadata = async () => {
    if (!user) return;

    setIsPopulatingMetadata(true);
    setMetadataResults(null);

    try {
      const { data, error } = await supabase.functions.invoke('populate-recipe-metadata');

      if (error) {
        throw error;
      }

      setMetadataResults(data);

      if (data.successCount > 0) {
        toast({
          title: "Metadata population successful!",
          description: `Updated ${data.successCount} of ${data.total} hotdogs with AI-generated recipe metadata.`,
        });
      } else {
        toast({
          title: "No records updated",
          description: data.errorCount > 0 ? `Failed to update ${data.errorCount} hotdogs. Check the results below.` : "No hotdogs found to update.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      console.error("Error populating metadata:", error);
      toast({
        title: "Population failed",
        description: error.message || "Failed to populate recipe metadata. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsPopulatingMetadata(false);
    }
  };

  const handleResetFTUX = () => {
    localStorage.removeItem('hasSeenFTUX');
    toast({
      title: "FTUX reset!",
      description: "Returning to home page to show the onboarding sequence...",
    });
    setTimeout(() => {
      navigate("/");
    }, 500);
  };

  const hasChanges = displayName.trim() !== originalDisplayName;
  const siteUrl = window.location.origin;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
      <Helmet>
        <title>Account Settings | Hotdogs Around the World</title>
        <meta 
          name="description" 
          content="Manage your hot dog passport account settings, update your display name, and manage your data."
        />
        <link rel="canonical" href={`${siteUrl}/settings`} />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Account Settings | Hotdogs Around the World" />
        <meta property="og:description" content="Manage your hot dog passport account settings and preferences." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/settings`} />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Account Settings | Hotdogs Around the World" />
        <meta name="twitter:description" content="Manage your hot dog passport account settings and preferences." />
      </Helmet>

      {/* Header */}
      <header className="sticky top-0 z-30 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Button onClick={() => navigate("/")} variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Map
          </Button>

          <div className="text-center flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
              Account Settings
            </h1>
            <p className="text-sm text-muted-foreground">
              Manage your profile and data
            </p>
          </div>

          <div className="w-24" /> {/* Spacer for centering */}
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="space-y-8">
          {/* Display Name Section */}
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Display Name
            </h2>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Your Display Name</Label>
                <Input
                  id="displayName"
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Enter your display name"
                  maxLength={50}
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  This is how other explorers will see you on the leaderboard
                </p>
              </div>
              <Button
                onClick={handleSaveDisplayName}
                disabled={isLoading || !hasChanges}
                className="w-full sm:w-auto"
              >
                <Save className="mr-2 h-4 w-4" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </div>

          {/* Clear Data Section */}
          <div className="bg-card rounded-lg p-6 shadow-md border-2 border-destructive/20">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Clear All Data
            </h2>
            <p className="text-muted-foreground mb-4">
              This will permanently delete all your passport stamps, reviews, ratings,
              and photos. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" disabled={isClearingData}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear All My Data
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete all your
                    hot dog stamps, reviews, ratings, and photos from our servers.
                    Your account will remain active but all your progress will be lost.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleClearAllData}
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  >
                    {isClearingData ? "Clearing..." : "Yes, delete everything"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>

          {/* Recipe Metadata Population - Admin Only */}
          {isAdmin && (
            <div className="bg-card rounded-lg p-6 shadow-md border-2 border-primary/20">
              <h2 className="text-xl font-semibold text-foreground mb-2">Recipe Metadata Population</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Use AI to intelligently populate prep time, cook time, calories, and yield for Google Recipe structured data
              </p>
              
              <div className="space-y-4">
                {/* Populate Button */}
                <Button 
                  onClick={handlePopulateMetadata}
                  disabled={isPopulatingMetadata}
                  variant="secondary"
                  className="w-full sm:w-auto"
                >
                  {isPopulatingMetadata ? 'Populating...' : 'Populate Recipe Metadata'}
                </Button>
                
                <p className="text-xs text-muted-foreground">
                  This analyzes each hotdog's ingredients and instructions to generate accurate recipe times and nutritional info. Takes 1-2 minutes for all hotdogs.
                </p>

                {/* Results Display */}
                {metadataResults && (
                  <div className="mt-4 p-4 bg-primary/5 rounded-lg border border-primary/10">
                    <div className="flex gap-4 text-sm mb-3">
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-green-600" />
                        <span>{metadataResults.successCount} successful</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-red-600" />
                        <span>{metadataResults.errorCount} errors</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">Total: {metadataResults.total}</span>
                      </div>
                    </div>

                    {metadataResults.results && metadataResults.results.length > 0 && (
                      <div className="max-h-60 overflow-y-auto space-y-1">
                        {metadataResults.results.slice(0, 10).map((result: any, index: number) => (
                          <div 
                            key={index}
                            className={`text-xs p-2 rounded ${
                              result.success 
                                ? 'bg-green-50 dark:bg-green-950/20 text-green-900 dark:text-green-200' 
                                : 'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200'
                            }`}
                          >
                            <span className="font-medium">{result.name}</span>
                            {result.success && result.metadata && (
                              <span className="ml-2 opacity-70">
                                ({result.metadata.prep_time}, {result.metadata.cook_time}, {result.metadata.calories} cal)
                              </span>
                            )}
                            {result.error && (
                              <span className="ml-2">- Error: {result.error}</span>
                            )}
                          </div>
                        ))}
                        {metadataResults.results.length > 10 && (
                          <p className="text-xs text-muted-foreground italic pt-2">
                            ...and {metadataResults.results.length - 10} more
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FTUX Testing - Admin Only */}
          {isAdmin && (
            <div className="bg-card rounded-lg p-6 shadow-md border-2 border-accent/20">
              <h2 className="text-xl font-semibold text-foreground mb-2">Test FTUX Onboarding</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Reset the first-time user experience to test the onboarding sequence as if you were a brand new user.
              </p>
              
              <Button 
                onClick={handleResetFTUX}
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset & Test FTUX
              </Button>
            </div>
          )}

          {/* Account Info */}
          <div className="bg-card rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Account Information
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email:</span>
                <span className="font-medium">{user?.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account ID:</span>
                <span className="font-mono text-xs">{user?.id.slice(0, 8)}...</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AccountSettings;
