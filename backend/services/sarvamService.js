const axios = require('axios');
const FormData = require('form-data');

const SARVAM_BASE_URL = 'https://api.sarvam.ai';

function getSarvamHeaders(extra = {}) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) throw new Error('SARVAM_API_KEY is not set in environment variables');
  return { 'api-subscription-key': apiKey, ...extra };
}

/**
 * Streams TTS audio from Sarvam AI bulbul:v3.
 * Endpoint: POST /text-to-speech/stream
 */
async function streamTTS({ text, speaker, dictId, languageCode = 'hi-IN', pace = 1.0, onChunk }) {
  const requestBody = {
    text,
    target_language_code: languageCode,
    speaker: speaker.toLowerCase(),
    model: 'bulbul:v3',
    output_audio_codec: 'mp3',
    pace: parseFloat(pace) || 1.0,
  };

  if (dictId) requestBody.dict_id = dictId;

  let response;
  try {
    response = await axios.post(
      `${SARVAM_BASE_URL}/text-to-speech/stream`,
      requestBody,
      {
        headers: getSarvamHeaders({ 'Content-Type': 'application/json' }),
        responseType: 'stream',
        timeout: 60000,
      }
    );
  } catch (err) {
    if (err.response) {
      const status = err.response.status;
      let message = `Sarvam API error (${status})`;
      try {
        const chunks = [];
        for await (const chunk of err.response.data) chunks.push(chunk);
        const body = JSON.parse(Buffer.concat(chunks).toString());
        message = body?.error || body?.message || body?.detail || message;
      } catch {}
      throw new Error(message);
    }
    throw err;
  }

  return new Promise((resolve, reject) => {
    response.data.on('data', (chunk) => onChunk(chunk));
    response.data.on('end', resolve);
    response.data.on('error', (err) => reject(new Error(`Stream error: ${err.message}`)));
  });
}

/**
 * Uploads a pronunciation dictionary to Sarvam AI.
 * CORRECT endpoint: POST /pronunciation-dictionary
 * NOTE: /pronunciation-dictionary/create returns 404 — do NOT use that path.
 */
async function uploadPronunciationDictionary(fileBuffer, filename) {
  const formData = new FormData();
  formData.append('file', fileBuffer, {
    filename: filename || 'dictionary.json',
    contentType: 'application/json',
  });

  let response;
  try {
    response = await axios.post(
      `${SARVAM_BASE_URL}/pronunciation-dictionary`,
      formData,
      {
        headers: { ...getSarvamHeaders(), ...formData.getHeaders() },
        timeout: 20000,
      }
    );
  } catch (err) {
    if (err.response) {
      const data = err.response.data;
      const message = data?.error || data?.message || data?.detail || `Sarvam API error (${err.response.status})`;
      throw new Error(message);
    }
    throw err;
  }

  const dictionaryId = response.data?.dictionary_id || response.data?.id;
  if (!dictionaryId) {
    throw new Error('Sarvam API did not return a dictionary_id. Response: ' + JSON.stringify(response.data));
  }
  return dictionaryId;
}

module.exports = { streamTTS, uploadPronunciationDictionary };
