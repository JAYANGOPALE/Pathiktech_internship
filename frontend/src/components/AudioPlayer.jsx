import React, { useRef, useState, useEffect } from 'react';
import { formatDuration } from '../utils/audioHelpers.js';

export default function AudioPlayer({ audioUrl, isStreaming, progress }) {
  const audioRef = useRef(null);
  const trackRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (audioUrl && audioRef.current) {
      setCurrentTime(0); setDuration(0); setIsPlaying(false);
      audioRef.current.load();
      audioRef.current.play().catch(() => {});
    }
  }, [audioUrl]);

  function togglePlayPause() {
    if (!audioRef.current) return;
    if (isPlaying) audioRef.current.pause();
    else audioRef.current.play();
  }

  function handleTrackClick(e) {
    if (!audioRef.current || !duration) return;
    const rect = trackRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    audioRef.current.currentTime = ratio * duration;
  }

  const pct = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div>
      <label className="label-indian">
        <span style={{ fontSize: '16px' }}>🔊</span>
        <span>Audio Output  <span className="font-devanagari font-normal" style={{ color: '#d97706', fontSize: '13px' }}>· ध्वनि</span></span>
      </label>

      <div className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.6)', border: '1.5px solid rgba(217,119,6,0.15)' }}>
        {/* Streaming animation */}
        {isStreaming && (
          <div className="flex items-center gap-4 mb-4 pb-4" style={{ borderBottom: '1px solid rgba(217,119,6,0.1)' }}>
            <div className="flex items-end gap-1 h-8">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="wave-bar" style={{ height: '100%', animationDelay: `${i * 0.12}s` }} />
              ))}
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#9b2335' }}>
                ✨ Generating voice…
              </p>
              <p className="text-xs mt-0.5" style={{ color: '#a07860' }}>
                {progress} chunk{progress !== 1 ? 's' : ''} streamed
              </p>
            </div>
            {/* Mandala spinner */}
            <div className="ml-auto">
              <div className="mandala-ring w-8 h-8" style={{ borderTopColor: '#f59e0b', borderRightColor: '#9b2335', borderBottomColor: '#3730a3', borderLeftColor: 'transparent' }} />
            </div>
          </div>
        )}

        {audioUrl ? (
          <div className="space-y-3">
            <audio ref={audioRef} src={audioUrl}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
              onEnded={() => setIsPlaying(false)}
              onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
              onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
              className="hidden"
            />

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Play / Pause */}
              <button onClick={togglePlayPause}
                className="w-11 h-11 rounded-full flex items-center justify-center transition-all active:scale-90"
                style={{ background: 'linear-gradient(135deg, #f59e0b, #9b2335)', boxShadow: '0 4px 14px rgba(245,158,11,0.35)', color: 'white', fontSize: '16px', flexShrink: 0 }}>
                {isPlaying ? '⏸' : '▶️'}
              </button>

              {/* Progress track */}
              <div className="flex-1 space-y-1">
                <div ref={trackRef} onClick={handleTrackClick} className="audio-track">
                  <div className="audio-fill" style={{ width: `${pct}%` }} />
                </div>
                <div className="flex justify-between text-xs font-mono" style={{ color: '#a07860' }}>
                  <span>{formatDuration(currentTime)}</span>
                  <span>{formatDuration(duration)}</span>
                </div>
              </div>
            </div>
          </div>
        ) : !isStreaming && (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-3"
              style={{ background: 'rgba(245,158,11,0.08)', border: '1.5px solid rgba(217,119,6,0.15)' }}>
              <span style={{ fontSize: '24px', opacity: 0.4 }}>🎶</span>
            </div>
            <p className="text-sm" style={{ color: '#a07860' }}>Audio will appear here</p>
            <p className="font-devanagari text-xs mt-1" style={{ color: '#c4a882' }}>
              यहाँ ध्वनि प्रकट होगी
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
