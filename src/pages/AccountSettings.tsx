import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Save, Trash2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
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

  const hasChanges = displayName.trim() !== originalDisplayName;

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-red-50">
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
