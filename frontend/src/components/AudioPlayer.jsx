import React, { useRef, useState, useEffect } from 'react';
import { Play, Pause, Volume2, Activity, Headphones, Music, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { formatDuration } from '../utils/audioHelpers.js';

export default function AudioPlayer({ audioUrl, isStreaming, progress }) {
  const audioRef = useRef(null);
  const progressBarRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(false);
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    isPlaying ? audioRef.current.pause() : audioRef.current.play();
  };

  const handleProgressClick = (e) => {
    if (!audioRef.current || !duration) return;
    const rect = progressBarRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  };

  const progressPercent = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <Headphones size={14} className="text-[var(--primary)]" /> 
          Vocal Performance
        </label>
        {isStreaming && (
          <div className="flex items-center gap-3 bg-[var(--bg-main)] px-4 py-1.5 rounded-full border border-[var(--primary)]/30 text-[var(--primary)] text-[10px] font-bold tracking-widest uppercase animate-pulse">
            <Activity size={12} />
            Neural Streaming Engine: {progress}
          </div>
        )}
      </div>

      <div className={`p-10 rounded-[2rem] border-2 transition-all duration-1000 relative overflow-hidden ${audioUrl ? 'border-[var(--primary)] bg-[var(--bg-main)] shadow-2xl' : 'border-[var(--border)] bg-[var(--bg-card)]'}`}>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Music size={120} />
        </div>

        {audioUrl ? (
          <div className="space-y-10 relative z-10">
            <audio
              ref={audioRef}
              src={audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              className="hidden"
            />

            <div className="flex items-center gap-10">
              <button
                onClick={togglePlayPause}
                className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[var(--primary)] to-[var(--primary-hover)] text-white dark:text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 shadow-2xl group"
              >
                {isPlaying ? <Pause size={36} fill="currentColor" /> : <Play size={36} className="ml-1" fill="currentColor" />}
              </button>

              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-end">
                  <div className="flex flex-col">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-[var(--text-muted)] mb-1">Session Duration</span>
                    <span className="font-display font-bold text-2xl text-[var(--primary)]">
                       {formatDuration(currentTime)} <span className="text-[var(--text-muted)]/30 text-lg mx-1">/</span> {formatDuration(duration)}
                    </span>
                  </div>
                  <Sparkles size={20} className="text-[var(--accent)] opacity-40" />
                </div>
                
                <div
                  ref={progressBarRef}
                  onClick={handleProgressClick}
                  className="h-2 bg-[var(--border)] rounded-full cursor-pointer relative group overflow-hidden"
                >
                  <motion.div
                    className="h-full bg-gradient-to-r from-[var(--accent)] to-[var(--primary)] rounded-full relative"
                    style={{ width: `${progressPercent}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  >
                    <div className="absolute top-0 right-0 h-full w-20 bg-white/20 blur-md translate-x-1/2" />
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 flex flex-col items-center justify-center text-center space-y-6 text-[var(--text-muted)]">
            <div className="w-20 h-20 rounded-full border-2 border-dashed border-[var(--border)] flex items-center justify-center animate-spin-slow">
              <Volume2 size={32} className="opacity-30" />
            </div>
            <div className="space-y-2">
              <p className="font-display font-bold text-2xl text-[var(--text-main)]">{isStreaming ? 'Synthesizing Audio Heritage' : 'Awaiting Vocal Composition'}</p>
              <p className="text-xs uppercase tracking-[0.3em] font-medium opacity-50">Neural Synthesis Ready</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
