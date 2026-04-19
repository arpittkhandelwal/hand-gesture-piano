import React, { useRef, useEffect, useState, useCallback } from 'react';
import { getAllNotes } from '../../utils/noteMapping';

export default function WaterfallCanvas({ activeNotes, aiActiveNotes }) {
  const canvasRef = useRef(null);
  const shardsRef = useRef([]);
  const requestRef = useRef(null);
  
  const allNotes = getAllNotes(3, 2);
  const noteCount = allNotes.length;

  const createShard = useCallback((note, isAi) => {
    const noteIndex = allNotes.findIndex(n => n.fullNote === note);
    if (noteIndex === -1) return;

    const shard = {
      id: Math.random(),
      note,
      x: (noteIndex / noteCount) * 100, // percentage x
      y: 0,
      opacity: 1,
      isAi,
      length: 20 + Math.random() * 40
    };
    shardsRef.current.push(shard);
  }, [allNotes, noteCount]);

  // Effect to spawn shards when notes are active
  useEffect(() => {
    activeNotes.forEach(note => {
      // Find if we already have a recent shard for this note to avoid over-spawning
      const existing = shardsRef.current.find(s => s.note === note && s.y < 10);
      if (!existing) createShard(note, false);
    });
    aiActiveNotes.forEach(note => {
      const existing = shardsRef.current.find(s => s.note === note && s.y < 10);
      if (!existing) createShard(note, true);
    });
  }, [activeNotes, aiActiveNotes, createShard]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const animate = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      // Update and Draw Shards
      shardsRef.current = shardsRef.current.filter(shard => shard.y < height + 100);
      
      shardsRef.current.forEach(shard => {
        shard.y += 5; // Fall speed
        
        const canvasX = (shard.x / 100) * width;
        const color = shard.isAi ? '71, 85, 105' : '15, 23, 42'; // Slate-600 vs Slate-900
        
        const gradient = ctx.createLinearGradient(0, shard.y - shard.length, 0, shard.y);
        gradient.addColorStop(0, `rgba(${color}, 0)`);
        gradient.addColorStop(1, `rgba(${color}, 0.6)`);

        ctx.fillStyle = gradient;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${color}, 0.5)`;
        
        // Draw shard (rounded rectangle)
        const radius = 4;
        const w = (1 / noteCount) * width * 1.5;
        ctx.beginPath();
        ctx.roundRect(canvasX, shard.y - shard.length, w, shard.length, radius);
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [noteCount]);

  return (
    <canvas
      ref={canvasRef}
      width={1280}
      height={720}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-40 mix-blend-screen"
    />
  );
}
