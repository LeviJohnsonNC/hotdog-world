import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { hotdogs } from "@/data/hotdogs";
import { HotdogPin } from "./HotdogPin";

function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (earthRef.current) {
      earthRef.current.rotation.y += 0.001;
    }
  });

  return (
    <Sphere ref={earthRef} args={[2, 64, 64]}>
      <meshStandardMaterial
        color="#5BC0EB"
        roughness={0.8}
        metalness={0.2}
        emissive="#3a8fb7"
        emissiveIntensity={0.2}
      />
    </Sphere>
  );
}

interface GlobeProps {
  onHotdogClick: (hotdogId: string) => void;
}

export function Globe({ onHotdogClick }: GlobeProps) {
  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#F3E9D2"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.4} color="#F6BD60" />
        
        <Earth />
        
        {hotdogs.map((hotdog) => (
          <HotdogPin
            key={hotdog.id}
            position={hotdog.position}
            onClick={() => onHotdogClick(hotdog.id)}
            hotdog={hotdog}
          />
        ))}
        
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
