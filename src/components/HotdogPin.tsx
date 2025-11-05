import { useState } from "react";
import { Html } from "@react-three/drei";
import { Hotdog } from "@/types/hotdog";
import { HotdogModel } from "./HotdogModel";
import { HotdogSpriteModel } from "./HotdogSpriteModel";

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
      {hotdog.hasSpriteCoordinates && hotdog.spriteSheetUrl ? (
        <HotdogSpriteModel 
          hovered={hovered} 
          spriteSheetUrl={hotdog.spriteSheetUrl}
          spriteX={hotdog.sprite_x!}
          spriteY={hotdog.sprite_y!}
          spriteWidth={hotdog.sprite_width || 256}
          spriteHeight={hotdog.sprite_height || 256}
          position={position} 
        />
      ) : (
        <HotdogModel hovered={hovered} imageUrl={hotdog.image} position={position} />
      )}
      
      {hovered && (
        <Html
          position={[0, 0.3, 0]}
          center
          distanceFactor={8}
          style={{
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          <div className="bg-card/90 text-card-foreground px-2 py-1 rounded-md shadow-sm whitespace-nowrap animate-fade-in leading-tight">
            <p className="font-heading font-semibold text-[9px]">{hotdog.name}</p>
            <p className="text-[8px] font-normal text-muted-foreground/80">{hotdog.city}</p>
          </div>
        </Html>
      )}
    </group>
  );
}
