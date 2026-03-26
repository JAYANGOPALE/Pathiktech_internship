const request = require('supertest');

// Mock the sarvam service so tests don't make real API calls
jest.mock('../services/sarvamService', () => ({
  streamTTS: jest.fn(),
  uploadPronunciationDictionary: jest.fn().mockResolvedValue('test-dict-id-123'),
}));

// Mock the WebSocket setup so no WS server is created during tests
jest.mock('../websocket', () => ({
  setupWebSocket: jest.fn(),
}));

const { app } = require('../server');

describe('GET /health', () => {
  it('returns 200 with status ok', async () => {
    const res = await request(app).get('/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('POST /api/dictionary', () => {
  it('rejects requests with no file', async () => {
    const res = await request(app).post('/api/dictionary');
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBeDefined();
  });

  it('rejects invalid JSON files', async () => {
    const res = await request(app)
      .post('/api/dictionary')
      .attach('file', Buffer.from('not valid json'), {
        filename: 'dict.json',
        contentType: 'application/json',
      });
    expect(res.statusCode).toBe(400);
  });

  it('rejects JSON without pronunciations key', async () => {
    const badDict = JSON.stringify({ words: {} });
    const res = await request(app)
      .post('/api/dictionary')
      .attach('file', Buffer.from(badDict), {
        filename: 'dict.json',
        contentType: 'application/json',
      });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/pronunciations/);
  });

  it('accepts valid dictionary and returns dictionary_id', async () => {
    const validDict = JSON.stringify({
      pronunciations: {
        'hi-IN': { 'test': 't-e-s-t' },
      },
    });
    const res = await request(app)
      .post('/api/dictionary')
      .attach('file', Buffer.from(validDict), {
        filename: 'dict.json',
        contentType: 'application/json',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body.dictionary_id).toBe('test-dict-id-123');
  });
});
