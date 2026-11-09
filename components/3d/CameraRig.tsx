'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { CameraRigConfig } from '@/types/scene';

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
    // 1. Accessibility & Safety Guard: If user prefers reduced motion or parallax is disabled,
    // lock camera strictly to base coordinates without frame jitter.
    if (prefersReducedMotion || !enableParallax) {
      state.camera.position.set(
        mergedConfig.basePosition[0],
        mergedConfig.basePosition[1],
        mergedConfig.basePosition[2]
      );
      state.camera.lookAt(lookTarget.current);
      return;
    }

    // 2. Subtle pointer-based target calculation (normalized -1 to 1)
    const pointerX = THREE.MathUtils.clamp(state.pointer.x, -1, 1);
    const pointerY = THREE.MathUtils.clamp(state.pointer.y, -1, 1);

    const targetX = mergedConfig.basePosition[0] + pointerX * mergedConfig.maxOffsetX;
    const targetY = mergedConfig.basePosition[1] + pointerY * mergedConfig.maxOffsetY;
    const targetZ = mergedConfig.basePosition[2];

    targetPos.current.set(targetX, targetY, targetZ);

    // 3. Smooth, frame-rate independent dampening using delta
    const dampFactor = Math.min(delta * mergedConfig.smoothSpeed, 1);
    state.camera.position.lerp(targetPos.current, dampFactor);
    state.camera.lookAt(lookTarget.current);
  });

  return null;
};

