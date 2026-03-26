require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const { setupWebSocket } = require('./websocket');
const dictionaryRoutes = require('./routes/dictionary');
const errorHandler = require('./middleware/errorHandler');

const app = express();
const server = http.createServer(app);

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/dictionary', dictionaryRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'Pathikatech TTS Backend' });
});

// Error handler (must be last)
app.use(errorHandler);

// Setup WebSocket on same HTTP server
setupWebSocket(server);

// Only start listening when run directly (not when required by tests)
if (require.main === module) {
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => {
    console.log(`✅ Pathikatech TTS Backend running on http://localhost:${PORT}`);
    console.log(`🔌 WebSocket endpoint: ws://localhost:${PORT}/tts-stream`);
  });
}

module.exports = { app, server };
