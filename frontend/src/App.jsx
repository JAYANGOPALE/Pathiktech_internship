import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import Footer from './components/Footer.jsx';
import TextInput from './components/TextInput.jsx';
import VoiceSelector from './components/VoiceSelector.jsx';
import DictionaryUploader from './components/DictionaryUploader.jsx';
import AudioPlayer from './components/AudioPlayer.jsx';
import DownloadButton from './components/DownloadButton.jsx';
import { useTTSStream } from './hooks/useTTSStream.js';
import { validateText } from './utils/validation.js';

const LANGUAGE_OPTIONS = [
  { code: 'hi-IN', label: 'Hindi · हिंदी' },
  { code: 'en-IN', label: 'English (India)' },
  { code: 'bn-IN', label: 'Bengali · বাংলা' },
  { code: 'gu-IN', label: 'Gujarati · ગુજરાતી' },
  { code: 'kn-IN', label: 'Kannada · ಕನ್ನಡ' },
  { code: 'ml-IN', label: 'Malayalam · മലയാളം' },
  { code: 'mr-IN', label: 'Marathi · मराठी' },
  { code: 'od-IN', label: 'Odia · ଓଡ଼ିଆ' },
  { code: 'pa-IN', label: 'Punjabi · ਪੰਜਾਬੀ' },
  { code: 'ta-IN', label: 'Tamil · தமிழ்' },
  { code: 'te-IN', label: 'Telugu · తెలుగు' },
];

export default function App() {
  const [text, setText] = useState('');
  const [speaker, setSpeaker] = useState('shubh');
  const [languageCode, setLanguageCode] = useState('hi-IN');
  const [dictionaryId, setDictionaryId] = useState(null);
  const [pace, setPace] = useState(1.0);
  const [validationError, setValidationError] = useState(null);
  const [showNameaste, setShowNameaste] = useState(false);
  const [mandalaActive, setMandalaActive] = useState(false);

  const { isStreaming, audioUrl, error: streamError, progress, startStream, cancelStream } = useTTSStream();

  // Show namaste toast when audio is ready
  useEffect(() => {
    if (audioUrl) {
      setShowNameaste(true);
      setMandalaActive(false);
      const t = setTimeout(() => setShowNameaste(false), 2800);
      return () => clearTimeout(t);
    }
  }, [audioUrl]);

  function handleGenerate() {
    const err = validateText(text);
    if (err) { setValidationError(err); return; }
    setValidationError(null);
    setMandalaActive(true);
    startStream({ text, speaker, dictId: dictionaryId, languageCode, pace });
  }

  function handleCancel() {
    cancelStream();
    setMandalaActive(false);
  }

  const displayError = validationError || streamError;
  const paceLabel = pace < 0.85 ? 'Slow' : pace > 1.15 ? 'Fast' : 'Normal';

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--cream)' }}>

      {/* Namaste toast */}
      {showNameaste && (
        <div className="namaste-toast">
          🙏 नमस्ते · Speech ready!
        </div>
      )}

      <Navbar />

      {/* Background decoration — large faint mandala */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 0 }}>
        <svg className="absolute -top-40 -right-40 opacity-[0.03]" width="600" height="600" viewBox="0 0 100 100">
          <g transform="translate(50,50)">
            {[0,30,60,90,120,150,180,210,240,270,300,330].map(a => (
              <g key={a} transform={`rotate(${a})`}>
                <ellipse cx="0" cy="-28" rx="6" ry="14" fill="#9b2335"/>
                <ellipse cx="0" cy="-18" rx="3" ry="8" fill="#f59e0b"/>
              </g>
            ))}
            <circle r="8" fill="none" stroke="#9b2335" strokeWidth="1.5"/>
            <circle r="18" fill="none" stroke="#f59e0b" strokeWidth="0.8" strokeDasharray="3 2"/>
            <circle r="28" fill="none" stroke="#3730a3" strokeWidth="0.5"/>
          </g>
        </svg>
        <svg className="absolute -bottom-20 -left-20 opacity-[0.04]" width="400" height="400" viewBox="0 0 100 100">
          <g transform="translate(50,50)">
            {[0,45,90,135,180,225,270,315].map(a => (
              <g key={a} transform={`rotate(${a})`}>
                <ellipse cx="0" cy="-22" rx="5" ry="12" fill="#d97706"/>
              </g>
            ))}
            <circle r="6" fill="none" stroke="#d97706" strokeWidth="1"/>
          </g>
        </svg>
      </div>

      <main className="flex-1 relative z-10 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Hero */}
          <div className="text-center space-y-3 pb-2 animate-fade-up">
            {/* Decorative Sanskrit header */}
            <div className="inline-flex items-center gap-3 mb-2">
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to right, transparent, #d97706)' }} />
              <span className="font-devanagari text-base" style={{ color: '#d97706' }}>वाणी · ध्वनि · संगीत</span>
              <div style={{ width: '40px', height: '1px', background: 'linear-gradient(to left, transparent, #d97706)' }} />
            </div>

            <h1 className="font-display text-4xl sm:text-5xl font-semibold leading-tight" style={{ color: '#4a0e18' }}>
              Voice of India
            </h1>
            <p className="font-devanagari text-lg" style={{ color: '#9b2335', opacity: 0.8 }}>
              भारत की आवाज़
            </p>
            <p className="text-sm max-w-md mx-auto" style={{ color: '#a07860' }}>
              Convert text to natural speech using Sarvam AI's multilingual model.
              Supports Hindi, English &amp; 10+ Indian languages.
            </p>
          </div>

          {/* Main card */}
          <div className="card-indian card-decorated p-6 space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>

            {/* Mandala pulse when streaming */}
            {mandalaActive && (
              <div className="flex justify-center pb-2">
                <div className="relative">
                  <div className="absolute inset-0 rounded-full animate-pulse-ring"
                    style={{ background: 'rgba(245,158,11,0.2)' }} />
                  <div className="w-12 h-12 rounded-full flex items-center justify-center animate-spin-slow"
                    style={{ background: 'rgba(245,158,11,0.1)', border: '2px dashed rgba(217,119,6,0.4)' }}>
                    <span className="font-devanagari text-xl" style={{ color: '#d97706' }}>ॐ</span>
                  </div>
                </div>
              </div>
            )}

            <TextInput value={text} onChange={setText} disabled={isStreaming} />

            {/* Voice + Language row */}
            <div className="grid sm:grid-cols-2 gap-5">
              <VoiceSelector selected={speaker} onChange={setSpeaker} disabled={isStreaming} />

              <div className="space-y-4">
                {/* Language */}
                <div>
                  <label className="label-indian">
                    <span style={{ fontSize: '15px' }}>🌐</span>
                    <span>Language  <span className="font-devanagari font-normal" style={{ color: '#d97706', fontSize: '13px' }}>· भाषा</span></span>
                  </label>
                  <select
                    value={languageCode}
                    onChange={e => setLanguageCode(e.target.value)}
                    disabled={isStreaming}
                    className="input-indian appearance-none cursor-pointer"
                  >
                    {LANGUAGE_OPTIONS.map(l => (
                      <option key={l.code} value={l.code}>{l.label}</option>
                    ))}
                  </select>
                </div>

                {/* Pace slider */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="label-indian mb-0">
                      <span style={{ fontSize: '15px' }}>⚡</span>
                      <span>Speech Pace</span>
                    </label>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full"
                      style={{ background: 'rgba(245,158,11,0.1)', color: '#d97706', border: '1px solid rgba(217,119,6,0.2)' }}>
                      {pace.toFixed(1)}× {paceLabel}
                    </span>
                  </div>
                  <input
                    type="range" min="0.5" max="2.0" step="0.1"
                    value={pace}
                    onChange={e => setPace(parseFloat(e.target.value))}
                    disabled={isStreaming}
                    className="slider-saffron w-full"
                    style={{ '--val': `${((pace - 0.5) / 1.5) * 100}%` }}
                  />
                  <div className="flex justify-between text-xs mt-1" style={{ color: '#c4a882' }}>
                    <span>0.5× Slow</span>
                    <span>1.0× Normal</span>
                    <span>2.0× Fast</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Dictionary uploader */}
            <DictionaryUploader
              dictionaryId={dictionaryId}
              onDictionaryUploaded={setDictionaryId}
              disabled={isStreaming}
            />

            {/* Error */}
            {displayError && (
              <div className="flex items-start gap-2.5 rounded-xl px-4 py-3"
                style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <span className="flex-shrink-0 mt-0.5">⚠️</span>
                <p className="text-sm" style={{ color: '#b91c1c' }}>{displayError}</p>
              </div>
            )}

            {/* Action buttons */}
            <div className="grid grid-cols-2 gap-3">
              {isStreaming ? (
                <>
                  <button disabled
                    className="btn-saffron flex items-center justify-center gap-2 opacity-70 col-span-1">
                    <div className="mandala-ring w-4 h-4" style={{ borderTopColor: 'white', borderRightColor: 'rgba(255,255,255,0.4)', borderWidth: '2px' }} />
                    <span>Generating…</span>
                  </button>
                  <button onClick={handleCancel}
                    className="btn-maroon flex items-center justify-center gap-2">
                    ✕ Cancel
                  </button>
                </>
              ) : (
                <button onClick={handleGenerate}
                  className="btn-saffron col-span-2 flex items-center justify-center gap-2.5 py-3.5 text-base">
                  <span style={{ fontSize: '18px' }}>🎙️</span>
                  <span>Generate Speech</span>
                  <span className="font-devanagari text-sm opacity-80">· बोलें</span>
                </button>
              )}
            </div>
          </div>

          {/* Audio player card */}
          <div className="card-indian p-6 space-y-4 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <AudioPlayer audioUrl={audioUrl} isStreaming={isStreaming} progress={progress} />
            <DownloadButton audioUrl={audioUrl} disabled={isStreaming} />
          </div>

          {/* Cultural tagline */}
          <div className="text-center animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <p className="font-devanagari text-sm" style={{ color: '#d97706', opacity: 0.5 }}>
              🪷 &nbsp; भारतीय प्रौद्योगिकी का सौन्दर्य &nbsp; 🪷
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
