'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRigConfig } from '@/types/scene';
import { getScrollState } from '@/lib/scroll-bridge';

interface CameraRigProps {
  enableParallax?: boolean;
  prefersReducedMotion?: boolean;
  config?: Partial<CameraRigConfig>;
}

const DEFAULT_CAMERA_CONFIG: CameraRigConfig = {
  maxOffsetX: 0.35,
  maxOffsetY: 0.2,
  smoothSpeed: 2.5,
  // Shift base position left so CyberCore appears framed on the right of the Hero
  basePosition: [-1.0, 0, 5.8],
};

/**
 * CameraRig manages smooth, dampened perspective camera movements.
 * Implements subtle pointer parallax, strict safety boundaries,
 * and immediate static lock when reduced motion is preferred.
 */
export const CameraRig: React.FC<CameraRigProps> = ({
  enableParallax = true,
  prefersReducedMotion = false,
  config = {},
}) => {
  const mergedConfig: CameraRigConfig = {
    ...DEFAULT_CAMERA_CONFIG,
    ...config,
  };

  // Reusable Vector3 instances to avoid memory allocation inside the frame loop
  const targetPos = useRef(new THREE.Vector3(...mergedConfig.basePosition));
  const lookTarget = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    // 1. Accessibility Guard: if user prefers reduced motion, lock camera strictly to base coordinates
    if (prefersReducedMotion) {
      state.camera.position.set(
        mergedConfig.basePosition[0],
        mergedConfig.basePosition[1],
        mergedConfig.basePosition[2]
      );
      lookTarget.current.set(0, 0, 0);
      state.camera.lookAt(lookTarget.current);
      return;
    }

    const scroll = getScrollState();

    // 2. Bounded scroll-linked camera choreography
    // Hero (0.0): [-1.0, 0, 5.8] -> Mid-sections (0.5): [-0.05, -0.08, 6.4] -> Contact (1.0): [0.35, -0.04, 6.0]
    const scrollShiftX = THREE.MathUtils.lerp(0, 1.35, scroll.progress);
    const scrollShiftY = -Math.sin(scroll.progress * Math.PI) * 0.1;
    const scrollShiftZ = Math.sin(scroll.progress * Math.PI) * 0.65;

    // 3. Subtle pointer-based target calculation (only when parallax is enabled)
    const pointerX = enableParallax ? THREE.MathUtils.clamp(state.pointer.x, -1, 1) : 0;
    const pointerY = enableParallax ? THREE.MathUtils.clamp(state.pointer.y, -1, 1) : 0;

    const targetX = mergedConfig.basePosition[0] + scrollShiftX + pointerX * mergedConfig.maxOffsetX;
    const targetY = mergedConfig.basePosition[1] + scrollShiftY + pointerY * mergedConfig.maxOffsetY;
    const targetZ = mergedConfig.basePosition[2] + scrollShiftZ;

    targetPos.current.set(targetX, targetY, targetZ);
    lookTarget.current.set(0, -scroll.progress * 0.15, 0);

    // 4. Smooth, frame-rate independent dampening using delta
    const dampFactor = Math.min(delta * mergedConfig.smoothSpeed, 1);
    state.camera.position.lerp(targetPos.current, dampFactor);
    state.camera.lookAt(lookTarget.current);
  });

  return null;
};

