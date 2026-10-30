const LANGUAGE_NAMES = {
  en: 'English', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', ta: 'Tamil', mr: 'Marathi',
  gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', ur: 'Urdu',
  as: 'Assamese', ks: 'Kashmiri', kok: 'Konkani', mai: 'Maithili', mni: 'Manipuri', ne: 'Nepali',
  sd: 'Sindhi', sa: 'Sanskrit', sat: 'Santali', brx: 'Bodo', doi: 'Dogri', lus: 'Mizo',
  kha: 'Khasi', trp: 'Kokborok'
};

const callAI = async ({ prompt, language, temperature = 0.2 }) => {
  const apiKey = process.env.AI_SERVICE_API_KEY?.trim();
  if (!apiKey) return null;
  const apiUrl = process.env.AI_SERVICE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_SERVICE_MODEL || 'gpt-4o-mini';
  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({
      model,
      temperature,
      messages: [
        { role: 'system', content: `You are the Mitti Mitra agricultural assistant. Answer in ${language}. Give practical, accurate, location-appropriate farming advice. Never invent diagnosis or exact pesticide doses. Be concise, safe, and useful.` },
        { role: 'user', content: prompt }
      ]
    })
  });
  if (!response.ok) throw new Error(`AI service returned ${response.status}`);
  const data = await response.json();
  return data.choices?.[0]?.message?.content?.trim() || null;
};

const getFallbackAdvice = ({ title, cropName, topic, description, state, district }) => {
  const crop = cropName?.trim() || 'the crop';
  const issue = topic?.replaceAll('_', ' ') || 'general crop concern';
  return {
    diagnosis: `Preliminary assessment: the reported problem may be related to ${issue}. Visible symptoms, crop stage, weather, soil moisture, pests, and nutrient history are needed for a more certain diagnosis.`,
    recommendation: `For ${crop}, inspect both upper and lower leaves, roots, soil moisture, and spreading damage. Isolate severely affected plants and avoid applying multiple chemicals together. Follow approved product labels and use photographs for uncertain symptoms.`,
    preventiveActions: `Improve drainage, avoid overwatering, remove severely damaged plant material, maintain spacing, and keep balanced crop nutrition. ${district || state ? `Consider local field conditions in ${[district, state].filter(Boolean).join(', ')}.` : ''}`,
    generatedAt: new Date(), responseSource: 'ai'
  };
};

export const generateGeneralVoiceAnswer = async ({ question, languageCode = 'en' }) => {
  const language = LANGUAGE_NAMES[languageCode] || 'English';
  const text = String(question || '').toLowerCase();
  const questionFallback = (answer) => answer;
  let localAnswer = '';
  if (/wheat|गेहूं|गेहुं/.test(text) && /water|irrig|पानी|सिंचाई/.test(text)) {
    localAnswer = 'For wheat, use light irrigation at crown-root initiation, tillering, jointing/booting, flowering, and grain-filling stages when soil moisture is low. Avoid standing water and stop irrigation before harvest when the grain hardens. Adjust frequency for rain, soil type, and temperature.';
  } else if (/wheat|गेहूं/.test(text)) {
    localAnswer = 'For wheat, select a variety suited to your state and sowing time, prepare a level seedbed, and use soil-test-based fertilizer. Maintain moisture at critical growth stages, monitor for rust and aphids, and harvest when ears and grains are fully mature.';
  } else if (/rice|paddy|धान/.test(text) && /water|irrig|pani|पानी|जल/.test(text)) {
    localAnswer = 'For rice, maintain shallow standing water during active tillering, but drain before land preparation and harvest. Use alternate wetting and drying where suitable, and prevent deep standing water around seedlings. Reduce irrigation if rain is expected or if the field is waterlogged.';
  } else if (/tomato|टमाटर/.test(text) && /disease|spot|leaf|pest|fungus|रोग/.test(text)) {
    localAnswer = 'For tomato leaf spots or disease, remove severely affected leaves, keep foliage dry, improve spacing and airflow, and avoid overhead irrigation. Check both leaf surfaces for insects or fungal growth, then upload a clear close-up and whole-plant photo in Plant Doctor. Do not apply an unidentified pesticide or seed treatment.';
  } else if (/fertil|soil|nutrient|खाद|मिट्टी/.test(text)) {
    localAnswer = 'Use a recent soil test and crop requirement before choosing fertilizer. Apply nitrogen in split doses, place fertilizer near the root zone rather than broadcasting unnecessarily, and add organic matter when available. Do not mix fertilizer with pesticides unless the approved label confirms compatibility.';
  } else if (/water|irrigat|drip|पानी|सिंचाई/.test(text)) {
    localAnswer = 'Check soil moisture at root depth and irrigate according to crop stage rather than a fixed schedule. Prefer drip or sprinkler irrigation where suitable, water early or late to reduce evaporation, and stop irrigation before heavy rain or if waterlogging is visible.';
  } else if (/disease|fungus|leaf spot|pest|worm|yellow|rot|रोग|कीट/.test(text)) {
    localAnswer = 'Separate and inspect healthy and affected plants. Record crop stage, weather, watering, and recent fertilizer or pesticide use. Upload clear close-up and whole-field photos for disease identification. Remove severely infected material and use only an approved product after confirming the cause.';
  } else if (/price|mandi|market|भाव|मंडी/.test(text)) {
    localAnswer = 'Open Mandi Prices and select your state, district, crop, market, and date. Compare modal, minimum, and maximum prices, then verify the latest quote with the local APMC, trader, or official Agmarknet information before selling.';
  } else if (/weather|rain|temperature|मौसम|बारिश/.test(text)) {
    localAnswer = 'Check your district forecast for rainfall, wind, humidity, and temperature before irrigation, spraying, fertilizer application, or harvesting. Stop spraying if strong wind or rain is expected and avoid field work during lightning or heat warnings.';
  } else if (/cost|expense|budget|खर्च/.test(text)) {
    localAnswer = 'List seed, fertilizer, labor, irrigation, machinery, transport, and pesticide costs per acre. Record each expense against the crop and activity so the Cost Calculator can show the total expenditure and expected break-even price.';
  } else {
    localAnswer = '';
  }
  const fallbackAnswers = {
    en: localAnswer || 'Please provide the crop name, state, growth stage, and the specific symptom or question so I can give practical guidance.',
    hi: 'कृपया फसल का नाम, राज्य, फसल की अवस्था और समस्या या प्रश्न बताएं ताकि मैं उपयोगी सलाह दे सकूं।',
    te: 'మరింత సరైన మార్గదర్శనం కోసం పంట పేరు, రాష్ట్రం, పెరుగుదల స్థాయి మరియు సమస్యను వివరించండి.',
    ta: 'சிறந்த வழிகாட்டுதலுக்கு பயிரின் பெயர், மாநிலம், வளர்ச்சி நிலை மற்றும் பிரச்சனை அல்லது கேள்வியைச் சொல்லுங்கள்.'
  };
  const nativeFallback = {
    hi: {
      wheatWater: 'गेहूं में कम मिट्टी की नमी होने पर मुकुट-मूल प्रारंभ, कल्ले निकलना, गांठ बनना, फूल आने और दाने भरने की अवस्था में हल्की सिंचाई करें। खेत में पानी जमा न होने दें और कटाई से पहले सिंचाई बंद करें। बारिश, मिट्टी और तापमान के अनुसार समय बदलें।',
      water: 'फसल की जड़ वाली मिट्टी की नमी जांचें और फसल की अवस्था के अनुसार सिंचाई करें। टपक सिंचाई का उपयोग करें, सुबह या शाम पानी दें और बारिश या जलभराव से बचें।',
      disease: 'पौधे की पत्तियों के ऊपरी और नीचे दोनों हिस्से जांचें, गंभीर रूप से प्रभावित पौधों को अलग करें और स्पष्ट फोटो प्लांट डॉक्टर में भेजें। लेबल के बिना कोई रसायन न डालें।',
      mandi: 'मंडी मूल्य में अपनी राज्य, जिला, फसल और बाजार चुनें। न्यूनतम, अधिकतम और modal भाव की तुलना करें, फिर बेचने से पहले स्थानीय एपीएमसी से अंतिम दर सत्यापित करें।',
      weather: 'बुवाई, सिंचाई, छिड़काव और कटाई से पहले जिले का बारिश, हवा और तापमान पूर्वानुमान देखें। तेज हवा या बारिश में छिड़काव न करें।'
    },
    te: {
      wheatWater: 'గోధుమలో కీటి-మూల దశ, మొలకలు, కాడ దృఢీకరణ, పూసిన దశ మరియు గింజలు నిండే దశల్లో నేల తేమ తక్కువగా ఉంటే తక్కువ నీరు ఇవ్వండి. నీరు నిల్వ ఉండకుండా చూసుకోండి మరియు కోతకు ముందు నీటిపారుదల ఆపండి.',
      water: 'మూలాల లోతులో నేల తేమను పరీక్షించి పంట దశకు అనుగుణంగా నీరు ఇవ్వండి. డ్రిప్ పద్ధతి సౌకర్యం ఉంటే దాన్ని ఉపయోగించండి, ఉదయం లేదా సాయంత్రం నీరు పోయండి మరియు వర్షం ముందుగా ఉండే చోట నీరు ఆపండి.',
      disease: 'పంట పత్రాల రెండు వైపులా, కాండం మరియు వేర్లను పరిశీలించండి. తీవ్రంగా నష్టపోయిన మొక్కను వేరుచేసి క్లుప్తంగా ఫోటోలు తీసి ప్లాంట్ డాక్టర్‌లో అప్లోడ్ చేయండి. లేబుల్ లేకుండా పురుగు మందు వాడవద్దు.',
      mandi: 'మండి ధరల పేజీలో రాష్ట్రం, జిల్లా, పంట, మార్కెట్ మరియు తేదీ ఎంచుకోండి. కనిష్ట, మధ్యస్థ మరియు గరిష్ట ధరలను పోల్చి అమ్మకానికి ముందు స్థానిక APMC ద్వారా తాజా ధరను నిర్ధారించండి.',
      weather: 'సేద్యం, ఎరువులు, పురుగు మందు లేదా కోతకు ముందు జిల్లా వాతావరణంలో వర్షం, గాలి, తేమ మరియు ఉష్ణోగ్రతను చూడండి. గాలి లేదా వర్షం ఉన్నప్పుడు మందు చల్లవద్దు.'
    },
    ta: {
      wheatWater: 'கோதுமையில் வேர் வளர்ச்சி, கன்று, குலை உருவாகும், பூக்கும் மற்றும் தானிய filling stages நிலைகளில் மண் ஈரமில்லாதபோது சிறிது நீர் பாய்ச்சுங்கள். களத்தில் நீர் தேங்காதீர்கள்; அறுவடைக்கு முன் நீர்ப்பாசனத்தை நிறுத்துங்கள்.',
      water: 'மண் வேர் ஆழத்தில் ஈரப்பதத்தைச் சோதித்து பயிர் நிலைக்கு ஏற்ப நீர்ப்பாசனம் செய்யுங்கள். சொட்டு நீர் வசதி இருந்தால் பயன்படுத்துங்கள்; அதிகாலை அல்லது மாலையில் பாய்ச்சவும்.',
      disease: 'இலைகளின் மேல் மற்றும் கீழ் பகுதிகளையும், வேரையும் சோதித்து தீவிரமாக பாதிக்கப்பட்ட தாவரங்களை பிரித்து தெளிவான படம் எடுத்துப் Plant Doctor பகுதியில் பதிவேற்றுங்கள். சான்றிடாத வேதிப்பொருள் பயன்படுத்தாதீர்கள்.',
      mandi: 'மண்டி விலைகளில் மாநிலம், மாவட்டம், பயிர், சந்தை மற்றும் தேதி தேர்ந்தெடுக்கவும். குறைந்த, நடுத்தர, அதிக விலைகளை ஒப்பிட்டு விற்பனைக்கு முன் உள்ளூர் APMC மூலம் சரிபார்க்கவும்.',
      weather: 'பாசனம், தெளிப்பு, உரமிடுதல் அல்லது அறுவடைக்கு முன் மழை, காற்று, ஈரப்பதம் மற்றும் வெப்பநிலை முன்னறிவிப்பை பார்க்கவும். காற்று அல்லது மழை இருக்கும் போது தெளிக்க வேண்டாம்.'
    }
  };
  let nativeAnswer = '';
  if (nativeFallback[languageCode]) {
    if (/wheat/.test(text) && /water|irrig/.test(text)) nativeAnswer = nativeFallback[languageCode].wheatWater;
    else if (/water|irrig|drip/.test(text)) nativeAnswer = nativeFallback[languageCode].water;
    else if (/disease|fungus|pest|worm|leaf/.test(text)) nativeAnswer = nativeFallback[languageCode].disease;
    else if (/mandi|market|price/.test(text)) nativeAnswer = nativeFallback[languageCode].mandi;
    else if (/weather|rain/.test(text)) nativeAnswer = nativeFallback[languageCode].weather;
  }

  try {
    const answer = await callAI({
      language,
      temperature: 0.3,
      prompt: `Farmer's question: ${question}\nAnswer this directly and accurately. Include immediate practical steps when relevant. Ask a short clarifying question only if essential details are missing. Do not give an irrelevant generic introduction.`
    });
    return answer || nativeAnswer || (localAnswer ? localAnswer : fallbackAnswers[languageCode] || fallbackAnswers.en);
  } catch (error) {
    console.error('Voice assistant AI generation failed:', error.message);
    return nativeAnswer || localAnswer || fallbackAnswers[languageCode] || fallbackAnswers.en;
  }
};

export const generateFollowUpResponse = async ({ request, question, languageCode = 'en' }) => {
  const language = LANGUAGE_NAMES[languageCode] || 'English';
  const fallback = `For the consultation regarding ${request.cropName || request.title}, use only the recommended next steps already confirmed for the crop and follow the approved product label. Check soil moisture and inspect affected plants again before changing treatment.`;
  try {
    const history = (request.followUpMessages || []).slice(-8).map((item) => `${item.senderRole}: ${item.message}`).join('\n');
    const answer = await callAI({
      language,
      temperature: 0.2,
      prompt: `Consultation: ${JSON.stringify({ title: request.title, cropName: request.cropName, topic: request.topic, description: request.description, state: request.state, district: request.district, aiResponse: request.aiResponse })}\nRecent conversation:\n${history}\nFarmer question: ${question}`
    });
    return answer || fallback;
  } catch (error) {
    console.error('AI follow-up generation failed:', error.message);
    return fallback;
  }
};

export const generateConsultationAdvice = async ({ title, cropName, topic, description, state, district, languageCode = 'en' }) => {
  const language = LANGUAGE_NAMES[languageCode] || 'English';
  try {
    const content = await callAI({
      language,
      temperature: 0.2,
      prompt: `Analyze this farmer consultation conservatively and return valid JSON only with keys diagnosis, recommendation, preventiveActions. Consultation: ${JSON.stringify({ title, cropName, topic, description, state, district })}`
    });
    if (content) {
      const parsed = JSON.parse(content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim());
      if (parsed.diagnosis && parsed.recommendation && parsed.preventiveActions) return {
        diagnosis: parsed.diagnosis,
        recommendation: parsed.recommendation,
        preventiveActions: parsed.preventiveActions,
        generatedAt: new Date(), responseSource: 'ai'
      };
    }
  } catch (error) {
    console.error('AI consultation generation failed:', error.message);
  }
  return getFallbackAdvice({ title, cropName, topic, description, state, district });
};
