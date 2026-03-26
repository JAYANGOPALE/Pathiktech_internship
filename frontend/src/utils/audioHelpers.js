/**
 * Triggers a download of a blob as an MP3 file.
 * @param {string} url - Object URL of the audio blob
 * @param {string} filename - Desired filename (without extension)
 */
export function downloadAudioBlob(url, filename = 'speech') {
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = `${filename}.mp3`;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
}

/**
 * Formats seconds into mm:ss display string.
 * @param {number} seconds
 * @returns {string}
 */
export function formatDuration(seconds) {
  if (!seconds || isNaN(seconds)) return '0:00';
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}
