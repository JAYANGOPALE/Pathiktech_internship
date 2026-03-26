import React from 'react';
import { Type, Sparkles } from 'lucide-react';

export default function TextInput({ value, onChange, disabled }) {
  const MAX_CHARS = 5000;
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
          <Type size={14} className="text-[var(--primary)]" /> 
          Composition Studio
        </label>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--border)] bg-[var(--bg-main)]">
          <Sparkles size={10} className="text-[var(--accent)]" />
          <span className="text-[10px] font-bold font-mono tracking-widest uppercase">
            {value.length.toLocaleString()} / {MAX_CHARS.toLocaleString()}
          </span>
        </div>
      </div>
      
      <div className="relative">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          maxLength={MAX_CHARS}
          rows={7}
          placeholder="Craft your narrative here... Neural engine will process multi-lingual text with native accents."
          className="input-base text-lg font-light leading-relaxed min-h-[220px] shadow-lg focus:shadow-2xl transition-all duration-500 placeholder:italic placeholder:opacity-40"
          spellCheck={false}
        />
        <div className="absolute bottom-4 right-4 opacity-10 pointer-events-none rotate-12">
           <Type size={80} />
        </div>
      </div>
    </div>
  );
}
