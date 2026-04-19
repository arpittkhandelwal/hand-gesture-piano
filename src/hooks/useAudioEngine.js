import * as Tone from 'tone';
import { useState, useCallback, useEffect, useRef } from 'react';

const INSTRUMENTS = {
  PIANO: 'Grand Piano',
  SYNTH: 'Cyber Synth',
  LOFI: 'Lo-Fi Chill',
  EDM: 'EDM Pad'
};

export function useAudioEngine() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [currentInstrument, setCurrentInstrument] = useState(INSTRUMENTS.PIANO);
  const [volume, setVolume] = useState(-12);
  
  const samplerRef = useRef(null);
  const synthRef = useRef(null);
  
  const compressorRef = useRef(null);
  const filterRef = useRef(null);
  const delayRef = useRef(null);
  const reverbRef = useRef(null);
  const limiterRef = useRef(null);

  useEffect(() => {
    limiterRef.current = new Tone.Limiter(-2).toDestination();

    reverbRef.current = new Tone.Reverb({
      decay: 3.5,
      preDelay: 0.02,
      wet: 0.35
    }).connect(limiterRef.current);

    delayRef.current = new Tone.FeedbackDelay({
      delayTime: "8n",
      feedback: 0.2,
      wet: 0.15
    }).connect(reverbRef.current);

    filterRef.current = new Tone.Filter({
      frequency: 200,
      type: "highpass",
      rolloff: -12
    }).connect(delayRef.current);

    compressorRef.current = new Tone.Compressor({
      threshold: -24,
      ratio: 4,
      attack: 0.01,
      release: 0.2
    }).connect(filterRef.current);

    // Salamander Grand Piano Mapping (Exact CDN filenames)
    samplerRef.current = new Tone.Sampler({
      urls: {
        A1: "A1.mp3", A2: "A2.mp3", A3: "A3.mp3", A4: "A4.mp3", A5: "A5.mp3", A6: "A6.mp3",
        C1: "C1.mp3", C2: "C2.mp3", C3: "C3.mp3", C4: "C4.mp3", C5: "C5.mp3", C6: "C6.mp3",
        "D#1": "Ds1.mp3", "D#2": "Ds2.mp3", "D#3": "Ds3.mp3", "D#4": "Ds4.mp3", "D#5": "Ds5.mp3", "D#6": "Ds6.mp3",
        "F#1": "Fs1.mp3", "F#2": "Fs2.mp3", "F#3": "Fs3.mp3", "F#4": "Fs4.mp3", "F#5": "Fs5.mp3", "F#6": "Fs6.mp3",
      },
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: () => setIsLoaded(true)
    }).connect(compressorRef.current);

    synthRef.current = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.02, decay: 0.1, sustain: 0.3, release: 1.2 }
    }).connect(compressorRef.current);

    return () => {
      samplerRef.current?.dispose();
      synthRef.current?.dispose();
      compressorRef.current?.dispose();
      filterRef.current?.dispose();
      delayRef.current?.dispose();
      reverbRef.current?.dispose();
      limiterRef.current?.dispose();
    };
  }, []);

  useEffect(() => {
    Tone.getDestination().volume.rampTo(volume, 0.1);
  }, [volume]);

  const playNote = useCallback(async (note, source = 'user') => {
    if (Tone.context.state !== 'running') {
      await Tone.start();
    }

    const velocity = source === 'user' ? 0.8 : 0.45;
    if (currentInstrument === INSTRUMENTS.PIANO) {
      samplerRef.current?.triggerAttack(note, Tone.now(), velocity);
    } else {
      synthRef.current?.triggerAttack(note, Tone.now(), velocity);
    }
  }, [currentInstrument]);

  const stopNote = useCallback((note) => {
    if (currentInstrument === INSTRUMENTS.PIANO) {
      samplerRef.current?.triggerRelease(note, Tone.now());
    } else {
      synthRef.current?.triggerRelease(note, Tone.now());
    }
  }, [currentInstrument]);

  const setInstrument = (name) => {
    setCurrentInstrument(name);
    if (!synthRef.current) return;
    if (name === INSTRUMENTS.SYNTH) synthRef.current.set({ oscillator: { type: "square" } });
    else if (name === INSTRUMENTS.LOFI) synthRef.current.set({ oscillator: { type: "triangle" } });
    else if (name === INSTRUMENTS.EDM) synthRef.current.set({ oscillator: { type: "sawtooth" } });
  };

  return { isLoaded, playNote, stopNote, currentInstrument, setInstrument, volume, setVolume, INSTRUMENTS };
}
