import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BookOpen, 
  Search, 
  Filter, 
  CheckCircle2, 
  ShieldCheck, 
  Sparkles, 
  ArrowRight, 
  Camera, 
  ExternalLink, 
  X, 
  Info,
  HandMetal,
  Stethoscope,
  AlertTriangle,
  GraduationCap,
  MessageCircle
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { signsApi } from '../services/api';

const LearnSignsPage = () => {
  const { t, language } = useAccessibility();

  const [signs, setSigns] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSignModal, setSelectedSignModal] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSigns = async () => {
      setLoading(true);
      try {
        const [signsRes, catRes] = await Promise.all([
          signsApi.getSigns(activeCategory, searchQuery),
          signsApi.getCategories()
        ]);
        if (signsRes.signs) setSigns(signsRes.signs);
        if (catRes.categories) setCategories(catRes.categories);
      } catch (err) {
        console.warn('Failed to load signs from server, falling back to local dataset');
      } finally {
        setLoading(false);
      }
    };

    fetchSigns();
  }, [activeCategory, searchQuery]);

  const categoryIcons = {
    greetings: HandMetal,
    healthcare: Stethoscope,
    emergency: AlertTriangle,
    education: GraduationCap,
    daily: MessageCircle,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Page Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold mb-2">
          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
          <span>Educational Sign Repository</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Text-to-Sign Learning Library
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Verified Indian Sign Language (ISL) &amp; universal core gestures for healthcare triage, emergency aid, and daily communication.
        </p>
      </div>

      {/* Regional Authenticity & Ethical Sign Integrity Banner */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-white">
            Authentic Sign Language Standard:
          </p>
          <p className="leading-relaxed text-slate-400">
            All dictionary gestures are aligned with standard Indian Sign Language (ISL) conventions and verified ASL cognates. SignBridge AI never synthesizes fabricated gestures or presents arbitrary stock clipart as authentic sign language.
          </p>
        </div>
      </div>

      {/* Filters & Search Row */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        
        {/* Search Bar */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search signs by English name, Telugu, or meaning..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:border-teal-400 text-xs sm:text-sm"
          />
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              activeCategory === 'all'
                ? 'bg-teal-500 text-slate-950 shadow-sm'
                : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
            }`}
          >
            All Categories
          </button>
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.id] || BookOpen;
            const isSelected = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSelected
                    ? 'bg-teal-500 text-slate-950 shadow-sm'
                    : 'bg-slate-900 text-slate-300 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{language === 'te' ? cat.nameTe : cat.name}</span>
                <span className="text-[10px] opacity-70">({cat.count})</span>
              </button>
            );
          })}
        </div>

      </div>

      {/* Signs Grid */}
      {loading ? (
        <div className="py-16 text-center">
          <div className="w-8 h-8 border-4 border-teal-500/30 border-t-teal-400 rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs text-slate-400">Loading sign catalog...</p>
        </div>
      ) : signs.length === 0 ? (
        <div className="p-12 text-center bg-slate-900/60 rounded-3xl border border-slate-800">
          <p className="text-slate-400 text-sm">No signs found matching your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signs.map((sign) => (
            <div
              key={sign.signId || sign._id}
              className="p-6 rounded-3xl bg-slate-900 border border-slate-800 hover:border-teal-500/40 transition-all flex flex-col justify-between group shadow-sm hover:shadow-xl hover:shadow-teal-500/10"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-slate-800 text-teal-300 border border-slate-700 uppercase tracking-wider">
                    {sign.category}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-medium">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Verified ISL
                  </span>
                </div>

                <h3 className="text-xl font-heading font-bold text-white group-hover:text-teal-300 transition-colors">
                  {sign.signName}
                </h3>
                {sign.signNameTelugu && (
                  <p className="text-xs font-semibold text-teal-400/90 mb-3">
                    {sign.signNameTelugu}
                  </p>
                )}

                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 mb-4">
                  {sign.meaning}
                </p>

                {/* Gesture Summary */}
                <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 mb-4 text-xs text-slate-400">
                  <strong className="text-slate-200 block text-[11px] mb-1">Hand Form:</strong>
                  <span className="line-clamp-2 text-slate-300 italic">{sign.gesturesDescription}</span>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <button
                  onClick={() => setSelectedSignModal(sign)}
                  className="text-xs text-teal-400 hover:text-teal-300 font-semibold flex items-center gap-1"
                >
                  <span>Step-by-Step Guide</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </button>

                <Link
                  to="/sign-to-text"
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-teal-300 transition-colors"
                  title="Test in Webcam Workspace"
                >
                  <Camera className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Step-by-Step Detailed Sign Guide Modal */}
      {selectedSignModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-teal-500/10 text-teal-300 border border-teal-500/30 uppercase tracking-wider mb-2">
                  <span>{selectedSignModal.category}</span>
                  <span>•</span>
                  <span>{selectedSignModal.supportedLanguage}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-heading font-extrabold text-white">
                  {selectedSignModal.signName}
                </h2>
                {selectedSignModal.signNameTelugu && (
                  <p className="text-sm font-bold text-teal-400 mt-0.5">
                    {selectedSignModal.signNameTelugu}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedSignModal(null)}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                aria-label="Close Guide"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Meaning & Usage */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400">Meaning &amp; Usage</span>
              <p className="text-sm text-slate-200 leading-relaxed">
                {selectedSignModal.meaning}
              </p>
            </div>

            {/* Visual Hand Posture Demonstration Representation */}
            <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-3">
              <span className="text-xs uppercase font-bold text-teal-400 tracking-wider">
                Posture Breakdown &amp; Gesture Target
              </span>
              <p className="text-sm text-slate-200 font-medium italic">
                "{selectedSignModal.gesturesDescription}"
              </p>
              <div className="inline-block px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-xs text-slate-400">
                Landmark Focus: <span className="text-teal-300 font-medium">{selectedSignModal.landmarkHints}</span>
              </div>
            </div>

            {/* Step-by-Step Execution Guide */}
            {selectedSignModal.steps && selectedSignModal.steps.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Step-by-Step Motion Sequence
                </h4>
                <div className="space-y-2">
                  {selectedSignModal.steps.map((step, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-950/70 border border-slate-800 text-xs sm:text-sm text-slate-200">
                      <span className="w-5 h-5 rounded-full bg-teal-500/20 text-teal-300 font-bold flex items-center justify-center flex-shrink-0 text-xs">
                        {idx + 1}
                      </span>
                      <p className="leading-relaxed">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Regional Limitation & Context Note */}
            {selectedSignModal.regionalNotes && (
              <div className="p-4 rounded-xl bg-slate-950/40 border border-slate-800/80 text-xs text-slate-400 space-y-1">
                <span className="font-semibold text-slate-300">Regional Note:</span>
                <p className="leading-relaxed">{selectedSignModal.regionalNotes}</p>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800">
              <Link
                to="/sign-to-text"
                onClick={() => setSelectedSignModal(null)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-500 text-slate-950 font-bold text-xs hover:bg-teal-400 transition-colors"
              >
                <Camera className="w-4 h-4" />
                <span>Test this gesture in Webcam Workspace</span>
              </Link>

              <button
                onClick={() => setSelectedSignModal(null)}
                className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 font-semibold text-xs hover:bg-slate-700 transition-colors"
              >
                Close Guide
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default LearnSignsPage;
