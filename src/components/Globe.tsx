import { useRef, useState, useEffect, forwardRef, useImperativeHandle } from "react";
import { Canvas, useFrame, useLoader, useThree } from "@react-three/fiber";
import { OrbitControls, Sphere } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
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
  ftuxPhase?: string;
}

// Easing function for zoom
const easeInOutQuart = (t: number) => 
  t < 0.5 ? 8 * t * t * t * t : 1 - Math.pow(-2 * t + 2, 4) / 2;

// Animation constants
const SPIN_DURATION = 5.2; // seconds (+2s for more rotations)
const ZOOM_DURATION = 2.0; // seconds
const MAX_TOTAL = 8.0; // safety net

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
  ftuxPulsingPins = new Set(),
  ftuxPhase = 'complete'
}: EarthProps) {
  const isMobile = useIsMobile();
  const { camera } = useThree();

  // Cinematic dolly-in on mount
  const introStartRef = useRef<number>(performance.now());
  const introDoneRef = useRef<boolean>(false);
  const introStartZRef = useRef<number>((isMobile ? 8 : 4.5) * 1.85);
  const introEndZRef = useRef<number>(isMobile ? 8 : 4.5);
  // Small random vertical tilt for idle drift (±0.0008 rad/frame)
  const idleTiltRef = useRef<number>((Math.random() * 2 - 1) * 0.0008);

  useEffect(() => {
    // Set starting camera position for dolly-in
    camera.position.set(0, 0.6, introStartZRef.current);
    camera.lookAt(0, 0, 0);
    introStartRef.current = performance.now();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load optimized Earth texture (152KB WebP — preloaded in index.html)
  const colorMap = useLoader(THREE.TextureLoader, '/textures/earth-map.webp');

  // Standard texture configuration for equirectangular projection
  colorMap.wrapS = THREE.RepeatWrapping;
  colorMap.wrapT = THREE.ClampToEdgeWrapping;
  colorMap.colorSpace = THREE.SRGBColorSpace;
  colorMap.anisotropy = 8;


  useFrame((state, delta) => {
    if (!earthGroupRef.current) return;

    // CINEMATIC DOLLY-IN on first mount
    if (!introDoneRef.current && phaseRef.current === "idle") {
      const t = (performance.now() - introStartRef.current) / 1800; // 1.8s
      const p = Math.min(t, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - p, 3);
      const z = introStartZRef.current + (introEndZRef.current - introStartZRef.current) * eased;
      const y = 0.6 * (1 - eased);
      camera.position.set(0, y, z);
      camera.lookAt(0, 0, 0);
      // Slow majestic spin during intro
      earthGroupRef.current.rotation.y -= 0.004 * (1 - eased * 0.6);
      if (p >= 1) introDoneRef.current = true;
      return;
    }

    const phase = phaseRef.current;


    // SPINNING PHASE: Time-bounded physics with guaranteed alignment
    if (phase === "spinning" && targetHotdog) {
      const t = (performance.now() - spinStartRef.current) / 1000;
      const spinProgress = Math.min(t / SPIN_DURATION, 1);
      
      // Apply friction to quickly damp the spin (gentler decay = longer sustained spin)
      const friction = isMobile ? 2.5 : 2.0;
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
    
    // IDLE PHASE: Slow majestic auto-rotation (only if enabled)
    else if (enableAutoRotation && !isInteracting && !isSpinning) {
      earthGroupRef.current.rotation.y -= 0.0018;
      earthGroupRef.current.rotation.x += idleTiltRef.current;
      // Clamp tilt so it doesn't drift indefinitely
      earthGroupRef.current.rotation.x = Math.max(-0.35, Math.min(0.35, earthGroupRef.current.rotation.x));
    }
  });

  // Mobile optimization: reduce geometry complexity
  const sphereDetail = isMobile ? 32 : 64;
  
  return (
    <group ref={earthGroupRef}>
      {/* Main Earth sphere */}
      <Sphere args={[2, sphereDetail, sphereDetail]}>
        <meshStandardMaterial
          map={colorMap}
          roughness={0.78}
          metalness={0.02}
        />
      </Sphere>

      {/* Subtle atmosphere — single thin backside layer, barely there */}
      <Sphere args={[2.06, 48, 48]}>
        <meshBasicMaterial
          color="#7fb8ff"
          transparent
          opacity={0.10}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </Sphere>


      
      {/* Hotdogs - disable clicks during spin */}
      {hotdogs.map((hotdog, index) => {
        // Pulse ALL hotdogs during entire FTUX (except 'loading' and 'complete')
        const shouldPulse = ftuxPulsingPins.has(hotdog.id) && ftuxPhase !== 'complete' && ftuxPhase !== 'loading';
        const pulseIndex = Array.from(ftuxPulsingPins).indexOf(hotdog.id);
        const pulseDelay = pulseIndex >= 0 ? pulseIndex * 150 : 0; // Rapid-fire stagger: 150ms between each
        
        // Subtle intro stagger — short, no lat-based delay
        const introDelay = 1600 + Math.random() * 300;

        return (
          <HotdogPin
            key={hotdog.id}
            position={hotdog.position}
            onClick={() => !isSpinning && onHotdogClick(hotdog.slug)}
            hotdog={hotdog}
            shouldPulse={shouldPulse}
            pulseDelay={pulseDelay}
            introDelay={introDelay}
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
  ftuxPhase?: string;
}

export const Globe = forwardRef<GlobeHandle, GlobeProps>(({ hotdogs, onHotdogClick, enableAutoRotation = true, ftuxPulsingPins = new Set(), ftuxPhase = 'complete' }, ref) => {
  const [isInteracting, setIsInteracting] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [targetHotdog, setTargetHotdog] = useState<Hotdog | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
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
      
      // Get camera's current direction as the "front" (where it's looking from)
      // Camera position normalized gives us the direction the camera is viewing from
      const cameraDirection = controlsRef.current?.object?.position?.clone().normalize() 
        ?? new THREE.Vector3(0, 0, 1);
      
      // Compute target orientation: rotate hotdog to face the camera's actual position
      const hotdogLocal = new THREE.Vector3(...hotdog.position).normalize();
      const hotdogWorldNow = hotdogLocal.clone().applyQuaternion(currentQ);
      const qDelta = new THREE.Quaternion().setFromUnitVectors(hotdogWorldNow, cameraDirection);
      const targetQ = qDelta.multiply(currentQ);
      targetQuaternionRef.current.copy(targetQ);
      
      // Initialize random 3D angular velocity (increased for more rotations)
      const baseSpeed = isMobile ? 0.25 : 0.30;
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
      // Short pause after release so drift resumes promptly
      timeoutRef.current = setTimeout(() => {
        setIsInteracting(false);
      }, 1500);
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
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.ACESFilmicToneMapping;
          gl.toneMappingExposure = 1.1;
          gl.outputColorSpace = THREE.SRGBColorSpace;
        }}
      >
        {/* Deep space background */}
        <color attach="background" args={["#0a1420"]} />
        <fog attach="fog" args={["#0a1420", 11, 22]} />

        {/* Cinematic three-point lighting */}
        <ambientLight intensity={0.35} color="#9ec8ff" />
        {/* Warm key (sun) */}
        <directionalLight
          position={[6, 3, 5]}
          intensity={2.4}
          color="#fff1d6"
        />
        {/* Cool fill */}
        <directionalLight
          position={[-6, -2, -4]}
          intensity={0.55}
          color="#6aa9ff"
        />
        {/* Rim light */}
        <directionalLight
          position={[0, 4, -6]}
          intensity={0.9}
          color="#aee0ff"
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
          ftuxPhase={ftuxPhase}
        />

        <OrbitControls
          ref={controlsRef}
          enablePan={false}
          enableZoom={true}
          enableDamping
          dampingFactor={0.08}
          minDistance={minZoom}
          maxDistance={10}
          rotateSpeed={0.38}
          zoomSpeed={0.7}
          onStart={handleInteractionStart}
          onEnd={handleInteractionEnd}
          enabled={!isSpinning}
        />

        {/* Postprocessing — subtle bloom + vignette */}
        {!isMobile && (
          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.6}
              luminanceSmoothing={0.25}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.2} darkness={0.55} blendFunction={BlendFunction.NORMAL} />
          </EffectComposer>
        )}
      </Canvas>
    </div>
  );
});
