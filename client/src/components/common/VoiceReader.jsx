import React from 'react';
import { Volume2, VolumeX } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

export const VoiceReader = ({ text, label = 'Listen', className = '' }) => {
  const { speak, stopSpeaking, isSpeaking } = useLanguage();

  const handleToggle = (e) => {
    e.stopPropagation();
    if (isSpeaking) {
      stopSpeaking();
    } else {
      speak(text);
    }
  };

  return (
    <button
      onClick={handleToggle}
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
        isSpeaking
          ? 'bg-amber-100 text-amber-900 border border-amber-300 animate-pulse'
          : 'bg-primary-50 text-primary-800 hover:bg-primary-100 border border-primary-200'
      } ${className}`}
      title={isSpeaking ? 'Stop speaking' : 'Read aloud in current language'}
      aria-label="Text to speech reader"
    >
      {isSpeaking ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
      <span>{isSpeaking ? 'Stop' : label}</span>
    </button>
  );
};

