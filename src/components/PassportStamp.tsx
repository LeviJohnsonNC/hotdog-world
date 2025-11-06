import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Camera, X, Stamp } from "lucide-react";
import { HotdogStamp } from "@/types/passport";
import { getStamp, saveStamp, deleteStamp } from "@/utils/stampStorage";
import { compressImageToBase64, checkStorageSpace } from "@/utils/imageCompression";
import { toast } from "sonner";

interface PassportStampProps {
  hotdogId: string;
  hotdogName: string;
}

export function PassportStamp({ hotdogId, hotdogName }: PassportStampProps) {
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
  }, [hotdogId]);

  // Scroll to top when stamp section opens
  useEffect(() => {
    if (isExpanded) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [isExpanded]);

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

    const success = saveStamp(newStamp);
    
    if (success) {
      setStamp(newStamp);
      setIsExpanded(false);
      toast.success("Stamped to your passport!", {
        description: `${hotdogName} has been added to your collection.`,
      });
    } else {
      toast.error("Storage full!", {
        description: "Please delete some old stamps to make space.",
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

  const handleDelete = () => {
    deleteStamp(hotdogId);
    setStamp(null);
    setTried(false);
    setRating(0);
    setReview("");
    setPhotoDataUrl("");
    setIsExpanded(false);
    toast.success("Stamp removed from passport");
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

      {/* Expanded Form Panel */}
      {isExpanded && (
        <div className="w-full max-w-4xl mx-auto px-4 mb-8 animate-fade-in">
          <Card className="relative p-6 md:p-8 shadow-[var(--shadow-elevated)] border-4 border-mustard/30 bg-bun">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 rounded-full"
            >
              <X className="h-5 w-5" />
            </Button>

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
                      onClick={() => setRating(value)}
                      className="text-4xl transition-all hover:scale-110 focus:outline-none focus:ring-2 focus:ring-mustard rounded"
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
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                        className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 shadow-md hover:scale-110 transition-transform"
                        aria-label="Remove photo"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="w-24 h-24 rounded-full border-4 border-dashed border-mustard/50 hover:border-mustard transition-colors flex items-center justify-center bg-background/50 hover:bg-background group"
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
                  disabled={isSaving}
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
          </Card>
        </div>
      )}
    </>
  );
}
