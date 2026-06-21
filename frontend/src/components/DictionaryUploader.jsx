import React, { useState, useRef } from 'react';
import { uploadDictionary } from '../lib/api.js';
import { validateDictionaryFile, previewDictionaryFile } from '../utils/validation.js';

export default function DictionaryUploader({ dictionaryId, onDictionaryUploaded, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [fileName, setFileName] = useState(null);
  const fileInputRef = useRef(null);

  async function handleFile(file) {
    setError(null);
    setPreview(null);

    const valErr = validateDictionaryFile(file);
    if (valErr) { setError(valErr); return; }

    setFileName(file.name);

    const prev = await previewDictionaryFile(file);
    if (!prev.valid) { setError(`Invalid format: ${prev.error}`); return; }
    setPreview(prev);

    setIsUploading(true);
    try {
      const result = await uploadDictionary(file);
      onDictionaryUploaded(result.dictionary_id);
    } catch (err) {
      setError(err.message || 'Upload failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  }

  function handleInputChange(e) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function clear() {
    setPreview(null); setFileName(null); setError(null);
    onDictionaryUploaded(null);
  }

  return (
    <div>
      <label className="label-indian">
        <span style={{ fontSize: '16px' }}>📖</span>
        <span>Pronunciation Dictionary</span>
        <span className="font-normal text-xs" style={{ color: '#c4a882' }}>(optional)</span>
      </label>

      {dictionaryId && !isUploading ? (
        /* Active state */
        <div className="flex items-center justify-between rounded-xl px-4 py-3"
          style={{ background: 'rgba(5,150,105,0.06)', border: '1.5px solid rgba(5,150,105,0.25)' }}>
          <div className="flex items-center gap-3">
            <span style={{ fontSize: '18px' }}>✅</span>
            <div>
              <p className="text-sm font-semibold" style={{ color: '#047857' }}>Dictionary active</p>
              {fileName && <p className="text-xs font-mono mt-0.5" style={{ color: '#a07860' }}>{fileName}</p>}
              {preview && (
                <p className="text-xs mt-0.5" style={{ color: '#a07860' }}>
                  {preview.wordCount} words · {preview.languages.join(', ')}
                </p>
              )}
            </div>
          </div>
          <button onClick={clear} disabled={disabled}
            className="text-xs px-3 py-1 rounded-lg transition-colors"
            style={{ color: '#9b2335', border: '1px solid rgba(155,35,53,0.2)' }}>
            Remove
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className="rounded-xl px-5 py-5 text-center transition-all duration-200 cursor-pointer"
          style={{
            background: isDragging ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.5)',
            border: `2px dashed ${isDragging ? '#f59e0b' : 'rgba(155,35,53,0.15)'}`,
            opacity: disabled || isUploading ? 0.5 : 1,
            cursor: disabled || isUploading ? 'not-allowed' : 'pointer',
          }}
        >
          <input ref={fileInputRef} type="file" accept=".json,application/json"
            onChange={handleInputChange} className="hidden" disabled={disabled || isUploading} />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <div className="mandala-ring w-6 h-6" />
              <p className="text-sm" style={{ color: '#a07860' }}>Uploading dictionary…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <span style={{ fontSize: '24px' }}>📂</span>
              <p className="text-sm" style={{ color: '#a07860' }}>
                Drop <span className="font-mono font-semibold" style={{ color: '#7f1d2b' }}>.json</span> file or{' '}
                <span style={{ color: '#d97706', textDecoration: 'underline' }}>browse</span>
              </p>
              <p className="text-xs font-mono" style={{ color: '#c4a882' }}>
                {'{ "pronunciations": { "hi-IN": { ... } } }'}
              </p>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="flex items-start gap-2 rounded-xl px-3 py-2 mt-2"
          style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <span className="text-xs flex-shrink-0 mt-0.5">⚠️</span>
          <p className="text-xs" style={{ color: '#b91c1c' }}>{error}</p>
        </div>
      )}
    </div>
  );
}
