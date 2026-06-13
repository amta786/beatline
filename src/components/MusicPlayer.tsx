import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Play, Pause, Volume2, SkipForward, Sliders, X, Radio } from "lucide-react";

interface MusicPlayerProps {
  title: string;
  artist: string;
  bpm: number;
  melodyString: string;
  genre: string;
  onClose: () => void;
}

const NOTE_FREQS: Record<string, number> = {
  "E3": 164.81, "B3": 246.94,
  "C4": 261.63, "C#4": 277.18, "D4": 293.66, "D#4": 311.13, "E4": 329.63, "F4": 349.23, "F#4": 369.99, "G4": 392.00, "G#4": 415.30, "A4": 440.00, "A#4": 466.16, "B4": 493.88,
  "C5": 523.25, "D5": 587.33, "D#5": 622.25, "E5": 659.25, "F5": 698.46, "G5": 783.99
};

export default function MusicPlayer({
  title,
  artist,
  bpm,
  melodyString,
  genre,
  onClose
}: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [volume, setVolume] = useState(0.4);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [oscType, setOscType] = useState<OscillatorType>("sawtooth");
  const [currentNoteIndex, setCurrentNoteIndex] = useState(-1);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const volumeNodeRef = useRef<GainNode | null>(null);
  const playbackIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Parse notes from custom encoded patterns, e.g. "E4-0.5, G#4-0.5, B4-0.5"
  const notes = melodyString.split(",").map((s) => {
    const [note, durationStr] = s.trim().split("-");
    return {
      note,
      duration: parseFloat(durationStr) || 0.5,
    };
  });

  // Track state
  const notesRef = useRef(notes);
  notesRef.current = notes;

  const currentNoteIndexRef = useRef(currentNoteIndex);
  currentNoteIndexRef.current = currentNoteIndex;

  const oscTypeRef = useRef(oscType);
  oscTypeRef.current = oscType;

  // Initialize Audio
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      gainNode.connect(audioCtxRef.current.destination);
      volumeNodeRef.current = gainNode;
    }
    if (audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  };

  // Play a single procedural note with proper synthesizer filters
  const playNote = (noteName: string, duration: number) => {
    if (!audioCtxRef.current || !volumeNodeRef.current || !isPlaying) return;

    const freq = NOTE_FREQS[noteName];
    if (!freq) return; // Rest or invalid note

    const ctx = audioCtxRef.current;
    
    // Create dual-oscillator standard synth engine
    const osc = ctx.createOscillator();
    const filter = ctx.createBiquadFilter();

    osc.type = oscTypeRef.current;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Sub-oscillator for fat low end (1 octave down)
    const subOsc = ctx.createOscillator();
    subOsc.type = "triangle";
    subOsc.frequency.setValueAtTime(freq / 2, ctx.currentTime);

    // Dynamic Filter sweep configuration
    filter.type = "lowpass";
    const baseFreq = genre === "Hip-Hop" || genre === "Electronic" ? 400 : 1200;
    filter.frequency.setValueAtTime(baseFreq, ctx.currentTime);
    filter.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + duration);

    // Simple Amplitude ADSR Envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0, ctx.currentTime);
    noteGain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // Route audio blocks
    osc.connect(filter);
    subOsc.connect(filter);
    filter.connect(noteGain);
    noteGain.connect(volumeNodeRef.current);

    // Fire oscillators
    osc.start();
    subOsc.start();
    osc.stop(ctx.currentTime + duration);
    subOsc.stop(ctx.currentTime + duration);
  };

  // Main tick scheduler
  useEffect(() => {
    if (playbackIntervalRef.current) {
      clearInterval(playbackIntervalRef.current);
    }

    if (!isPlaying) return;

    // Map BPM to note duration ticks in milliseconds
    const tickDuration = (60 / bpm) * 1000 * playbackSpeed;

    const tick = () => {
      initAudio();
      const nextIndex = (currentNoteIndexRef.current + 1) % notesRef.current.length;
      setCurrentNoteIndex(nextIndex);

      const targetNote = notesRef.current[nextIndex];
      playNote(targetNote.note, targetNote.duration * (tickDuration / 1000) * 0.9);
    };

    // Fire first beat immediately
    tick();

    playbackIntervalRef.current = setInterval(tick, tickDuration);

    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
    };
  }, [isPlaying, melodyString, bpm, playbackSpeed]);

  // Adjust volume
  useEffect(() => {
    if (volumeNodeRef.current && audioCtxRef.current) {
      volumeNodeRef.current.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
    }
  }, [volume]);

  // Visual oscillator canvas drawing simulation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let width = canvas.width;
    let height = canvas.height;
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Background mesh grid
      ctx.strokeStyle = "#e4e4e7"; // zinc-200
      ctx.lineWidth = 1;
      for (let i = 0; i < width; i += 20) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, height);
        ctx.stroke();
      }

      // Live waveform
      ctx.strokeStyle = "#dc2626"; // red-600
      ctx.lineWidth = 3;
      ctx.beginPath();

      const waveSpeed = isPlaying ? 0.15 : 0;
      phase += waveSpeed;

      const activeNoteStr = notes[currentNoteIndex]?.note || "Rest";
      const freqMultiplier = NOTE_FREQS[activeNoteStr] ? NOTE_FREQS[activeNoteStr] / 300 : 1.0;

      for (let x = 0; x < width; x++) {
        // Compose rich multi-tonal curves
        const wave1 = Math.sin(x * 0.04 * freqMultiplier + phase) * 18;
        const wave2 = Math.cos(x * 0.08 * freqMultiplier - phase * 0.5) * 8;
        const wave3 = Math.sin(x * 0.12 * freqMultiplier + phase * 2.0) * 4;
        
        const y = height / 2 + (wave1 + wave2 + wave3) * (isPlaying ? 1 : 0.15);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();

      animationFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPlaying, currentNoteIndex, notes]);

  // Cleanup synthesizer audio resources on unmount
  useEffect(() => {
    return () => {
      if (playbackIntervalRef.current) {
        clearInterval(playbackIntervalRef.current);
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  return (
    <div id="beatline-synth-player" className="fixed bottom-6 right-6 z-50 bg-black text-white w-96 border-4 border-black shadow-2xl p-4 select-none">
      <div className="flex justify-between items-center border-b border-zinc-800 pb-2 mb-4">
        <div className="flex items-center gap-1.5 text-[10px] font-mono tracking-widest text-red-500 font-extrabold uppercase">
          <Radio className="w-4 h-4 text-red-500 animate-pulse animate-duration-1000" />
          SYNTH SOUND BOOTH
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex gap-4 mb-4">
        {/* Playback Controls & Wave Visualizer */}
        <div className="flex-1 min-w-0">
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 block">CURRENT CHART ENTRY</span>
          <h4 className="text-sm font-extrabold tracking-tight truncate uppercase text-white mt-0.5">{title}</h4>
          <p className="text-xs text-zinc-400 font-mono italic truncate">{artist}</p>

          <div className="mt-2 bg-zinc-900 border border-zinc-800 rounded-sm p-1.5">
            <canvas
              ref={canvasRef}
              width={220}
              height={50}
              className="w-full bg-zinc-900"
            />
          </div>
        </div>

        {/* Synthesizer Control Panel shortcuts */}
        <div className="w-24 shrink-0 flex flex-col gap-1.5 border-l border-zinc-800 pl-3">
          <span className="text-[8px] font-mono tracking-widest text-zinc-500 uppercase">OSCILLATOR</span>
          {["sawtooth", "triangle", "sine"].map((type) => (
            <button
              key={type}
              onClick={() => setOscType(type as OscillatorType)}
              className={`text-[9px] font-mono py-1 rounded text-left px-1.5 uppercase tracking-wider font-bold transition-colors cursor-pointer ${
                oscType === type ? "bg-red-600 text-white" : "bg-zinc-900 text-zinc-400 hover:bg-neutral-800"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* BPM Dial and Volume slider row */}
      <div className="grid grid-cols-2 gap-4 border-t border-zinc-900 pt-3 mb-4 text-xs font-mono">
        <div>
          <span className="text-[10px] text-zinc-500 block mb-1">TEMPO (BPM)</span>
          <span className="text-sm font-black text-white">{bpm} BPM</span>
        </div>
        <div>
          <span className="text-[10px] text-zinc-500 block mb-1">GENRE PROFILE</span>
          <span className="text-xs font-extrabold text-red-500 uppercase">{genre}</span>
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-zinc-900 pt-3 text-xs font-mono text-zinc-400">
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              initAudio();
              setIsPlaying(!isPlaying);
            }}
            className="w-10 h-10 rounded-full bg-red-600 text-white border border-red-500 hover:bg-red-700 transition-colors flex items-center justify-center cursor-pointer"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>
          <span className="text-[10px] uppercase font-bold tracking-wider">
            {isPlaying ? "Playing synth" : "Paused"}
          </span>
        </div>

        {/* Volume controls */}
        <div className="flex items-center gap-2">
          <Volume2 className="w-4 h-4 text-zinc-400" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-red-600 cursor-pointer h-1 bg-zinc-800 rounded-lg appearance-none"
          />
        </div>
      </div>
    </div>
  );
}
