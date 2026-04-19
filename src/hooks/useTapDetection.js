import { useRef, useCallback } from 'react';

const TAP_THRESHOLD = 0.02; // Slightly higher threshold to avoid noise
const RELEASE_THRESHOLD = -0.015; // Requires more upward movement to release
const EMA_ALPHA = 0.2; // Smoother velocity to filter out jitter
const TAP_COOLDOWN = 300; // Minimum ms between taps for the same finger

export function useTapDetection(onTap, onRelease) {
  const prevYRef = useRef({}); 
  const velocityRef = useRef({});
  const isPressedRef = useRef({});
  const lastTapTimeRef = useRef({});

  const processLandmarks = useCallback((landmarks, handId) => {
    if (!landmarks) return;

    // Index (8), Middle (12), Ring (16), Pinky (20)
    const fingerIndices = [8, 12, 16, 20];
    const now = Date.now();

    fingerIndices.forEach((idx) => {
      const landmark = landmarks[idx];
      const fingerId = `${handId}-${idx}`;

      if (prevYRef.current[fingerId] !== undefined) {
        const dy = landmark.y - prevYRef.current[fingerId];
        
        // Exponential Moving Average for smoothing velocity
        const prevVel = velocityRef.current[fingerId] || 0;
        const smoothedVel = (EMA_ALPHA * dy) + (1 - EMA_ALPHA) * prevVel;
        velocityRef.current[fingerId] = smoothedVel;

        const timeSinceLastTap = now - (lastTapTimeRef.current[fingerId] || 0);

        // Detect Tap (Downward movement spike)
        if (smoothedVel > TAP_THRESHOLD && !isPressedRef.current[fingerId] && timeSinceLastTap > TAP_COOLDOWN) {
          isPressedRef.current[fingerId] = true;
          lastTapTimeRef.current[fingerId] = now;
          onTap?.(landmark, fingerId);
        } 
        
        // Detect Release (Upward movement)
        // We require a clearer upward movement to reset the "pressed" state
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
