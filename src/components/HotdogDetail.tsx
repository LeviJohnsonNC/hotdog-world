import { Hotdog } from "@/types/hotdog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, MapPin } from "lucide-react";

interface HotdogDetailProps {
  hotdog: Hotdog;
  onClose: () => void;
}

export function HotdogDetail({ hotdog, onClose }: HotdogDetailProps) {
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto border-2 shadow-[var(--shadow-elevated)]">
        <CardHeader className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
          
          <div className="flex items-start gap-3 mb-4">
            <Badge variant="secondary" className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hotdog.city}, {hotdog.country}
            </Badge>
          </div>
          
          <CardTitle className="text-3xl font-heading pr-12">{hotdog.name}</CardTitle>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-2">
            <h3 className="font-heading font-semibold text-xl">Description</h3>
            <p className="text-foreground/90 leading-relaxed">{hotdog.description}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
