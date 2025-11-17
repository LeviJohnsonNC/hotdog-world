import { Lightbulb } from "lucide-react";

interface TechnicalNoteProps {
  children: React.ReactNode;
}

export const TechnicalNote = ({ children }: TechnicalNoteProps) => {
  return (
    <div 
      role="note" 
      className="mt-3 mb-2 p-4 bg-mustard/10 border-l-4 border-mustard rounded-r-lg transition-all hover:bg-mustard/15"
    >
      <div className="flex items-start gap-3">
        <Lightbulb className="h-5 w-5 text-mustard flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-mustard">Technique tip:</span>
          <span className="text-foreground/90 ml-2">{children}</span>
        </div>
      </div>
    </div>
  );
};
