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
  earthGroupRef: React.RefObject<THREE.Group>;
  angularVelocityRef: { current: THREE.Vector3 };
  targetQuaternionRef: { current: THREE.Quaternion };
  animationStartTime: number;
  isZoomingRef: { current: boolean };
  zoomStartTimeRef: { current: number };
  controlsRef: React.RefObject<any>;
}

// Easing function for zoom
const easeInOutQuart = (t: number) => 
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

function Earth({ 
  hotdogs, 
  onHotdogClick, 
  isInteracting, 
  isSpinning,
  targetHotdog,
  earthGroupRef,
  angularVelocityRef,
  targetQuaternionRef,
  animationStartTime,
  isZoomingRef,
  zoomStartTimeRef,
  controlsRef
}: EarthProps) {
  const isMobile = useIsMobile();
  const { camera } = useThree();
  
  // Load optimized Earth texture (will use browser caching after first load)
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-map.png');
  
  // Standard texture configuration for equirectangular projection
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  useFrame(() => {
    if (!earthGroupRef.current) return;

    if (isSpinning && targetHotdog) {
      const elapsed = (performance.now() - animationStartTime) / 1000;
      
      // Physics constants
      const decayFactor = isMobile ? 0.94 : 0.96;
      const alignmentStrength = Math.min(elapsed / 2.5, 1.0);
      
      // Calculate current forward direction
      const currentForward = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(earthGroupRef.current.quaternion);
      
      // Calculate target forward direction (towards hotdog)
      const targetPos = new THREE.Vector3(...targetHotdog.position);
      const targetForward = targetPos.clone().normalize();
      
      // Calculate correction force using cross product
      const correctionAxis = new THREE.Vector3()
        .crossVectors(currentForward, targetForward);
      const correctionAngle = Math.acos(
        THREE.MathUtils.clamp(currentForward.dot(targetForward), -1, 1)
      );
      
      // Apply magnetic alignment force
      const alignmentForce = correctionAxis
        .multiplyScalar(correctionAngle * alignmentStrength * 0.15);
      
      // Apply physics: friction + magnetic pull
      angularVelocityRef.current
        .multiplyScalar(decayFactor)
        .add(alignmentForce);
      
      // Apply rotation
      const rotationSpeed = angularVelocityRef.current.length();
      if (rotationSpeed > 0.001) {
        const axis = angularVelocityRef.current.clone().normalize();
        earthGroupRef.current.rotateOnAxis(axis, rotationSpeed);
      }
      
      // Check if settled → start zoom
      if (!isZoomingRef.current && rotationSpeed < 0.002 && correctionAngle < 0.05) {
        isZoomingRef.current = true;
        zoomStartTimeRef.current = performance.now();
      }
      
      // Zoom phase
      if (isZoomingRef.current) {
        const zoomElapsed = (performance.now() - zoomStartTimeRef.current) / 1000;
        const zoomDuration = isMobile ? 1.0 : 1.2;
        
        if (zoomElapsed < zoomDuration) {
          const progress = zoomElapsed / zoomDuration;
          const eased = easeInOutQuart(progress);
          
          // Calculate target positions
          const hotdogWorldPos = new THREE.Vector3(...targetHotdog.position);
          const surfaceNormal = hotdogWorldPos.clone().normalize();
          const targetCameraPos = surfaceNormal.clone().multiplyScalar(3.0);
          const targetOrbitPos = surfaceNormal.clone().multiplyScalar(2.0);
          
          // Spring overshoot for polish
          const spring = 1.0 + (Math.sin(eased * Math.PI) * 0.05);
          
          camera.position.lerp(
            targetCameraPos.multiplyScalar(spring), 
            0.08
          );
          
          if (controlsRef.current) {
            controlsRef.current.target.lerp(targetOrbitPos, 0.08);
          }
        } else {
          // Zoom complete - will be handled by parent
        }
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
  const [animationStartTime, setAnimationStartTime] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<any>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  
  // Physics state refs
  const angularVelocityRef = { current: new THREE.Vector3() };
  const targetQuaternionRef = { current: new THREE.Quaternion() };
  const isZoomingRef = { current: false };
  const zoomStartTimeRef = { current: 0 };
  const animationCheckIntervalRef = useRef<NodeJS.Timeout | null>(null);
  
  const cameraZ = isMobile ? 8 : 4.5;
  const minZoom = isMobile ? 6.5 : 4;

  const resetAnimation = () => {
    setIsSpinning(false);
    setTargetHotdog(null);
    isZoomingRef.current = false;
    angularVelocityRef.current.set(0, 0, 0);
    
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
    
    if (animationCheckIntervalRef.current) {
      clearInterval(animationCheckIntervalRef.current);
      animationCheckIntervalRef.current = null;
    }
  };

  // Expose imperative handle for parent to trigger spin
  useImperativeHandle(ref, () => ({
    spinToHotdog: (hotdogSlug: string) => {
      const hotdog = hotdogs.find(h => h.slug === hotdogSlug);
      if (!hotdog) return;

      // Reset any previous animation
      resetAnimation();

      // Initialize physics with random 3D angular velocity
      const velocityScale = isMobile ? 0.7 : 1.0;
      angularVelocityRef.current.set(
        (Math.random() - 0.5) * 0.35 * velocityScale,
        (Math.random() - 0.5) * 0.35 * velocityScale,
        (Math.random() - 0.5) * 0.35 * velocityScale
      );

      setIsSpinning(true);
      setTargetHotdog(hotdog);
      setAnimationStartTime(performance.now());

      // Disable controls during animation
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }

      // Check for zoom completion
      animationCheckIntervalRef.current = setInterval(() => {
        if (isZoomingRef.current) {
          const zoomElapsed = (performance.now() - zoomStartTimeRef.current) / 1000;
          const zoomDuration = isMobile ? 1.0 : 1.2;
          
          if (zoomElapsed >= zoomDuration) {
            if (animationCheckIntervalRef.current) {
              clearInterval(animationCheckIntervalRef.current);
            }
            onHotdogClick(hotdog.slug);
            // Small delay before reset
            setTimeout(() => resetAnimation(), 100);
          }
        }
      }, 50);
    }
  }));

  // Cleanup on unmount or interruption
  useEffect(() => {
    return () => {
      if (isSpinning) {
        resetAnimation();
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isSpinning]);

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
          earthGroupRef={earthGroupRef}
          angularVelocityRef={angularVelocityRef}
          targetQuaternionRef={targetQuaternionRef}
          animationStartTime={animationStartTime}
          isZoomingRef={isZoomingRef}
          zoomStartTimeRef={zoomStartTimeRef}
          controlsRef={controlsRef}
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
