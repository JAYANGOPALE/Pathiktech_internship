import React, { useState, useEffect } from 'react';
import { Sparkles, Loader2, Volume2, Globe, FileUp, Download, Diamond, Crown, Languages } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast, { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import TextInput from './components/TextInput.jsx';
import VoiceSelector from './components/VoiceSelector.jsx';
import DictionaryUploader from './components/DictionaryUploader.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import { useTTSStream } from './hooks/useTTSStream.js';
import { validateText } from './utils/validation.js';

const LANGUAGES = [
  { code: 'hi-IN', label: 'Hindi' },
  { code: 'en-IN', label: 'English (IN)' },
  { code: 'bn-IN', label: 'Bengali' },
  { code: 'gu-IN', label: 'Gujarati' },
  { code: 'kn-IN', label: 'Kannada' },
  { code: 'ml-IN', label: 'Malayalam' },
  { code: 'mr-IN', label: 'Marathi' },
  { code: 'od-IN', label: 'Odia' },
  { code: 'pa-IN', label: 'Punjabi' },
  { code: 'ta-IN', label: 'Tamil' },
  { code: 'te-IN', label: 'Telugu' },
];

export default function App() {
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState('shubh');
  const [languageCode, setLanguageCode] = useState('hi-IN');
  const [dictionaryId, setDictionaryId] = useState(null);
  
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.className = theme;
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const { isStreaming, audioUrl, error: streamError, progress, startStream, cancelStream } = useTTSStream();

  const handleGenerate = () => {
    const textError = validateText(text);
    if (textError) {
      toast.error(textError, {
        style: {
          background: theme === 'dark' ? '#141417' : '#FFFFFF',
          color: theme === 'dark' ? '#F8F9FA' : '#1A1C16',
          border: '1px solid var(--border)'
        }
      });
      return;
    }
    startStream({ text, speaker, dictId: dictionaryId, languageCode });
  };

  useEffect(() => {
    if (streamError) toast.error(streamError);
  }, [streamError]);

  return (
    <div className="min-h-screen flex flex-col selection:bg-accent/30">
      <Toaster position="bottom-right" />
      <Navbar theme={theme} toggleTheme={toggleTheme} />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-16 space-y-16">
        
        {/* Luxury Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[var(--border)] bg-[var(--bg-card)] shadow-sm mb-4"
          >
            <Crown size={14} className="text-[var(--primary)]" />
            <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-[var(--text-muted)]">Premium Neural Audio Studio</span>
          </motion.div>
          
          <motion.h1 
            className="text-5xl md:text-7xl font-display font-medium leading-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            The Gold Standard <br />
            in <span className="italic italic text-[var(--primary)] font-serif">Voice Intelligence</span>
          </motion.h1>
          
          <p className="text-xl text-[var(--text-muted)] max-w-2xl mx-auto font-light leading-relaxed">
            Experience unparalleled clarity and emotional depth with our boutique collection of neural voices, tailored for the sophisticated narrator.
          </p>
        </section>

        {/* Studio Interface */}
        <div className="card p-1 md:p-12 shadow-2xl bg-gradient-to-b from-[var(--bg-card)] to-[var(--bg-main)]">
          <div className="p-8 space-y-10">
            <TextInput 
              value={text} 
              onChange={setText} 
              disabled={isStreaming} 
            />

            <div className="grid md:grid-cols-2 gap-12">
              <VoiceSelector 
                selected={speaker} 
                onChange={setSpeaker} 
                disabled={isStreaming} 
              />

              <div className="space-y-4">
                <label className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[var(--text-muted)]">
                  <Languages size={14} className="text-[var(--primary)]" /> 
                  Target Dialect
                </label>
                <div className="relative">
                  <select
                    value={languageCode}
                    onChange={(e) => setLanguageCode(e.target.value)}
                    disabled={isStreaming}
                    className="input-base appearance-none cursor-pointer font-medium h-14 pr-12"
                  >
                    {LANGUAGES.map(lang => (
                      <option key={lang.code} value={lang.code}>{lang.label}</option>
                    ))}
                  </select>
                  <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none opacity-50">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <DictionaryUploader
                dictionaryId={dictionaryId}
                onDictionaryUploaded={setDictionaryId}
                disabled={isStreaming}
              />
            </div>

            <div className="pt-6">
              <button
                onClick={isStreaming ? cancelStream : handleGenerate}
                disabled={!text.trim() && !isStreaming}
                className="btn-primary w-full h-16 flex items-center justify-center gap-4 text-xl shadow-xl disabled:opacity-30"
              >
                {isStreaming ? (
                  <>
                    <Loader2 className="animate-spin" size={24} /> 
                    <span className="tracking-widest uppercase text-sm font-bold">Interrupting Synthesis</span>
                  </>
                ) : (
                  <>
                    <Diamond size={20} className="text-white/50" />
                    <span className="tracking-tight">Master Piece Generation</span>
                    <Sparkles size={20} className="text-white/50" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Master Output Section */}
        <AnimatePresence>
          {(audioUrl || isStreaming) && (
            <motion.div 
              className="card p-10 bg-[var(--bg-card)] border-l-4 border-l-[var(--primary)]"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <div className="flex flex-col gap-10">
                <AudioPlayer
                  audioUrl={audioUrl}
                  isStreaming={isStreaming}
                  progress={progress}
                />
                
                {audioUrl && !isStreaming && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center pt-6 border-t border-[var(--border)]"
                  >
                    <DownloadButton audioUrl={audioUrl} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
}
