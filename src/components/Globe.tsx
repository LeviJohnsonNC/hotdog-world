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
  
  // Load Earth textures
  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth-color.jpg',
    '/textures/earth-bump.jpg'
  ]);

  useFrame(() => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere with realistic texture */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          bumpMap={bumpMap}
          bumpScale={0.05}
          roughness={0.7}
          metalness={0.1}
        />
      </Sphere>
      
      {/* Atmosphere glow effect */}
      <Sphere args={[2.05, 64, 64]}>
        <meshBasicMaterial
          color="#5BC0EB"
          transparent
          opacity={0.1}
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
        <color attach="background" args={["#2a2a3e"]} />
        
        {/* Improved lighting for realistic globe */}
        <ambientLight intensity={0.6} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.8}
          color="#ffffff"
        />
        <hemisphereLight
          color="#ffffff"
          groundColor="#666666"
          intensity={0.8}
        />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#F6BD60" />
        
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
