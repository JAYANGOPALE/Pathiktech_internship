/**
 * Validates the structure of a pronunciation dictionary JSON.
 * Expected format per Sarvam AI docs:
 * {
 *   "pronunciations": {
 *     "hi-IN": { "word": "phonetic_pronunciation", ... },
 *     "en-IN": { ... }
 *   }
 * }
 *
 * @param {Object} json - Parsed JSON object
 * @returns {string|null} - Error message, or null if valid
 */
function validateDictionaryJSON(json) {
  if (typeof json !== 'object' || json === null) {
    return 'Dictionary must be a JSON object';
  }

  if (!json.pronunciations) {
    return 'Dictionary must contain a "pronunciations" key';
  }

  if (typeof json.pronunciations !== 'object' || Array.isArray(json.pronunciations)) {
    return '"pronunciations" must be an object with language-code keys';
  }

  const languageCodes = Object.keys(json.pronunciations);
  if (languageCodes.length === 0) {
    return '"pronunciations" must contain at least one language code (e.g., "hi-IN")';
  }

  // Validate each language block
  for (const langCode of languageCodes) {
    const entries = json.pronunciations[langCode];
    if (typeof entries !== 'object' || Array.isArray(entries)) {
      return `"pronunciations.${langCode}" must be an object mapping words to pronunciations`;
    }
  }

  return null; // Valid
}

module.exports = { validateDictionaryJSON };
