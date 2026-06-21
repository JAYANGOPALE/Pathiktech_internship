import React from 'react';

const VOICES = [
  {
    id: 'shubh',
    label: 'Shubh',
    devanagari: 'शुभ',
    gender: 'Male',
    desc: 'Deep & authoritative',
    emoji: '🎙️',
    color: '#3730a3',
    bg: 'rgba(55,48,163,0.06)',
    border: 'rgba(55,48,163,0.2)',
  },
  {
    id: 'simran',
    label: 'Simran',
    devanagari: 'सिमरन',
    gender: 'Female',
    desc: 'Clear & expressive',
    emoji: '🎤',
    color: '#9b2335',
    bg: 'rgba(155,35,53,0.06)',
    border: 'rgba(155,35,53,0.2)',
  },
  {
    id: 'ritu',
    label: 'Ritu',
    devanagari: 'ऋतु',
    gender: 'Female',
    desc: 'Warm & melodious',
    emoji: '🪗',
    color: '#059669',
    bg: 'rgba(5,150,105,0.06)',
    border: 'rgba(5,150,105,0.2)',
  },
];

export default function VoiceSelector({ selected, onChange, disabled }) {
  return (
    <div>
      <label className="label-indian">
        <span style={{ fontSize: '16px' }}>🎭</span>
        <span>Voice  <span className="font-devanagari font-normal" style={{ color: '#d97706', fontSize: '13px' }}>· वक्ता</span></span>
      </label>
      <div className="grid grid-cols-3 gap-2">
        {VOICES.map(v => {
          const isSelected = selected === v.id;
          return (
            <button
              key={v.id}
              type="button"
              onClick={() => !disabled && onChange(v.id)}
              disabled={disabled}
              className="relative text-left rounded-xl p-3 transition-all duration-200 focus:outline-none"
              style={{
                background: isSelected ? v.bg : 'rgba(255,255,255,0.5)',
                border: `1.5px solid ${isSelected ? v.color : 'rgba(155,35,53,0.12)'}`,
                boxShadow: isSelected ? `0 4px 16px ${v.bg}` : 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                opacity: disabled ? 0.5 : 1,
                transform: isSelected ? 'translateY(-1px)' : 'none',
              }}
            >
              {/* Selection dot */}
              <div className="absolute top-2 right-2 w-3 h-3 rounded-full transition-all"
                style={{
                  background: isSelected ? v.color : 'transparent',
                  border: `2px solid ${isSelected ? v.color : 'rgba(155,35,53,0.2)'}`,
                }} />

              <div className="text-xl mb-1">{v.emoji}</div>
              <div className="font-display font-semibold text-sm" style={{ color: isSelected ? v.color : '#4a2020' }}>
                {v.label}
              </div>
              <div className="font-devanagari text-xs" style={{ color: v.color, opacity: 0.7 }}>
                {v.devanagari}
              </div>
              <div className="text-xs mt-1" style={{ color: '#a07860' }}>
                {v.gender} · {v.desc}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
