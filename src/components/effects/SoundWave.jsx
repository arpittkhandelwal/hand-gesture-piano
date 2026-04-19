import { motion } from 'framer-motion';

export default function SoundWave({ active }) {
  return (
    <div className="flex items-end gap-1 h-8 px-4">
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          animate={{ 
            height: active ? [4, Math.random() * 24 + 8, 4] : 4,
            opacity: active ? 1 : 0.3
          }}
          transition={{ 
            duration: 0.5, 
            repeat: Infinity, 
            delay: i * 0.05,
            ease: "easeInOut"
          }}
          className="w-1 bg-primary rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"
        />
      ))}
    </div>
  );
}
