import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Copy, 
  Trash2, 
  Check, 
  AlertCircle, 
  Languages, 
  Maximize2, 
  Sparkles, 
  Volume2, 
  Eye, 
  Globe 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { aiApi } from '../services/api';

const SpeechToTextPage = () => {
  const { t, language } = useAccessibility();

  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimText, setInterimText] = useState('');
  const [selectedLang, setSelectedLang] = useState('en-IN');
  const [isSupported, setIsSupported] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [copied, setCopied] = useState(false);
  const [largeMode, setLargeMode] = useState(false);
  const [translating, setTranslating] = useState(false);
  const [translatedText, setTranslatedText] = useState(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = selectedLang;

    recognition.onstart = () => {
      setIsListening(true);
      setErrorMsg(null);
    };

    recognition.onresult = (event) => {
      let currentInterim = '';
      let finalized = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const item = event.results[i];
        if (item.isFinal) {
          finalized += item[0].transcript + ' ';
        } else {
          currentInterim += item[0].transcript;
        }
      }

      if (finalized) {
        setTranscript((prev) => (prev ? `${prev} ${finalized.trim()}` : finalized.trim()));
      }
      setInterimText(currentInterim);
    };

    recognition.onerror = (event) => {
      console.warn('Speech recognition event error:', event.error);
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        setErrorMsg('Microphone access was denied. Please allow microphone permissions in your browser.');
        setIsListening(false);
      } else if (event.error === 'no-speech') {
        // Normal silence timeout, keep waiting
      } else if (event.error === 'network') {
        setErrorMsg('Speech recognition network error occurred. Check internet connection.');
        setIsListening(false);
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimText('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (e) {}
      }
    };
  }, [selectedLang]);

  const startListening = () => {
    setErrorMsg(null);
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.lang = selectedLang;
      recognitionRef.current.start();
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
    }
  };

  const stopListening = () => {
    if (!recognitionRef.current) return;
    try {
      recognitionRef.current.stop();
      setIsListening(false);
    } catch (err) {
      console.error('Failed to stop speech recognition:', err);
    }
  };

  const handleCopy = () => {
    const full = transcript + (interimText ? ` ${interimText}` : '');
    if (!full.trim()) return;
    navigator.clipboard.writeText(full.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClear = () => {
    setTranscript('');
    setInterimText('');
    setTranslatedText(null);
  };

  // AI Translation helper via Gemini backend
  const handleTranslateWithAi = async () => {
    const textToTranslate = transcript.trim();
    if (!textToTranslate) return;

    setTranslating(true);
    try {
      const targetLang = selectedLang.startsWith('te') ? 'en' : 'te';
      const res = await aiApi.translate(textToTranslate, targetLang);
      if (res.translatedText) {
        setTranslatedText({
          text: res.translatedText,
          lang: targetLang === 'te' ? 'Telugu (తెలుగు)' : 'English',
          notice: res.fallbackNotice,
        });
      }
    } catch (err) {
      console.warn('AI translation failed:', err);
    } finally {
      setTranslating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <span>Auditory Transcription Workspace</span>
          </div>
          <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
            Speech-to-Text (Live Transcript)
          </h1>
          <p className="text-sm text-slate-300 mt-1 max-w-2xl">
            Allows Deaf individuals to read words spoken by hearing companions in real-time. Microphone is only accessed when you click start.
          </p>
        </div>

        {/* Start / Stop Toggle */}
        <div className="flex items-center gap-3">
          {!isListening ? (
            <button
              onClick={startListening}
              disabled={!isSupported}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 disabled:opacity-40 transition-all hover:scale-105"
            >
              <Mic className="w-4 h-4" />
              <span>{t('startListening')}</span>
            </button>
          ) : (
            <button
              onClick={stopListening}
              className="flex items-center gap-2 px-6 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-white font-bold text-sm shadow-lg shadow-red-500/20 transition-all animate-pulse"
            >
              <MicOff className="w-4 h-4" />
              <span>{t('stopListening')}</span>
            </button>
          )}
        </div>
      </div>

      {/* Browser Support Fallback Alert */}
      {!isSupported && (
        <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <p>
            Your browser does not support the Web SpeechRecognition API. For real-time speech transcription, please use Google Chrome or Microsoft Edge.
          </p>
        </div>
      )}

      {/* Permission or Runtime Error Alert */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-300 text-sm flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p>{errorMsg}</p>
        </div>
      )}

      {/* Workspace Body Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        
        {/* Controls Bar: Language Selector & Visibility Mode */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800">
          
          <div className="flex items-center gap-2 text-xs">
            <Globe className="w-4 h-4 text-teal-400" />
            <span className="text-slate-300 font-semibold">Spoken Input Language:</span>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              disabled={isListening}
              className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-white text-xs focus:border-teal-400 disabled:opacity-50"
            >
              <option value="en-IN">English (India) — en-IN</option>
              <option value="en-US">English (US) — en-US</option>
              <option value="te-IN">తెలుగు (Telugu) — te-IN</option>
              <option value="hi-IN">हिन्दी (Hindi) — hi-IN</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setLargeMode(!largeMode)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Toggle Large High-Contrast Display for Deaf Readers"
            >
              <Maximize2 className="w-3.5 h-3.5 text-teal-400" />
              <span>{largeMode ? 'Standard Text' : 'Large Screen Mode'}</span>
            </button>

            <button
              onClick={handleCopy}
              disabled={!transcript && !interimText}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Copy Transcript"
              aria-label="Copy transcript text"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>

            <button
              onClick={handleClear}
              disabled={!transcript && !interimText}
              className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 disabled:opacity-40 transition-colors"
              title="Clear Transcript"
              aria-label="Clear transcript text"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Transcript Display Box */}
        <div 
          className={`p-6 rounded-2xl bg-slate-950 border border-slate-800 min-h-[220px] transition-all flex flex-col justify-between ${
            largeMode ? 'min-h-[320px]' : ''
          }`}
        >
          <div className="space-y-2">
            {transcript || interimText ? (
              <p className={`font-medium leading-relaxed ${largeMode ? 'text-2xl sm:text-3xl text-white' : 'text-base sm:text-lg text-slate-100'}`}>
                {transcript}
                {interimText && (
                  <span className="text-teal-400/80 italic pl-1 animate-pulse">
                    {interimText}
                  </span>
                )}
              </p>
            ) : (
              <div className="py-12 text-center text-slate-600">
                <p className="text-base italic">
                  {isListening 
                    ? 'Listening... Speak into the microphone now.' 
                    : 'Transcript will appear here. Click "Start Microphone" to begin listening.'}
                </p>
              </div>
            )}
          </div>

          {/* Real-time Listening Indicator */}
          <div className="pt-4 flex items-center justify-between text-xs text-slate-500 border-t border-slate-900 mt-4">
            <div className="flex items-center gap-2">
              {isListening ? (
                <span className="flex items-center gap-1.5 text-emerald-400 font-semibold animate-pulse">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                  Microphone Active — Receiving Spoken Audio
                </span>
              ) : (
                <span>Microphone Standby</span>
              )}
            </div>

            {transcript && (
              <button
                onClick={handleTranslateWithAi}
                disabled={translating}
                className="flex items-center gap-1.5 text-xs text-teal-400 hover:text-teal-300 font-semibold"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{translating ? 'Translating with Gemini...' : 'Translate Transcript with AI'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Translated Transcript Box (if requested) */}
        {translatedText && (
          <div className="p-5 rounded-2xl bg-teal-950/20 border border-teal-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-teal-300 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-teal-400" />
                AI Translation to {translatedText.lang}
              </span>
              <button
                onClick={() => setTranslatedText(null)}
                className="text-slate-400 hover:text-white"
              >
                &times;
              </button>
            </div>
            <p className="text-base text-white font-medium">
              {translatedText.text}
            </p>
          </div>
        )}

      </div>

      {/* Usage context tips */}
      <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-1.5">
        <h4 className="font-bold text-white flex items-center gap-1.5">
          <Languages className="w-4 h-4 text-teal-400" />
          Accessibility Note for Doctors &amp; Public Staff:
        </h4>
        <p className="text-slate-300 leading-relaxed">
          When speaking to a Deaf person using this tool, speak at a normal conversational volume and look directly toward the patient. The transcript captures speech continuously.
        </p>
      </div>

    </div>
  );
};

export default SpeechToTextPage;
