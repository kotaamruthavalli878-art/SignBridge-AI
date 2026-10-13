import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Camera, 
  Volume2, 
  Mic, 
  BookOpen, 
  MessageSquare, 
  Settings, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Copy, 
  Trash2, 
  Plus, 
  Maximize2, 
  VolumeX, 
  Eye, 
  Check, 
  User, 
  Activity 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAccessibility } from '../context/AccessibilityContext';
import { healthApi } from '../services/api';

const DashboardPage = () => {
  const { user } = useAuth();
  const { fontSize, highContrast, language, t } = useAccessibility();

  // Local saved communication notes / recent text activity
  const [savedNotes, setSavedNotes] = useState(() => {
    const local = localStorage.getItem('signbridge_saved_notes');
    return local ? JSON.parse(local) : [
      { id: 1, text: 'Need consultation regarding severe ear ringing and dizziness.', date: 'Today, 09:30 AM' },
      { id: 2, text: 'Please show me the examination room number 304.', date: 'Yesterday' }
    ];
  });

  const [newNote, setNewNote] = useState('');
  const [activeLargeModal, setActiveLargeModal] = useState(null);
  const [copiedId, setCopiedId] = useState(null);
  const [systemHealth, setSystemHealth] = useState(null);

  useEffect(() => {
    localStorage.setItem('signbridge_saved_notes', JSON.stringify(savedNotes));
  }, [savedNotes]);

  useEffect(() => {
    const fetchHealth = async () => {
      try {
        const res = await healthApi.check();
        setSystemHealth(res);
      } catch (err) {
        console.warn('Health check query failed');
      }
    };
    fetchHealth();
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    const note = {
      id: Date.now(),
      text: newNote.trim(),
      date: 'Just now',
    };
    setSavedNotes([note, ...savedNotes]);
    setNewNote('');
  };

  const handleDeleteNote = (id) => {
    setSavedNotes(savedNotes.filter((n) => n.id !== id));
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const quickShortcuts = [
    { label: t('hospitalPreset'), labelTe: 'దయచేసి వైద్యుడిని పిలవండి' },
    { label: t('helpPreset'), labelTe: 'నాకు సహాయం కావాలి' },
    { label: t('writeDownPreset'), labelTe: 'దయచేసి రాసి చూపించండి' },
    { label: t('deafPreset'), labelTe: 'నేను వినలేను (బధిరుడిని)' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Welcome Section */}
      <section className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/30 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-400" />
            <span>Authenticated Member Dashboard</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-heading font-extrabold text-white tracking-tight">
            {t('welcomeBack')}, {user?.name || 'Friend'}!
          </h1>
          <p className="text-sm text-slate-300">
            Account Email: <span className="text-teal-400 font-mono text-xs">{user?.email}</span> • Preferred Language: <span className="text-white font-medium">{language === 'te' ? 'తెలుగు (Telugu)' : 'English'}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/settings"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-semibold transition-colors"
          >
            <Settings className="w-4 h-4 text-teal-400" />
            <span>Accessibility Settings</span>
          </Link>
          <Link
            to="/sign-to-text"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-teal-500/20"
          >
            <Camera className="w-4 h-4" />
            <span>Open Webcam Workspace</span>
          </Link>
        </div>
      </section>

      {/* System Status Indicators */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Text Display Size</div>
          <div className="text-lg font-bold text-white capitalize mt-1 flex items-center gap-2">
            <span>{fontSize}</span>
            <span className="text-[10px] text-teal-400 font-normal">Active</span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">High Contrast</div>
          <div className="text-lg font-bold text-white mt-1 flex items-center gap-2">
            <span>{highContrast ? 'Enabled' : 'Standard'}</span>
            <span className={`w-2 h-2 rounded-full ${highContrast ? 'bg-yellow-400' : 'bg-slate-600'}`}></span>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">AI Engine Provider</div>
          <div className="text-lg font-bold text-white mt-1 truncate">
            {systemHealth?.ai?.provider || 'Google Gemini'}
          </div>
          <div className="text-[10px] text-teal-400">
            {systemHealth?.ai?.configured ? 'Live Generative AI' : 'Deterministic Fallback Active'}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400 font-medium">Database Mode</div>
          <div className="text-sm font-bold text-white mt-1 truncate">
            {systemHealth?.database?.mode || 'Mongoose Storage'}
          </div>
          <div className="text-[10px] text-teal-400">100% Functional</div>
        </div>
      </section>

      {/* Quick Situation Emergency Launchpad */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-heading font-bold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-teal-400" />
              Quick Situation Cards (Instant Tap &amp; Show)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Tap any card to display large fullscreen text to doctors, counter clerks, or teachers.
            </p>
          </div>
          <Link to="/quick-communication" className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1">
            <span>View All Cards</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickShortcuts.map((card, idx) => (
            <div 
              key={idx}
              className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="mb-4">
                <p className="text-base font-bold text-white leading-snug group-hover:text-teal-300 transition-colors">
                  {card.label}
                </p>
                <p className="text-xs text-teal-400/80 mt-1 font-medium">
                  {card.labelTe}
                </p>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                <button
                  onClick={() => setActiveLargeModal(card.label)}
                  className="flex-1 py-1.5 px-2.5 rounded-lg bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  title="Open Large Text Screen"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Show Large</span>
                </button>
                <button
                  onClick={() => speakText(card.label)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                  title="Speak aloud using speech synthesis"
                  aria-label="Speak text"
                >
                  <Volume2 className="w-4 h-4 text-teal-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Feature Workspace Grid */}
      <section className="space-y-4">
        <h2 className="text-xl font-heading font-bold text-white">
          Active Workspaces
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/sign-to-text"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-teal-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-teal-500/10 text-teal-400 flex items-center justify-center flex-shrink-0 group-hover:bg-teal-500 group-hover:text-slate-950 transition-all">
              <Camera className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-teal-300 transition-colors">
                Sign-to-Text Recognition
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Webcam gesture classification with confidence metrics and live speech output.
              </p>
            </div>
          </Link>

          <Link
            to="/text-to-speech"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-500 group-hover:text-slate-950 transition-all">
              <Volume2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors">
                Text-to-Speech Engine
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Type your thoughts and have them clearly voiced aloud in custom rates and accents.
              </p>
            </div>
          </Link>

          <Link
            to="/speech-to-text"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 transition-all">
              <Mic className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-emerald-300 transition-colors">
                Speech-to-Text Transcripts
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Microphone speech listener for reading spoken answers from hearing companions.
              </p>
            </div>
          </Link>

          <Link
            to="/learn-signs"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center flex-shrink-0 group-hover:bg-purple-500 group-hover:text-slate-950 transition-all">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-purple-300 transition-colors">
                Sign Language Learning Library
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Step-by-step verified ISL signs categorized by health, emergency, and education.
              </p>
            </div>
          </Link>

          <Link
            to="/quick-communication"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center flex-shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 transition-all">
              <MessageSquare className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-amber-300 transition-colors">
                Quick Communication Workspace
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Emergency phrase catalog, custom phrase boards, and AI message composition.
              </p>
            </div>
          </Link>

          <Link
            to="/settings"
            className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all group flex items-start gap-4"
          >
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center flex-shrink-0 group-hover:bg-cyan-500 group-hover:text-slate-950 transition-all">
              <Eye className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                Accessibility Preferences
              </h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Fine-tune font scalers, high-contrast dark palette, and speech parameters.
              </p>
            </div>
          </Link>
        </div>
      </section>

      {/* Recent Text-based Activity / Communication Scratchpad */}
      <section className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-heading font-bold text-white">
              Recent Communication Notes &amp; Scratchpad
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Store notes locally for ongoing appointments. Never uploads audio or video.
            </p>
          </div>
          <span className="text-xs px-3 py-1 rounded-full bg-slate-800 text-teal-300 border border-slate-700">
            {savedNotes.length} saved phrases
          </span>
        </div>

        {/* Add note input */}
        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Type a new reusable message or doctor query..."
            className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 text-sm"
          />
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Save</span>
          </button>
        </form>

        {/* List of notes */}
        <div className="space-y-3">
          {savedNotes.length === 0 ? (
            <p className="text-xs text-slate-500 text-center py-6">
              No saved communication notes yet. Type a message above to store it for quick access.
            </p>
          ) : (
            savedNotes.map((note) => (
              <div
                key={note.id}
                className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 group"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-slate-200 font-medium break-words">
                    {note.text}
                  </p>
                  <span className="text-[10px] text-slate-500">{note.date}</span>
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <button
                    onClick={() => speakText(note.text)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition-colors"
                    title="Speak aloud"
                    aria-label="Speak note"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActiveLargeModal(note.text)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition-colors"
                    title="Show Large Text"
                    aria-label="Show large text"
                  >
                    <Maximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleCopy(note.id, note.text)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-teal-300 transition-colors"
                    title="Copy note text"
                    aria-label="Copy note"
                  >
                    {copiedId === note.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-red-950/40 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete note"
                    aria-label="Delete note"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Privacy Pledge Card */}
      <section className="p-6 rounded-2xl bg-teal-950/20 border border-teal-500/20 flex items-start gap-4">
        <ShieldCheck className="w-8 h-8 text-teal-400 flex-shrink-0 mt-0.5" />
        <div>
          <h4 className="text-sm font-bold text-white mb-1">
            Privacy &amp; Data Ethics Guarantee
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            SignBridge AI never captures, saves, or transmits your webcam video stream or microphone audio recordings. All computer vision gesture processing and speech synthesis execute securely inside your client browser.
          </p>
        </div>
      </section>

      {/* Large Text Display Modal */}
      {activeLargeModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in"
          role="dialog"
          aria-modal="true"
          aria-label="Large text message view"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
              SignBridge AI — High Visibility Message Card
            </span>
            <button
              onClick={() => setActiveLargeModal(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 text-sm"
            >
              Close Screen (Esc)
            </button>
          </div>

          <div className="my-auto text-center max-w-5xl mx-auto py-8">
            <p className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight font-heading tracking-tight select-all">
              {activeLargeModal}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => speakText(activeLargeModal)}
              className="px-6 py-3 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 hover:bg-teal-400 transition-colors"
            >
              <Volume2 className="w-5 h-5" />
              <span>Speak Aloud</span>
            </button>
            <button
              onClick={() => setActiveLargeModal(null)}
              className="px-6 py-3 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default DashboardPage;
