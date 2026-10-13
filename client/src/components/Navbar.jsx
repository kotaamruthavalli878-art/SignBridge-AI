import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Camera, 
  Volume2, 
  Mic, 
  BookOpen, 
  MessageSquare, 
  LayoutDashboard, 
  Settings, 
  Info, 
  Globe, 
  Eye, 
  Type, 
  Menu, 
  X, 
  LogOut, 
  User, 
  Sparkles 
} from 'lucide-react';
import { useAccessibility } from '../context/AccessibilityContext';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { fontSize, setFontSize, highContrast, setHighContrast, language, toggleLanguage, t } = useAccessibility();
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const cycleFontSize = () => {
    if (fontSize === 'normal') setFontSize('large');
    else if (fontSize === 'large') setFontSize('xlarge');
    else setFontSize('normal');
  };

  const navLinks = [
    { to: '/sign-to-text', label: t('signToText'), icon: Camera },
    { to: '/text-to-speech', label: t('textToSpeech'), icon: Volume2 },
    { to: '/speech-to-text', label: t('speechToText'), icon: Mic },
    { to: '/learn-signs', label: t('learnSigns'), icon: BookOpen },
    { to: '/quick-communication', label: t('quickComm'), icon: MessageSquare },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 text-slate-100">
      {/* Skip Link for screen readers & keyboard navigation */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-teal-500 focus:text-slate-950 focus:font-bold focus:rounded-md focus:shadow-lg"
      >
        Skip to main content
      </a>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 rounded-lg p-1"
            aria-label="SignBridge AI Homepage"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-teal-500 to-cyan-400 flex items-center justify-center text-slate-950 shadow-md shadow-teal-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-heading font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                SignBridge <span className="text-teal-400">AI</span>
              </span>
              <span className="block text-[10px] tracking-wider uppercase text-slate-400 font-semibold">
                Accessibility Platform
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const active = isActive(link.to);
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    active
                      ? 'bg-teal-500/15 text-teal-300 border border-teal-500/30'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${active ? 'text-teal-400' : 'text-slate-400'}`} />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Right Action Tools: Accessibility Toggles & Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Language Switcher */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
              title="Switch language between English and Telugu"
              aria-label={`Current language: ${language === 'en' ? 'English' : 'Telugu'}. Click to switch.`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-400" />
              <span>{language === 'en' ? 'EN' : 'తెలుగు'}</span>
            </button>

            {/* Font Size Cycle */}
            <button
              onClick={cycleFontSize}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-slate-600 transition-colors"
              title="Adjust text size (Normal / Large / Extra Large)"
              aria-label={`Text size current: ${fontSize}. Click to enlarge.`}
            >
              <Type className="w-3.5 h-3.5 text-cyan-400" />
              <span>{fontSize === 'normal' ? 'A' : fontSize === 'large' ? 'A+' : 'A++'}</span>
            </button>

            {/* High Contrast Toggle */}
            <button
              onClick={() => setHighContrast(!highContrast)}
              className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
                highContrast
                  ? 'bg-yellow-400 text-black border-yellow-300 font-bold'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700 hover:border-slate-600'
              }`}
              title="Toggle High Contrast Mode"
              aria-label={`High contrast mode is ${highContrast ? 'enabled' : 'disabled'}. Click to toggle.`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contrast</span>
            </button>

            {/* Auth Buttons */}
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-teal-600/20 text-teal-300 border border-teal-500/30 hover:bg-teal-600/30 transition-colors"
                  title="Open User Dashboard"
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-teal-400" />
                  <span className="hidden md:inline">{user?.name?.split(' ')[0] || 'Dashboard'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-red-400 hover:bg-slate-800 transition-colors"
                  title="Log out of account"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 pl-2 border-l border-slate-800">
                <Link
                  to="/login"
                  className="px-3 py-1.5 rounded-lg text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  {t('login')}
                </Link>
                <Link
                  to="/register"
                  className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-teal-500 text-slate-950 hover:bg-teal-400 transition-colors shadow-sm shadow-teal-500/20"
                >
                  {t('register')}
                </Link>
              </div>
            )}

            {/* Mobile menu hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 focus:outline-none"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 bg-slate-900 border-b border-slate-800 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const active = isActive(link.to);
            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-medium ${
                  active ? 'bg-teal-500/20 text-teal-300' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-teal-400" />
                {link.label}
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-800 flex flex-col gap-1">
            <Link
              to="/settings"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              <Settings className="w-4 h-4 text-slate-400" />
              {t('settings')}
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-slate-300 hover:bg-slate-800"
            >
              <Info className="w-4 h-4 text-slate-400" />
              {t('about')}
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
