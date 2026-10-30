import React, { useEffect, useRef, useState } from 'react';
import { Mic, MicOff, Send, Volume2, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext.jsx';
import { api } from '../../services/api.js';

const localeByLanguage = {
  en: 'en-IN', hi: 'hi-IN', bn: 'bn-IN', te: 'te-IN', ta: 'ta-IN', mr: 'mr-IN',
  gu: 'gu-IN', kn: 'kn-IN', ml: 'ml-IN', pa: 'pa-IN', or: 'or-IN', ur: 'ur-IN',
  as: 'as-IN', ks: 'ks-IN', kok: 'kok-IN', mai: 'mai-IN', mni: 'mni-IN', ne: 'ne-NP',
  sd: 'sd-IN', sa: 'sa-IN', sat: 'sat-IN', brx: 'brx-IN', doi: 'doi-IN',
  lus: 'lus-IN', kha: 'kha-IN', trp: 'trp-IN'
};

const responseByLanguage = {
  en: 'I can provide general farming guidance. Please ask about a crop, soil, irrigation, disease, or farming cost. For a serious problem, consult a local agricultural officer or Krishi Vigyan Kendra.',
  hi: 'मैं सामान्य खेती संबंधी मार्गदर्शन दे सकता हूँ। कृपया फसल, मिट्टी, सिंचाई, बीमारी या खेती की लागत के बारे में पूछें। गंभीर समस्या के लिए स्थानीय कृषि अधिकारी या कृषि विज्ञान केंद्र से संपर्क करें।',
  bn: 'আমি সাধারণ কৃষি নির্দেশনা দিতে পারি। ফসল, মাটি, সেচ, রোগ বা খরচ সম্পর্কে প্রশ্ন করুন। গুরুতর সমস্যায় স্থানীয় কৃষি কর্মকর্তা বা কৃষি বিজ্ঞান কেন্দ্রে যোগাযোগ করুন।',
  te: 'నేను సాధారణ వ్యవసాయ మార్గదర్శకం ఇవ్వగలను. పంట, నేల, నీటిపారుదల, తెగులు లేదా ఖర్చుల గురించి అడగండి. తీవ్రమైన సమస్యకు స్థానిక వ్యవసాయ అధికారిని లేదా వ్యవసాయ విజ్ఞాన కేంద్రాన్ని సంప్రదించండి.',
  ta: 'நான் பொதுவான விவசாய வழிகாட்டுதலை வழங்க முடியும். பயிர், மண், நீர்ப்பாசனம், நோய் அல்லது செலவு பற்றி கேளுங்கள். கடுமையான பிரச்சனைக்கு உள்ளூர் வேளாண் அதிகாரி அல்லது வேளாண் அறிவியல் மையத்தை அணுகுங்கள்.',
  mr: 'मी सामान्य शेती मार्गदर्शन देऊ शकतो. पीक, माती, सिंचन, रोग किंवा खर्चाबद्दल विचारा. गंभीर समस्येसाठी स्थानिक कृषी अधिकारी किंवा कृषी विज्ञान केंद्राशी संपर्क साधा.',
  gu: 'હું સામાન્ય ખેતી માર્ગદર્શન આપી શકું છું. પાક, માટી, સિંચાઈ, રોગ અથવા ખર્ચ વિશે પૂછો. ગંભીર સમસ્યા હોય તો સ્થાનિક કૃષિ અધિકારી અથવા કૃષિ વિજ્ઞાન કેન્દ્રનો સંપર્ક કરો.',
  kn: 'ನಾನು ಸಾಮಾನ್ಯ ಕೃಷಿ ಮಾರ್ಗದರ್ಶನ ನೀಡಬಹುದು. ಬೆಳೆ, ಮಣ್ಣು, ನೀರಾವರಿ, ರೋಗ ಅಥವಾ ಖರ್ಚು ಬಗ್ಗೆ ಕೇಳಿ. গুরুತರ ಸಮಸ್ಯೆಗೆ ಸ್ಥಳೀಯ ಕೃಷಿ ಅಧಿಕಾರಿ ಅಥವಾ ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರವನ್ನು ಸಂಪರ್ಕಿಸಿ.',
  ml: 'ഞാൻ പൊതു കാർഷിക मार्गനിർദേശം നൽകാം. വിള, മണ്ണ്, ജലസേചനം, രോഗം അല്ലെങ്കിൽ ചെലവ് എന്നിവയെക്കുറിച്ച് ചോദിക്കുക. ഗുരുതര പ്രശ്നമെങ്കിൽ ഉദ്ദേശ്യ സ്ഥലിയ കാർഷിക ഓഫീസറെയോ കാർഷിക വിജ്ഞാന കേന്ദ്രത്തെയോ സമീപിക്കുക.',
  pa: 'ਮੈਂ ਆਮ ਖੇਤੀ ਸਬੰਧੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ। ਫਸਲ, ਮਿੱਟੀ, ਸਿੰਚਾਈ, ਬਿਮਾਰੀ ਜਾਂ ਖਰਚੇ ਬਾਰੇ ਪੁੱਛੋ। ਗੰਭੀਰ ਸਮੱਸਿਆ ਲਈ ਸਥਾਨਕ ਖੇਤੀ ਅਧਿਕਾਰੀ ਜਾਂ Krishi Vigyan Kendra ਨਾਲ ਸੰਪਰਕ ਕਰੋ।',
  or: 'ମୁଁ ସାଧାରଣ କୃଷି ପରାମର୍ଶ ଦେଇପାରେ। ଫସଲ, ମାଟି, ଜଳସେଚନ, ରୋଗ କିମ୍ବା ଖର୍ଚ୍ଚ ବିଷୟରେ ପଚାରନ୍ତୁ। ଗମ୍ଭୀର ସମସ୍ୟା ପାଇଁ ସ୍ଥାନୀୟ କୃଷି କର୍ମଚାରୀ ବା Krishi Vigyan Kendra ସହିତ ଯୋଗାଯୋଗ କରନ୍ତୁ।',
  ur: 'میں عام زرعی رہنمائی دے سکتا ہوں۔ فصل، مٹی، آبپاشی، بیماری یا خرچ کے بارے میں پوچھیں۔ سنجیدہ مسئلہ کے لیے مقامی زرعی افسر یا Krishi Vigyan Kendra سے رابطہ کریں۔',
  as: 'মই সাধাৰণ কৃষি পৰামৰ্শ দিব পাৰোঁ। শস্য, মাটি, সেচ, ৰোগ বা খৰচৰ বিষয়ে সোধক। গুৰুতৰ সমস্যাৰ বাবে স্থানীয় কৃষি অধিকাৰী বা কৃষি বিজ্ঞান কেন্দ্ৰৰ লগত যোগাযোগ কৰক।',
  ne: 'म सामान्य कृषि मार्गदर्शन दिन सक्छु। खेतीको फसल, माटो, सिंचाइ, रोग वा खर्च बारे सोध्नुहोस्। गम्भीर समस्या भएमा स्थानीय कृषि अधिकारी वा कृषि विज्ञान केन्द्रसँग सम्पर्क गर्नुहोस्।',
  sd: 'مان عام زراعت جي هدايت ڏئي سگهان ٿو. فصل، مٽي، آبپاشي، بيماري يا خرچ جي بابت پڇو. سنجيده مسئلي لاءِ مقامي زرعي آفيسر يا Krishi Vigyan Kendra سان رابطو ڪريو.',
  sa: 'अहं सामान्यकृषिविषयं मार्गदर्शनं दातुं शक्नोमि। सस्यं, मृत्तिका, सिंचनं, रोगः वा व्ययः इत्यस्मिन् पृच्छतु। गम्भीरसमस्यायां स्थानीयकृष्यधिकारीं वा Krishi Vigyan Kendra संपर्कतु।',
  mai: 'हम सामान्य कृषि सलाह दे सकै छी। फसल, मिट्टी, सिंचाई, रोग वा खर्च के संबंध मे पूछी। गंभीर समस्या होए त स्थानीय कृषि अधिकारी या Krishi Vigyan Kendra सँ संपर्क करी।',
  ks: 'بٕہ عام زراعت متعلق رہنمائی دِی سکاں۔ فصل، مٹی، آبپاشی، بیماری یا خرچ متعلق پُوژھِو۔ سنجیدہ مسئلہ آسانی کے لیے مقامی زرعی افسر یا Krishi Vigyan Kendra سے رابطہ کرِو۔',
  kok: 'हांव सामान्य शेती मार्गदर्शन दिवंक शकता. पीक, माती, सिंचन, रोग वा खर्चाबद्दल विचारात. गंभीर समस्या आसल्यार थळाव्या कृषि अधिकारी वा Krishi Vigyan Kendra कडेन संपर्क करात.',
  mni: 'ঐহাকনা মশীগী লৈয়াকি general মার্গদর্শন পীবা ঙম্লি। হৌফম, লৈতাক, ৺ইশিন, শিম্বা নত্রগা খরচগী চীংবীদনা। ওয়াখল নাৱা তমপোয়দা কাছিংবেক অগ্রিকলচার অফিসর নত্রগা Krishi Vigyan Kendra নরক।',
  sat: 'इं सामान्य खेती दिश गुराय माराय दाड़ेयाक्। फसल, माटी, सिंचाई, बीमारी आर खर्चबाबोत् कुलमेन। गंभीर समस्या रेयारे स्थानीय कृषि अधिकारी आर Krishi Vigyan Kendra सो संगोकमे।',
  brx: 'आंं आम साबिक खेती सलाह होनाय जानाय। फसल, हायज, सिंचाई, रोग एबा खार्चनि बारे जिखनाय। गम्भीर समस्या थाखाय सथानीय कृषि अफिसार एबा Krishi Vigyan Kendra जों फोन/संपर्क खालाम।',
  doi: 'मैं सामान्य खेती संबंधी सलाह दे सकदा आं। फसल, मिट्टी, सिंचाई, बीमारी जां खर्च बारे पुछो। गंभीर समस्या लेई स्थानीय कृषि अधिकारी जां Krishi Vigyan Kendra नाल संपर्क करो।',
  lus: 'Ka lo ngaihtuah phawt turin ka thei ang. Thlai, lei, tui pek, natna emaw senso chungchang zawt rawh. Chhiatna lian takah chuan local agriculture officer emaw Krishi Vigyan Kendra rawn rawh.',
  kha: 'Nga lah ban ai jing ka jing ka rukom kitshna. Kylli shaphang jingthung, khyndew, um pyllait, jingpang ne jinglut. Na ka jingpang kylli, shuhtrew sha ki ophisar ka jingtrep ne Krishi Vigyan Kendra.',
  trp: 'Ano bo umum kheti sidiya rwkma nung. Phai, ha, twi pala, khorong na kharcha bising sadi. Hamjakni bagwi somoi na jagthai ne local agriculture officer nai Krishi Vigyan Kendra swrup.'
};

export const VoiceAssistant = () => {
  const { lang, t, speak, stopSpeaking } = useLanguage();
  const [open, setOpen] = useState(false);
  const [listening, setListening] = useState(false);
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [answering, setAnswering] = useState(false);
  const [error, setError] = useState('');
  const recognitionRef = useRef(null);
  const recognitionActiveRef = useRef(false);
  const startingRef = useRef(false);
  const cancelledRef = useRef(false);
  const langRef = useRef(lang);

  useEffect(() => {
    langRef.current = lang;
    if (recognitionRef.current) recognitionRef.current.lang = localeByLanguage[lang] || 'en-IN';
  }, [lang]);

  const getAnswer = (text = '') => {
    const selectedLanguage = langRef.current;
    const input = text.toLowerCase();
    if (selectedLanguage === 'en') {
      if (/disease|fungus|leaf|pest|worm|rot|spot/.test(input)) {
        return 'For plant disease symptoms, upload a clear leaf or fruit photo in Plant Doctor. Check both leaf surfaces, isolate severely infected plants, and avoid spraying chemicals until the cause is identified.';
      }
      if (/soil|fertil|nutrient/.test(input)) {
        return 'For soil or fertilizer guidance, add your latest soil report and select the crop in Fertilizer & Nutrient Advisory. Use balanced nutrients and avoid applying fertilizer without confirming the field requirement.';
      }
      if (/water|irrigat|rain/.test(input)) {
        return 'For irrigation guidance, use soil moisture and crop stage instead of watering by a fixed schedule. Water early or late in the day and adjust during rain to prevent waterlogging.';
      }
      if (/weather/.test(input)) {
        return 'Open the Weather page for the forecast for your state and district. Check wind, rain, and temperature before spraying or harvesting.';
      }
      if (/price|mandi|market/.test(input)) {
        return 'Open Mandi Prices to compare commodity rates by state, district, market, and date. Verify the latest price with the local APMC or official portal before selling.';
      }
    }
    return responseByLanguage[selectedLanguage] || responseByLanguage.en;
  };

  const processQuestion = async (text) => {
    const trimmedText = text.trim();
    if (!trimmedText) return;
    setQuestion(trimmedText);
    setAnswering(true);
    setError('');
    try {
      const result = await api.post('/assistant/ask', {
        question: trimmedText,
        languageCode: langRef.current
      });
      const response = result.answer || getAnswer(trimmedText);
      setAnswer(response);
      speak(response, langRef.current);
    } catch (requestError) {
      const fallback = getAnswer(trimmedText);
      setAnswer(fallback);
      setError(requestError.message || 'Could not reach the AI assistant. Showing available guidance instead.');
    } finally {
      setAnswering(false);
    }
  };

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return undefined;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.lang = localeByLanguage[langRef.current] || 'en-IN';

    recognition.onstart = () => {
      startingRef.current = false;
      recognitionActiveRef.current = true;
      setListening(true);
      setError('');
    };

    recognition.onresult = (event) => {
      const transcript = event.results?.[0]?.[0]?.transcript;
      if (transcript) processQuestion(transcript);
    };

    recognition.onend = () => {
      recognitionActiveRef.current = false;
      startingRef.current = false;
      setListening(false);
    };

    recognition.onerror = (event) => {
      recognitionActiveRef.current = false;
      startingRef.current = false;
      setListening(false);
      const isHindi = langRef.current === 'hi';
      const messages = {
        'not-allowed': isHindi ? 'माइक्रोफोन की अनुमति नहीं मिली। कृपया ब्राउज़र सेटिंग में माइक्रोफोन अनुमति चालू करें।' : 'Microphone permission was denied. Allow microphone access in your browser settings.',
        'service-not-allowed': isHindi ? 'इस ब्राउज़र ने आवाज़ पहचान की अनुमति नहीं दी। HTTPS या Chrome/Edge का उपयोग करें।' : 'Speech recognition is blocked by this browser. Use HTTPS or Chrome/Edge.',
        'no-speech': isHindi ? 'कोई आवाज़ नहीं सुनाई दी। फिर से बोलकर प्रयास करें।' : 'No speech was detected. Please try again.',
        'audio-capture': isHindi ? 'माइक्रोफोन उपलब्ध नहीं है या उपयोग में है।' : 'No microphone is available, or it is already in use.',
        'network': isHindi ? 'आवाज़ पहचान नेटवर्क सेवा उपलब्ध नहीं है।' : 'Speech recognition network service is unavailable.',
        aborted: isHindi ? 'आवाज़ सुनना रोक दिया गया।' : 'Voice listening was stopped.'
      };
      if (event.error !== 'aborted') setError(messages[event.error] || (isHindi ? 'आवाज़ पहचान में त्रुटि हुई। फिर से प्रयास करें।' : 'Voice recognition failed. Please try again.'));
    };

    recognitionRef.current = recognition;
    return () => {
      cancelledRef.current = true;
      recognitionActiveRef.current = false;
      recognition.onresult = null;
      recognition.onend = null;
      recognition.onerror = null;
      try { recognition.abort(); } catch { /* Recognition may already be stopped. */ }
      recognitionRef.current = null;
    };
  }, []);

  const startListening = () => {
    const recognition = recognitionRef.current;
    if (!recognition) {
      setError(langRef.current === 'hi' ? 'यह ब्राउज़र आवाज़ पहचान समर्थित नहीं करता। Chrome या Edge का उपयोग करें।' : 'Voice input is not supported in this browser. Use Chrome or Edge.');
      return;
    }
    if (recognitionActiveRef.current || startingRef.current) return;

    setError('');
    stopSpeaking();
    cancelledRef.current = false;
    startingRef.current = true;
    recognition.lang = localeByLanguage[langRef.current] || 'en-IN';

    try {
      setListening(true);
      recognition.start();
    } catch (startError) {
      startingRef.current = false;
      recognitionActiveRef.current = false;
      setListening(false);
      if (startError?.name === 'InvalidStateError') {
        return;
      }
      setError(langRef.current === 'hi'
        ? 'माइक्रोफोन शुरू नहीं हो सका। अनुमति और माइक्रोफोन जांचें।'
        : 'Could not start the microphone. Check microphone access and try again.');
    }
  };

  const stopListening = () => {
    cancelledRef.current = true;
    startingRef.current = false;
    if (recognitionActiveRef.current && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch { /* Recognition may already be stopped. */ }
    }
    recognitionActiveRef.current = false;
    setListening(false);
  };

  const ask = (e) => {
    e?.preventDefault();
    processQuestion(question);
  };

  return (
    <>
      {!open && (
        <button type="button" onClick={() => { setOpen(true); startListening(); }} className="fixed bottom-5 right-5 z-[60] flex items-center gap-2 rounded-full bg-primary-700 px-4 py-3 text-xs font-bold text-white shadow-lg hover:bg-primary-800" aria-label="Open voice assistant and start listening">
          <Mic className="w-4 h-4" /> {lang === 'hi' ? 'आवाज़ से पूछें' : 'Ask by voice'}
        </button>
      )}
      {open && (
        <section className="fixed bottom-5 right-5 z-[60] w-[calc(100vw-2rem)] max-w-sm rounded-3xl border border-slate-200 bg-white p-5 shadow-2xl" aria-label="Voice farming assistant">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 pb-3">
            <div><h2 className="text-sm font-black text-slate-900">{t('voiceAssistant.title')}</h2><p className="text-[10px] text-slate-500">{t('voiceAssistant.prompt')}</p></div>
            <button type="button" onClick={() => { stopListening(); stopSpeaking(); setOpen(false); }} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={ask} className="mt-4 flex gap-2">
            <input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder={t('voiceAssistant.placeholder')} className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-xs" />
            <button type="button" onClick={listening ? stopListening : startListening} className={`rounded-xl px-3 ${listening ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`} aria-label={listening ? 'Stop listening' : 'Start voice input'}>{listening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}</button>
            <button type="submit" className="rounded-xl bg-primary-700 px-3 text-white"><Send className="w-4 h-4" /></button>
          </form>
          {error && <p className="mt-2 rounded-lg bg-red-50 px-3 py-2 text-[10px] font-semibold text-red-700" role="alert">{error}</p>}
          {listening && <p className="mt-2 text-[10px] font-bold text-red-600">Listening…</p>}
          {answering && <p className="mt-2 text-[10px] font-bold text-primary-700" role="status">Generating answer…</p>}
          {answer && <div className="mt-4 rounded-2xl border border-emerald-100 bg-emerald-50 p-3 text-xs leading-relaxed text-emerald-950"><div className="mb-2 flex items-center justify-between font-bold"><span>Answer</span><button type="button" onClick={() => speak(answer, langRef.current)}><Volume2 className="w-4 h-4" /></button></div>{answer}</div>}        </section>
      )}
    </>
  );
};
