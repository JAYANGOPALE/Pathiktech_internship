import React from 'react';

const MAX_CHARS = 5000;

export default function TextInput({ value, onChange, disabled }) {
  const count = value.length;
  const nearLimit = count > MAX_CHARS * 0.85;
  const atLimit = count >= MAX_CHARS;

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="label-indian">
          <span style={{ fontSize: '16px' }}>🎵</span>
          <span>Your Text  <span className="font-devanagari font-normal" style={{ color: '#d97706', fontSize: '13px' }}>· पाठ</span></span>
        </label>
        <span className="text-xs font-mono" style={{ color: atLimit ? '#dc2626' : nearLimit ? '#d97706' : '#c4a882' }}>
          {count.toLocaleString()} / {MAX_CHARS.toLocaleString()}
        </span>
      </div>
      <div className="relative">
        <textarea
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={disabled}
          maxLength={MAX_CHARS}
          rows={6}
          placeholder="Enter your text here… let the voice of India bring it to life · यहाँ अपना पाठ लिखें…"
          className="input-indian leading-relaxed"
          spellCheck={false}
        />
        {/* Decorative corner */}
        <div className="absolute bottom-2 right-3 font-devanagari text-xs pointer-events-none select-none"
          style={{ color: '#d97706', opacity: 0.25 }}>
          ॐ
        </div>
      </div>
      <p className="text-xs mt-1.5" style={{ color: '#c4a882' }}>
        Supports Hindi, English, Hinglish · हिंदी, अंग्रेज़ी और मिश्रित भाषा
      </p>
    </div>
  );
}
