import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, HeartHandshake, Eye, Sparkles, AlertCircle } from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';

const Footer = () => {
  const { t } = useAccessibility();

  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2 text-white font-heading font-bold text-lg">
              <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-slate-950">
                <Sparkles className="w-5 h-5" />
              </div>
              SignBridge <span className="text-teal-400">AI</span>
            </div>
            <p className="text-sm text-slate-300 max-w-md leading-relaxed">
              An AI-powered accessibility platform advancing communication equity for Deaf and hard-of-hearing individuals across healthcare, education, civic offices, and public life.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-teal-300">
                <ShieldCheck className="w-4 h-4 text-teal-400" />
                100% Client-Side Video Processing
              </span>
              <span className="flex items-center gap-1.5 text-teal-300">
                <Eye className="w-4 h-4 text-teal-400" />
                WCAG 2.1 AA Compliant
              </span>
            </div>
          </div>

          {/* Quick Workspaces */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold mb-3">Workspaces</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/sign-to-text" className="hover:text-teal-400 transition-colors">Sign-to-Text Recognition</Link>
              </li>
              <li>
                <Link to="/text-to-speech" className="hover:text-teal-400 transition-colors">Text-to-Speech (Audio)</Link>
              </li>
              <li>
                <Link to="/speech-to-text" className="hover:text-teal-400 transition-colors">Speech-to-Text (Transcripts)</Link>
              </li>
              <li>
                <Link to="/quick-communication" className="hover:text-teal-400 transition-colors">Quick Situation Cards</Link>
              </li>
              <li>
                <Link to="/learn-signs" className="hover:text-teal-400 transition-colors">Sign Language Library</Link>
              </li>
            </ul>
          </div>

          {/* Platform & Transparency */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-slate-200 font-semibold mb-3">Transparency</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">Honest AI Limitations</Link>
              </li>
              <li>
                <Link to="/settings" className="hover:text-teal-400 transition-colors">Accessibility Preferences</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-teal-400 transition-colors">Privacy &amp; Data Ethics</Link>
              </li>
              <li>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-teal-400 transition-colors"
                >
                  GitHub Source Code
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Ethical AI & Privacy Disclosure Notice */}
        <div className="pt-6 border-t border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              Ethical Disclosure: SignBridge AI features transparent demo gesture classification. It does not replace full sign-language certified interpreters.
            </span>
          </div>
          <p>© {new Date().getFullYear()} SignBridge AI. Open Source Accessibility Initiative.</p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
