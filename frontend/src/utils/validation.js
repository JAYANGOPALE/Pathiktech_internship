/**
 * Validates a text string for TTS input.
 * @param {string} text
 * @returns {string|null} Error message or null if valid
 */
export function validateText(text) {
  if (!text || text.trim().length === 0) {
    return 'Please enter some text to convert to speech.';
  }
  if (text.trim().length < 2) {
    return 'Text must be at least 2 characters long.';
  }
  if (text.length > 5000) {
    return 'Text must be under 5,000 characters. Please split into smaller segments.';
  }
  return null;
}

/**
 * Validates a file for pronunciation dictionary upload.
 * @param {File} file
 * @returns {string|null} Error message or null if valid
 */
export function validateDictionaryFile(file) {
  if (!file) return 'No file selected.';

  const MAX_SIZE = 1 * 1024 * 1024; // 1 MB
  if (file.size > MAX_SIZE) {
    return 'File size exceeds 1 MB limit.';
  }

  if (!file.name.endsWith('.json') && file.type !== 'application/json') {
    return 'Only .json files are accepted.';
  }

  return null;
}

/**
 * Parses and previews a dictionary JSON file's content.
 * @param {File} file
 * @returns {Promise<{ valid: boolean, wordCount: number, languages: string[], error?: string }>}
 */
export async function previewDictionaryFile(file) {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target.result);
        if (!json.pronunciations || typeof json.pronunciations !== 'object') {
          resolve({ valid: false, error: 'Missing "pronunciations" key' });
          return;
        }
        const languages = Object.keys(json.pronunciations);
        const wordCount = languages.reduce((acc, lang) => {
          return acc + Object.keys(json.pronunciations[lang] || {}).length;
        }, 0);
        resolve({ valid: true, wordCount, languages });
      } catch {
        resolve({ valid: false, error: 'Invalid JSON format' });
      }
    };
    reader.onerror = () => resolve({ valid: false, error: 'Failed to read file' });
    reader.readAsText(file);
  });
}
