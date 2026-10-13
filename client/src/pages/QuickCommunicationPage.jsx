import React, { useState } from 'react';
import { 
  MessageSquare, 
  Volume2, 
  Maximize2, 
  Copy, 
  Check, 
  Sparkles, 
  Plus, 
  Trash2, 
  Wand2, 
  HeartPulse, 
  AlertCircle, 
  ShieldAlert, 
  HelpCircle 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { aiApi } from '../services/api';

const DEFAULT_ESSENTIAL_CARDS = [
  {
    id: 'help',
    text: 'I need urgent help.',
    textTe: 'నాకు అత్యవసర సహాయం కావాలి.',
    category: 'Emergency',
    color: 'border-red-500/40 text-red-300',
  },
  {
    id: 'doctor',
    text: 'Please call a doctor or medical staff.',
    textTe: 'దయచేసి వెంటనే వైద్యుడిని లేదా వైద్య సిబ్బందిని పిలవండి.',
    category: 'Healthcare',
    color: 'border-blue-500/40 text-blue-300',
  },
  {
    id: 'repeat',
    text: 'Please repeat that once more.',
    textTe: 'దయచేసి మీరు చెప్పింది మళ్లీ ఒకసారి చెప్పండి.',
    category: 'General',
    color: 'border-teal-500/40 text-teal-300',
  },
  {
    id: 'understand',
    text: 'I do not understand what you mean.',
    textTe: 'మీరు చెప్పింది నాకు సరిగ్గా అర్థం కాలేదు.',
    category: 'General',
    color: 'border-amber-500/40 text-amber-300',
  },
  {
    id: 'thank-you',
    text: 'Thank you very much for your help.',
    textTe: 'మీ సహాయానికి చాలా ధన్యవాదాలు.',
    category: 'Courtesy',
    color: 'border-emerald-500/40 text-emerald-300',
  },
  {
    id: 'write-down',
    text: 'Please write it down on paper or screen.',
    textTe: 'దయచేసి మీ సమాధానాన్ని కాగితంపై లేదా స్క్రీన్‌పై రాసి చూపించండి.',
    category: 'Clarification',
    color: 'border-cyan-500/40 text-cyan-300',
  },
  {
    id: 'deaf-info',
    text: 'I am Deaf / hard of hearing. Please face me directly when speaking.',
    textTe: 'నేను వినలేను (బధిరుడిని). మాట్లాడేటప్పుడు దయచేసి నన్ను చూసి మాట్లాడండి.',
    category: 'Identification',
    color: 'border-purple-500/40 text-purple-300',
  },
  {
    id: 'emergency-room',
    text: 'Where is the emergency department or triage desk?',
    textTe: 'అత్యవసర చికిత్స విభాగం లేదా రిసెప్షన్ ఎక్కడ ఉంది?',
    category: 'Healthcare',
    color: 'border-rose-500/40 text-rose-300',
  },
  {
    id: 'water',
    text: 'Can I please have a cup of drinking water?',
    textTe: 'నాకు తాగడానికి మంచినీరు ఇవ్వగలరా, దయచేసి?',
    category: 'Basic Need',
    color: 'border-indigo-500/40 text-indigo-300',
  },
];

const QuickCommunicationPage = () => {
  const { t, language } = useAccessibility();

  const [cards, setCards] = useState(() => {
    const saved = localStorage.getItem('signbridge_custom_cards');
    return saved ? JSON.parse(saved) : DEFAULT_ESSENTIAL_CARDS;
  });

  const [activeLargeMessage, setActiveLargeMessage] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  // Custom phrase creation
  const [customText, setCustomText] = useState('');
  const [customCategory, setCustomCategory] = useState('Personal');

  // AI Message drafting
  const [aiIntent, setAiIntent] = useState('');
  const [aiContext, setAiContext] = useState('Hospital');
  const [aiDrafts, setAiDrafts] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiNotice, setAiNotice] = useState(null);

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'te' ? 'te-IN' : 'en-US';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleAddCustomCard = (e) => {
    e.preventDefault();
    if (!customText.trim()) return;

    const newCard = {
      id: 'custom_' + Date.now(),
      text: customText.trim(),
      textTe: '',
      category: customCategory,
      color: 'border-teal-500/40 text-teal-300',
    };

    const updated = [newCard, ...cards];
    setCards(updated);
    localStorage.setItem('signbridge_custom_cards', JSON.stringify(updated));
    setCustomText('');
  };

  const handleDeleteCard = (id) => {
    const updated = cards.filter((c) => c.id !== id);
    setCards(updated);
    localStorage.setItem('signbridge_custom_cards', JSON.stringify(updated));
  };

  // Compose with Gemini AI
  const handleComposeWithAi = async (e) => {
    e.preventDefault();
    if (!aiIntent.trim()) return;

    setAiLoading(true);
    setAiNotice(null);
    setAiDrafts(null);

    try {
      const res = await aiApi.compose(aiIntent.trim(), aiContext);
      if (res.suggestions) {
        // Parse suggestions lines
        const lines = res.suggestions
          .split('\n')
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => l.replace(/^\d+[\.\)]\s*/, ''));
        setAiDrafts(lines);
        if (res.fallbackNotice) setAiNotice(res.fallbackNotice);
      }
    } catch (err) {
      console.warn('AI composer error:', err);
      setAiNotice('Unable to connect to AI engine. Using offline drafting template.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
          <MessageSquare className="w-3.5 h-3.5 text-amber-400" />
          <span>High-Visibility Quick Communication</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Quick Communication Situation Cards
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Tap any card to show fullscreen high-contrast messages to healthcare workers, police officers, or counter clerks.
        </p>
      </div>

      {/* Situation Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => {
          const displayText = language === 'te' && card.textTe ? card.textTe : card.text;
          return (
            <div
              key={card.id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between group shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-950 border ${card.color}`}>
                    {card.category}
                  </span>
                  {card.id.startsWith('custom_') && (
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="text-slate-500 hover:text-red-400 p-1"
                      title="Delete card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-lg font-bold text-white leading-snug group-hover:text-teal-300 transition-colors mb-2">
                  {displayText}
                </p>

                {language !== 'te' && card.textTe && (
                  <p className="text-xs text-teal-400/80 font-medium">
                    {card.textTe}
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="pt-4 mt-4 border-t border-slate-800/80 flex items-center gap-2">
                <button
                  onClick={() => setActiveLargeMessage(displayText)}
                  className="flex-1 py-2 px-3 rounded-xl bg-teal-500/10 hover:bg-teal-500/20 text-teal-300 border border-teal-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                  <span>Show Fullscreen</span>
                </button>

                <button
                  onClick={() => speakText(displayText)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors"
                  title="Speak Aloud"
                  aria-label="Speak text"
                >
                  <Volume2 className="w-4 h-4 text-teal-400" />
                </button>

                <button
                  onClick={() => handleCopy(card.id, displayText)}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors"
                  title="Copy Text"
                  aria-label="Copy message text"
                >
                  {copiedId === card.id ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Section: Add Custom Message & AI Drafter */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Custom Message Card Creator */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Plus className="w-5 h-5 text-teal-400" />
            <span>Create Custom Situation Card</span>
          </div>
          <p className="text-xs text-slate-400">
            Save personal medical notes, recurring addresses, or questions to your device.
          </p>

          <form onSubmit={handleAddCustomCard} className="space-y-3">
            <input
              type="text"
              required
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              placeholder="e.g., I am allergic to penicillin; please note on my chart."
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-teal-400"
            />
            <div className="flex gap-2">
              <select
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-teal-400"
              >
                <option value="Personal">Personal</option>
                <option value="Healthcare">Healthcare</option>
                <option value="College">College</option>
                <option value="Transit">Transit</option>
              </select>

              <button
                type="submit"
                className="flex-1 py-2.5 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Save to Board</span>
              </button>
            </div>
          </form>
        </div>

        {/* Gemini AI Message Drafter */}
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <Sparkles className="w-5 h-5 text-teal-400" />
            <span>AI Smart Message Drafter</span>
          </div>
          <p className="text-xs text-slate-400">
            Tell the AI what you want to say; it will draft 3 courteous, accessible options.
          </p>

          <form onSubmit={handleComposeWithAi} className="space-y-3">
            <div className="flex gap-2">
              <input
                type="text"
                required
                value={aiIntent}
                onChange={(e) => setAiIntent(e.target.value)}
                placeholder="e.g., Ask doctor about side effects of this medicine"
                className="flex-1 px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:border-teal-400"
              />
              <select
                value={aiContext}
                onChange={(e) => setAiContext(e.target.value)}
                className="px-3 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-xs focus:border-teal-400"
              >
                <option value="Hospital">Hospital</option>
                <option value="College">College</option>
                <option value="Public Office">Public Office</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={aiLoading || !aiIntent.trim()}
              className="w-full py-2.5 px-4 rounded-xl bg-teal-500/20 hover:bg-teal-500/30 text-teal-300 border border-teal-500/40 font-bold text-xs transition-colors disabled:opacity-40 flex items-center justify-center gap-2"
            >
              <Wand2 className="w-4 h-4" />
              <span>{aiLoading ? 'Drafting with Gemini AI...' : 'Generate 3 Quick Messages'}</span>
            </button>
          </form>

          {/* AI Output Choices */}
          {aiDrafts && aiDrafts.length > 0 && (
            <div className="space-y-2 pt-2">
              <span className="text-[11px] uppercase tracking-wider text-teal-300 font-bold">
                Tap Any Option to Display or Speak:
              </span>
              {aiDrafts.map((draft, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950 border border-slate-800 hover:border-teal-500/40 flex items-center justify-between gap-3 group"
                >
                  <p className="text-xs text-slate-200 font-medium leading-relaxed">
                    {draft}
                  </p>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button
                      onClick={() => setActiveLargeMessage(draft)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300"
                      title="Show Large Text"
                    >
                      <Maximize2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => speakText(draft)}
                      className="p-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-teal-300"
                      title="Speak Aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Large High-Contrast Display Modal */}
      {activeLargeMessage && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between p-6 sm:p-12 animate-in fade-in"
          role="dialog"
          aria-modal="true"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider text-teal-400 font-bold">
              High-Visibility Visual Card — SignBridge AI
            </span>
            <button
              onClick={() => setActiveLargeMessage(null)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-white font-bold hover:bg-slate-700 text-sm"
            >
              Close Screen (Esc)
            </button>
          </div>

          <div className="my-auto text-center max-w-5xl mx-auto py-8">
            <p className="text-3xl sm:text-6xl md:text-7xl font-extrabold text-white leading-tight font-heading tracking-tight select-all">
              {activeLargeMessage}
            </p>
          </div>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => speakText(activeLargeMessage)}
              className="px-6 py-3.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-sm flex items-center gap-2 hover:bg-teal-400 transition-colors shadow-lg shadow-teal-500/20"
            >
              <Volume2 className="w-5 h-5" />
              <span>Speak Aloud</span>
            </button>
            <button
              onClick={() => setActiveLargeMessage(null)}
              className="px-6 py-3.5 rounded-xl bg-slate-800 text-slate-200 font-semibold text-sm hover:bg-slate-700 transition-colors"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default QuickCommunicationPage;
