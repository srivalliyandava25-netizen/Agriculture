import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../i18n/en.json';
import hi from '../i18n/hi.json';
import mr from '../i18n/mr.json';
import pa from '../i18n/pa.json';
import bn from '../i18n/bn.json';
import ta from '../i18n/ta.json';
import { useAuth } from './AuthContext.jsx';
import { api } from '../services/api.js';

export const LANGUAGE_OPTIONS = [
  { code: 'en', native: 'English', states: 'English' },
  { code: 'hi', native: 'हिन्दी', states: 'Hindi · 12 states and union territories' },
  { code: 'bn', native: 'বাংলা', states: 'Bengal · Tripura · Assam' },
  { code: 'te', native: 'తెలుగు', states: 'Andhra Pradesh · Telangana' },
  { code: 'ta', native: 'தமிழ்', states: 'Tamil Nadu · Puducherry' },
  { code: 'mr', native: 'मराठी', states: 'Maharashtra · Goa' },
  { code: 'gu', native: 'ગુજરાતી', states: 'Gujarat · Dadra and Nagar Haveli and Daman and Diu' },
  { code: 'kn', native: 'ಕನ್ನಡ', states: 'Karnataka' },
  { code: 'ml', native: 'മലയാളം', states: 'Kerala · Lakshadweep' },
  { code: 'pa', native: 'ਪੰਜਾਬੀ', states: 'Punjab · Chandigarh · Haryana' },
  { code: 'or', native: 'ଓଡ଼ିଆ', states: 'Odisha' },
  { code: 'ur', native: 'اردو', states: 'Jammu and Kashmir · Telangana · Uttar Pradesh' },
  { code: 'as', native: 'অসমীয়া', states: 'Assam' },
  { code: 'ks', native: 'कॉशुर', states: 'Jammu and Kashmir' },
  { code: 'kok', native: 'कोंकणी', states: 'Goa · Karnataka · Maharashtra' },
  { code: 'mai', native: 'मैथिली', states: 'Bihar · Jharkhand' },
  { code: 'mni', native: 'মৈতৈলোন্', states: 'Manipur' },
  { code: 'ne', native: 'नेपाली', states: 'Sikkim · West Bengal' },
  { code: 'sd', native: 'سنڌي', states: 'Rajasthan · Gujarat' },
  { code: 'sa', native: 'संस्कृतम्', states: 'Uttarakhand · Himachal Pradesh' },
  { code: 'sat', native: 'ᱥᱟᱱᱛᱟᱞᱤ', states: 'Jharkhand · Odisha · West Bengal' },
  { code: 'brx', native: 'बड़ो', states: 'Assam' },
  { code: 'doi', native: 'डोगरी', states: 'Jammu and Kashmir' },
  { code: 'lus', native: 'Mizo', states: 'Mizoram' },
  { code: 'kha', native: 'Khasi', states: 'Meghalaya' },
  { code: 'trp', native: 'Kokborok', states: 'Tripura' }
];

export const SPEECH_LANGUAGE_CODES = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN',
  gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN', ur: 'ur-IN',
  as: 'as-IN', ne: 'ne-NP'
};

const translations = { en, hi, mr, pa, bn, ta };

const setGoogleTranslationCookie = (language) => {
  const value = language === 'en' ? '/en/en' : `/en/${language}`;
  document.cookie = `googtrans=${value}; path=/`;
  document.cookie = `googtrans=${value}; path=/; domain=${window.location.hostname}`;
};

const applyWebsiteTranslation = (language) => {
  document.documentElement.lang = language;
  setGoogleTranslationCookie(language);
  if (!window.google || !window.google.translate) return false;

  const select = document.querySelector('.goog-te-combo');
  if (!select) return false;

  if (select.value !== language) {
    select.value = language;
    select.dispatchEvent(new Event('change', { bubbles: true }));
  }
  return true;
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  const [lang, setLangState] = useState(() => {
    return localStorage.getItem('mittimitra_lang') || 'en';
  });

  const [isSpeaking, setIsSpeaking] = useState(false);

  const setLang = (newLang) => {
    const normalizedLanguage = LANGUAGE_OPTIONS.some((language) => language.code === newLang) ? newLang : 'en';
    setLangState(normalizedLanguage);
    localStorage.setItem('mittimitra_lang', normalizedLanguage);
    setGoogleTranslationCookie(normalizedLanguage);

    if (isAuthenticated) {
      api.put('/auth/profile', { preferredLanguage: normalizedLanguage }).catch((error) => {
        console.warn('[Language] Could not save account preference:', error.message);
      });
    }
  };

  useEffect(() => {
    if (!isAuthenticated || !user?.preferredLanguage || localStorage.getItem('mittimitra_lang')) return;
    const savedLanguage = user.preferredLanguage;
    if (LANGUAGE_OPTIONS.some((language) => language.code === savedLanguage)) {
      setLang(savedLanguage);
    }
  }, [isAuthenticated, user?.preferredLanguage]);

  const t = (path) => {
    const keys = path.split('.');
    let current = translations[lang] || translations.en;
    for (const key of keys) {
      if (!current || current[key] === undefined) {
        // Fallback to English if key missing
        let fallback = translations.en;
        for (const fKey of keys) {
          if (!fallback || fallback[fKey] === undefined) return path;
          fallback = fallback[fKey];
        }
        return fallback;
      }
      current = current[key];
    }
    return current;
  };

  // Web Speech API Text-to-Speech
  const speak = (text) => {
    if (!('speechSynthesis' in window)) {
      alert('Voice synthesis is not supported on this browser.');
      return;
    }

    window.speechSynthesis.cancel();
    if (!text) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = SPEECH_LANGUAGE_CODES[lang] || 'en-IN';
    utterance.rate = 0.9; // clear, comfortable speed for farmers

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  useEffect(() => {
    const supportedLanguages = LANGUAGE_OPTIONS.map((language) => language.code).join(',');
    window.googleTranslateElementInit = () => {
      if (!window.google?.translate?.TranslateElement) return;
      new window.google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: supportedLanguages,
          autoDisplay: false
        },
        'google_translate_element'
      );
    };

    if (!document.getElementById('google-translate-script')) {
      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    } else if (window.google?.translate) {
      window.googleTranslateElementInit();
    }
  }, []);

  useEffect(() => {
    let attempts = 0;
    const timer = window.setInterval(() => {
      attempts += 1;
      if (applyWebsiteTranslation(lang) || attempts >= 60) {
        window.clearInterval(timer);
      }
    }, 250);

    const observer = new MutationObserver(() => {
      if (applyWebsiteTranslation(lang)) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearInterval(timer);
      observer.disconnect();
    };
  }, [lang]);

  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang, t, speak, stopSpeaking, isSpeaking }}>
      <div id="google_translate_element" aria-hidden="true" style={{ display: 'none' }} />
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

