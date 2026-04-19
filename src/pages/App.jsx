import React, { useRef, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, Info, HelpCircle } from 'lucide-react';
import WebcamFeed from '../components/webcam/WebcamFeed';
import HandOverlay from '../components/webcam/HandOverlay';
import PianoKeyboard from '../components/piano/PianoKeyboard';
import ControlsPanel from '../components/controls/ControlsPanel';
import SoundWave from '../components/effects/SoundWave';
import WaterfallCanvas from '../components/effects/WaterfallCanvas';
import ParticleBurst from '../components/effects/ParticleBurst';
import HandCursor from '../components/piano/HandCursor';
import { useHandTracking } from '../hooks/useHandTracking';
import { useAudioEngine } from '../hooks/useAudioEngine';
import { useTapDetection } from '../hooks/useTapDetection';
import { getAllNotes } from '../utils/noteMapping';
import { getHarmonicCompanion } from '../utils/aiHarmony';
import { createMidiFile, downloadMidi, noteToMidi } from '../utils/midiExporter';
import { cn } from '../lib/utils';

export default function App({ onBack }) {
  const videoRef = useRef(null);
  const { results, isCameraReady } = useHandTracking(videoRef);
  const { playNote, stopNote, isLoaded, INSTRUMENTS, setInstrument, currentInstrument, volume, setVolume } = useAudioEngine();
  const [pressedNotes, setPressedNotes] = useState(new Set());
  const [aiPressedNotes, setAiPressedNotes] = useState(new Set());
  const [ghostNotes, setGhostNotes] = useState(new Set());
  const [midiEvents, setMidiEvents] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [aiAssist, setAiAssist] = useState(true);
  const smoothedHandPosRef = useRef({ x: 0.5, y: 0.5 });
  const [handPos, setHandPos] = useState({ x: 0.5, y: 0.5, active: false });
  
  const particleRef = useRef(null);
  const allNotes = getAllNotes(3, 2);
  const activeLandmarksRef = useRef({});

  useEffect(() => {
    if (results?.multiHandLandmarks?.[0]) {
      const landmark = results.multiHandLandmarks[0][8]; // Index finger
      const targetX = 1 - landmark.x;
      const targetY = landmark.y;

      // Smoothen the movement (Linear Interpolation)
      // current + (target - current) * lerpFactor
      const lerpFactor = 0.3;
      const nextX = smoothedHandPosRef.current.x + (targetX - smoothedHandPosRef.current.x) * lerpFactor;
      const nextY = smoothedHandPosRef.current.y + (targetY - smoothedHandPosRef.current.y) * lerpFactor;

      smoothedHandPosRef.current = { x: nextX, y: nextY };
      setHandPos({ x: nextX, y: nextY, active: true });
    } else {
      setHandPos(prev => ({ ...prev, active: false }));
    }
  }, [results]);

  const handleTap = useCallback((landmark, fingerId) => {
    const mirroredX = 1 - landmark.x;
    
    // LAYERED DETECTION: Check Black keys first as they overlap
    let noteObj = allNotes.find(n => n.type === 'black' && mirroredX >= n.xRange[0] && mirroredX <= n.xRange[1]);
    
    // Fall back to White keys if no black key hit
    if (!noteObj) {
      noteObj = allNotes.find(n => n.type === 'white' && mirroredX >= n.xRange[0] && mirroredX <= n.xRange[1]);
    }

    if (noteObj) {
      const keyIndex = allNotes.indexOf(noteObj);
      setPressedNotes(prev => new Set(prev).add(noteObj.fullNote));
      playNote(noteObj.fullNote, 'user');
      activeLandmarksRef.current[fingerId] = noteObj.fullNote;

      // Burst Effect
      particleRef.current?.burst((1 - landmark.x) * 1280, landmark.y * 720);

      // AI Suggestions (Ghost Notes)
      // Suggest notes in the same neighborhood/scale
      const suggest = allNotes.filter((_, i) => Math.abs(i - keyIndex) < 3 && i !== keyIndex);
      setGhostNotes(new Set(suggest.map(n => n.fullNote)));

      // MIDI Recording
      if (isRecording) {
        setMidiEvents(prev => [...prev, { type: 'on', noteNumber: noteToMidi(noteObj.fullNote), time: Date.now() }]);
      }

      // AI ASSIST: Play harmonic companion
      if (aiAssist) {
        const companion = getHarmonicCompanion(noteObj.fullNote);
        if (companion) {
          setTimeout(() => {
            setAiPressedNotes(prev => new Set(prev).add(companion));
            playNote(companion, 'ai');
            if (isRecording) {
              setMidiEvents(prev => [...prev, { type: 'on', noteNumber: noteToMidi(companion), time: Date.now() }]);
            }
            
            setTimeout(() => {
              setAiPressedNotes(prev => {
                const next = new Set(prev);
                next.delete(companion);
                return next;
              });
              stopNote(companion);
              if (isRecording) {
                setMidiEvents(prev => [...prev, { type: 'off', noteNumber: noteToMidi(companion), time: Date.now() }]);
              }
            }, 500);
          }, 50 + Math.random() * 50);
        }
      }
    }
  }, [allNotes, playNote, aiAssist, stopNote, isRecording]);

  const handleRelease = useCallback((fingerId) => {
    const note = activeLandmarksRef.current[fingerId];
    if (note) {
      setPressedNotes(prev => {
        const next = new Set(prev);
        next.delete(note);
        return next;
      });
      stopNote(note);
      delete activeLandmarksRef.current[fingerId];
    }
  }, [stopNote]);

  const { processLandmarks } = useTapDetection(handleTap, handleRelease);

  useEffect(() => {
    if (results?.multiHandLandmarks) {
      results.multiHandLandmarks.forEach((hand, idx) => {
        processLandmarks(hand, idx);
      });
    }
  }, [results, processLandmarks]);

  return (
    <div className="h-screen bg-[#F8F9FA] flex flex-col overflow-hidden p-6 gap-6">
      {/* Top Header */}
      <header className="flex justify-between items-center px-4">
        <div className="flex items-center gap-6">
          <button 
            onClick={onBack}
            className="p-3 rounded-2xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <ChevronLeft className="text-slate-600 group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">AirPiano AI</h1>
            <div className="flex items-center gap-2">
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Spatial Production Interface</p>
              <SoundWave active={pressedNotes.size > 0} />
            </div>
          </div>
        </div>
        
        <div className="flex gap-2">
          <div className="px-4 py-2 rounded-xl bg-white border border-slate-200 shadow-sm flex items-center gap-2">
            <div className={cn("w-2 h-2 rounded-full", isLoaded ? "bg-green-500" : "bg-amber-500 animate-pulse")} />
            <span className="text-xs font-bold uppercase">{isLoaded ? "Audio Live" : "Loading Samples..."}</span>
          </div>
          <button className="p-3 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition-all shadow-sm">
            <HelpCircle size={18} className="text-slate-400" />
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex gap-6 min-h-0">
        {/* Left Side: Webcam Feed */}
        <div className="flex-[2] flex flex-col gap-6 min-h-0">
          <div className="flex-1 relative min-h-0">
            <WebcamFeed videoRef={videoRef} isCameraReady={isCameraReady} />
            <WaterfallCanvas activeNotes={Array.from(pressedNotes)} aiActiveNotes={Array.from(aiPressedNotes)} />
            <HandOverlay results={results} />
            <ParticleBurst ref={particleRef} />
            
            {/* HUD Elements */}
            <div className="absolute top-1/2 left-4 -translate-y-1/2 flex flex-col gap-2">
               {[...Array(5)].map((_, i) => (
                 <motion.div 
                  key={i}
                  animate={{ opacity: [0.2, 0.5, 0.2] }}
                  transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
                  className="w-1 h-8 bg-white/20 rounded-full" 
                 />
               ))}
            </div>
          </div>

          {/* Virtual Piano Bottom */}
          <div className="h-auto relative">
            <HandCursor x={handPos.x} y={handPos.y} isActive={handPos.active} />
            <PianoKeyboard 
              pressedNotes={pressedNotes} 
              aiPressedNotes={aiPressedNotes}
              ghostNotes={ghostNotes}
              onPlay={playNote} 
              onStop={stopNote} 
            />
          </div>
        </div>

        {/* Right Side: Controls Panel */}
        <div className="flex-1 min-w-[320px] max-w-[400px]">
          <ControlsPanel 
            instruments={INSTRUMENTS}
            currentInstrument={currentInstrument}
            setInstrument={setInstrument}
            volume={volume}
            setVolume={setVolume}
            isRecording={isRecording}
            toggleRecording={() => {
              if (isRecording) {
                // Do nothing special on stop
              } else {
                setMidiEvents([]); // Clear on start
              }
              setIsRecording(!isRecording);
            }}
            aiAssist={aiAssist}
            setAiAssist={setAiAssist}
            onExportMidi={() => {
              const blob = createMidiFile(midiEvents);
              downloadMidi(blob);
            }}
            hasEvents={midiEvents.length > 0}
          />
        </div>
      </main>
      
      {/* Visual Feedback Overlay (Sound Waves) */}
      <AnimatePresence>
        {pressedNotes.size > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-slate-900 to-transparent blur-sm pointer-events-none z-50"
          />
        )}
      </AnimatePresence>
    </div>
  );
}

