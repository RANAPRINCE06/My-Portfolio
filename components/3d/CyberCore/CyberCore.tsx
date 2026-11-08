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
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const coreMeshRef = useRef<THREE.Mesh>(null);
  const outerCageRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

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
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Inner Quantum Shader-Driven Core */}
      <mesh ref={coreMeshRef}>
        <icosahedronGeometry args={[1.2, subdivisionDetail]} />
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
        <icosahedronGeometry args={[1.65, 1]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={config.tier === 'low' ? 0.15 : 0.24}
        />
      </mesh>

      {/* Subtle Inner Violet Energy Filament Ring */}
      <mesh rotation={[Math.PI / 3, 0, 0]}>
        <torusGeometry args={[1.45, 0.008, 8, 48]} />
        <meshBasicMaterial
          color="#8A2BE2"
          transparent
          opacity={0.35}
        />
      </mesh>
    </group>
  );
};
