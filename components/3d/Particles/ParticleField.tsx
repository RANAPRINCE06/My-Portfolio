'use client';

import React, { useMemo, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { ScenePerformanceConfig } from '@/types/scene';
import { getScrollState } from '@/lib/scroll-bridge';

interface ParticleFieldProps {
  config: ScenePerformanceConfig;
  prefersReducedMotion?: boolean;
}

/**
 * Kinetic Particle Field.
 * Implements GPU-accelerated celestial orbital dynamics around the central CyberCore,
 * with cursor-repulsion kinematics, scroll-linked vertical parallax, and adaptive tier scaling.
 */
export const ParticleField: React.FC<ParticleFieldProps> = ({
  config,
  prefersReducedMotion = false,
}) => {
  const pointsRef = useRef<THREE.Points>(null);
  const geomRef = useRef<THREE.BufferGeometry>(null);
  const count = config.particleCount;

  // Previous pointer tracking for velocity computation
  const prevPointer = useRef(new THREE.Vector2(0, 0));
  const pointerWorld = useRef(new THREE.Vector3(0, 0, 0));
  const elapsedTime = useRef(0);

  // 1. Precompute particle parameters (base coordinates, orbital constants, vertex colors)
  const { positions, colors, baseData, offsets } = useMemo(() => {
    if (count <= 0) {
      return {
        positions: new Float32Array(0),
        colors: new Float32Array(0),
        baseData: new Float32Array(0),
        offsets: new Float32Array(0),
      };
    }

    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const base = new Float32Array(count * 4); // [radius, theta, phi, orbitalSpeed]
    const off = new Float32Array(count * 3); // [offsetX, offsetY, offsetZ]

    const cyan = new THREE.Color('#00F0FF');
    const violet = new THREE.Color('#8A2BE2');
    const white = new THREE.Color('#FFFFFF');

    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      // Distance distribution: inner halo (2.6) to deep outer orbit (8.5)
      const radius = 2.6 + Math.pow(Math.random(), 1.6) * 6.2;
      const theta = Math.random() * Math.PI * 2;
      // Clustered slightly around the equatorial plane with spherical dispersion
      const phi = (Math.random() * 0.8 + 0.1) * Math.PI;
      // Individual orbital speed: inner particles move faster than outer (Keplerian-inspired)
      const speed = (0.04 + Math.random() * 0.08) * (Math.random() < 0.5 ? 1 : -1);

      base[i4 + 0] = radius;
      base[i4 + 1] = theta;
      base[i4 + 2] = phi;
      base[i4 + 3] = speed;

      // Initial Cartesian position
      pos[i3 + 0] = radius * Math.sin(phi) * Math.cos(theta);
      pos[i3 + 1] = radius * Math.cos(phi);
      pos[i3 + 2] = radius * Math.sin(phi) * Math.sin(theta);

      // Color distribution: 60% Cyan, 30% Violet, 10% Diamond White
      const rand = Math.random();
      const chosenColor = rand < 0.6 ? cyan : rand < 0.9 ? violet : white;
      col[i3 + 0] = chosenColor.r;
      col[i3 + 1] = chosenColor.g;
      col[i3 + 2] = chosenColor.b;
    }

    return {
      positions: pos,
      colors: col,
      baseData: base,
      offsets: off,
    };
  }, [count]);

  // Clean disposal on unmount
  useEffect(() => {
    const geom = geomRef.current;
    return () => {
      geom?.dispose();
    };
  }, []);

  useFrame((state, delta) => {
    if (!pointsRef.current || count <= 0) return;

    // 1. Accessibility Guard: motionless particles when reduced-motion is preferred
    if (prefersReducedMotion) {
      pointsRef.current.position.set(0, 0, 0);
      pointsRef.current.rotation.set(0, 0, 0);
      return;
    }

    const scroll = getScrollState();
    elapsedTime.current += delta;
    const time = elapsedTime.current;

    // 2. Lenis Scroll Dynamics
    // As the user scrolls, the particle cloud smoothly lowers and subtly dilates
    pointsRef.current.position.y = -scroll.progress * 1.6;
    const scrollOrbitalBoost = scroll.velocity * 0.0006;

    // 3. Low-Tier Optimization:
    // On low mobile profiles, avoid per-particle CPU calculations.
    // Rotate the point cloud uniformly in a single GPU draw call.
    if (config.tier === 'low' || !config.enableInteractiveParallax) {
      pointsRef.current.rotation.y += delta * 0.03 + scrollOrbitalBoost;
      pointsRef.current.rotation.x = Math.sin(time * 0.1) * 0.05;
      return;
    }

    // 4. High & Balanced Tiers: Kinetic Orbital Dynamics + Cursor Repulsion
    // Convert normalized pointer [-1, 1] into world coordinates at z = 0 plane
    const viewWidth = state.viewport.width;
    const viewHeight = state.viewport.height;
    pointerWorld.current.set(
      state.pointer.x * (viewWidth * 0.5),
      state.pointer.y * (viewHeight * 0.5),
      0
    );

    // Compute pointer velocity for dynamic push strength
    const ptrDeltaX = state.pointer.x - prevPointer.current.x;
    const ptrDeltaY = state.pointer.y - prevPointer.current.y;
    prevPointer.current.set(state.pointer.x, state.pointer.y);
    const pointerSpeed = Math.min(Math.sqrt(ptrDeltaX * ptrDeltaX + ptrDeltaY * ptrDeltaY) / (delta || 0.016), 15);
    const dynamicRadius = 2.2 + pointerSpeed * 0.08;

    const interactionRadiusSq = dynamicRadius * dynamicRadius;
    const pX = pointerWorld.current.x;
    const pY = pointerWorld.current.y;

    const posArray = positions;
    const base = baseData;
    const off = offsets;

    // Update particles in place
    for (let i = 0; i < count; i++) {
      const i3 = i * 3;
      const i4 = i * 4;

      const radius = base[i4 + 0];
      const initialTheta = base[i4 + 1];
      const phi = base[i4 + 2];
      const speed = base[i4 + 3];

      // Smooth Keplerian orbit
      const currentTheta = initialTheta + (speed * time) + (scroll.progress * 0.8);

      // Orbital target coordinate with gentle vertical harmonic breathing
      const naturalX = radius * Math.sin(phi) * Math.cos(currentTheta);
      const naturalY = radius * Math.cos(phi) + Math.sin(time * 0.8 + initialTheta) * 0.2;
      const naturalZ = radius * Math.sin(phi) * Math.sin(currentTheta);

      // Distance to cursor in XY projection
      const dx = naturalX - pX;
      const dy = naturalY - pY;
      const distSq = dx * dx + dy * dy;

      // Soft cushioned repulsion if within interaction radius
      if (distSq < interactionRadiusSq && distSq > 0.01) {
        const dist = Math.sqrt(distSq);
        const force = (1.0 - dist / dynamicRadius) * 0.35;
        off[i3 + 0] += (dx / dist) * force;
        off[i3 + 1] += (dy / dist) * force;
        off[i3 + 2] += force * 0.25; // Gentle push outward in depth
      }

      // Spring damping: decay offsets smoothly back to 0
      off[i3 + 0] *= 0.91;
      off[i3 + 1] *= 0.91;
      off[i3 + 2] *= 0.91;

      posArray[i3 + 0] = naturalX + off[i3 + 0];
      posArray[i3 + 1] = naturalY + off[i3 + 1];
      posArray[i3 + 2] = naturalZ + off[i3 + 2];
    }

    if (geomRef.current) {
      geomRef.current.attributes.position.needsUpdate = true;
    }
  });

  if (count <= 0 || positions.length === 0) {
    return null;
  }

  return (
    <points ref={pointsRef}>
      <bufferGeometry ref={geomRef}>
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
        size={config.tier === 'high' ? 0.034 : 0.026}
        vertexColors
        transparent
        opacity={0.65}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};
