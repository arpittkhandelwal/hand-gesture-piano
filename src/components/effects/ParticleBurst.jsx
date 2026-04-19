import React, { useRef, useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';

const ParticleBurst = forwardRef((props, ref) => {
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const requestRef = useRef(null);

  const createParticles = useCallback((x, y, color) => {
    const count = 15;
    for (let i = 0; i < count; i++) {
        particlesRef.current.push({
            x,
            y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            size: Math.random() * 4 + 2,
            life: 1,
            color: color || '#1e293b' // Slate-800
        });
    }
  }, []);

  useImperativeHandle(ref, () => ({
    burst: (x, y, color = '#6366F1') => {
      createParticles(x, y, color);
    }
  }));

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      particlesRef.current = particlesRef.current.filter(p => p.life > 0);
      
      particlesRef.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.2; // Gravity
        p.life -= 0.02;
        
        ctx.globalAlpha = p.life;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      ctx.globalAlpha = 1;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="absolute inset-0 w-full h-full pointer-events-none z-50"
    />
  );
});

export default ParticleBurst;
