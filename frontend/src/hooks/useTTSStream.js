import { useState, useRef, useCallback } from 'react';

const WS_URL = import.meta.env.VITE_WS_URL || 'ws://localhost:3000/tts-stream';

/**
 * Custom hook for TTS WebSocket streaming.
 * Accumulates binary audio chunks and assembles them into a single MP3 Blob on completion.
 */
export function useTTSStream() {
  const [isStreaming, setIsStreaming] = useState(false);
  const [audioUrl, setAudioUrl] = useState(null);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);

  const wsRef = useRef(null);
  const chunksRef = useRef([]);
  const prevUrlRef = useRef(null);
  // Use a ref to track streaming state in WS callbacks (avoids stale closure)
  const isStreamingRef = useRef(false);

  const startStream = useCallback(({ text, speaker, dictId = null, languageCode = 'hi-IN', pace = 1.0 }) => {
    // Close existing connection
    if (wsRef.current) wsRef.current.close();

    // Free old audio URL
    if (prevUrlRef.current) URL.revokeObjectURL(prevUrlRef.current);

    isStreamingRef.current = true;
    setIsStreaming(true);
    setAudioUrl(null);
    setError(null);
    setProgress(0);
    chunksRef.current = [];

    const ws = new WebSocket(WS_URL);
    wsRef.current = ws;
    ws.binaryType = 'arraybuffer';

    ws.onopen = () => {
      ws.send(JSON.stringify({ text, speaker, dictId, languageCode, pace }));
    };

    ws.onmessage = (event) => {
      if (event.data instanceof ArrayBuffer) {
        // Binary chunk — accumulate
        chunksRef.current.push(new Uint8Array(event.data));
        setProgress(p => p + 1);
      } else {
        try {
          const msg = JSON.parse(event.data);
          if (msg.done) {
            // Assemble all chunks into one MP3 Blob
            const total = chunksRef.current.reduce((a, c) => a + c.length, 0);
            const buf = new Uint8Array(total);
            let offset = 0;
            for (const chunk of chunksRef.current) {
              buf.set(chunk, offset);
              offset += chunk.length;
            }
            const blob = new Blob([buf], { type: 'audio/mpeg' });
            const url = URL.createObjectURL(blob);
            prevUrlRef.current = url;
            setAudioUrl(url);
            isStreamingRef.current = false;
            setIsStreaming(false);
          } else if (msg.error) {
            setError(msg.error);
            isStreamingRef.current = false;
            setIsStreaming(false);
          }
        } catch {
          // ignore non-JSON frames
        }
      }
    };

    ws.onerror = () => {
      setError('WebSocket connection failed. Is the backend running on port 3000?');
      isStreamingRef.current = false;
      setIsStreaming(false);
    };

    ws.onclose = (event) => {
      if (!event.wasClean && isStreamingRef.current) {
        setError('Connection closed unexpectedly.');
        isStreamingRef.current = false;
        setIsStreaming(false);
      }
    };
  }, []);

  const cancelStream = useCallback(() => {
    if (wsRef.current) { wsRef.current.close(); wsRef.current = null; }
    isStreamingRef.current = false;
    setIsStreaming(false);
    chunksRef.current = [];
  }, []);

  return { isStreaming, audioUrl, error, progress, startStream, cancelStream };
}
