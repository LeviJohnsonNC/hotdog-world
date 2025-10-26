import { useRef } from "react";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";

interface EarthProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogId: string) => void;
}

function Earth({ hotdogs, onHotdogClick }: EarthProps) {
  const groupRef = useRef<THREE.Group>(null);
  
  // Load Earth textures
  const [colorMap, bumpMap] = useLoader(THREE.TextureLoader, [
    '/textures/earth-color.jpg',
    '/textures/earth-bump.jpg'
  ]);

  useFrame(() => {
    if (groupRef.current) {
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
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#1a1a2e"]} />
        
        {/* Improved lighting for realistic globe */}
        <ambientLight intensity={0.3} />
        <directionalLight 
          position={[5, 3, 5]} 
          intensity={1.2}
          color="#ffffff"
        />
        <hemisphereLight
          color="#ffffff"
          groundColor="#444444"
          intensity={0.5}
        />
        <pointLight position={[-5, -3, -5]} intensity={0.3} color="#F6BD60" />
        
        <Earth hotdogs={hotdogs} onHotdogClick={onHotdogClick} />
        
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          minDistance={4}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
        />
      </Canvas>
    </div>
  );
}
