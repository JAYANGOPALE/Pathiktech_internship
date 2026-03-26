import React, { useState, useRef } from 'react';
import { BookOpen, Upload, CheckCircle, XCircle, Loader2, X } from 'lucide-react';
import { uploadDictionary } from '../lib/api.js';
import { validateDictionaryFile, previewDictionaryFile } from '../utils/validation.js';

/**
 * Pronunciation dictionary upload area.
 * Validates, previews, uploads to backend, and returns dictionary_id to parent.
 */
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

    // Client-side validation
    const validationError = validateDictionaryFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setFileName(file.name);

    // Preview JSON structure
    const previewResult = await previewDictionaryFile(file);
    if (!previewResult.valid) {
      setError(`Invalid dictionary format: ${previewResult.error}`);
      return;
    }
    setPreview(previewResult);

    // Upload to backend
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
    // Reset input so same file can be re-selected
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function clearDictionary() {
    setPreview(null);
    setFileName(null);
    setError(null);
    onDictionaryUploaded(null);
  }

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium text-white/70">
        <BookOpen size={14} className="text-gold-400" />
        Pronunciation Dictionary
        <span className="text-xs text-white/25 font-normal">(optional)</span>
      </label>

      {/* Uploaded state */}
      {dictionaryId && !isUploading ? (
        <div className="flex items-center justify-between rounded-xl border border-jade-400/30 bg-jade-400/5 px-4 py-3">
          <div className="flex items-center gap-3">
            <CheckCircle size={16} className="text-jade-400 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-jade-400">Dictionary active</p>
              {fileName && (
                <p className="text-xs text-white/30 mt-0.5 font-mono truncate max-w-[200px]">
                  {fileName}
                </p>
              )}
              {preview && (
                <p className="text-xs text-white/25 mt-0.5">
                  {preview.wordCount} words · {preview.languages.join(', ')}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={clearDictionary}
            disabled={disabled}
            className="text-white/30 hover:text-white/60 transition-colors p-1 rounded"
            title="Remove dictionary"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        /* Drop zone */
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => !disabled && !isUploading && fileInputRef.current?.click()}
          className={`
            relative rounded-xl border-2 border-dashed px-5 py-5 text-center
            transition-all duration-200 cursor-pointer
            ${isDragging
              ? 'border-gold-400/60 bg-gold-400/10'
              : 'border-white/10 bg-ink-800/30 hover:border-white/20 hover:bg-ink-800/50'
            }
            ${disabled || isUploading ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleInputChange}
            className="hidden"
            disabled={disabled || isUploading}
          />

          {isUploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 size={20} className="text-gold-400 animate-spin" />
              <p className="text-sm text-white/50">Uploading dictionary…</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload size={18} className="text-white/30" />
              <p className="text-sm text-white/50">
                Drop a <span className="text-white/70 font-mono">.json</span> file or{' '}
                <span className="text-gold-400/80 underline underline-offset-2">browse</span>
              </p>
              <p className="text-xs text-white/20">Max 1 MB · Sarvam format</p>
            </div>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-3 py-2">
          <XCircle size={14} className="text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}

      {/* Format hint */}
      {!dictionaryId && !error && (
        <p className="text-xs text-white/20 font-mono leading-relaxed">
          {'{ "pronunciations": { "hi-IN": { "word": "phonetic" } } }'}
        </p>
      )}
    </div>
  );
}
