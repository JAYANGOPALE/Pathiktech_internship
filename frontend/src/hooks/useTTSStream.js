import { useState, useRef, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/tts-stream';

/**
 * Custom hook for TTS WebSocket streaming.
 * Manages connection lifecycle, chunk accumulation, and audio blob creation.
 */
export function useTTSStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0); // rough chunk count for UI

  const wsRef = useRef(null);
  const chunksRef = useRef([]);
  const prevAudioUrlRef = useRef(null);
  // Track streaming state in a ref to avoid stale closures in WS callbacks
  const isStreamingRef = useRef(false);

  /**
   * Start streaming TTS audio.
   * @param {Object} params
   * @param {string} params.text        - Text to convert
   * @param {string} params.speaker     - 'shubh' or 'simran'
   * @param {string|null} params.dictId - Optional dictionary ID
   * @param {string} params.languageCode - Language code (default: 'hi-IN')
   */
  const startStream = useCallback(({ text, speaker, dictId = null, languageCode = 'hi-IN' }) => {
    // Clean up any existing connection
    if (wsRef.current) {
      wsRef.current.close();
    }

    // Revoke previous audio URL to free memory
    if (prevAudioUrlRef.current) {
      URL.revokeObjectURL(prevAudioUrlRef.current);
    }

    isStreamingRef.current = true;
    setIsStreaming(true);
    setAudioUrl(null);
    setError(null);
    setProgress(0);
    chunksRef.current = [];

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;

    // Set binary type to ArrayBuffer for audio chunks
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      // Send the TTS request parameters as JSON
      ws.send(JSON.stringify({ text, speaker, dictId, languageCode }));
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Binary data = audio chunk
        chunksRef.current.push(new Uint8Array(event.data));
        setProgress((p) => p + 1);
      } else {
        // JSON control message
        try {
          const message = JSON.parse(event.data);

          if (message.done) {
            // All chunks received — assemble MP3 Blob
            const totalLength = chunksRef.current.reduce((acc, c) => acc + c.length, 0);
            const combined = new Uint8Array(totalLength);
            let offset = 0;
            for (const chunk of chunksRef.current) {
              combined.set(chunk, offset);
              offset += chunk.length;
            }

            const blob = new Blob([combined], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            prevAudioUrlRef.current = url;
            setAudioUrl(url);
            isStreamingRef.current = false;
            setIsStreaming(false);
          } else if (message.error) {
            setError(message.error);
            isStreamingRef.current = false;
            setIsStreaming(false);
          }
        } catch {
          // Ignore non-JSON messages
        }
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection failed. Is the backend running?');
      isStreamingRef.current = false;
      setIsStreaming(false);
    };

    ws.onclose = (event) => {
      // Use ref to check real streaming state — avoids stale closure on captured state
      if (!event.wasClean && isStreamingRef.current) {
        setError('Connection closed unexpectedly');
        isStreamingRef.current = false;
        setIsStreaming(false);
      }
    };
  }, []);

  /**
   * Cancel an in-progress stream.
   */
  const cancelStream = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    isStreamingRef.current = false;
    setIsStreaming(false);
    chunksRef.current = [];
  }, []);

  return { isStreaming, audioUrl, error, progress, startStream, cancelStream };
}
