import React from 'react';
import { Download } from 'lucide-react';
import { downloadAudioBlob } from '../utils/audioHelpers.js';

/**
 * Download button for saving the generated MP3.
 * Disabled until audio is ready.
 */
export default function DownloadButton({ audioUrl, disabled }) {
  function handleDownload() {
    if (!audioUrl) return;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/[T:]/g, '-');
    downloadAudioBlob(audioUrl, `pathikatech-tts-${timestamp}`);
  }

  return (
    <button
      onClick={handleDownload}
      disabled={disabled || !audioUrl}
      className="btn-secondary flex items-center gap-2 w-full justify-center"
      title={!audioUrl ? 'Generate audio first' : 'Download MP3'}
    >
      <Download size={15} />
      <span>Download MP3</span>
    </button>
  );
}
