const { validateDictionaryJSON } = require('../utils/validators');
const { uploadPronunciationDictionary } = require('../services/sarvamService');

/**
 * POST /api/dictionary
 * Accepts a JSON file upload, validates it, uploads to Sarvam, returns dictionary_id.
 */
async function uploadDictionary(req, res, next) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded. Please upload a .json file.' });
    }

    // Parse and validate JSON content
    let parsedDict;
    try {
      parsedDict = JSON.parse(req.file.buffer.toString('utf-8'));
    } catch {
      return res.status(400).json({ error: 'Invalid JSON file. Could not parse file contents.' });
    }

    const validationError = validateDictionaryJSON(parsedDict);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    // Upload to Sarvam AI
    const dictionaryId = await uploadPronunciationDictionary(
      req.file.buffer,
      req.file.originalname
    );

    console.log(`✅ Dictionary uploaded successfully: ${dictionaryId}`);

    return res.status(200).json({
      dictionary_id: dictionaryId,
      message: 'Pronunciation dictionary uploaded successfully',
    });
  } catch (err) {
    console.error('❌ Dictionary upload error:', err.message);

    // Handle Sarvam API errors
    if (err.response) {
      const status = err.response.status;
      const message = err.response.data?.message || 'Sarvam API error';
      return res.status(status).json({ error: message });
    }

    next(err);
  }
}

module.exports = { uploadDictionary };
