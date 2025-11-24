import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";
import { Stars } from "./Stars";
import { useIsMobile } from "@/hooks/use-mobile";

interface EarthProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogSlug: string) => void;
  isInteracting: boolean;
  isSpinning: boolean;
  targetHotdog: Hotdog | null;
  animationPhase: 'idle' | 'spin' | 'settle' | 'zoom';
  animationStartTime: number;
  earthGroupRef: React.RefObject<THREE.Group>;
}

// Easing functions
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

function Earth({ 
  hotdogs, 
  onHotdogClick, 
  isInteracting, 
  isSpinning,
  targetHotdog,
  animationPhase,
  animationStartTime,
  earthGroupRef
}: EarthProps) {
  const isMobile = useIsMobile();
  const { camera } = useThree();
  
  // Load optimized Earth texture (will use browser caching after first load)
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-map.png');
  
  // Standard texture configuration for equirectangular projection
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  // Store initial camera position for reset
  const initialCameraZ = useRef(isMobile ? 8 : 4.5);

  useFrame(() => {
    if (!earthGroupRef.current) return;

    const now = performance.now();
    const elapsed = (now - animationStartTime) / 1000; // seconds

    if (isSpinning && targetHotdog) {
      // PHASE 1: Brisk Spin (1.5 seconds)
      if (animationPhase === 'spin' && elapsed < 1.5) {
        earthGroupRef.current.rotation.y += 0.15;
        earthGroupRef.current.rotation.x = Math.sin(elapsed * 3) * 0.15;
      }
      
      // PHASE 2: Settle (1 second, from 1.5s to 2.5s)
      else if (animationPhase === 'settle' && elapsed >= 1.5 && elapsed < 2.5) {
        const settleProgress = (elapsed - 1.5) / 1.0;
        const easedProgress = easeOutCubic(settleProgress);
        
        // Calculate target rotation to face the hotdog
        const targetPos = new THREE.Vector3(...targetHotdog.position);
        const spherical = new THREE.Spherical().setFromVector3(targetPos);
        const targetRotationY = -spherical.theta + Math.PI / 2;
        
        // Smoothly interpolate to target rotation
        const startRotationY = earthGroupRef.current.rotation.y;
        earthGroupRef.current.rotation.y = THREE.MathUtils.lerp(
          startRotationY,
          targetRotationY,
          easedProgress
        );
        
        // Reduce wobble
        earthGroupRef.current.rotation.x *= (1 - easedProgress);
      }
      
      // PHASE 3: Zoom (1.2 seconds, from 2.5s to 3.7s)
      else if (animationPhase === 'zoom' && elapsed >= 2.5 && elapsed < 3.7) {
        const zoomProgress = (elapsed - 2.5) / 1.2;
        const easedProgress = easeInOutCubic(zoomProgress);
        
        // Calculate target camera position (zoom in close)
        const targetPos = new THREE.Vector3(...targetHotdog.position);
        const targetCameraPos = targetPos.clone().normalize().multiplyScalar(3.2);
        
        // Smoothly move camera
        camera.position.lerp(targetCameraPos, easedProgress * 0.1);
        camera.lookAt(targetPos);
      }
    } 
    // Normal auto-rotation when not spinning
    else if (!isInteracting && !isSpinning) {
      earthGroupRef.current.rotation.y += 0.001;
    }
  });

  // Mobile optimization: reduce geometry complexity
  const sphereDetail = isMobile ? 32 : 64;
  
  return (
    <group ref={earthGroupRef}>
      {/* Main Earth sphere - optimized geometry for mobile */}
      <Sphere args={[2, sphereDetail, sphereDetail]}>
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
      
      {/* Hotdogs - disable clicks during spin */}
      {hotdogs.map((hotdog) => (
        <HotdogPin
          key={hotdog.id}
          position={hotdog.position}
          onClick={() => !isSpinning && onHotdogClick(hotdog.slug)}
          hotdog={hotdog}
        />
      ))}
    </group>
  );
}

export interface GlobeHandle {
  spinToHotdog: (hotdogSlug: string) => void;
}

interface GlobeProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogSlug: string) => void;
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(({ hotdogs, onHotdogClick }, ref) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetHotdog, setTargetHotdog] = useState<Hotdog | null>(null);
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'spin' | 'settle' | 'zoom'>('idle');
  const [animationStartTime, setAnimationStartTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<any>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  
  const cameraZ = isMobile ? 8 : 4.5;
  const minZoom = isMobile ? 6.5 : 4;

  // Expose imperative handle for parent to trigger spin
  useImperativeHandle(ref, () => ({
    spinToHotdog: (hotdogSlug: string) => {
      const hotdog = hotdogs.find(h => h.slug === hotdogSlug);
      if (!hotdog) return;

      setIsSpinning(true);
      setTargetHotdog(hotdog);
      setAnimationPhase('spin');
      setAnimationStartTime(performance.now());

      // Disable controls during animation
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Phase transitions
      setTimeout(() => setAnimationPhase('settle'), 1500);
      setTimeout(() => setAnimationPhase('zoom'), 2500);
      
      // Navigate after animation completes
      setTimeout(() => {
        onHotdogClick(hotdog.slug);
      }, 3700);

      // Reset state after navigation
      setTimeout(() => {
        setIsSpinning(false);
        setTargetHotdog(null);
        setAnimationPhase('idle');
        if (controlsRef.current) {
          controlsRef.current.enabled = true;
        }
      }, 4000);
    }
  }));

  const handleInteractionStart = () => {
    if (!isSpinning) {
      setIsInteracting(true);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    }
  };

  const handleInteractionEnd = () => {
    if (!isSpinning) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 10000);
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="w-full h-full">
      <Canvas
        camera={{ position: [0, 0, cameraZ], fov: 50, near: 0.01 }}
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
        
        <Earth 
          hotdogs={hotdogs} 
          onHotdogClick={onHotdogClick} 
          isInteracting={isInteracting}
          isSpinning={isSpinning}
          targetHotdog={targetHotdog}
          animationPhase={animationPhase}
          animationStartTime={animationStartTime}
          earthGroupRef={earthGroupRef}
        />
        
        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          minDistance={minZoom}
          maxDistance={10}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          onStart={handleInteractionStart}
          onChange={handleInteractionStart}
          onEnd={handleInteractionEnd}
          enabled={!isSpinning}
        />
      </Canvas>
    </div>
  );
});
