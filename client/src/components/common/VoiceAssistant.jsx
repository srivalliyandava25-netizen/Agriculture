import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Volume2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';

const localeByLanguage = { en: 'en-IN', hi: 'hi-IN', mr: 'mr-IN', pa: 'pa-IN', bn: 'bn-IN', ta: 'ta-IN' };

export const VoiceAssistant = () => {
  const { lang, t, speak, stopSpeaking } = useLanguage();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.onresult = (event) => setQuestion(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognitionRef.current = recognition;
    return () => recognition.abort();
  }, []);

  useEffect(() => {
    if (recognitionRef.current) recognitionRef.current.lang = localeByLanguage[lang] || 'en-IN';
  }, [lang]);

  const startListening = () => {
    if (!recognitionRef.current) {
      alert(lang === 'hi' ? 'यह ब्राउज़र आवाज़ पहचान समर्थित नहीं करता।' : 'Voice input is not supported in this browser.');
      return;
    }
    stopSpeaking();
    setListening(true);
    recognitionRef.current.start();
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const getAnswer = (text) => {
    const normalized = text.toLowerCase();
    if (/crop|फसल|पीक|फसल कोणती|फसल कौन/.test(normalized)) {
      return lang === 'hi'
        ? 'फसल का चुनाव मिट्टी का प्रकार, मौसम, सिंचाई और उपलब्ध मिट्टी-परीक्षण आंकड़ों पर निर्भर करता है। सटीक सलाह के लिए Crop Recommendation पर खेत की जानकारी भरें।'
        : lang === 'mr' ? 'पीक निवड मातीचा प्रकार, हंगाम, सिंचन आणि माती चाचणीच्या माहितीवर अवलंबून आहे. योग्य शिफारसासाठी फसल शिफारस पृष्ठ वापरा.' : 'Crop choice depends on soil type, season, irrigation and laboratory soil-test data. Open Crop Recommendation and enter your field details.';
    }
    if (/soil|मिट्टी|माती|माटি/.test(normalized)) {
      return lang === 'hi' ? 'मिट्टी के pH, NPK और जैविक कार्बन की विश्वसनीय जानकारी के लिए मिट्टी-परीक्षण करवाएं। फोटो केवल सतह के रंग और बनावट का प्रारंभिक अनुमान दे सकती है।' : 'For reliable soil recommendations, submit a soil sample for pH and NPK testing. A photograph can only give a preliminary indication of visible soil characteristics.';
    }
    if (/water|पानी|सिंचाई|पाणी|जल/.test(normalized)) {
      return lang === 'hi' ? 'मिट्टी की नमी जांचें और सिंचाई मौसम व फसल अवस्था के अनुसार करें। छिद्र-सिंचाई, सुबह-शाम सिंचाई और वर्षा का पूर्वानुमान मिलाकर पानी बचाएं।' : 'Check soil moisture and water according to crop stage and weather. Drip irrigation, early-morning watering and rain forecasts can reduce water use.';
    }
    return lang === 'hi'
      ? 'मैं सामान्य खेती संबंधी मार्गदर्शन दे सकता हूँ। कृपया फसल, मिट्टी, सिंचाई या बीमारी से जुड़ा अपना प्रश्न थोड़ा विस्तार से पूछें। गंभीर समस्या के लिए स्थानीय कृषि अधिकारी या KVK से संपर्क करें।'
      : 'I can provide general farming guidance. Please ask more specifically about a crop, soil, irrigation, or disease. For a serious problem, consult your local agricultural officer or KVK.';
  };

  const ask = (e) => {
    e?.preventDefault();
    const text = question.trim();
    if (!text) return;
    const response = getAnswer(text);
    setAnswer(response);
    speak(response);
  };

  return (
    <>
      {!open && (
        <button type="button" onClick={() => setOpen(true)} className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary-700 px-4 py-3 text-xs font-bold text-white shadow-lg hover:bg-primary-800" aria-label="Open voice assistant">
          <Mic className="w-4 h-4" /> {lang === 'hi' ? 'आवाज़ से पूछें' : 'Ask by voice'}
        </button>
      )}
      {open && (
        <section className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl" aria-label="Voice farming assistant">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div><h2 className="text-sm font-black text-slate-900">{t('voiceAssistant.title')}</h2><p className="text-[10px] text-slate-500">{t('voiceAssistant.prompt')}</p></div>
            <button type="button" onClick={() => { stopSpeaking(); setOpen(false); }} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={ask} className="mt-4 flex gap-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t('voiceAssistant.placeholder')} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs" />
            <button type="button" onClick={listening ? stopListening : startListening} className={`rounded-xl px-3 ${listening ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`} aria-label={listening ? 'Stop listening' : 'Start voice input'}>{listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
            <button type="submit" className="rounded-xl bg-primary-700 px-3 text-white"><Send className="w-4 h-4" /></button>
          </form>
          {listening && <p className="mt-2 text-[10px] font-bold text-red-600">Listening…</p>}
          {answer && <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-950"><div className="mb-2 flex items-center justify-between font-bold"><span>Answer</span><button type="button" onClick={() => speak(answer)}><Volume2 className="w-4 h-4" /></button></div>{answer}</div>}
        </section>
      )}
    </>
  );
};
