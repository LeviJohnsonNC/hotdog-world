import { useRef, useState } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog, HotdogCluster as HotdogClusterType } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";
import { HotdogCluster } from "./HotdogCluster";
import { Stars } from "./Stars";

interface EarthProps {
  clusters: HotdogClusterType[];
  singles: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
  isInteracting: boolean;
}

function Earth({ clusters, singles, onHotdogClick, isInteracting }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load proper equirectangular Earth texture
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-map.png');
  
  // Standard texture configuration for equirectangular projection
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (groupRef.current && !isInteracting) {
      groupRef.current.rotation.y += 0.001;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Main Earth sphere - standard Three.js sphere with equirectangular UV mapping */}
      <Sphere args={[2, 64, 64]}>
        <meshStandardMaterial
          map={colorMap}
          roughness={0.7}
          metalness={0.0}
          toneMapped={false}
        />
      </Sphere>
      
      {/* Subtle atmosphere glow */}
      <Sphere args={[2.05, 32, 32]}>
        <meshBasicMaterial
          color="#87CEEB"
          transparent
          opacity={0.2}
          side={THREE.BackSide}
        />
      </Sphere>
      
      {/* Render clustered hotdogs */}
      {clusters.map((cluster) => (
        <HotdogCluster
          key={cluster.id}
          cluster={cluster}
          onHotdogClick={onHotdogClick}
        />
      ))}
      
      {/* Render single hotdogs */}
      {singles.map((hotdog) => (
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
  clusters: HotdogClusterType[];
  singles: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
}

export function Globe({ clusters, singles, onHotdogClick }: GlobeProps) {
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
        camera={{ position: [0, 0, 6], fov: 45, near: 0.01 }}
        gl={{ antialias: true, alpha: true }}
      >
        {/* Dark starry background like the reference */}
        <color attach="background" args={["#1a2332"]} />
        <fog attach="fog" args={["#1a2332", 10, 20]} />
        
        {/* Bright lighting for cartoonish look */}
        <ambientLight intensity={1.5} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.5}
          color="#ffffff"
        />
        <directionalLight 
          position={[-5, -3, -5]} 
          intensity={0.8}
          color="#ffffff"
        />
        
        {/* Starfield background */}
        <Stars />
        
        <Earth clusters={clusters} singles={singles} onHotdogClick={onHotdogClick} isInteracting={isInteracting} />
        
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
