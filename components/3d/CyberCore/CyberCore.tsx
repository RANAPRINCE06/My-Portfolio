'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';
import { getScrollState } from '@/lib/scroll-bridge';
import {
  cyberCoreVertexShader,
  cyberCoreFragmentShader,
} from './shaders';
import { createCyberCoreUniforms } from './CyberCoreMaterial';

interface CyberCoreProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
  /** World-space offset for the entire CyberCore group. Defaults to [0,0,0]. */
  position?: [number, number, number];
}

/**
 * CyberCore 3D Centerpiece.
 * An organic, quantum computational energy core powered by custom GLSL shaders,
 * framed by an outer protective crystalline geodesic wireframe lattice,
 * with Lenis scroll-linked axial rotation and subtle cursor-following kinematics.
 */
export const CyberCore: React.FC<CyberCoreProps> = ({
  config,
  prefersReducedMotion = false,
  position = [0, 0, 0],
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const outerCageRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  // Orbital ring refs for independent animation
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const ring4Ref = useRef<THREE.Mesh>(null);

  // Geometry subdivision count based on performance tier
  const subdivisionDetail = useMemo(() => {
    if (config.tier === 'high') return 4;
    if (config.tier === 'balanced') return 3;
    return 2; // low
  }, [config.tier]);

  // Shader Uniforms memoized to prevent recreation across re-renders
  const uniforms = useMemo(() => {
    return createCyberCoreUniforms(config);
  }, [config]);

  // Reusable vector refs for zero garbage collection inside useFrame
  const targetRotation = useRef(new THREE.Euler(0, 0, 0));
  const pointerPos = useRef(new THREE.Vector2(0, 0));

  // Clean disposal of shader materials on unmount
  useEffect(() => {
    const material = materialRef.current;
    return () => {
      material?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    const scroll = getScrollState();

    // 1. Accessibility guard: if reduced motion is requested, keep core static and still
    if (prefersReducedMotion) {
      if (groupRef.current) {
        groupRef.current.rotation.set(0, 0, 0);
        groupRef.current.position.set(0, 0, 0);
      }
      return;
    }

    // 2. Advance shader uniform time
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta;
    }

    if (!groupRef.current) return;

    // 3. Lenis Scroll-Linked Axial Dynamics
    // Scroll progress (0 to 1) gently rotates the core along Y and X
    const scrollRotY = scroll.progress * Math.PI * 1.5;
    const scrollRotX = Math.sin(scroll.progress * Math.PI) * 0.35;
    const scrollVelocityOffset = scroll.velocity * 0.0008;

    // 4. Subtle Cursor Tracking (Pointer Parallax)
    // Pointer coordinates (-1 to 1) gently tip the orientation of the core
    const isParallaxEnabled = config.enableInteractiveParallax && config.tier !== 'low';
    const pointerInfluenceX = isParallaxEnabled ? state.pointer.x * 0.25 : 0;
    const pointerInfluenceY = isParallaxEnabled ? -state.pointer.y * 0.2 : 0;

    // Idle ambient rotation
    targetRotation.current.y += delta * 0.2 + scrollVelocityOffset;
    targetRotation.current.x += delta * 0.08;

    // Dampened interpolation toward composite rotation
    const damp = Math.min(delta * 2.2, 1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation.current.y + scrollRotY + pointerInfluenceX,
      damp
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      targetRotation.current.x + scrollRotX + pointerInfluenceY,
      damp
    );

    // 5. Outer Geodesic Cage Counter-Rotation
    if (outerCageRef.current) {
      outerCageRef.current.rotation.y -= delta * 0.35;
      outerCageRef.current.rotation.z += delta * 0.15;
    }

    // 6. Orbital Energy Ring Animations (independent speeds + axes)
    if (ring1Ref.current) {
      ring1Ref.current.rotation.z += delta * 0.55;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y += delta * 0.38;
      ring2Ref.current.rotation.x -= delta * 0.12;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.x += delta * 0.28;
      ring3Ref.current.rotation.z -= delta * 0.22;
    }
    if (ring4Ref.current) {
      ring4Ref.current.rotation.y -= delta * 0.42;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Inner Quantum Shader-Driven Core — scaled up for Hero prominence */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.65, subdivisionDetail]} />
        <shaderMaterial
          ref={materialRef}
          vertexShader={cyberCoreVertexShader}
          fragmentShader={cyberCoreFragmentShader}
          uniforms={uniforms}
          transparent
          depthWrite={false}
          side={THREE.FrontSide}
        />
      </mesh>

      {/* Outer Crystalline Geodesic Lattice Cage */}
      <mesh ref={outerCageRef}>
        <icosahedronGeometry args={[2.2, 1]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={config.tier === 'low' ? 0.12 : config.tier === 'high' ? 0.32 : 0.2}
        />
      </mesh>

      {/* Orbital Energy Ring 1 — Cyan primary, equatorial tilt */}
      <mesh ref={ring1Ref} rotation={[Math.PI / 2, 0, Math.PI / 6]}>
        <torusGeometry args={[2.5, 0.012, 8, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={config.tier === 'low' ? 0.2 : 0.55} />
      </mesh>

      {/* Orbital Energy Ring 2 — Violet, 55° inclination */}
      <mesh ref={ring2Ref} rotation={[Math.PI / 3, Math.PI / 4, 0]}>
        <torusGeometry args={[2.85, 0.009, 8, 64]} />
        <meshBasicMaterial color="#8A2BE2" transparent opacity={config.tier === 'low' ? 0.15 : 0.45} />
      </mesh>

      {/* Orbital Energy Ring 3 — Cyan, perpendicular axis */}
      <mesh ref={ring3Ref} rotation={[0, Math.PI / 5, Math.PI / 2]}>
        <torusGeometry args={[3.15, 0.007, 8, 64]} />
        <meshBasicMaterial color="#00F0FF" transparent opacity={config.tier === 'low' ? 0.1 : 0.3} />
      </mesh>

      {/* Orbital Energy Ring 4 — Violet, diagonal (high tier only) */}
      {config.tier !== 'low' && (
        <mesh ref={ring4Ref} rotation={[Math.PI / 6, 0, Math.PI / 3]}>
          <torusGeometry args={[3.5, 0.005, 8, 48]} />
          <meshBasicMaterial color="#8A2BE2" transparent opacity={0.2} />
        </mesh>
      )}
    </group>
  );
};
