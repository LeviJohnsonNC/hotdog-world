import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";

interface EarthProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
  isInteracting: boolean;
}

function Earth({ hotdogs, onHotdogClick, isInteracting }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load bright cartoonish Earth texture
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-cartoon.jpg');

  useFrame(() => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with cartoonish texture */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          roughness={0.3}
          metalness={0.0}
        />
      </Sphere>
      
      {/* Brighter atmosphere glow effect */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Hotdogs are now children of the rotating Earth group */}
      {hotdogs.map((hotdog) => (
        <HotdogPin
          key={hotdog.id}
          position={hotdog.position}
          onClick={() => onHotdogClick(hotdog.id)}
          hotdog={hotdog}
        />
      ))}
    </group>
  );
}

interface GlobeProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
}

export function Globe({ hotdogs, onHotdogClick }: GlobeProps) {
  const [isInteracting, setIsInteracting] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleInteractionStart = () => {
    setIsInteracting(true);
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  const handleInteractionEnd = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsInteracting(false);
    }, 10000);
  };

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#E8F4F8"]} />
        
        {/* Bright, cheerful lighting for cartoonish globe */}
        <ambientLight intensity={1.2} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.5}
          color="#ffffff"
        />
        <hemisphereLight
          color="#ffffff"
          groundColor="#87CEEB"
          intensity={1.0}
        />
        <pointLight position={[-5, -3, -5]} intensity={0.5} color="#FFD700" />
        
        <Earth hotdogs={hotdogs} onHotdogClick={onHotdogClick} isInteracting={isInteracting} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          onStart={handleInteractionStart}
          onChange={handleInteractionStart}
          onEnd={handleInteractionEnd}
        />
      </Canvas>
    </div>
  );
}
