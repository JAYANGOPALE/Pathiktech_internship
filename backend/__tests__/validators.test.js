const { validateDictionaryJSON } = require('../utils/validators');

describe('validateDictionaryJSON', () => {
  test('returns null for valid dictionary', () => {
    const dict = {
      pronunciations: {
        'hi-IN': { 'नमस्ते': 'n-uh-m-uh-s-t-e' },
      },
    };
    expect(validateDictionaryJSON(dict)).toBeNull();
  });

  test('returns error for non-object input', () => {
    expect(validateDictionaryJSON('not an object')).toBeTruthy();
    expect(validateDictionaryJSON(null)).toBeTruthy();
    expect(validateDictionaryJSON(42)).toBeTruthy();
  });

  test('returns error when pronunciations key is missing', () => {
    expect(validateDictionaryJSON({})).toMatch(/pronunciations/);
  });

  test('returns error when pronunciations is an array', () => {
    expect(validateDictionaryJSON({ pronunciations: [] })).toBeTruthy();
  });

  test('returns error when pronunciations is empty', () => {
    expect(validateDictionaryJSON({ pronunciations: {} })).toMatch(/at least one/);
  });

  test('returns error when language entry is not an object', () => {
    const dict = { pronunciations: { 'hi-IN': 'invalid' } };
    expect(validateDictionaryJSON(dict)).toBeTruthy();
  });

  test('accepts multiple language codes', () => {
    const dict = {
      pronunciations: {
        'hi-IN': { word1: 'phonetic1' },
        'en-IN': { word2: 'phonetic2' },
      },
    };
    expect(validateDictionaryJSON(dict)).toBeNull();
  });
});
