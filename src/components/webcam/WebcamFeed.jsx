import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, CameraOff } from 'lucide-react';

export default function WebcamFeed({ videoRef, isCameraReady }) {
  return (
    <div className="relative w-full aspect-video rounded-3xl overflow-hidden bg-slate-900 border-4 border-white shadow-2xl group">
      <video
        ref={videoRef}
        className="w-full h-full object-cover scale-x-[-1]"
        autoPlay
        playsInline
        muted
      />
      
      {!isCameraReady && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900 text-white gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Camera className="text-primary" size={48} />
          </motion.div>
          <p className="text-slate-400 font-medium">Initializing Aura Engine...</p>
        </div>
      )}

      <div className="absolute top-6 left-6 flex items-center gap-2 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white text-xs font-bold uppercase tracking-widest">
        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
        Live Feed
      </div>
    </div>
  );
}
