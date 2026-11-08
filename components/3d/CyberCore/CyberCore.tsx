'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';

interface CyberCoreProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
}

/**
 * CyberCore Foundation Component.
 * Establishes modular geometric anchor for the central cyberpunk element.
 * Phase 3.1: Clean mathematical wireframe cage and inner core with adaptive detail.
 * Phase 3.2: Custom GLSL displacement and fresnel shaders will be injected here.
 */
export const CyberCore: React.FC<CyberCoreProps> = ({
  config,
  prefersReducedMotion = false,
}) => {
  const groupRef = useRef<THREE.Group>(null);
  const outerWireRef = useRef<THREE.Mesh>(null);
  const innerMeshRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (prefersReducedMotion || !groupRef.current) return;

    // Subtle, elegant idle rotation
    const rotDelta = delta * 0.25;
    if (outerWireRef.current) {
      outerWireRef.current.rotation.x += rotDelta * 0.5;
      outerWireRef.current.rotation.y += rotDelta * 0.8;
    }
    if (innerMeshRef.current) {
      innerMeshRef.current.rotation.x -= rotDelta * 0.4;
      innerMeshRef.current.rotation.y -= rotDelta * 0.6;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Outer Geometric Wireframe Cage */}
      <mesh ref={outerWireRef}>
        <icosahedronGeometry args={[1.35, 1]} />
        <meshBasicMaterial
          color="#00F0FF"
          wireframe
          transparent
          opacity={0.22}
        />
      </mesh>

      {/* Inner Geometric Crystalline Core */}
      <mesh ref={innerMeshRef}>
        <octahedronGeometry args={[0.75, 0]} />
        <meshStandardMaterial
          color="#0A1026"
          roughness={0.2}
          metalness={0.85}
          emissive="#8A2BE2"
          emissiveIntensity={0.25}
          wireframe={config.tier === 'low'}
        />
      </mesh>
    </group>
  );
};

