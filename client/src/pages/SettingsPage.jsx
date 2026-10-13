import React, { useState } from 'react';
import { 
  Settings, 
  Type, 
  Eye, 
  Sparkles, 
  Globe, 
  ShieldCheck, 
  Sliders, 
  Check, 
  Save, 
  Keyboard, 
  Volume2 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { 
    fontSize, 
    setFontSize, 
    highContrast, 
    setHighContrast, 
    reducedMotion, 
    setReducedMotion, 
    language, 
    setLanguage, 
    t 
  } = useAccessibility();

  const { isAuthenticated, updatePreferences } = useAuth();
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveToProfile = async () => {
    if (isAuthenticated) {
      await updatePreferences({
        fontSize,
        highContrast,
        reducedMotion,
        preferredLanguage: language,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold mb-2">
          <Settings className="w-3.5 h-3.5 text-cyan-400" />
          <span>Universal Accessibility Settings</span>
        </div>
        <h1 className="text-3xl font-heading font-extrabold text-white tracking-tight">
          Accessibility Customization
        </h1>
        <p className="text-sm text-slate-300 mt-1 max-w-2xl">
          Adjust visual contrast, font scaling, motion, and language settings to best fit your personal needs.
        </p>
      </div>

      {/* Main Settings Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-8">
        
        {/* 1. Text Size Scaler */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Type className="w-5 h-5 text-teal-400" />
              <div>
                <h3 className="text-base font-bold text-white">Adjustable Text Size</h3>
                <p className="text-xs text-slate-400">Scale the base typography across the entire platform.</p>
              </div>
            </div>
            <span className="text-xs font-mono font-bold text-teal-300 capitalize">{fontSize}</span>
          </div>

          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { id: 'normal', label: 'Normal', size: '16px' },
              { id: 'large', label: 'Large (A+)', size: '18px' },
              { id: 'xlarge', label: 'Extra Large (A++)', size: '21px' },
            ].map((opt) => (
              <button
                key={opt.id}
                onClick={() => setFontSize(opt.id)}
                className={`p-3.5 rounded-xl border text-center transition-all ${
                  fontSize === opt.id
                    ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold shadow-sm'
                    : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                <div className="text-sm font-semibold">{opt.label}</div>
                <div className="text-[10px] text-slate-400 mt-0.5">{opt.size} base font</div>
              </button>
            ))}
          </div>

          {/* Live Preview Sample */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 mt-3">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block mb-1">Live Text Sample:</span>
            <p className="text-slate-200">
              "SignBridge AI provides equitable communication for Deaf and hard-of-hearing individuals."
            </p>
          </div>
        </div>

        {/* 2. High Contrast Mode */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <Eye className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-white">High-Contrast Mode (WCAG AAA)</h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                Switches interface backgrounds to pure pitch black (#000000) with ultra-high contrast bright yellow and cyan borders for low vision readability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setHighContrast(!highContrast)}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 flex-shrink-0 ${
              highContrast ? 'bg-yellow-400' : 'bg-slate-700'
            }`}
            aria-label="Toggle high contrast"
          >
            <div
              className={`w-6 h-6 rounded-full bg-slate-950 transition-transform ${
                highContrast ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 3. Reduced Motion Support */}
        <div className="flex items-start justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="flex items-start gap-3">
            <Sliders className="w-5 h-5 text-teal-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="text-base font-bold text-white">Reduced Motion</h3>
              <p className="text-xs text-slate-400 mt-0.5 max-w-md">
                Disables all non-essential animations, smooth transitions, and pulse effects for users sensitive to motion sickness or vestibular conditions.
              </p>
            </div>
          </div>

          <button
            onClick={() => setReducedMotion(!reducedMotion)}
            className={`w-14 h-8 rounded-full transition-colors relative p-1 flex-shrink-0 ${
              reducedMotion ? 'bg-teal-500' : 'bg-slate-700'
            }`}
            aria-label="Toggle reduced motion"
          >
            <div
              className={`w-6 h-6 rounded-full bg-slate-950 transition-transform ${
                reducedMotion ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* 4. Interface Language */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-teal-400" />
            <div>
              <h3 className="text-base font-bold text-white">Platform Language</h3>
              <p className="text-xs text-slate-400">Choose between English and Telugu for workspace controls.</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-1">
            <button
              onClick={() => setLanguage('en')}
              className={`p-3 rounded-xl border text-center transition-all ${
                language === 'en'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLanguage('te')}
              className={`p-3 rounded-xl border text-center transition-all ${
                language === 'te'
                  ? 'bg-teal-500/20 border-teal-400 text-teal-300 font-bold'
                  : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
              }`}
            >
              తెలుగు (Telugu)
            </button>
          </div>
        </div>

        {/* 5. Save to cloud profile action */}
        {isAuthenticated && (
          <div className="pt-2 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-300 font-semibold block">Cloud Profile Synchronization</span>
              <span className="text-[11px] text-slate-500">Save current accessibility preferences to your account.</span>
            </div>

            <button
              onClick={handleSaveToProfile}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs transition-colors shadow-sm"
            >
              {saveSuccess ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save to Account</span>
                </>
              )}
            </button>
          </div>
        )}

      </div>

      {/* Keyboard Navigation & Screen Reader Compliance Guide */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 text-xs text-slate-400">
        <h4 className="font-bold text-white flex items-center gap-2 text-sm">
          <Keyboard className="w-4 h-4 text-teal-400" />
          Screen Reader &amp; Keyboard Navigation Quick Guide:
        </h4>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-slate-300">
          <li className="flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">Tab / Shift+Tab</span>
            <span>Navigate through all interactive controls in order</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">Space / Enter</span>
            <span>Trigger active buttons or links</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">Esc</span>
            <span>Dismiss fullscreen high-contrast message cards</span>
          </li>
          <li className="flex items-center gap-2">
            <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-teal-300 font-bold">Skip Link</span>
            <span>Top of page jump directly to main workspace</span>
          </li>
        </ul>
      </div>

    </div>
  );
};

export default SettingsPage;
