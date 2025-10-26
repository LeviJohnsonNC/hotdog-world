import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";
import { Stars } from "./Stars";

interface EarthProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
  isInteracting: boolean;
}

function Earth({ hotdogs, onHotdogClick, isInteracting }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load Earth texture with proper equirectangular projection
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-equirect-clean.jpg');

  useFrame(() => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          roughness={0.4}
          metalness={0.0}
          emissive="#4FC3F7"
          emissiveIntensity={0.1}
        />
      </Sphere>
      
      {/* Inner glow layer */}
      <Sphere args={[2.08, 64, 64]}>
        <meshBasicMaterial
          color="#4FC3F7"
          transparent
          opacity={0.3}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Outer atmosphere glow */}
      <Sphere args={[2.15, 64, 64]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.15}
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
        {/* Dark starry background like the reference */}
        <color attach="background" args={["#1a2332"]} />
        <fog attach="fog" args={["#1a2332", 10, 20]} />
        
        {/* Lighting setup for glowing globe effect */}
        <ambientLight intensity={0.8} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={2.0}
          color="#ffffff"
        />
        <pointLight position={[0, 0, 4]} intensity={1.5} color="#4FC3F7" />
        <pointLight position={[-5, -3, -5]} intensity={0.8} color="#9CCC65" />
        
        {/* Starfield background */}
        <Stars />
        
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
