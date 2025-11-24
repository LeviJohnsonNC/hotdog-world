import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import * as THREE from "three";
import { Hotdog } from "@/types/hotdog";
import { HotdogPin } from "./HotdogPin";
import { Stars } from "./Stars";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSound } from "@/hooks/useSound";

type AnimationPhase = "idle" | "spinning" | "zooming";

interface EarthProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogSlug: string) => void;
  isInteracting: boolean;
  isSpinning: boolean;
  targetHotdog: Hotdog | null;
  earthGroupRef: React.RefObject<THREE.Group>;
  angularVelocityRef: React.MutableRefObject<THREE.Vector3>;
  phaseRef: React.MutableRefObject<AnimationPhase>;
  spinStartRef: React.MutableRefObject<number>;
  zoomStartRef: React.MutableRefObject<number>;
  targetQuaternionRef: React.MutableRefObject<THREE.Quaternion>;
  zoomSlugRef: React.MutableRefObject<string | null>;
  cameraStartRef: React.MutableRefObject<THREE.Vector3>;
  cameraEndRef: React.MutableRefObject<THREE.Vector3>;
  targetStartRef: React.MutableRefObject<THREE.Vector3>;
  targetEndRef: React.MutableRefObject<THREE.Vector3>;
  controlsRef: React.RefObject<any>;
  playZoomSound: () => void;
  enableAutoRotation?: boolean;
  ftuxPulsingPins?: Set<string>;
}

// Easing function for zoom
const easeInOutQuart = (t: number) => 
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// Animation constants
const SPIN_DURATION = 3.2; // seconds
const ZOOM_DURATION = 2.0; // seconds
const MAX_TOTAL = 6.0; // safety net

function Earth({ 
  hotdogs,
  onHotdogClick,
  isInteracting,
  isSpinning,
  targetHotdog,
  earthGroupRef,
  angularVelocityRef,
  phaseRef,
  spinStartRef,
  zoomStartRef,
  targetQuaternionRef,
  zoomSlugRef,
  cameraStartRef,
  cameraEndRef,
  targetStartRef,
  targetEndRef,
  controlsRef,
  playZoomSound,
  enableAutoRotation = true,
  ftuxPulsingPins = new Set()
}: EarthProps) {
  const isMobile = useIsMobile();
  const { camera } = useThree();
  
  // Load optimized Earth texture (will use browser caching after first load)
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-map.png');
  
  // Standard texture configuration for equirectangular projection
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;

  useFrame((state, delta) => {
    if (!earthGroupRef.current) return;

    const phase = phaseRef.current;

    // SPINNING PHASE: Time-bounded physics with guaranteed alignment
    if (phase === "spinning" && targetHotdog) {
      const t = (performance.now() - spinStartRef.current) / 1000;
      const spinProgress = Math.min(t / SPIN_DURATION, 1);
      
      // Apply friction to quickly damp the spin
      const friction = isMobile ? 3.5 : 2.8;
      const damping = Math.max(0, 1 - friction * delta);
      angularVelocityRef.current!.multiplyScalar(damping);
      
      // Magnetic alignment: ramp up strength as time progresses
      const alignmentStrength = spinProgress;
      const currentQ = earthGroupRef.current.quaternion;
      currentQ.slerp(targetQuaternionRef.current!, alignmentStrength * 0.08);
      
      // Apply remaining angular velocity for "flick" feel
      const w = angularVelocityRef.current!.length();
      if (w > 0.0005) {
        const axis = angularVelocityRef.current!.clone().normalize();
        earthGroupRef.current.rotateOnAxis(axis, w);
      }
      
      // Phase transition: guaranteed alignment at SPIN_DURATION
      if (spinProgress >= 1 || t > MAX_TOTAL) {
        // Force exact alignment
        earthGroupRef.current.quaternion.copy(targetQuaternionRef.current!);
        
        // Setup zoom endpoints
        cameraStartRef.current!.copy(camera.position);
        const orbitTarget = controlsRef.current?.target ?? new THREE.Vector3(0, 0, 0);
        targetStartRef.current!.copy(orbitTarget);
        
        // Compute hotdog world direction after rotation
        const hotdogLocal = new THREE.Vector3(...targetHotdog.position);
        const hotdogWorld = hotdogLocal.clone()
          .normalize()
          .applyQuaternion(earthGroupRef.current.quaternion);
        
        // Set zoom endpoints
        const cameraDistance = isMobile ? 3.4 : 3.0;
        cameraEndRef.current!.copy(hotdogWorld).multiplyScalar(cameraDistance);
        
        const targetDistance = 2.0;
        targetEndRef.current!.copy(hotdogWorld).multiplyScalar(targetDistance);
        
        // Transition to zoom phase
        phaseRef.current = "zooming";
        zoomStartRef.current = performance.now();
        
        // Play zoom sound
        playZoomSound();
      }
    }
    
    // ZOOMING PHASE: Smooth cinematic camera movement
    else if (phase === "zooming") {
      const t = (performance.now() - zoomStartRef.current) / 1000;
      const zoomProgress = Math.min(t / ZOOM_DURATION, 1);
      const eased = easeInOutQuart(zoomProgress);
      
      // Interpolate camera position
      camera.position.lerpVectors(
        cameraStartRef.current!,
        cameraEndRef.current!,
        eased
      );
      
      // Interpolate orbit target
      if (controlsRef.current) {
        controlsRef.current.target.lerpVectors(
          targetStartRef.current!,
          targetEndRef.current!,
          eased
        );
      }
      
      // Complete: navigate to hotdog page
      if (zoomProgress >= 1 && zoomSlugRef.current) {
        phaseRef.current = "idle";
        onHotdogClick(zoomSlugRef.current);
      }
    }
    
    // IDLE PHASE: Normal auto-rotation (only if enabled)
    else if (enableAutoRotation && !isInteracting && !isSpinning) {
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
      {hotdogs.map((hotdog, index) => {
        const shouldPulse = ftuxPulsingPins.has(hotdog.id);
        const pulseIndex = Array.from(ftuxPulsingPins).indexOf(hotdog.id);
        const pulseDelay = pulseIndex >= 0 ? pulseIndex * 200 : 0;
        
        return (
          <HotdogPin
            key={hotdog.id}
            position={hotdog.position}
            onClick={() => !isSpinning && onHotdogClick(hotdog.slug)}
            hotdog={hotdog}
            shouldPulse={shouldPulse}
            pulseDelay={pulseDelay}
          />
        );
      })}
    </group>
  );
}

export interface GlobeHandle {
  spinToHotdog: (hotdogSlug: string) => void;
}

interface GlobeProps {
  hotdogs: Hotdog[];
  onHotdogClick: (hotdogSlug: string) => void;
  enableAutoRotation?: boolean;
  ftuxPulsingPins?: Set<string>;
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(({ hotdogs, onHotdogClick, enableAutoRotation = true, ftuxPulsingPins = new Set() }, ref) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetHotdog, setTargetHotdog] = useState<Hotdog | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const controlsRef = useRef<any>(null);
  const earthGroupRef = useRef<THREE.Group>(null);
  const isMobile = useIsMobile();
  
  // Sound effects
  const playSpinSound = useSound('/sounds/spin.mp3', 0.15);
  const playZoomSound = useSound('/sounds/zoom.mp3', 0.15);
  
  // Physics state refs (proper useRef hooks)
  const angularVelocityRef = useRef(new THREE.Vector3());
  const phaseRef = useRef<AnimationPhase>("idle");
  const spinStartRef = useRef(0);
  const zoomStartRef = useRef(0);
  const targetQuaternionRef = useRef(new THREE.Quaternion());
  const zoomSlugRef = useRef<string | null>(null);
  
  // Zoom path refs
  const cameraStartRef = useRef(new THREE.Vector3());
  const cameraEndRef = useRef(new THREE.Vector3());
  const targetStartRef = useRef(new THREE.Vector3());
  const targetEndRef = useRef(new THREE.Vector3());
  
  const cameraZ = isMobile ? 8 : 4.5;
  const minZoom = isMobile ? 6.5 : 4;

  const resetAnimation = () => {
    phaseRef.current = "idle";
    setIsSpinning(false);
    setTargetHotdog(null);
    zoomSlugRef.current = null;
    angularVelocityRef.current.set(0, 0, 0);
    
    if (controlsRef.current) {
      controlsRef.current.enabled = true;
    }
  };

  // Expose imperative handle for parent to trigger spin
  useImperativeHandle(ref, () => ({
    spinToHotdog: (hotdogSlug: string) => {
      const hotdog = hotdogs.find(h => h.slug === hotdogSlug);
      if (!hotdog || !earthGroupRef.current) return;

      // Reset any previous animation
      resetAnimation();

      // Capture current earth orientation
      const currentQ = earthGroupRef.current.quaternion.clone();
      
      // Compute target orientation: rotate hotdog to front (+Z)
      const hotdogLocal = new THREE.Vector3(...hotdog.position).normalize();
      const front = new THREE.Vector3(0, 0, 1);
      const hotdogWorldNow = hotdogLocal.clone().applyQuaternion(currentQ);
      const qDelta = new THREE.Quaternion().setFromUnitVectors(hotdogWorldNow, front);
      const targetQ = qDelta.multiply(currentQ);
      targetQuaternionRef.current.copy(targetQ);
      
      // Initialize random 3D angular velocity with saner magnitude
      const baseSpeed = isMobile ? 0.18 : 0.22;
      const randomAxis = new THREE.Vector3(
        Math.random() - 0.5,
        Math.random() - 0.5,
        Math.random() - 0.5
      ).normalize();
      angularVelocityRef.current.copy(randomAxis.multiplyScalar(baseSpeed));

      // Set state and timing
      phaseRef.current = "spinning";
      spinStartRef.current = performance.now();
      zoomSlugRef.current = hotdog.slug;
      setIsSpinning(true);
      setTargetHotdog(hotdog);

      // Play spin sound
      playSpinSound();

      // Disable controls during animation
      if (controlsRef.current) {
        controlsRef.current.enabled = false;
      }
    }
  }));

  // Cleanup on unmount or interruption
  useEffect(() => {
    return () => {
      phaseRef.current = "idle";
      angularVelocityRef.current.set(0, 0, 0);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
          phaseRef={phaseRef}
          spinStartRef={spinStartRef}
          zoomStartRef={zoomStartRef}
          targetQuaternionRef={targetQuaternionRef}
          zoomSlugRef={zoomSlugRef}
          cameraStartRef={cameraStartRef}
          cameraEndRef={cameraEndRef}
          targetStartRef={targetStartRef}
          targetEndRef={targetEndRef}
          controlsRef={controlsRef}
          playZoomSound={playZoomSound}
          enableAutoRotation={enableAutoRotation}
          ftuxPulsingPins={ftuxPulsingPins}
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
