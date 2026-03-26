import React from 'react';
import { User, ShieldCheck, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

const VOICES = [
  { id: 'shubh', label: 'Shubh', icon: <ShieldCheck size={18} />, tag: 'Authoritative', desc: 'Commanding & Resonant' },
  { id: 'simran', label: 'Simran', icon: <Heart size={18} />, tag: 'Expressive', desc: 'Melodic & Empathetic' },
];

export default function VoiceSelector({ selected, onChange, disabled }) {
  return (
    <div className="space-y-4">
      <label className="flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
        <User size={14} className="text-[var(--primary)]" /> 
        Vocal Curations
      </label>
      
      <div className="grid grid-cols-2 gap-6">
        {VOICES.map((voice) => {
          const isSelected = selected === voice.id;
          return (
            <button
              key={voice.id}
              onClick={() => !disabled && onChange(voice.id)}
              disabled={disabled}
              className={`group relative p-6 rounded-2xl border-2 text-left transition-all duration-500 overflow-hidden ${
                isSelected 
                  ? 'border-[var(--primary)] bg-[var(--bg-main)] shadow-xl' 
                  : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--primary)]/30'
              }`}
            >
              {isSelected && (
                <motion.div 
                  layoutId="vocal-active"
                  className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent"
                />
              )}
              
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-[var(--primary)] text-white dark:text-black' : 'bg-[var(--bg-main)] text-[var(--text-muted)]'}`}>
                    {voice.icon}
                  </div>
                  <span className={`text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded border border-[var(--border)] ${isSelected ? 'text-[var(--primary)]' : 'text-[var(--text-muted)]'}`}>
                    {voice.tag}
                  </span>
                </div>
                
                <div>
                  <div className="font-display font-bold text-xl mb-1">{voice.label}</div>
                  <div className="text-[11px] font-medium tracking-wide text-[var(--text-muted)]/70 uppercase">{voice.desc}</div>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
