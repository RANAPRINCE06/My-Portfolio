import { useRef, useCallback } from 'react';
import * as THREE from 'three';
import { CameraRigConfig } from '@/types/scene';

/**
 * Hook providing dampened, bounded camera target calculations.
 */
export function useCameraControls(config: CameraRigConfig) {
  const currentPos = useRef(new THREE.Vector3(...config.basePosition));
  const targetPos = useRef(new THREE.Vector3(...config.basePosition));

  const calculateTarget = useCallback(
    (pointerX: number, pointerY: number) => {
      const clampedX = THREE.MathUtils.clamp(pointerX, -1, 1);
      const clampedY = THREE.MathUtils.clamp(pointerY, -1, 1);

      targetPos.current.set(
        config.basePosition[0] + clampedX * config.maxOffsetX,
        config.basePosition[1] + clampedY * config.maxOffsetY,
        config.basePosition[2]
      );

      return targetPos.current;
    },
    [config.basePosition, config.maxOffsetX, config.maxOffsetY]
  );

  return { currentPos, targetPos, calculateTarget };
}

