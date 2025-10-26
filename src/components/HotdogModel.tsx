import { useLoader } from "@react-three/fiber";
import * as THREE from "three";

interface HotdogModelProps {
  hovered: boolean;
  imageUrl: string;
}

export function HotdogModel({ hovered, imageUrl }: HotdogModelProps) {
  const texture = useLoader(THREE.TextureLoader, imageUrl);
  const scale = hovered ? 0.08 : 0.06;
  
  return (
    <sprite scale={[scale, scale, 1]}>
      <spriteMaterial 
        map={texture} 
        transparent 
        opacity={1}
        sizeAttenuation={true}
      />
    </sprite>
  );
}
