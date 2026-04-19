import { useRef, useCallback, useState } from 'react';

const TAP_THRESHOLD = 0.015; // Velocity threshold for tap
const RELEASE_THRESHOLD = -0.01;
const EMA_ALPHA = 0.3; // Smoothing factor

export function useTapDetection(onTap, onRelease) {
  const prevYRef = useRef({}); // Store prev Y for each finger
  const velocityRef = useRef({});
  const isPressedRef = useRef({});

  const processLandmarks = useCallback((landmarks, handId) => {
    if (!landmarks) return;

    // We track fingertips: Index (8), Middle (12), Ring (16), Pinky (20)
    const fingerIndices = [8, 12, 16, 20];

    fingerIndices.forEach((idx) => {
      const landmark = landmarks[idx];
      const fingerId = `${handId}-${idx}`;

      if (prevYRef.current[fingerId] !== undefined) {
        const dy = landmark.y - prevYRef.current[fingerId];
        
        // Exponential Moving Average for smoothing velocity
        const prevVel = velocityRef.current[fingerId] || 0;
        const currentVel = dy;
        const smoothedVel = (EMA_ALPHA * currentVel) + (1 - EMA_ALPHA) * prevVel;
        
        velocityRef.current[fingerId] = smoothedVel;

        // Detect Tap (Downward movement spike)
        if (smoothedVel > TAP_THRESHOLD && !isPressedRef.current[fingerId]) {
          isPressedRef.current[fingerId] = true;
          onTap?.(landmark, fingerId);
        } 
        
        // Detect Release (Upward movement or pause)
        if (smoothedVel < RELEASE_THRESHOLD && isPressedRef.current[fingerId]) {
          isPressedRef.current[fingerId] = false;
          onRelease?.(fingerId);
        }
      }

      prevYRef.current[fingerId] = landmark.y;
    });
  }, [onTap, onRelease]);

  return { processLandmarks };
}
