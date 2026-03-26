const axios = require('axios');
const FormData = require('form-data');

const SARVAM_BASE_URL = 'https://api.sarvam.ai';

/**
 * Returns the default Axios headers for Sarvam API authentication.
 */
function getSarvamHeaders(extra = {}) {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error('SARVAM_API_KEY is not set in environment variables');
  }
  return {
    'api-subscription-key': apiKey,
    ...extra,
  };
}

/**
 * Streams TTS audio from Sarvam AI's bulbul:v3 model.
 * Calls onChunk for each binary chunk received, then resolves when done.
 *
 * @param {Object} options
 * @param {string} options.text         - Text to convert to speech
 * @param {string} options.speaker      - 'shubh' or 'simran'
 * @param {string|null} options.dictId  - Optional pronunciation dictionary ID
 * @param {string} options.languageCode - Target language code (default: 'hi-IN')
 * @param {Function} options.onChunk    - Callback for each binary audio chunk (Buffer)
 */
async function streamTTS({ text, speaker, dictId, languageCode = 'hi-IN', onChunk }) {
  const requestBody = {
    text,
    target_language_code: languageCode,
    speaker,
    model: 'bulbul:v3',
    output_audio_codec: 'mp3',
  };

  // Include dictionary ID if provided
  if (dictId) {
    requestBody.dict_id = dictId;
  }

  const response = await axios.post(
    `${SARVAM_BASE_URL}/text-to-speech/stream`,
    requestBody,
    {
      headers: getSarvamHeaders({ 'Content-Type': 'application/json' }),
      responseType: 'stream', // Important: get a readable stream
      timeout: 30000, // 30-second timeout
    }
  );

  // Stream the response data chunk by chunk
  return new Promise((resolve, reject) => {
    response.data.on('data', (chunk) => {
      onChunk(chunk);
    });

    response.data.on('end', () => {
      resolve();
    });

    response.data.on('error', (err) => {
      reject(new Error(`Sarvam stream error: ${err.message}`));
    });
  });
}

/**
 * Uploads a pronunciation dictionary JSON file to Sarvam AI.
 * Returns the dictionary_id string from Sarvam's response.
 *
 * @param {Buffer} fileBuffer   - Raw file contents
 * @param {string} filename     - Original file name
 * @returns {Promise<string>}   - The dictionary_id
 */
async function uploadPronunciationDictionary(fileBuffer, filename) {
  const formData = new FormData();
  formData.append('file', fileBuffer, {
    filename: filename || 'dictionary.json',
    contentType: 'application/json',
  });

  const response = await axios.post(
    `${SARVAM_BASE_URL}/pronunciation-dictionary/create`,
    formData,
    {
      headers: {
        ...getSarvamHeaders(),
        ...formData.getHeaders(),
      },
      timeout: 15000,
    }
  );

  const { dictionary_id } = response.data;
  if (!dictionary_id) {
    throw new Error('Sarvam API did not return a dictionary_id');
  }

  return dictionary_id;
}

module.exports = { streamTTS, uploadPronunciationDictionary };
