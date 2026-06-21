const WebSocket = require('ws');
const { streamTTS } = require('./services/sarvamService');

/**
 * Sets up the WebSocket server on the given HTTP server instance.
 * Handles /tts-stream path for TTS audio streaming from Sarvam AI.
 */
function setupWebSocket(server) {
  const wss = new WebSocket.Server({ server, path: '/tts-stream' });

  wss.on('connection', (ws, req) => {
    console.log(`🔗 WebSocket client connected from ${req.socket.remoteAddress}`);

    ws.on('message', async (data) => {
      let params;
      try {
        params = JSON.parse(data.toString());
      } catch {
        ws.send(JSON.stringify({ error: 'Invalid JSON message format' }));
        return;
      }

      const { text, speaker, dictId, languageCode, pace } = params;

      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        ws.send(JSON.stringify({ error: 'Text is required and must be non-empty' }));
        return;
      }

      const validSpeakers = ['shubh', 'simran', 'ritu', 'aditya', 'priya', 'neha', 'rahul',
        'pooja', 'rohan', 'kavya', 'amit', 'dev', 'ishita', 'shreya', 'ratan', 'varun'];
      if (!speaker || !validSpeakers.includes(speaker.toLowerCase())) {
        ws.send(JSON.stringify({ error: `Invalid speaker. Must be one of: ${validSpeakers.join(', ')}` }));
        return;
      }

      console.log(`🎙️ TTS stream: speaker="${speaker}", lang="${languageCode||'hi-IN'}", dictId="${dictId||'none'}", pace=${pace||1.0}, chars=${text.length}`);

      try {
        await streamTTS({
          text: text.trim(),
          speaker,
          dictId: dictId || null,
          languageCode: languageCode || 'hi-IN',
          pace: pace || 1.0,
          onChunk: (chunk) => {
            if (ws.readyState === WebSocket.OPEN) ws.send(chunk);
          },
        });

        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ done: true }));
          console.log('✅ TTS stream complete');
        }
      } catch (err) {
        console.error('❌ TTS stream error:', err.message);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ error: err.message || 'TTS streaming failed' }));
        }
      }
    });

    ws.on('close', () => console.log('🔌 WebSocket client disconnected'));
    ws.on('error', (err) => console.error('⚠️ WebSocket error:', err.message));
  });

  console.log('✅ WebSocket server initialized at /tts-stream');
}

module.exports = { setupWebSocket };
