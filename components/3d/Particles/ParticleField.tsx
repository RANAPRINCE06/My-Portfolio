'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';

interface ParticleFieldProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
}

/**
 * ParticleField Foundation Component.
 * Implements an instanced, GPU-efficient particle constellation.
 * Dynamic particle capacity adapts cleanly across profiles:
 * High: 1500, Balanced: 600, Low: 150, Fallback: 0.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  config,
  prefersReducedMotion = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = config.particleCount;

  // Compute deterministic coordinates and vertex colors once per count change
  const [positions, colors] = useMemo(() => {
    if (count <= 0) {
      return [new Float32Array(0), new Float32Array(0)];
    }

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);

    const cyan = new THREE.Color('#00F0FF');
    const violet = new THREE.Color('#8A2BE2');
    const white = new THREE.Color('#FFFFFF');

    // Pseudo-random distribution in a spherical shell
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const radius = 2.8 + Math.random() * 7.2;
      const theta = Math.random() * 2 * Math.PI;
      const phi = Math.acos(2 * Math.random() - 1);

      pos[i3] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      pos[i3 + 2] = radius * Math.cos(phi);

      // Color distribution: 65% cyan, 25% violet, 10% white
      const rand = Math.random();
      const chosen = rand < 0.65 ? cyan : rand < 0.9 ? violet : white;
      col[i3] = chosen.r;
      col[i3 + 1] = chosen.g;
      col[i3 + 2] = chosen.b;
    }

    return [pos, col];
  }, [count]);

  useFrame((_, delta) => {
    if (prefersReducedMotion || !pointsRef.current || count <= 0) return;
    pointsRef.current.rotation.y += delta * 0.025;
    pointsRef.current.rotation.x += delta * 0.012;
  });

  if (count <= 0 || positions.length === 0) {
    return null;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={colors.length / 3}
          array={colors}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={config.tier === 'high' ? 0.035 : 0.028}
        vertexColors
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

