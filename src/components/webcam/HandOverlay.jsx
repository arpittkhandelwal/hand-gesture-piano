import React, { useRef, useEffect } from 'react';

const CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4], // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8], // Index
  [0, 9], [9, 10], [10, 11], [11, 12], // Middle
  [0, 13], [13, 14], [14, 15], [15, 16], // Ring
  [0, 17], [17, 18], [18, 19], [19, 20] // Pinky
];

export default function HandOverlay({ results }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) return;
    const ctx = canvasRef.current.getContext('2d');
    const { width, height } = canvasRef.current;
    
    ctx.clearRect(0, 0, width, height);
    
    if (results?.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((landmarks) => {
        // Draw connections
        ctx.strokeStyle = 'rgba(99, 102, 241, 0.6)';
        ctx.lineWidth = 3;
        
        CONNECTIONS.forEach(([start, end]) => {
          const s = landmarks[start];
          const e = landmarks[end];
          ctx.beginPath();
          // Mirrored mapping for canvas: (1 - x)
          ctx.moveTo((1 - s.x) * width, s.y * height);
          ctx.lineTo((1 - e.x) * width, e.y * height);
          ctx.stroke();
        });

        // Draw joints
        landmarks.forEach((landmark, i) => {
          const isFingertip = [4, 8, 12, 16, 20].includes(i);
          ctx.fillStyle = isFingertip ? '#6366F1' : '#FFFFFF';
          ctx.beginPath();
          ctx.arc((1 - landmark.x) * width, landmark.y * height, isFingertip ? 6 : 3, 0, 2 * Math.PI);
          ctx.fill();
          
          if (isFingertip) {
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#6366F1';
            ctx.stroke();
            ctx.shadowBlur = 0;
          }
        });
      });
    }
  }, [results]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="absolute inset-0 w-full h-full pointer-events-none"
    />
  );
}
