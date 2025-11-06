import { StampedHotdog } from '@/types/passport';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Calendar, Trash2, Edit } from 'lucide-react';
import { deleteStamp } from '@/utils/stampStorage';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

interface StampDetailModalProps {
  hotdog: StampedHotdog | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onStampDeleted?: () => void;
}

export const StampDetailModal = ({ hotdog, open, onOpenChange, onStampDeleted }: StampDetailModalProps) => {
  const navigate = useNavigate();

  if (!hotdog) return null;

  const handleRemoveStamp = () => {
    if (!hotdog.isStamped) return;
    
    deleteStamp(hotdog.id);
    toast({
      title: "Stamp removed",
      description: `${hotdog.name} has been removed from your passport.`,
    });
    onOpenChange(false);
    onStampDeleted?.();
  };

  const handleEdit = () => {
    navigate(`/hotdog/${hotdog.id}`);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">{hotdog.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-base">
            <MapPin className="w-4 h-4" />
            {hotdog.city}, {hotdog.country}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Image */}
          <div className="relative w-full h-48 rounded-lg overflow-hidden">
            <img
              src={hotdog.image}
              alt={hotdog.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Description */}
          <p className="text-sm text-muted-foreground">{hotdog.description}</p>

          {/* Stamp Details - Only show if stamped */}
          {hotdog.isStamped && hotdog.stamp && (
            <div className="space-y-4 p-4 bg-muted/50 rounded-lg border border-border">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide">
                Your Stamp
              </h4>

              {/* Date */}
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <span>Tried on {formatDate(hotdog.stamp.timestamp)}</span>
              </div>

              {/* Rating */}
              {hotdog.stamp.rating && (
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Your rating:</span>
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "w-4 h-4",
                          i < hotdog.stamp!.rating!
                            ? "fill-secondary text-secondary"
                            : "fill-muted-foreground/20 text-muted-foreground/20"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">
                    ({hotdog.stamp.rating}/5)
                  </span>
                </div>
              )}

              {/* Review */}
              {hotdog.stamp.review && (
                <div className="space-y-1">
                  <span className="text-sm font-medium">Your review:</span>
                  <p className="text-sm text-foreground italic">
                    "{hotdog.stamp.review}"
                  </p>
                </div>
              )}

              {/* User Photo */}
              {hotdog.stamp.photoDataUrl && (
                <div className="space-y-2">
                  <span className="text-sm font-medium">Your photo:</span>
                  <div className="relative w-full h-40 rounded-lg overflow-hidden border border-border">
                    <img
                      src={hotdog.stamp.photoDataUrl}
                      alt="Your photo"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            {hotdog.isStamped ? (
              <>
                <Button
                  onClick={handleEdit}
                  className="flex-1"
                  variant="default"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Stamp
                </Button>
                <Button
                  onClick={handleRemoveStamp}
                  variant="destructive"
                  className="flex-1"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Remove
                </Button>
              </>
            ) : (
              <Button
                onClick={handleEdit}
                className="w-full"
                variant="default"
              >
                View Details & Try It
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
