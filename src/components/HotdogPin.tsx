import { useState } from "react";
import { Html } from "@react-three/drei";
import { Hotdog } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";

interface HotdogPinProps {
  position: [number, number, number];
  onClick: () => void;
  hotdog: Hotdog;
  cameraDistance: number;
}

export function HotdogPin({ position, onClick, hotdog, cameraDistance }: HotdogPinProps) {
  const [hovered, setHovered] = useState(false);
  
  // Scale label based on camera distance (inverse relationship)
  // At distance 4.5 (default), scale = 1; at distance 10 (max zoom out), scale = 0.5
  const labelScale = Math.max(0.5, Math.min(1.2, 5 / cameraDistance));

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
          position={[0, 0.2, 0]}
          center
          distanceFactor={6}
          style={{
            pointerEvents: "none",
            userSelect: "none",
            transform: `scale(${labelScale})`,
            transformOrigin: "center bottom",
          }}
        >
          <div className="relative">
            {/* Pointer tail */}
            <div 
              className="absolute left-1/2 -translate-x-1/2 top-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[8px] border-t-card/90"
              style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))" }}
            />
            
            {/* Label content */}
            <div 
              className="bg-card/90 text-card-foreground px-3 py-2 rounded-2xl whitespace-nowrap animate-fade-in"
              style={{ 
                boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              }}
            >
              <p className="font-heading font-semibold text-sm leading-tight">{hotdog.name}</p>
              <p className="text-xs font-medium text-muted-foreground/80 leading-tight mt-0.5">{hotdog.city}</p>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
}
