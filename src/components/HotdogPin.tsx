import { useState } from "react";
import { Html } from "@react-three/drei";
import { Hotdog } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";

interface HotdogPinProps {
  position: [number, number, number];
  onClick: () => void;
  hotdog: Hotdog;
}

export function HotdogPin({ position, onClick, hotdog }: HotdogPinProps) {
  const [hovered, setHovered] = useState(false);

  return (
    <group 
      position={position}
      onClick={(e) => {
        e.stopPropagation();
        onClick();
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
      <HotdogModel hovered={hovered} imageUrl={hotdog.image} />
      
      {hovered && (
        <Html
          position={[0, 0.4, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-card text-card-foreground px-3 py-2 rounded-lg shadow-lg border-2 border-primary whitespace-nowrap animate-fade-in">
            <p className="font-heading font-semibold text-sm">{hotdog.name}</p>
            <p className="text-xs text-muted-foreground">{hotdog.city}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
