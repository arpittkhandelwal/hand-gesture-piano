import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function PianoKey({ note, type, isPressed, isAiPressed, isGhost, onPlay, onStop }) {
  const isBlack = type === 'black';

  return (
    <motion.div
      onMouseDown={() => onPlay(note)}
      onMouseUp={() => onStop(note)}
      onMouseLeave={() => onStop(note)}
      className={cn(
        "relative flex-shrink-0 cursor-pointer transition-all duration-75",
        isBlack 
          ? "w-8 h-32 bg-slate-800 -mx-4 z-10 rounded-b-md shadow-lg" 
          : "w-14 h-48 bg-white border border-slate-200 rounded-b-xl shadow-sm z-0",
        (isPressed || isAiPressed) && (isBlack ? "bg-primary scale-x-95 brightness-125" : "bg-slate-100 scale-y-95 border-primary/50"),
        isGhost && !isPressed && !isAiPressed && "border-primary/20 bg-primary/5"
      )}
    >
      <div className={cn(
        "absolute bottom-4 left-0 right-0 text-center font-medium text-xs pointer-events-none select-none",
        isBlack ? "text-slate-500" : "text-slate-400"
      )}>
        {note}
      </div>

      {isGhost && !isPressed && !isAiPressed && (
        <motion.div
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 bg-primary/10 rounded-b-xl pointer-events-none"
        />
      )}

      {(isPressed || isAiPressed) && (
        <motion.div
          initial={{ opacity: 0.5, scale: 0.8 }}
          animate={{ opacity: 0, scale: 1.5 }}
          className={cn(
            "absolute inset-0 rounded-b-xl pointer-events-none",
            isAiPressed ? "bg-indigo-500/40" : "bg-primary/20"
          )}
        />
      )}
    </motion.div>
  );
}
