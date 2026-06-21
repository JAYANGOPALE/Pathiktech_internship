import React from 'react';
import { downloadAudioBlob } from '../utils/audioHelpers.js';

export default function DownloadButton({ audioUrl, disabled }) {
  function handleDownload() {
    if (!audioUrl) return;
    const ts = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    downloadAudioBlob(audioUrl, `pathikatech-tts-${ts}`);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !audioUrl}
      className="btn-outline-gold w-full flex items-center justify-center gap-2"
      title={!audioUrl ? 'Generate audio first' : 'Download as MP3'}
    >
      <span style={{ fontSize: '16px' }}>⬇️</span>
      <span>Download MP3</span>
      <span className="font-devanagari text-xs" style={{ color: '#d97706', opacity: 0.7 }}>· डाउनलोड</span>
    </button>
  );
}
