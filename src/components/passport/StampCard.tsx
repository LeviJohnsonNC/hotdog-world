import { StampedHotdog } from '@/types/passport';
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StampCardProps {
  hotdog: StampedHotdog;
  onClick: () => void;
}

export const StampCard = ({ hotdog, onClick }: StampCardProps) => {
  const { stamp, isStamped, name, city, image } = hotdog;

  return (
    <button
      onClick={onClick}
      className={cn(
        "group relative aspect-square rounded-lg overflow-hidden transition-all duration-300",
        "hover:scale-105 hover:shadow-xl cursor-pointer",
        "border-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        isStamped
          ? "border-primary shadow-md"
          : "border-dashed border-muted-foreground/30"
      )}
      aria-label={`${name} - ${isStamped ? 'Stamped' : 'Not yet tried'}`}
    >
      {/* Hotdog Image */}
      <div className="relative w-full h-full">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover"
        />
        
        {/* Gradient Overlay */}
        <div className={cn(
          "absolute inset-0 bg-gradient-to-t transition-opacity",
          isStamped
            ? "from-foreground/80 via-foreground/20 to-transparent"
            : "from-foreground/60 via-foreground/10 to-transparent"
        )} />
        
        {/* Info Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-3 text-left">
          <h3 className="font-semibold text-sm text-white drop-shadow-lg line-clamp-1">
            {city}
          </h3>
          <p className="text-xs text-white/90 drop-shadow-md line-clamp-1">
            {name}
          </p>
        </div>
        
        {/* Rating Stars - Only show if stamped and has rating */}
        {isStamped && stamp?.rating && (
          <div className="absolute top-2 right-2 flex gap-0.5 bg-card/90 backdrop-blur-sm rounded-full px-2 py-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3",
                  i < stamp.rating!
                    ? "fill-secondary text-secondary"
                    : "fill-muted text-muted"
                )}
              />
            ))}
          </div>
        )}
        
        {/* Photo Badge - Show if has photo */}
        {isStamped && stamp?.photoDataUrl && (
          <div className="absolute top-2 left-2 bg-accent/90 backdrop-blur-sm rounded-full px-2 py-1">
            <span className="text-xs font-medium text-accent-foreground">📸</span>
          </div>
        )}
      </div>
    </button>
  );
};
