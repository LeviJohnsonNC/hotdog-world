export function LoadingGlobe() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-[#1a2332]">
      {/* Wireframe Globe Animation */}
      <div className="relative w-32 h-32 md:w-40 md:h-40">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full animate-spin"
          style={{ animationDuration: '8s' }}
        >
          {/* Outer circle */}
          <circle
            cx="100"
            cy="100"
            r="80"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="1"
            opacity="0.6"
          />
          
          {/* Latitude lines */}
          <ellipse cx="100" cy="100" rx="80" ry="20" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="80" ry="40" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="80" ry="60" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          
          {/* Longitude lines */}
          <ellipse cx="100" cy="100" rx="20" ry="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="40" ry="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          <ellipse cx="100" cy="100" rx="60" ry="80" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
          
          {/* Vertical line */}
          <line x1="100" y1="20" x2="100" y2="180" stroke="hsl(var(--primary))" strokeWidth="0.5" opacity="0.4" />
        </svg>
        
        {/* Pulsing hotdog icons */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-4xl animate-pulse" style={{ animationDuration: '2s' }}>🌭</span>
        </div>
      </div>
      
      {/* Loading text */}
      <div className="mt-8 text-center animate-fade-in">
        <p className="text-primary font-heading font-semibold text-lg md:text-xl mb-2">
          Loading Hotdogs Around the World
        </p>
        <p className="text-muted-foreground text-sm md:text-base">
          Preparing your culinary journey...
        </p>
      </div>
      
      {/* Loading dots */}
      <div className="flex gap-2 mt-4">
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '150ms' }} />
        <div className="w-2 h-2 rounded-full bg-primary animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
    </div>
  );
}
