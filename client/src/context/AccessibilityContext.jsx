import React, { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../utils/translations';

const AccessibilityContext = createContext(null);

export const AccessibilityProvider = ({ children }) => {
  const [fontSize, setFontSize] = useState(() => {
    return localStorage.getItem('signbridge_font_size') || 'normal';
  });

  const [highContrast, setHighContrast] = useState(() => {
    return localStorage.getItem('signbridge_high_contrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState(() => {
    return localStorage.getItem('signbridge_reduced_motion') === 'true';
  });

  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('signbridge_language') || 'en';
  });

  // Apply DOM classes dynamically whenever settings change
  useEffect(() => {
    const root = document.documentElement;

    // Font size
    root.classList.remove('font-size-large', 'font-size-xlarge');
    if (fontSize === 'large') root.classList.add('font-size-large');
    if (fontSize === 'xlarge') root.classList.add('font-size-xlarge');
    localStorage.setItem('signbridge_font_size', fontSize);

    // High Contrast
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
    localStorage.setItem('signbridge_high_contrast', String(highContrast));

    // Reduced Motion
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
    localStorage.setItem('signbridge_reduced_motion', String(reducedMotion));

    // Language
    root.setAttribute('lang', language);
    localStorage.setItem('signbridge_language', language);
  }, [fontSize, highContrast, reducedMotion, language]);

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'te' : 'en'));
  };

  const t = (key) => {
    return translations[language]?.[key] || translations['en']?.[key] || key;
  };

  return (
    <AccessibilityContext.Provider
      value={{
        fontSize,
        setFontSize,
        highContrast,
        setHighContrast,
        reducedMotion,
        setReducedMotion,
        language,
        setLanguage,
        toggleLanguage,
        t,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
};

export const useAccessibility = () => {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within AccessibilityProvider');
  }
  return context;
};
