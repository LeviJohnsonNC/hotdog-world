import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, X, Stamp, RefreshCcw } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { HotdogStamp } from "@/types/passport";
import { useStamps } from "@/hooks/useStamps";
import { useUserProgress } from "@/contexts/UserProgressContext";
import { compressImageToBase64, checkStorageSpace } from "@/utils/imageCompression";
import { toast } from "sonner";
import { toast as shadcnToast } from "@/hooks/use-toast";
import { useOnboardingNudges } from "@/hooks/useOnboardingNudges";

interface PassportStampProps {
  hotdogId: string;
  hotdogName: string;
}

export function PassportStamp({ hotdogId, hotdogName }: PassportStampProps) {
  const navigate = useNavigate();
  const { getStamp, saveStamp: saveStampLegacy, deleteStamp: deleteStampFromStorage, stamps } = useStamps();
  const { saveStamp: saveStampWithErrors } = useUserProgress();
  const { hasShownFirstStampBadgeToast, markFirstStampBadgeShown } = useOnboardingNudges();
  const [isExpanded, setIsExpanded] = useState(false);
  const [stamp, setStamp] = useState<HotdogStamp | null>(null);
  const [tried, setTried] = useState(false);
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [photoDataUrl, setPhotoDataUrl] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing stamp on mount
  useEffect(() => {
    const existingStamp = getStamp(hotdogId);
    if (existingStamp) {
      setStamp(existingStamp);
      setTried(existingStamp.tried);
      setRating(existingStamp.rating || 0);
      setReview(existingStamp.review || "");
      setPhotoDataUrl(existingStamp.photoDataUrl || "");
    }
  }, [hotdogId, getStamp]);

  // (Removed scroll-to-top; modal opens in place now)

  const handleSave = async () => {
    if (!tried) {
      toast.error("Please mark this hotdog as tried first!");
      return;
    }

    setIsSaving(true);

    const newStamp: HotdogStamp = {
      hotdogId,
      tried,
      rating: rating > 0 ? rating : undefined,
      review: review.trim() || undefined,
      photoDataUrl: photoDataUrl || undefined,
      timestamp: stamp?.timestamp || Date.now(),
      lastModified: Date.now(),
    };

    const result = await saveStampWithErrors(newStamp);
    
    if (result.success) {
      setStamp(newStamp);
      setIsExpanded(false);
      
      // Check if this is the first stamp (was 0 stamps before saving)
      const isFirstStamp = stamps.length === 0;
      
      if (isFirstStamp && !hasShownFirstStampBadgeToast()) {
        // Show "First Bite Taken" badge toast
        shadcnToast({
          title: "🎉 New Badge Earned: First Bite Taken",
          description: "Tap to view your badges",
          duration: 10000,
          action: (
            <button
              onClick={() => navigate("/passport?tab=stats")}
              className="text-primary hover:text-primary/80 font-medium text-sm"
            >
              View
            </button>
          ),
        });
        markFirstStampBadgeShown();
      } else {
        // Show regular stamp toast
        toast.success("Stamped to your passport!", {
          description: `${hotdogName} has been added to your collection.`,
        });
      }
    } else {
      // Show error with retry button
      shadcnToast({
        title: "Failed to save stamp",
        description: result.error || "Please try again",
        variant: "destructive",
        action: (
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setIsSaving(false);
              handleSave();
            }}
            className="gap-1"
          >
            <RefreshCcw className="h-3 w-3" />
            Retry
          </Button>
        ),
      });
    }

    setIsSaving(false);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error("Please upload an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image too large", {
        description: "Please upload an image smaller than 5MB",
      });
      return;
    }

    try {
      const compressed = await compressImageToBase64(file);
      
      if (!checkStorageSpace()) {
        toast.error("Storage space low", {
          description: "Image compression may not save properly",
        });
      }
      
      setPhotoDataUrl(compressed);
      toast.success("Photo added!");
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error("Failed to process image");
    }
  };

  const handleRemovePhoto = () => {
    setPhotoDataUrl("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleDelete = async () => {
    const success = await deleteStampFromStorage(hotdogId);
    if (success) {
      setStamp(null);
      setTried(false);
      setRating(0);
      setReview("");
      setPhotoDataUrl("");
      setIsExpanded(false);
      toast.success("Stamp removed from passport");
    } else {
      toast.error("Failed to delete stamp");
    }
  };

  // Compact stamped view
  if (stamp && !isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        className="fixed top-6 right-6 z-40 bg-relish text-white px-3 py-2 md:px-6 md:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 font-display text-sm md:text-lg tracking-wide flex items-center gap-2"
      >
        <span>✅ TRIED</span>
        {stamp.rating && (
          <span className="flex gap-0.5">
            {'🌭'.repeat(stamp.rating)}
          </span>
        )}
        {stamp.photoDataUrl && <span>📸</span>}
      </button>
    );
  }

  return (
    <>
      {/* Floating Button */}
      {!isExpanded && (
        <Button
          onClick={() => setIsExpanded(true)}
          className="fixed top-6 right-6 z-40 shadow-lg rounded-full px-3 py-2 md:px-6 text-sm md:text-base animate-pulse hover:animate-none bg-mustard text-poppy hover:bg-mustard/90"
        >
          <Stamp className="hidden md:inline-block mr-0 md:mr-2 h-5 w-5" />
          <span className="hidden md:inline">Stamp My Passport</span>
          <span className="md:hidden">Stamp</span>
        </Button>
      )}

      {/* Expanded Form Modal */}
      <Dialog open={isExpanded} onOpenChange={setIsExpanded}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 md:p-8 border-4 border-mustard/30 bg-bun">


            {/* Header */}
            <div className="mb-6">
              <div className="inline-block px-4 py-2 bg-mustard text-poppy font-display text-xl tracking-wider shadow-md -rotate-1 mb-2">
                PASSPORT STAMP
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                Mark your experience with {hotdogName}
              </p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Tried Toggle */}
              <div className="flex items-center justify-between p-4 bg-background/50 rounded-lg">
                <Label htmlFor="tried-toggle" className="text-lg font-heading cursor-pointer">
                  {tried ? "✅ I've tried this hot dog!" : "Mark as tried"}
                </Label>
                <Switch
                  id="tried-toggle"
                  checked={tried}
                  onCheckedChange={setTried}
                  className="data-[state=checked]:bg-relish"
                />
              </div>

              {/* Rating */}
              <div className="space-y-2">
                <Label className="text-base font-heading">Rating (optional)</Label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => tried && setRating(value)}
                      disabled={!tried}
                      className="text-4xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-mustard rounded disabled:cursor-not-allowed disabled:opacity-40"
                      aria-label={`Rate ${value} out of 5`}
                    >
                      <span className={rating >= value ? "opacity-100" : "opacity-30"}>
                        🌭
                      </span>
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <button
                    type="button"
                    onClick={() => setRating(0)}
                    disabled={!tried}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Clear rating
                  </button>
                )}
              </div>

              {/* Review */}
              <div className="space-y-2">
                <Label htmlFor="review" className="text-base font-heading">
                  Your review (optional)
                </Label>
                <Textarea
                  id="review"
                  value={review}
                  onChange={(e) => setReview(e.target.value)}
                  placeholder="What did you think? Share your experience..."
                  maxLength={500}
                  rows={4}
                  className="resize-none"
                  disabled={!tried}
                />
                <div className="text-xs text-muted-foreground text-right">
                  {review.length}/500
                </div>
              </div>

              {/* Photo Upload */}
              <div className="space-y-2">
                <Label className="text-base font-heading">Photo (optional)</Label>
                <div className="flex items-center gap-4">
                  {photoDataUrl ? (
                    <div className="relative">
                      <img
                        src={photoDataUrl}
                        alt="Your hotdog photo"
                        className="w-24 h-24 rounded-full object-cover border-4 border-mustard shadow-md"
                      />
                      <button
                        type="button"
                        onClick={handleRemovePhoto}
                        disabled={!tried}
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform disabled:cursor-not-allowed disabled:opacity-50"
                        aria-label="Remove photo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => tried && fileInputRef.current?.click()}
                      disabled={!tried}
                      className="w-24 h-24 rounded-full border-4 border-dashed border-mustard/50 hover:border-mustard transition-colors flex items-center justify-center bg-background/50 hover:bg-background group disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Camera className="h-8 w-8 text-muted-foreground group-hover:text-mustard transition-colors" />
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                    disabled={!tried}
                  />
                  <div className="flex-1 text-sm text-muted-foreground">
                    {photoDataUrl ? "Change photo" : "Add a photo of your hotdog experience"}
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  disabled={isSaving || !tried}
                  className="flex-1 bg-relish text-white hover:bg-relish/90"
                  size="lg"
                >
                  {isSaving ? "Saving..." : stamp ? "Update Stamp" : "Save to Passport"}
                </Button>
                {stamp && (
                  <Button
                    onClick={handleDelete}
                    variant="destructive"
                    size="lg"
                  >
                    Delete
                  </Button>
                )}
              </div>
            </div>
        </DialogContent>
      </Dialog>

    </>
  );
}
