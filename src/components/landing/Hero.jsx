import { motion } from 'framer-motion';
import { Play, Cpu, Music } from 'lucide-react';

export default function Hero({ onStart }) {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 overflow-hidden premium-gradient">
      {/* Background Animated Elements - Stabilized and Slowed */}
      <motion.div 
        animate={{ 
          scale: [1, 1.1, 1], // Reduced scale variation (1.2 -> 1.1)
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }} // Slower duration (8s -> 12s)
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-slate-200/40 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1.1, 1, 1.1],
          opacity: [0.05, 0.1, 0.05]
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }} // Slower duration (10s -> 15s)
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-slate-100/40 rounded-full blur-3xl -z-10" 
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="max-w-4xl"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/50 border border-white/20 glass mb-8">
          <Cpu size={16} className="text-slate-900" />
          <span className="text-sm font-medium tracking-wide uppercase">AI-Powered Gesture Tracking</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-6 bg-gradient-to-b from-slate-900 to-slate-500 bg-clip-text text-transparent">
          Play Music <br /> in the Air
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed">
          The world's first spatial AI piano. No physical keys, no boundaries. 
          Just your hands and the music.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <motion.button
            whileHover={{ scale: 1.02 }} // Reduced scale on hover
            whileTap={{ scale: 0.98 }}
            onClick={onStart}
            className="px-8 py-4 rounded-2xl bg-slate-900 text-white font-semibold text-lg flex items-center gap-2 shadow-xl shadow-slate-900/20"
          >
            Start Playing <Play size={20} />
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
            className="px-8 py-4 rounded-2xl bg-white/50 border border-white/20 glass font-semibold text-lg flex items-center gap-2"
          >
            Watch Demo <Music size={20} />
          </motion.button>
        </div>
      </motion.div>

      {/* Floating Animated Hand Visualization - Stabilized */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5, duration: 1.5, ease: "easeOut" }}
        className="mt-20 relative"
      >
        <div className="w-full max-w-2xl mx-auto glass rounded-3xl p-8 shadow-2xl overflow-hidden">
          <div className="flex justify-center gap-2 mb-4">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                animate={{ height: [30, 50, 30] }} // Reduced vertical vibration (20-60 -> 30-50)
                transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
                className="w-4 bg-slate-900/20 rounded-full"
              />
            ))}
          </div>
          <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">Aura Spatial Engine Active</p>
        </div>
      </motion.div>
    </section>
  );
}
