import React, { useState, useEffect } from 'react';
import { 
  Volume2, 
  VolumeX, 
  Play, 
  Square, 
  Sparkles, 
  Copy, 
  Trash2, 
  Check, 
  Sliders, 
  AlertCircle, 
  Languages, 
  Wand2 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { aiApi } from '../services/api';

const QUICK_PHRASES = [
  { text: 'Hello, I am Deaf and using SignBridge AI to speak.', textTe: 'నమస్కారం, నేను వినలేను; మాట్లాడటానికి సైన్‌బ్రిడ్జ్ AI వాడుతున్నాను.' },
  { text: 'Could you please call the doctor or nurse immediately?', textTe: 'దయచేసి వెంటనే వైద్యుడిని లేదా నర్సును పిలుస్తారా?' },
  { text: 'Where is the main consultation or registration desk?', textTe: 'ప్రధాన రిజిస్ట్రేషన్ లేదా సంప్రదింపుల విభాగం ఎక్కడ ఉంది?' },
  { text: 'I need drinking water, please.', textTe: 'నాకు తాగడానికి మంచినీరు కావాలి, దయచేసి.' },
  { text: 'Please write down your reply so I can read it.', textTe: 'దయచేసి మీ సమాధానాన్ని రాసి చూపించండి, నేను చదువుతాను.' },
  { text: 'Thank you very much for your kind patience.', textTe: 'మీ ఓపికకు చాలా ధన్యవాదాలు.' },
];

const TextToSpeechPage = () => {
  const { t, language } = useAccessibility();

  const [text, setText] = useState('');
  const [voices, setVoices] = useState([]);
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [rate, setRate] = useState(1.0);
  const [pitch, setPitch] = useState(1.0);
  const [volume, setVolume] = useState(1.0);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [copied, setCopied] = useState(false);
  const [simplifying, setSimplifying] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  // Load browser speech synthesis voices
  useEffect(() => {
    if (!('speechSynthesis' in window)) {
      setIsSupported(false);
      return;
    }

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);

      if (availableVoices.length > 0 && !selectedVoice) {
        // Find matching voice for active language if available
        const langCode = language === 'te' ? 'te' : 'en';
        const preferred = availableVoices.find(v => v.lang.startsWith(langCode)) || availableVoices[0];
        setSelectedVoice(preferred.name);
      }
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [language]);

  const handleSpeak = () => {
    if (!('speechSynthesis' in window) || !text.trim()) return;

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text.trim());
    utterance.rate = rate;
    utterance.pitch = pitch;
    utterance.volume = volume;

    if (selectedVoice) {
      const voiceObj = voices.find(v => v.name === selectedVoice);
      if (voiceObj) utterance.voice = voiceObj;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      console.error('Speech synthesis error:', e);
      setIsSpeaking(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  const handleCopy = () => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // AI Simplify Text helper via backend Gemini service
  const handleSimplifyWithAi = async () => {
    if (!text.trim()) return;
    setSimplifying(true);
    setAiNotice(null);

    try {
      const res = await aiApi.simplify(text.trim());
      if (res.text) {
        setText(res.text);
        if (res.fallbackNotice) {
          setAiNotice(res.fallbackNotice);
        } else {
          setAiNotice('Text simplified using Google Gemini for accessible, direct speech.');
        }
      }
    } catch (err) {
      console.warn('AI simplify failed:', err);
      setAiNotice('Unable to reach AI service. Proceeding with current text.');
    } finally {
      setSimplifying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-300 text-xs font-semibold mb-2">
          <Volume2 className="w-3.5 h-3.5 text-blue-400" />
          <span>Vocal Synthesis Workspace</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Text-to-Speech (Vocal Audio)
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Type any statement or tap pre-formatted phrases to vocalize thoughts aloud through clear synthetic speech.
        </p>
      </div>

      {/* Browser Support Fallback Alert */}
      {!isSupported && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            Your current browser does not support the Web SpeechSynthesis API. Please use Google Chrome, Microsoft Edge, Safari, or Firefox for full vocal audio features.
          </p>
        </div>
      )}

      {/* AI Notification Banner */}
      {aiNotice && (
        <div className="p-3.5 rounded-xl bg-teal-950/40 border border-teal-500/30 text-teal-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span>{aiNotice}</span>
          </div>
          <button 
            onClick={() => setAiNotice(null)} 
            className="text-teal-400 hover:text-teal-200 font-bold"
          >
            &times;
          </button>
        </div>
      )}

      {/* Main Text Input & Playback Controls Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Textarea */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Message to Vocalize
            </label>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSimplifyWithAi}
                disabled={!text.trim() || simplifying}
                className="flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-teal-300 border border-slate-700 disabled:opacity-40 transition-colors"
                title="Rewrite text in clear, concise plain English with Gemini AI"
              >
                <Wand2 className="w-3.5 h-3.5 text-teal-400" />
                <span>{simplifying ? 'Simplifying...' : 'AI Plain-Language Simplify'}</span>
              </button>
              <button
                onClick={handleCopy}
                disabled={!text.trim()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Copy Text"
                aria-label="Copy message text"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={() => setText('')}
                disabled={!text.trim()}
                className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
                title="Clear Text"
                aria-label="Clear message text"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          <textarea
            rows={5}
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type your message here, for example: 'Hello, please help me find the outpatient radiology room.'"
            className="w-full p-4 rounded-2xl bg-slate-950 border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-teal-400 text-base leading-relaxed transition-colors resize-y"
          />

          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{text.length} characters</span>
            {isSpeaking && (
              <span className="flex items-center gap-1.5 text-teal-400 font-medium animate-pulse">
                <Volume2 className="w-4 h-4" />
                Vocalizing message aloud...
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Speak & Stop */}
        <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-slate-800">
          <button
            onClick={handleSpeak}
            disabled={!text.trim() || !isSupported}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            <Play className="w-4 h-4 fill-slate-950" />
            <span>{t('speak')}</span>
          </button>

          <button
            onClick={handleStop}
            disabled={!isSpeaking}
            className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 disabled:opacity-40 transition-colors"
          >
            <Square className="w-4 h-4" />
            <span>{t('stop')}</span>
          </button>
        </div>

        {/* Voice & Acoustic Settings (Voice, Rate, Pitch) */}
        <div className="p-5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            <Sliders className="w-4 h-4 text-teal-400" />
            <span>Voice &amp; Audio Customization</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Voice Dropdown */}
            <div className="space-y-1.5">
              <label className="text-slate-400 font-medium">Selected Vocal Engine</label>
              <select
                value={selectedVoice || ''}
                onChange={(e) => setSelectedVoice(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs focus:border-teal-400"
              >
                {voices.length === 0 ? (
                  <option value="">Default Browser Voice</option>
                ) : (
                  voices.map((v) => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))
                )}
              </select>
            </div>

            {/* Speech Rate Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Speaking Rate (Speed)</span>
                <span className="text-teal-400 font-mono">{rate}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.0"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(parseFloat(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>

            {/* Pitch Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-slate-400 font-medium">
                <span>Vocal Pitch</span>
                <span className="text-teal-400 font-mono">{pitch}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="1.5"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(parseFloat(e.target.value))}
                className="w-full accent-teal-400"
              />
            </div>
          </div>
        </div>

      </div>

      {/* Quick Phrase Launchpad */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Languages className="w-4 h-4 text-teal-400" />
          Common Quick Speech Presets (Click to Load)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {QUICK_PHRASES.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                const phrase = language === 'te' ? item.textTe : item.text;
                setText(phrase);
              }}
              className="p-4 rounded-xl bg-slate-900 border border-slate-800 hover:border-teal-500/50 hover:bg-slate-850 text-left transition-all group"
            >
              <p className="text-xs font-semibold text-slate-200 group-hover:text-teal-300 transition-colors leading-relaxed">
                {language === 'te' ? item.textTe : item.text}
              </p>
              <span className="text-[10px] text-teal-400/80 mt-1 block">
                Load into speech box &rarr;
              </span>
            </button>
          ))}
        </div>
      </div>

    </div>
  );
};

export default TextToSpeechPage;
