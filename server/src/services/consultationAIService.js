const LANGUAGE_NAMES = {
  en: 'English', hi: 'Hindi', bn: 'Bengali', te: 'Telugu', ta: 'Tamil', mr: 'Marathi',
  gu: 'Gujarati', kn: 'Kannada', ml: 'Malayalam', pa: 'Punjabi', or: 'Odia', ur: 'Urdu',
  as: 'Assamese', ks: 'Kashmiri', kok: 'Konkani', mai: 'Maithili', mni: 'Manipuri', ne: 'Nepali',
  sd: 'Sindhi', sa: 'Sanskrit', sat: 'Santali', brx: 'Bodo', doi: 'Dogri', lus: 'Mizo',
  kha: 'Khasi', trp: 'Kokborok'
};

const getFallbackAdvice = ({ title, cropName, topic, description, state, district }) => {
  const crop = cropName?.trim() || 'the crop';
  const issue = topic?.replaceAll('_', ' ') || 'general crop concern';

  return {
    diagnosis: `Preliminary assessment: the reported problem is likely related to ${issue}. Visible symptoms, crop stage, weather, soil moisture, pests, and nutrient history are needed for a more certain diagnosis. Do not assume a single disease without evidence.`,
    recommendation: `For ${crop}, inspect both upper and lower leaves, check roots and soil moisture, and isolate affected plants if pests or lesions are spreading. Follow label directions for any approved pesticide or fertilizer; avoid applying multiple chemicals together. If symptoms include wilting, webbing, chewing damage, unusual spots, or nutrient-yellowing, send clear close-up and whole-plant photographs before treatment.`,
    preventiveActions: `Improve field drainage, avoid overwatering, remove severely damaged plant material, clean tools, maintain proper plant spacing, and use balanced irrigation and crop nutrition. Keep records of symptoms and treatments. Severe, rapidly spreading, toxic-exposure, or uncertain symptoms should be confirmed by a qualified agricultural expert.`,
    generatedAt: new Date(),
    responseSource: 'ai'
  };
};

export const generateFollowUpResponse = async ({ request, question, languageCode = 'en' }) => {
  const apiKey = process.env.AI_SERVICE_API_KEY;
  const apiUrl = process.env.AI_SERVICE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_SERVICE_MODEL || 'gpt-4o-mini';
  const language = LANGUAGE_NAMES[languageCode] || 'English';
  const fallback = `For the consultation regarding ${request.cropName || request.title}, use only the recommended next steps already confirmed for the crop and follow the approved product label. Check soil moisture and inspect affected plants again before changing treatment. Avoid applying chemicals without identifying the symptoms. If symptoms spread rapidly or plants collapse, contact a qualified local agriculture officer.`;

  if (!apiKey) return fallback;

  try {
    const history = (request.followUpMessages || [])
      .slice(-8)
      .map((item) => `${item.senderRole}: ${item.message}`)
      .join('\n');
    const prompt = `You are the Mitti Mitra agricultural assistant. Answer the farmer's follow-up question in ${language}. Use the consultation context below. Do not invent a diagnosis. Give practical, safe, location-appropriate advice and advise caution with pesticides, fertilizers, and dosage. Never claim that you are a human expert.\nConsultation: ${JSON.stringify({ title: request.title, cropName: request.cropName, topic: request.topic, description: request.description, state: request.state, district: request.district, aiResponse: request.aiResponse })}\nRecent conversation:\n${history}\nFarmer question: ${question}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: `Answer only agricultural and crop-care questions in ${language}. Be clear, practical, and safe. Use uncertainty where evidence is insufficient.` },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`AI service returned ${response.status}`);
    const data = await response.json();
    const answer = data.choices?.[0]?.message?.content?.trim();
    return answer || fallback;
  } catch (error) {
    console.error('AI follow-up generation failed:', error.message);
    return fallback;
  }
};

export const generateConsultationAdvice = async ({ title, cropName, topic, description, state, district, languageCode = 'en' }) => {
  const apiKey = process.env.AI_SERVICE_API_KEY;
  const apiUrl = process.env.AI_SERVICE_URL || 'https://api.openai.com/v1/chat/completions';
  const model = process.env.AI_SERVICE_MODEL || 'gpt-4o-mini';

  if (!apiKey) return getFallbackAdvice({ title, cropName, topic, description, state, district });

  try {
    const language = LANGUAGE_NAMES[languageCode] || 'English';
    const prompt = `You are an agricultural extension advisor. Respond in ${language}. Analyze this farmer consultation conservatively and never invent a diagnosis. Return valid JSON only with keys diagnosis, recommendation, preventiveActions. Include immediate safe actions, mention uncertainty, and advise following approved product labels and local expert guidance. Avoid prescriptions without crop symptoms and dose details that could be unsafe.\nConsultation: ${JSON.stringify({ title, cropName, topic, description, state, district })}`;

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model,
        temperature: 0.2,
        messages: [
          { role: 'system', content: 'You provide safe, evidence-based agricultural guidance. Return only valid JSON.' },
          { role: 'user', content: prompt }
        ]
      })
    });

    if (!response.ok) throw new Error(`AI service returned ${response.status}`);
    const data = await response.json();
    const content = data.choices?.[0]?.message?.content || '';
    const parsed = JSON.parse(content.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim());

    if (!parsed.diagnosis || !parsed.recommendation || !parsed.preventiveActions) {
      throw new Error('AI response was incomplete');
    }

    return {
      diagnosis: parsed.diagnosis,
      recommendation: parsed.recommendation,
      preventiveActions: parsed.preventiveActions,
      generatedAt: new Date(),
      responseSource: 'ai'
    };
  } catch (error) {
    console.error('AI consultation generation failed:', error.message);
    return getFallbackAdvice({ title, cropName, topic, description, state, district });
  }
};
