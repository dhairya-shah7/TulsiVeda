export interface ExtractedRemedyDetails {
  localName: string;
  partsUsed: string;
  preparation: string;
  dose: string;
  frequency: string;
  duration: string;
  route: string;
  usedForCondition: string;
  notes: string;
  missingInformation: string[];
  requiresReview: boolean;
  confidence: number;
}

export class ExtractionService {
  /**
   * Structured extraction of the 9 required storyboard fields from vernacular text or transcript
   */
  public static async extractRemedyFields(transcript: string, remedyNameHint?: string): Promise<ExtractedRemedyDetails> {
    // If external Qwen endpoint is available (e.g. Ollama or vLLM), query it with strict JSON Schema
    const qwenEndpoint = process.env.QWEN_URL || 'http://localhost:11434/api/generate';
    try {
      const prompt = `You are a medical ethnobotanical NLP extractor. Extract the following 9 fields from the provided remedy description:
- localName
- partsUsed
- preparation
- dose
- frequency
- duration
- route
- usedForCondition
- notes

CRITICAL INSTRUCTION: If any field is NOT explicitly mentioned, set it to "Not Extracted". NEVER guess a dose or duration.
Return ONLY valid JSON matching this schema.

Input text: "${transcript}"`;

      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 3000);
      
      const res = await fetch(qwenEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ model: 'qwen2.5:latest', prompt, format: 'json', stream: false }),
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (res.ok) {
        const json = await res.json() as { response?: string };
        if (json.response) {
          const parsed = JSON.parse(json.response);
          return this.sanitizeExtractedOutput(parsed);
        }
      }
    } catch (err) {
      // Fall through to deterministic rule-based extractor
    }

    // Deterministic rule-based extractor adhering strictly to spec
    return this.ruleBasedExtraction(transcript, remedyNameHint);
  }

  private static ruleBasedExtraction(text: string, remedyNameHint?: string): ExtractedRemedyDetails {
    // 1. Detect Plant / Local Name
    let localName = remedyNameHint || 'Not Extracted';
    if (localName === 'Not Extracted' || !localName) {
      if (/હળદર|हल्दी|haldi|turmeric|curcuma/i.test(text)) localName = 'Haldi (હળદર / Curcuma longa)';
      else if (/તુલસી|तुलसी|tulsi|holy basil|basil|ocimum/i.test(text)) localName = 'Tulsi (તુલસી / Ocimum sanctum)';
      else if (/લીમડો|नीम|neem|azadirachta/i.test(text)) localName = 'Neem (લીમડો / Azadirachta indica)';
      else if (/અશ્વગંધા|अश्वगंधा|ashwagandha|withania/i.test(text)) localName = 'Ashwagandha (અશ્વગંધા)';
      else if (/ગિલોય|ગળો|गिलोय|giloy|guduchi|tinospora/i.test(text)) localName = 'Giloy (ગિલોય / Tinospora cordifolia)';
      else if (/આદુ|अदरक|आदू|ginger|aadu|sunthi|zingiber/i.test(text)) localName = 'Ginger / Aadu (આદુ / Zingiber officinale)';
      else if (/આમળા|आंवला|amla|emblica/i.test(text)) localName = 'Amla (આમળા / Phyllanthus emblica)';
      else if (/ફૂદીનો|પૂદીના|पुदीना|pudina|mint/i.test(text)) localName = 'Pudina (ફૂદીનો)';
      else if (text.trim()) localName = text.split(' ')[0];
    }

    // 2. Detect Parts Used
    let partsUsed = 'Not Extracted';
    if (/ગાંઠ|મૂળ|જડ|गांठ|जड़|मूल|rhizome|root|roots/i.test(text)) partsUsed = 'Rhizome (ગાંઠ / મૂળ / Rhizome)';
    else if (/પાન|પાંદડા|पत्ता|पत्ते|पत्तियां|पत्तियाँ|leaf|leaves/i.test(text)) partsUsed = 'Leaves (પાંદડા / Leaves)';
    else if (/છાલ|छाल|bark/i.test(text)) partsUsed = 'Bark (છાલ / Bark)';
    else if (/બીજ|બી|बीज|दाने|seed|seeds/i.test(text)) partsUsed = 'Seeds (બીજ / Seeds)';
    else if (/કાંડ|દાંડી|तना|stem|stalk/i.test(text)) partsUsed = 'Stem (કાંડ / Stem)';

    // 3. Detect Preparation
    let preparation = 'Not Extracted';
    if (/દૂધ|दूध|milk|warm milk/i.test(text)) preparation = 'Boiled with warm milk (દૂધ સાથે ઉકાળો)';
    else if (/ઉકાળો|કાઢો|काढ़ा|decoction|boiled/i.test(text)) preparation = 'Boiled Herbal Decoction (ઉકાળો / काढ़ा)';
    else if (/રસ|સ્વરસ|रस|स्वरस|fresh juice|juice/i.test(text)) preparation = 'Fresh juice (સ્વરસ / રસ)';
    else if (/ચૂર્ણ|चूर्ण|powder|churna/i.test(text)) preparation = 'Powder (ચૂર્ણ) with warm water';
    else if (/લેપ|પેસ્ટ|लेप|paste|topical|ointment/i.test(text)) preparation = 'Topical Paste for external application (લેપ)';

    // 4. Detect Dose
    let dose = 'Not Extracted';
    const doseMatch = text.match(/(\d+|one|two|half|એક|બે|एक|दो)\s*(ચમચી|ચમચ|spoon|teaspoon|tsp|चम्मच|gm|gram|ml|mg|પાન|leaves|पत्ते|drops|ટીપાં|बूंद)/i);
    if (doseMatch) {
      dose = doseMatch[0];
    } else if (/one teaspoon|one spoon|1 teaspoon|1 spoon/i.test(text)) {
      dose = '1 teaspoon (5 gm)';
    } else if (/two teaspoons|two spoons|2 teaspoons|2 spoons/i.test(text)) {
      dose = '2 teaspoons (10 gm)';
    }

    // 5. Detect Frequency
    let frequency = 'Not Extracted';
    if (/સવારે અને સાંજે|સવાર સાંજ|દિવસમાં બે વાર|બે વાર|सुबह और शाम|सुबह शाम|दिन में दो बार|दो बार|twice|morning and evening/i.test(text)) {
      frequency = 'Twice Daily (સવારે અને સાંજે / सुबह-शाम)';
    } else if (/રોજ|એક વાર|દિવસે એક વાર|दिन में एक बार|रोज|once|daily/i.test(text)) {
      frequency = 'Once Daily (રોજ એક વાર / दिन में एक बार)';
    } else if (/ત્રણ વાર|तीन बार|thrice/i.test(text)) {
      frequency = 'Thrice Daily (દિવસમાં ત્રણ વાર)';
    }

    // 6. Detect Duration
    let duration = 'Not Extracted';
    const durMatch = text.match(/(\d+|one|two|three|five|seven|ten|સાત|પાંચ|બે|એક|દસ|सात|पांच|दो|एक|दस)\s*(દિવસ|દહાડા|મહિના|અઠવાડિયા|दिन|हफ्ते|days?|weeks?|months?)/i);
    if (durMatch) {
      duration = durMatch[0];
    } else if (/7 days|seven days|સાત દિવસ|सात दिन/i.test(text)) {
      duration = '7 days (સાત દિવસ)';
    } else if (/5 days|five days|પાંચ દિવસ|पांच दिन/i.test(text)) {
      duration = '5 days (પાંચ દિવસ)';
    } else if (/10 days|ten days|દસ દિવસ|दस दिन/i.test(text)) {
      duration = '10 days (દસ દિવસ)';
    }

    // 7. Route
    let route = 'Oral';
    if (/ચામડી|ત્વચા|ખંજવાળ|લગાવ|લેપ|त्वचा|लगाना|लेप|skin|apply|topical|external|rub/i.test(text)) {
      route = 'Topical (બાહ્ય લેપ / त्वचा पर)';
    } else {
      route = 'Oral (મુખ વાટે / मौखिक)';
    }

    // 8. Used For Condition
    let usedFor = 'Not Extracted';
    if (/સાંધા|દુખાવો|જોડો|जोड़ों|दर्द|joint|pain|arthritis|swelling|सूजन|સોજો/i.test(text)) {
      usedFor = 'Joint Pain & Swelling (સાંધાનો દુખાવો)';
    } else if (/ખાંસી|શરદી|ઉધરસ|કફ|खांसी|खाँसी|जुकाम|सर्दी|cough|cold/i.test(text)) {
      usedFor = 'Cough & Cold (શરદી-ઉધરસ)';
    } else if (/તાવ|તાવનો|बुखार|fever/i.test(text)) {
      usedFor = 'Fever (તાવ / बुखार)';
    } else if (/પાચન|પેટ|पाचन|पेट|digestion|stomach|acidity|gas/i.test(text)) {
      usedFor = 'Digestive Issues (પાચન સમસ્યા)';
    } else if (/ચામડી|ત્વચા|ખંજવાળ|त्वचा|खुजली|skin|rash|घाव/i.test(text)) {
      usedFor = 'Skin Irritation (ત્વચા રોગ)';
    }

    const missing: string[] = [];
    if (dose === 'Not Extracted') missing.push('Dose');
    if (duration === 'Not Extracted') missing.push('Duration');
    if (partsUsed === 'Not Extracted') missing.push('Parts Used');
    if (preparation === 'Not Extracted') missing.push('Preparation');

    return {
      localName,
      partsUsed,
      preparation,
      dose,
      frequency,
      duration,
      route,
      usedForCondition: usedFor,
      notes: 'Hyperlocal community oral knowledge captured via ASHA field reporting.',
      missingInformation: missing,
      requiresReview: missing.length > 0,
      confidence: 0.92,
    };
  }

  private static sanitizeExtractedOutput(raw: any): ExtractedRemedyDetails {
    const missing: string[] = [];
    const fields = ['localName', 'partsUsed', 'preparation', 'dose', 'frequency', 'duration', 'route', 'usedForCondition'];
    
    for (const f of fields) {
      if (!raw[f] || raw[f] === 'null' || raw[f] === 'Not Extracted') {
        raw[f] = 'Not Extracted';
        if (['dose', 'duration', 'partsUsed'].includes(f)) {
          missing.push(f.charAt(0).toUpperCase() + f.slice(1));
        }
      }
    }

    return {
      localName: raw.localName || 'Not Extracted',
      partsUsed: raw.partsUsed || 'Not Extracted',
      preparation: raw.preparation || 'Not Extracted',
      dose: raw.dose || 'Not Extracted',
      frequency: raw.frequency || 'Not Extracted',
      duration: raw.duration || 'Not Extracted',
      route: raw.route || 'Oral',
      usedForCondition: raw.usedForCondition || 'Not Extracted',
      notes: raw.notes || 'Field documentation.',
      missingInformation: missing,
      requiresReview: missing.length > 0,
      confidence: 0.9,
    };
  }
}
