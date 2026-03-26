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

      // Parse the incoming JSON message
      try {
        params = JSON.parse(data.toString());
      } catch (err) {
        ws.send(JSON.stringify({ error: 'Invalid JSON message format' }));
        return;
      }

      const { text, speaker, dictId, languageCode } = params;

      // Basic validation
      if (!text || typeof text !== 'string' || text.trim().length === 0) {
        ws.send(JSON.stringify({ error: 'Text is required and must be non-empty' }));
        return;
      }

      if (!speaker || !['shubh', 'simran'].includes(speaker)) {
        ws.send(JSON.stringify({ error: 'Speaker must be "shubh" or "simran"' }));
        return;
      }

      console.log(`🎙️ Streaming TTS: speaker="${speaker}", dictId="${dictId || 'none'}", text length=${text.length}`);

      try {
        // Call Sarvam streaming API and forward chunks to the WebSocket client
        await streamTTS({
          text: text.trim(),
          speaker,
          dictId: dictId || null,
          languageCode: languageCode || 'hi-IN',
          onChunk: (chunk) => {
            // Forward binary audio chunk to client if connection is still open
            if (ws.readyState === WebSocket.OPEN) {
              ws.send(chunk);
            }
          },
        });

        // Signal completion
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ done: true }));
          console.log('✅ TTS stream complete');
        }
      } catch (err) {
        console.error('❌ TTS streaming error:', err.message);
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ error: err.message || 'TTS streaming failed' }));
        }
      }
    });

    ws.on('close', () => {
      console.log('🔌 WebSocket client disconnected');
    });

    ws.on('error', (err) => {
      console.error('⚠️ WebSocket error:', err.message);
    });
  });

  console.log('✅ WebSocket server initialized at /tts-stream');
}

module.exports = { setupWebSocket };
