import React from 'react';
import { motion } from 'framer-motion';
import { Volume2, Music, Mic, Play, Settings, Sparkles, Download } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function ControlsPanel({ 
  instruments, currentInstrument, setInstrument, 
  volume, setVolume, isRecording, toggleRecording,
  aiAssist, setAiAssist, onExportMidi, hasEvents 
}) {
  return (
    <div className="glass rounded-3xl p-8 flex flex-col gap-8 h-full shadow-2xl border border-white/20">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold bg-gradient-to-br from-slate-800 to-slate-500 bg-clip-text text-transparent">
          Studio Controls
        </h2>
        <p className="text-slate-500 text-sm mt-1">Refine your sonic experience</p>
      </div>

      <div className="space-y-8 overflow-y-auto pr-2 custom-scrollbar flex-1">
        {/* Recording Status */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-600 flex items-center gap-2">
              <div className={cn("w-2 h-2 rounded-full", isRecording ? "bg-red-500 animate-pulse" : "bg-slate-300")} />
              {isRecording ? "Recording Session..." : "Session Inactive"}
            </span>
            <button 
              onClick={toggleRecording}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all",
                isRecording 
                  ? "bg-red-50 text-red-600 hover:bg-red-100" 
                  : "bg-primary/10 text-primary hover:bg-primary/20"
              )}
            >
              {isRecording ? "Stop Recording" : "Start New Jam"}
            </button>
          </div>

          {!isRecording && hasEvents && (
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={onExportMidi}
              className="w-full py-3 bg-indigo-600 text-white rounded-2xl text-sm font-semibold flex items-center justify-center gap-2 hover:bg-indigo-700 active:scale-95 transition-all shadow-lg shadow-indigo-200"
            >
              <Download className="w-4 h-4" />
              Export MIDI Session
            </motion.button>
          )}
        </div>

        <hr className="border-slate-100" />

        {/* Instrument Selector */}
        <div className="space-y-3">
          <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
            <Music size={16} /> Sound Profile
          </label>
          <div className="grid grid-cols-2 gap-2">
            {Object.values(instruments).map((inst) => (
              <button
                key={inst}
                onClick={() => setInstrument(inst)}
                className={cn(
                  "px-4 py-3 rounded-2xl text-sm font-medium transition-all border",
                  currentInstrument === inst 
                    ? "bg-slate-900 text-white border-slate-900 shadow-md" 
                    : "bg-white text-slate-600 border-slate-100 hover:border-primary/30"
                )}
              >
                {inst}
              </button>
            ))}
          </div>
        </div>

        {/* AI Assist Toggle */}
        <div className="flex items-center justify-between p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-white shadow-sm text-indigo-600">
              <Sparkles size={18} />
            </div>
            <div>
              <p className="text-sm font-bold text-slate-800">AI Harmony</p>
              <p className="text-[10px] text-slate-500 uppercase font-bold">Auto-Pilot Mode</p>
            </div>
          </div>
          <button 
            onClick={() => setAiAssist(!aiAssist)}
            className={cn(
              "w-12 h-6 rounded-full transition-all relative",
              aiAssist ? "bg-indigo-600" : "bg-slate-200"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all shadow-sm",
              aiAssist ? "left-7" : "left-1"
            )} />
          </button>
        </div>

        {/* Volume Level */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm font-semibold text-slate-700">
            <label className="flex items-center gap-2"><Volume2 size={16} /> Output Level</label>
            <span className="text-slate-400 font-mono">{Math.round((volume + 60) * 1.66)}%</span>
          </div>
          <input 
            type="range" 
            min="-60" 
            max="0" 
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
        </div>
      </div>
      
      <div className="mt-auto pt-6 text-center border-t border-slate-50">
        <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
          Spatial Engine v2.0
        </p>
      </div>
    </div>
  );
}
