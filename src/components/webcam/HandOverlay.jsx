import React, { useRef, useEffect } from 'react';

// Exclude landmark 0 (wrist) to keep lines localized to the hand/fingers
const CONNECTIONS = [
  [1, 2], [2, 3], [3, 4], // Thumb
  [5, 6], [6, 7], [7, 8], // Index
  [9, 10], [10, 11], [11, 12], // Middle
  [13, 14], [14, 15], [15, 16], // Ring
  [17, 18], [18, 19], [19, 20], // Pinky
  // Palm base
  [1, 5], [5, 9], [9, 13], [13, 17], [17, 1]
];

export default function HandOverlay({ results }) {
  const canvasRef = useRef(null);
  const smoothedLandmarksRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { width, height } = canvasRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    if (results?.multiHandLandmarks?.[0]) {
      const rawLandmarks = results.multiHandLandmarks[0];
      
      // Initialize or Smoothen landmarks using Lerp
      if (!smoothedLandmarksRef.current) {
        smoothedLandmarksRef.current = rawLandmarks.map(l => ({ ...l }));
      } else {
        const lerpFactor = 0.25;
        smoothedLandmarksRef.current = smoothedLandmarksRef.current.map((prev, i) => {
          const target = rawLandmarks[i];
          return {
            x: prev.x + (target.x - prev.x) * lerpFactor,
            y: prev.y + (target.y - prev.y) * lerpFactor,
            z: prev.z + (target.z - prev.z) * lerpFactor
          };
        });
      }

      const landmarks = smoothedLandmarksRef.current;

      // Draw connections - Subtle Slate
      ctx.strokeStyle = 'rgba(71, 85, 105, 0.4)';
      ctx.lineWidth = 2;
      
      CONNECTIONS.forEach(([start, end]) => {
        const s = landmarks[start];
        const e = landmarks[end];
        if (!s || !e) return;
        ctx.beginPath();
        ctx.moveTo((1 - s.x) * width, s.y * height);
        ctx.lineTo((1 - e.x) * width, e.y * height);
        ctx.stroke();
      });

      // Draw joints
      landmarks.forEach((landmark, i) => {
          if (i === 0) return; // Skip wrist joint
        const isFingertip = [4, 8, 12, 16, 20].includes(i);
        ctx.fillStyle = isFingertip ? 'rgba(30, 41, 59, 0.8)' : 'rgba(255, 255, 255, 0.3)';
        ctx.beginPath();
        ctx.arc((1 - landmark.x) * width, landmark.y * height, isFingertip ? 5 : 2, 0, 2 * Math.PI);
        ctx.fill();
      });
    } else {
      smoothedLandmarksRef.current = null;
    }
  }, [results]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
    />
  );
}
