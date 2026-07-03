import { FactFlipCard } from "@/components/FactFlipCard";

interface Props {
  facts: string[];
  isRevealed: (i: number) => boolean;
  onReveal: (i: number) => void;
  revealedCount: number;
}

export function TriviaPostcards({ facts, isRevealed, onReveal, revealedCount }: Props) {
  return (
    <section className="paper-card p-6 md:p-10">
      <div className="flex items-center justify-between mb-3 flex-wrap gap-3">
        <div className="stamp-label">Postcards from the Cart</div>
        <div className="flex items-center gap-2">
          {facts.map((_, i) => (
            <span
              key={i}
              className="h-2.5 w-2.5 rounded-full border"
              style={{
                background: isRevealed(i) ? "hsl(var(--stamp-red))" : "transparent",
                borderColor: "hsl(var(--ink) / 0.45)",
              }}
              aria-hidden
            />
          ))}
          <span className="ml-2 text-[11px] uppercase tracking-[0.18em] text-[hsl(var(--ink))]/65">
            {revealedCount} / {facts.length} discovered
          </span>
        </div>
      </div>
      <p className="text-sm text-[hsl(var(--ink))]/65 mb-8">
        Tap a postcard to flip it over. Each one adds a stamp to your trail.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {facts.map((fact, i) => (
          <div key={i} className="relative">
            <FactFlipCard
              fact={fact}
              index={i}
              isRevealed={isRevealed(i)}
              onReveal={() => onReveal(i)}
            />
            {isRevealed(i) && (
              <span className="discovered-stamp absolute -bottom-2 left-3 z-10">Discovered</span>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
