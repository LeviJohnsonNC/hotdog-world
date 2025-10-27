import { useState } from "react";
import { Html } from "@react-three/drei";
import { HotdogCluster as HotdogClusterType } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";
import { Card } from "./ui/card";
import { MapPin } from "lucide-react";

interface HotdogClusterProps {
  cluster: HotdogClusterType;
  onHotdogClick: (hotdogId: string) => void;
}

export function HotdogCluster({ cluster, onHotdogClick }: HotdogClusterProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={cluster.position}
      onClick={(e) => {
        e.stopPropagation();
        setShowMenu(!showMenu);
      }}
      onPointerOver={(e) => {
        e.stopPropagation();
        setHovered(true);
        document.body.style.cursor = "pointer";
      }}
      onPointerOut={(e) => {
        e.stopPropagation();
        setHovered(false);
        document.body.style.cursor = "auto";
      }}
    >
      {/* Use first hotdog's image for the cluster pin */}
      <HotdogModel hovered={hovered} imageUrl={cluster.hotdogs[0].image} />
      
      {/* Cluster count badge */}
      <Html
        position={[0, 0.5, 0]}
        center
        distanceFactor={6}
        style={{
          pointerEvents: "none",
          userSelect: "none",
        }}
      >
        <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg border-2 border-background">
          {cluster.hotdogs.length}
        </div>
      </Html>
      
      {/* Popup menu when clicked */}
      {showMenu && (
        <Html
          position={[0, 0.6, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: "auto",
          }}
        >
          <Card className="p-2 shadow-xl border-2 border-primary animate-fade-in min-w-[200px]">
            <div className="space-y-1">
              {cluster.hotdogs.map((hotdog) => (
                <button
                  key={hotdog.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    onHotdogClick(hotdog.id);
                  }}
                  className="w-full text-left px-3 py-2 rounded-md hover:bg-accent transition-colors flex items-start gap-2"
                >
                  <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                  <div>
                    <p className="font-heading font-semibold text-sm">{hotdog.name}</p>
                    <p className="text-xs text-muted-foreground">{hotdog.city}</p>
                  </div>
                </button>
              ))}
            </div>
          </Card>
        </Html>
      )}
    </group>
  );
}
