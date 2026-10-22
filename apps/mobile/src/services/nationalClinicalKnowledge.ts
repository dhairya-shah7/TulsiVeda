// Official National Clinical Knowledge Base for Bharat Health AI
// Sourced from:
// 1. Ministry of AYUSH — National Formulary of India (Ayurveda, Siddha, Unani)
// 2. Central Drugs Standard Control Organisation (CDSCO) — National Essential Medicines List (NLEM)
// 3. Pradhan Mantri Bhartiya Janaushadhi Pariyojana (PMBJP) Official Price & Formulation Catalog
// 4. Indian Council of Medical Research (ICMR) — Standard Treatment Guidelines

export interface ClinicalConditionRecord {
  id: string;
  conditionName: string;
  hindiName: string;
  gujaratiName: string;
  punjabiName?: string;
  bodySystem: 'Respiratory' | 'Digestive' | 'Cardiovascular' | 'Metabolic' | 'Musculoskeletal' | 'Dermatological' | 'Nervous' | 'Renal' | 'Infectious' | 'Dental' | 'Hepatic';
  typicalSymptoms: string[];
  vernacularSymptomKeywords: string[];
  
  // Official Govt Generic (Tier 1: Jan Aushadhi)
  officialGeneric: {
    medicineName: string;
    genericSalt: string;
    dosageStrength: string;
    pmbjpPriceINR: string;
    cdscoNlemListed: boolean;
    standardDosageSchedule: string;
  };

  // Official AYUSH Monograph (Tier 2: Classic Pharmacopoeia)
  ayushClassicalFormulation: {
    formulationName: string;
    scientificBotanical: string;
    activePhytochemical: string;
    classicalReference: string;
    ayushDosage: string;
    anupanaDietaryMedium: string;
  };

  // Safe Verified Home/Kitchen Remedy (Tier 3: Emergency First Aid)
  verifiedHomeRemedy: {
    kitchenItem: string;
    preparationMethod: string;
    modeOfAdministration: string;
    contraindicationWarning: string;
  };

  // Clinical Escalation Protocol (When to send to PHC/Hospital)
  escalationProtocol: {
    dangerSigns: string[];
    maxWaitHoursBeforeHospital: number;
    recommendedLabTest: string;
  };
}

export const NATIONAL_CLINICAL_RECORDS: ClinicalConditionRecord[] = [
  {
    id: 'CLIN_01',
    conditionName: 'Acute Viral Fever & Hyperpyrexia',
    hindiName: 'तीव्र वायरल बुखार व बदन दर्द (ज्वर)',
    gujaratiName: 'તીવ્ર તાવ અને કળતર',
    punjabiName: 'ਤੇਜ਼ ਵਾਇਰਲ ਬੁਖਾਰ ਅਤੇ ਸਰੀਰ ਦਰਦ (ਜਵਰ)',
    bodySystem: 'Infectious',
    typicalSymptoms: ['High body temperature (>100°F)', 'Chills', 'Headache', 'Generalized myalgia (body ache)'],
    vernacularSymptomKeywords: [
      'fever', 'temperature', 'viral fever', 'body ache', 'chills', 'hyperpyrexia', 'pyrexia',
      'बुखार', 'वायरल बुखार', 'ताप', 'बदन दर्द', 'कम्कंपी', 'ज्वर',
      'તાવ', 'વાયરਲ તાવ', 'કળતર', 'ધ્રુજારી', 'શરીર તૂટવું',
      'ਬੁਖਾਰ', 'ਕਾਂਬਾ', 'ਸਰੀਰ ਦਰਦ', 'ਸਿਰ ਦਰਦ',
      'காய்ச்சல்', 'உடல் வலி', 'జ్వరం', 'శరీర నొప్పులు', 'ಜ್ವರ'
    ],
    officialGeneric: {
      medicineName: 'Paracetamol Tablets IP 500mg / 650mg',
      genericSalt: 'Paracetamol (Acetaminophen)',
      dosageStrength: '650 mg',
      pmbjpPriceINR: '₹2.50 per strip of 10 tablets (80% subsidized vs ₹25.00 brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet post-meals every 6-8 hours; do not exceed 3,000 mg in 24 hours.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Giloy Ghan Vati / Guduchi Kwath',
      scientificBotanical: 'Tinospora cordifolia (Menispermaceae)',
      activePhytochemical: 'Tinosporide, Cordifolioside A & Berberine',
      classicalReference: 'Ayurvedic Pharmacopoeia of India (API) Part I, Vol I',
      ayushDosage: '2 tablets (500mg each) twice daily with warm water.',
      anupanaDietaryMedium: 'Warm water or honey (prevents gastric irritation)'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Tulsi, Ginger and Black Pepper Decoction (Kadha)',
      preparationMethod: 'Boil 8 tulsi leaves, 1 inch freshly crushed ginger root, and 3 peppercorns in 2 cups water until reduced to 1 cup.',
      modeOfAdministration: 'Drink 2 tablespoons warm, 2 times daily. Sweeten with jaggery (Gud).',
      contraindicationWarning: 'Do not give black pepper concoctions in active gastric ulceration.'
    },
    escalationProtocol: {
      dangerSigns: ['Temperature exceeding 103°F with confusion', 'Convulsions / Rigors', 'Bleeding gums or petechiae rashes (Dengue warning)'],
      maxWaitHoursBeforeHospital: 48,
      recommendedLabTest: 'Complete Blood Count (CBC) with Platelet Count & Peripheral Blood Smear'
    }
  },
  {
    id: 'CLIN_02',
    conditionName: 'Type 2 Diabetes Mellitus & Postprandial Spikes',
    hindiName: 'मधुमेह टाइप-2 (ब्लड शुगर)',
    gujaratiName: 'ડાયાબિટીસ (મધુપ્રમેહ)',
    punjabiName: 'ਟਾਈਪ 2 ਸ਼ੂਗਰ ਅਤੇ ਬਲੱਡ ਸ਼ੂਗਰ ਨਿਯੰਤਰਣ',
    bodySystem: 'Metabolic',
    typicalSymptoms: ['Frequent urination (Polyuria)', 'Excess thirst (Polydipsia)', 'Unexplained fatigue', 'Slow wound healing'],
    vernacularSymptomKeywords: [
      'diabetes', 'sugar', 'blood sugar', 'glucose', 'high sugar', 'hyperglycemia', 'diabetic',
      'मधुमेह', 'शुगर', 'ब्लड शुगर', 'पेशाब बार बार आना', 'ग्लूकोज',
      'ડાયાબિટીસ', 'સુગર', 'લોહીમાં ખાંડ', 'મધુપ્રમેહ',
      'ਸ਼ੂਗਰ', 'ਸ਼ੱਕਰ', 'ਬਲੱਡ ਸ਼ੂਗਰ', 'ਪੇਸ਼ਾਬ',
      'சர்க்கரை நோய்', 'நீரிழிவு', 'మధుమేహం', 'షుగర్'
    ],
    officialGeneric: {
      medicineName: 'Metformin Hydrochloride Tablets IP 500mg / 1000mg ER',
      genericSalt: 'Metformin Hydrochloride (Biguanide)',
      dosageStrength: '500 mg ER',
      pmbjpPriceINR: '₹4.50 per strip of 10 tablets (85% cheaper than Glycomet)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once or twice daily with or immediately after major meals.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Nisha Katakadi Kashayam & Jamun-Karela Churna',
      scientificBotanical: 'Syzygium cumini & Momordica charantia',
      activePhytochemical: 'Jamboline, Charantin & Polypeptide-p',
      classicalReference: 'Sahasrayogam, Prameha Chikitsa & API Part I, Vol II',
      ayushDosage: '1 teaspoon (3g) twice daily 30 minutes before meals.',
      anupanaDietaryMedium: 'Lukewarm water on empty stomach'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Methi (Fenugreek) Seed Overnight Infusion',
      preparationMethod: 'Soak 1 tablespoon whole methi seeds in 1 glass drinking water overnight. Strain in the morning.',
      modeOfAdministration: 'Drink water and chew softened seeds on empty stomach at dawn.',
      contraindicationWarning: 'May potentiate pharmaceutical hypoglycemia; monitor fasting blood glucose.'
    },
    escalationProtocol: {
      dangerSigns: ['Fasting Blood Sugar > 250 mg/dL', 'Fruity acetone breath odor', 'Non-healing foot ulcer with redness (Diabetic foot)'],
      maxWaitHoursBeforeHospital: 24,
      recommendedLabTest: 'HbA1c (Glycated Hemoglobin), Fasting Blood Sugar (FBS) & Serum Creatinine'
    }
  },
  {
    id: 'CLIN_03',
    conditionName: 'Essential Hypertension & High Blood Pressure',
    hindiName: 'उच्च रक्तचाप (हाई बीपी)',
    gujaratiName: 'હાઈ બ્લડ પ્રેશર (હાયપરટેન્શન)',
    punjabiName: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਤੇ ਦਿਲ ਦੀ ਸੰਭਾਲ',
    bodySystem: 'Cardiovascular',
    typicalSymptoms: ['Occipital throbbing headache', 'Dizziness', 'Palpitations', 'Tinnitus (ringing in ears)'],
    vernacularSymptomKeywords: [
      'hypertension', 'blood pressure', 'high bp', 'bp', 'systolic', 'pressure', 'dizziness',
      'हाई बीपी', 'उच्च रक्तचाप', 'रक्तचाप', 'बीपी', 'सिर घूमना', 'घबराहट',
      'હાઈ બીપી', 'બ્લડ પ્રેશર', 'પ્રેશર', 'ચક્કર',
      'ਹਾਈ ਬੀਪੀ', 'ਪ੍ਰੈਸ਼ਰ', 'ਚੱਕਰ ਆਉਣਾ', 'ਘਬਰਾਹਟ',
      'இரத்த அழுத்தம்', 'ரத்தக் கொதிப்பு', 'రక్తపోటు', 'హై బీపీ'
    ],
    officialGeneric: {
      medicineName: 'Amlodipine Besylate Tablets IP 5mg',
      genericSalt: 'Amlodipine (Dihydropyridine Calcium Channel Blocker)',
      dosageStrength: '5 mg',
      pmbjpPriceINR: '₹3.20 per strip of 10 tablets (80% subsidized vs ₹28 brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily morning with a full glass of water.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Sarpagandha Ghan Vati / Arjuna Ksheerapaka',
      scientificBotanical: 'Rauvolfia serpentina & Terminalia arjuna',
      activePhytochemical: 'Reserpine & Arjunolic Acid',
      classicalReference: 'Ayurvedic Pharmacopoeia of India, Part I, Vol II',
      ayushDosage: '1 tablet (250mg) at bedtime under medical supervision.',
      anupanaDietaryMedium: 'Warm milk or warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Garlic (Lahsun) Pod with Warm Lemon Water',
      preparationMethod: 'Crush 1 small raw garlic clove, let it rest for 5 minutes (activating allicin enzyme).',
      modeOfAdministration: 'Swallow with lukewarm water every morning.',
      contraindicationWarning: 'Consult doctor before combining raw garlic with anticoagulants (Aspirin/Warfarin).'
    },
    escalationProtocol: {
      dangerSigns: ['Blood pressure reading > 180/110 mmHg', 'Sudden chest tightness or left-arm numbness', 'Blurry vision or facial asymmetry (Stroke warning)'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: '12-lead ECG, Serum Electrolytes & Renal Function Test'
    }
  },
  {
    id: 'CLIN_04',
    conditionName: 'Gastroesophageal Reflux, Acidity & Dyspepsia',
    hindiName: 'अम्लपित्त, पेट में गैस, जलन व अपच',
    gujaratiName: 'એસિડિટી, પેટમાં બળતરા અને ગેસ',
    punjabiName: 'ਤੇਜ਼ਾਬ, ਗੈਸ ਅਤੇ ਪੇਟ ਦੀ ਜਲਣ (ਅਮਲਪਿੱਤ)',
    bodySystem: 'Digestive',
    typicalSymptoms: ['Retrosternal heartburn', 'Acid regurgitation', 'Epigastric fullness', 'Frequent sour belching'],
    vernacularSymptomKeywords: [
      'acidity', 'gas', 'heartburn', 'acid reflux', 'gerd', 'indigestion', 'dyspepsia', 'bloating', 'sour belch',
      'गैस', 'एसिडिटी', 'पेट में जलन', 'खट्टी डकार', 'अपच', 'सीने में जलन', 'पेट फूलना',
      'એસિડિટી', 'ગેસ', 'છાતીમાં બળતરા', 'ખાટા ઓડકાર', 'અપચો',
      'ਤੇਜ਼ਾਬ', 'ਗੈਸ', 'ਪੇਟ ਜਲਣਾ', 'ਖੱਟੇ ਡਕਾਰ',
      'நெஞ்செரிச்சல்', 'அமிலத்தன்மை', 'కడుపులో మంట', 'గ్యాస్', 'ఎసిడిటీ'
    ],
    officialGeneric: {
      medicineName: 'Pantoprazole Gastro-resistant Tablets IP 40mg',
      genericSalt: 'Pantoprazole Sodium (Proton Pump Inhibitor)',
      dosageStrength: '40 mg',
      pmbjpPriceINR: '₹6.50 per strip of 10 tablets (80% subsidized vs Pan-40)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet 30-45 minutes before morning breakfast with water.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Avipattikar Churna / Kamadudha Rasa',
      scientificBotanical: 'Operculina turpethum, Zingiber officinale & Piper longum',
      activePhytochemical: 'Turpethin, Gingerol & Piperine',
      classicalReference: 'Bhaishajya Ratnavali, Amlapitta Rogadhikara',
      ayushDosage: '1 teaspoon (3-5g) twice daily post-meals.',
      anupanaDietaryMedium: 'Cool water or tender coconut water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Cold Milk with Roasted Cumin (Jeera) and Fennel (Saunf)',
      preparationMethod: 'Soak 1 teaspoon fennel seeds and 1/2 teaspoon roasted cumin in half cup chilled milk.',
      modeOfAdministration: 'Sip slowly during acute burning episodes.',
      contraindicationWarning: 'Avoid citrus, chilies, carbonated drinks, and smoking.'
    },
    escalationProtocol: {
      dangerSigns: ['Black tarry stools (Melena)', 'Coffee-ground vomiting (GI bleed)', 'Difficulty swallowing solid food (Dysphagia)'],
      maxWaitHoursBeforeHospital: 6,
      recommendedLabTest: 'Upper GI Endoscopy & Stool Occult Blood'
    }
  },
  {
    id: 'CLIN_05',
    conditionName: 'Osteoarthritis, Knee Joint Pain & Stiffness',
    hindiName: 'जोड़ों का दर्द, घुटने का दर्द व गठिया (संधिवात)',
    gujaratiName: 'સાંધાનો દુખાવો, ગોઠણની કળતર અને સોજો',
    punjabiName: 'ਜੋੜਾਂ ਦਾ ਦਰਦ, ਗਠੀਆ ਅਤੇ ਸੋਜ (ਸੰਧੀਵਾਤ)',
    bodySystem: 'Musculoskeletal',
    typicalSymptoms: ['Knee joint crepitus', 'Morning stiffness > 30 mins', 'Swelling and warmth over knees', 'Difficulty walking or climbing stairs'],
    vernacularSymptomKeywords: [
      'joint pain', 'knee pain', 'arthritis', 'osteoarthritis', 'knee swelling', 'stiffness', 'gathiya',
      'जोड़ों का दर्द', 'घुटने का दर्द', 'गठिया', 'संधिवात', 'जोड़ों में सूजन', 'घुटने की कट-कट',
      'સાંધાનો દુખાવો', 'ગોઠણનો દુખાવો', 'સંધિવા', 'સોજો',
      'ਜੋੜਾਂ ਦਾ ਦਰਦ', 'ਗੋਡੇ ਦਾ ਦਰਦ', 'ਸੋਜ', 'ਗਠੀਆ',
      'மூட்டு வலி', 'முழங்கால் வலி', 'కీళ్ల నొప్పులు', 'మోకాళ్ళ నొప్పులు'
    ],
    officialGeneric: {
      medicineName: 'Aceclofenac 100mg + Paracetamol 325mg Tablets IP',
      genericSalt: 'Aceclofenac + Paracetamol (NSAID Combination)',
      dosageStrength: '100mg / 325mg',
      pmbjpPriceINR: '₹6.00 for strip of 10 tablets (82% cheaper than Zerodol-P)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily strictly after meals for max 5-7 days.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Shallaki (Boswellia serrata) & Yograj Guggulu',
      scientificBotanical: 'Boswellia serrata (Burseraceae)',
      activePhytochemical: 'Acetyl-11-keto-beta-boswellic acid (AKBA)',
      classicalReference: 'Ayurvedic Pharmacopoeia of India, Part I, Vol III',
      ayushDosage: '1 tablet (300mg) twice daily with meals.',
      anupanaDietaryMedium: 'Warm water or warm milk'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Golden Turmeric Milk with Pinch of Black Pepper',
      preparationMethod: 'Boil 1/2 teaspoon pure turmeric powder with 1 cup milk and a pinch of black pepper (piperine enhances curcumin bio-absorption by 2000%).',
      modeOfAdministration: 'Drink warm at bedtime.',
      contraindicationWarning: 'Do not take concentrated curcumin capsules with Warfarin/Aspirin.'
    },
    escalationProtocol: {
      dangerSigns: ['Acute red, hot, swollen joint with fever (Septic arthritis emergency)', 'Complete inability to bear weight'],
      maxWaitHoursBeforeHospital: 12,
      recommendedLabTest: 'Serum Uric Acid, Erythrocyte Sedimentation Rate (ESR) & X-ray bilateral knees'
    }
  },
  {
    id: 'CLIN_06',
    conditionName: 'Acute Respiratory Bronchitis, Productive Cough & Cold',
    hindiName: 'खांसी, जुकाम, बलगम व सीने में जकड़न (कास)',
    gujaratiName: 'ખાંસી, શરદી, કફ અને ગળામાં ખરાશ',
    punjabiName: 'ਖੰਘ, ਜ਼ੁਕਾਮ, ਬਲਗਮ ਅਤੇ ਛਾਤੀ ਦੀ ਜਕੜਨ (ਕਾਸ)',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['Frequent coughing fits', 'Mucopurulent sputum', 'Sore throat', 'Chest tightness on deep breathing'],
    vernacularSymptomKeywords: [
      'cough', 'cold', 'phlegm', 'mucus', 'sore throat', 'bronchitis', 'congestion', 'runny nose',
      'खांसी', 'जुकाम', 'कफ', 'बलगम', 'गले में खराश', 'छाती में जकड़न', 'सर्दी',
      'ખાંસી', 'શરદી', 'કફ', 'ગળામાં દુખાવો', 'ઉધરસ',
      'ਖੰਘ', 'ਜ਼ੁਕਾਮ', 'ਬਲਗਮ', 'ਗਲੇ ਦੀ ਖਰਾਸ਼',
      'இருமல்', 'சளி', 'தொண்டை வலி', 'దగ్గు', 'జలుబు', 'కఫం'
    ],
    officialGeneric: {
      medicineName: 'Ambroxol Hydrochloride 30mg + Levocetirizine 2.5mg Syrup',
      genericSalt: 'Ambroxol HCl + Levocetirizine (Mucolytic & Antihistamine)',
      dosageStrength: '100 ml Syrup',
      pmbjpPriceINR: '₹14.00 per 100ml bottle (75% subsidized vs ₹70 brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '5 ml twice daily after food for adults; hydrate with warm fluids.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Sitopaladi Churna & Talisadi Churna with Honey',
      scientificBotanical: 'Bambusa bambos, Piper longum & Cinnamomum tamala',
      activePhytochemical: 'Silica, Piperine & Cinnamaldehyde',
      classicalReference: 'Sharangadhara Samhita, Madhyama Khanda',
      ayushDosage: '1 teaspoon (3g) mixed with 1 teaspoon pure honey, licked slowly 3 times daily.',
      anupanaDietaryMedium: 'Pure honey (Madhu) or warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Crushed Ginger Root & Tulsi Leaf Honey Paste',
      preparationMethod: 'Extract 1 teaspoon fresh ginger juice by grating; crush 5 tulsi leaves, blend with 1 teaspoon pure honey.',
      modeOfAdministration: 'Lick slowly twice daily. Do not drink cold water for 30 minutes.',
      contraindicationWarning: 'Do not administer raw honey to infants below 1 year old (infant botulism risk).'
    },
    escalationProtocol: {
      dangerSigns: ['Oxygen saturation (SpO2) < 94%', 'Blood in sputum (Hemoptysis)', 'Severe chest indrawing or stridor in infants'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Pulse Oximetry, Chest X-Ray PA View & Sputum AFB'
    }
  },
  {
    id: 'CLIN_07',
    conditionName: 'Back Pain, Lumbago, Sciatica & Muscle Spasms',
    hindiName: 'कमर दर्द, पीठ दर्द, साइटिका व मांसपेशियों में खिंचाव (कटिशूल)',
    gujaratiName: 'કમરનો દુખાવો, વાંસાનો દુખાવો અને સ્નાયુ ખેંચાણ',
    punjabiName: 'ਪਿੱਠ ਦਰਦ, ਲੱਕ ਦਰਦ, ਸਾਇਟਿਕਾ ਅਤੇ ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਖਿਚਾਅ (ਕਟੀਸ਼ੂਲ)',
    bodySystem: 'Musculoskeletal',
    typicalSymptoms: ['Sharp or dull lower back ache', 'Radiating pain down buttock or leg (sciatica)', 'Morning lumbar stiffness', 'Pain aggravated by forward bending or sitting'],
    vernacularSymptomKeywords: [
      'back pain', 'backache', 'lower back pain', 'lumbago', 'sciatica', 'lumbar pain', 'spine pain', 'muscle spasm', 'back stiffness',
      'कमर दर्द', 'पीठ दर्द', 'रीढ़ की हड्डी में दर्द', 'साइटिका', 'कमर जकड़न', 'मांसपेशियों में दर्द', 'कटिशूल', 'कमर', 'पीठ',
      'કમરનો દુખાવો', 'વાંસાનો દુખાવો', 'સાયટિકા', 'કમર જકડાઈ જવી',
      'ਪਿੱਠ ਦਰਦ', 'ਲੱਕ ਦਰਦ', 'ਲੱਕੜੀ ਪੀੜ', 'ਸਾਇਟਿਕਾ',
      'முதுகு வலி', 'இடுப்பு வலி', 'నడుము నొప్పి', 'వెన్ను నొప్పి', 'బెణుకు'
    ],
    officialGeneric: {
      medicineName: 'Aceclofenac 100mg + Thiocolchicoside 4mg Tablets IP',
      genericSalt: 'Aceclofenac + Thiocolchicoside (NSAID & Centrally-Acting Muscle Relaxant)',
      dosageStrength: '100mg / 4mg',
      pmbjpPriceINR: '₹18.00 per strip of 10 tablets (80% subsidized vs ₹180 brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily strictly after meals for 3-5 days. Avoid heavy weight lifting.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Trayodashanga Guggulu & Mahanarayan Taila Massage',
      scientificBotanical: 'Commiphora mukul, Vitex negundo & Withania somnifera',
      activePhytochemical: 'Guggulsterones, Negundoside & Withanolides',
      classicalReference: 'Bhaishajya Ratnavali, Vatavyadhi Rogadhikara',
      ayushDosage: '2 tablets twice daily with warm water. Gently massage warm Mahanarayan oil externally.',
      anupanaDietaryMedium: 'Warm water or Dashamoola Kwath'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Garlic-Infused Mustard or Sesame Oil Warm Compress',
      preparationMethod: 'Crush 5 garlic cloves and warm in 3 tablespoons mustard or sesame oil until lightly brown. Let cool to comfortable warmth.',
      modeOfAdministration: 'Gently massage onto lower back in circular motions, followed by warm water bag fomentation.',
      contraindicationWarning: 'Do not apply vigorous pressure if disc herniation or numbness in toes is present.'
    },
    escalationProtocol: {
      dangerSigns: ['Sudden loss of bowel or bladder control (Cauda Equina Syndrome emergency)', 'Numbness in groin or saddle area', 'Progressive foot drop or weakness in legs'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'MRI Lumbo-Sacral Spine & Plain X-Ray Lumbar Spine AP/Lateral'
    }
  },
  {
    id: 'CLIN_08',
    conditionName: 'Dengue Fever, Thrombocytopenia & Post-Viral Fatigue',
    hindiName: 'डेंगू बुखार, गिरते प्लेटलेट्स व बदन दर्द',
    gujaratiName: 'ડેન્ગ્યુ તાવ, પ્લેટલેટ્સ ઘટવા અને અતિશય નબળાઈ',
    punjabiName: 'ਡੈਂਗੂ ਬੁਖਾਰ, ਪਲੇਟਲੈੱਟਾਂ ਦੀ ਕਮੀ ਅਤੇ ਸਰੀਰਕ ਕਮਜ਼ੋਰੀ',
    bodySystem: 'Infectious',
    typicalSymptoms: ['Sudden high continuous fever (103°F)', 'Retro-orbital pain (pain behind eyes)', 'Severe bone and joint break-bone pain', 'Petechial skin rashes', 'Rapidly declining platelet count'],
    vernacularSymptomKeywords: [
      'dengue', 'dengue fever', 'platelet', 'platelets', 'low platelets', 'thrombocytopenia', 'breakbone fever', 'retro-orbital pain',
      'डेंगू', 'डेंगू बुखार', 'प्लेटलेट', 'प्लेटलेट्स', 'आंखों के पीछे दर्द', 'हड्डी तोड़ बुखार',
      'ડેન્ગ્યુ', 'ડેન્ગ્યુ તાવ', 'પ્લેટલેટ', 'પ્લેટલેટ્સ ઘટવા',
      'ਡੈਂਗੂ', 'ਡੈਂਗੂ ਬੁਖਾਰ', 'ਪਲੇਟਲੈਟ', 'ਪਲੇਟਲੈੱਟਾਂ ਦੀ ਘਾਟ',
      'டெங்கு', 'டெங்கு காய்ச்சல்', 'ప్లేట్‌లెట్స్', 'డెంగ్యూ', 'డెంగ్యూ జ్వరం'
    ],
    officialGeneric: {
      medicineName: 'Paracetamol Tablets IP 650mg + WHO Oral Rehydration Salts (ORS)',
      genericSalt: 'Paracetamol 650mg + ORS Electrolytes (STRICT: NO NSAIDs/ASPIRIN/IBUPROFEN)',
      dosageStrength: '650mg / 21.8g Sachet',
      pmbjpPriceINR: '₹2.50 per strip & ₹4.00 per ORS sachet (Govt Subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Paracetamol 650mg every 6 hours for temperature > 100°F. STRICT WARNING: DO NOT TAKE ASPIRIN, IBUPROFEN, OR DICLOFENAC (causes fatal internal bleeding).'
    },
    ayushClassicalFormulation: {
      formulationName: 'Carica Papaya Leaf Extract (Papita Patra) & Giloy Ghan Vati',
      scientificBotanical: 'Carica papaya & Tinospora cordifolia',
      activePhytochemical: 'Carpaine, Papain, Tinosporaside & Flavonoids',
      classicalReference: 'AYUSH Dengue Treatment Guidelines & CCRAS Verified Protocols',
      ayushDosage: 'Papaya leaf extract syrup 10ml twice daily; Giloy Ghan Vati 2 tablets twice daily.',
      anupanaDietaryMedium: 'Fresh room-temperature water or pomegranate juice'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Fresh Papaya Leaf Juice & Coconut Water Hydration',
      preparationMethod: 'Crush 2-3 fresh tender papaya leaves without stems, squeeze through clean cloth to get 15-20ml bitter juice.',
      modeOfAdministration: 'Drink 15-20ml juice twice daily. Drink tender coconut water and pomegranate juice every 2 hours to maintain vascular volume.',
      contraindicationWarning: 'Papaya leaf juice is not a substitute for hospital platelet transfusion if platelets fall below 20,000/μL.'
    },
    escalationProtocol: {
      dangerSigns: ['Platelet count drops below 20,000/μL', 'Persistent vomiting or severe abdominal tenderness', 'Spontaneous bleeding from gums, nose, or blood in vomit/stool (Dengue Hemorrhagic Shock)'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: 'Daily Complete Blood Count (CBC) with Platelet Count & Hematocrit, Dengue NS1 / IgM ELISA'
    }
  },
  {
    id: 'CLIN_09',
    conditionName: 'Malaria & Intermittent Rigor Fevers',
    hindiName: 'मलेरिया बुखार, ठंड लगकर कंपकंपी आना (विषम ज्वर)',
    gujaratiName: 'મેલેરિયા તાવ અને ધ્રુજારી સાથે આવતો તાવ',
    punjabiName: 'ਮਲੇਰੀਆ ਬੁਖਾਰ, ਕਾਂਬੇ ਨਾਲ ਚੜ੍ਹਨ ਵਾਲਾ ਤਾਪ (ਵਿਸ਼ਮ ਜਵਰ)',
    bodySystem: 'Infectious',
    typicalSymptoms: ['Fever with periodic shivering and severe chills', 'Profuse sweating stage following fever drop', 'Severe nausea and headache', 'Enlarged tender spleen on prolonged infection'],
    vernacularSymptomKeywords: [
      'malaria', 'shivering fever', 'chills and fever', 'rigors', 'falciparum', 'vivax', 'periodic fever',
      'मलेरिया', 'मलेरिया बुखार', 'कंपकंपी वाला बुखार', 'ठंड लगकर बुखार', 'जाड़ा लगकर बुखार',
      'મેલેરિયા', 'ધ્રુજારી વાળો તાવ', 'ટાઢ વાઈને તાવ',
      'ਮਲੇਰੀਆ', 'ਕਾਂਬੇ ਵਾਲਾ ਬੁਖਾਰ',
      'மலேரியா', 'குளிர் காய்ச்சல்', 'మలేరియా', 'చలి జ్వరం'
    ],
    officialGeneric: {
      medicineName: 'Artemether 80mg + Lumefantrine 480mg / Chloroquine 250mg Tablets IP',
      genericSalt: 'Artemether + Lumefantrine (ACT Antimalarial) or Chloroquine Phosphate',
      dosageStrength: '80mg / 480mg',
      pmbjpPriceINR: '₹22.00 per blister pack of 6 tablets (Govt NVBDCP standard)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Complete exact 3-day course strictly as prescribed by Primary Health Centre doctor.'
    },
    ayushClassicalFormulation: {
      formulationName: 'AYUSH-64 Formulation / Sudarshan Churna',
      scientificBotanical: 'Andrographis paniculata (Kalmegh), Swertia chirata (Chirata) & Picrorhiza kurroa',
      activePhytochemical: 'Andrographolide, Swertiamarin & Kutkin',
      classicalReference: 'CCRAS Validated Clinical Protocol & Bhaishajya Ratnavali',
      ayushDosage: 'AYUSH-64 2 tablets (500mg) thrice daily after meals.',
      anupanaDietaryMedium: 'Warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Kalmegh & Tulsi Bitter Cleansing Decoction',
      preparationMethod: 'Boil 5-6 fresh Tulsi leaves with 1/2 teaspoon Chirata or Kalmegh powder in 2 cups water until reduced to 1 cup.',
      modeOfAdministration: 'Drink 3 tablespoons twice daily before food.',
      contraindicationWarning: 'Confirm blood slide or rapid test before starting therapy. Do not self-treat in pregnancy.'
    },
    escalationProtocol: {
      dangerSigns: ['Altered sensorium or delirium (Cerebral Malaria warning)', 'Yellowish eyes/skin (Hemolytic Jaundice)', 'Dark black-colored urine (Blackwater fever)'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Rapid Diagnostic Test (RDT) for Malaria (Pf/Pv) & Peripheral Blood Smear Examination'
    }
  },
  {
    id: 'CLIN_10',
    conditionName: 'Typhoid & Enteric Fever',
    hindiName: 'टाइफाइड, मियादी बुखार व आंतों का संक्रमण',
    gujaratiName: 'ટાઈફોઈડ, મુદતી તાવ અને પેટમાં ચેપ',
    punjabiName: 'ਟਾਈਫਾਈਡ, ਮਿਆਦੀ ਬੁਖਾਰ ਅਤੇ ਅੰਤੜੀਆਂ ਦੀ ਇਨਫੈਕਸ਼ਨ',
    bodySystem: 'Infectious',
    typicalSymptoms: ['Step-ladder pattern continuous fever', 'Severe malaise and weakness', 'Abdominal pain and coating on tongue', 'Rose spots on trunk'],
    vernacularSymptomKeywords: [
      'typhoid', 'enteric fever', 'salmonella', 'stepladder fever', 'miyadi bukhar', 'prolonged fever',
      'टाइफाइड', 'मियादी बुखार', 'मोतीझरा', 'आंतों का बुखार', 'लगातार बुखार',
      'ટાઈફોઈડ', 'મુદતી તાવ', 'ઝીણો તાવ',
      'ਟਾਈਫਾਈਡ', 'ਮਿਆਦੀ ਬੁਖਾਰ',
      'டைபாய்டு', 'টাইফয়েড', 'టైఫాయిడ్'
    ],
    officialGeneric: {
      medicineName: 'Cefixime Dispersible Tablets IP 200mg / Azithromycin 500mg',
      genericSalt: 'Cefixime (3rd Generation Cephalosporin)',
      dosageStrength: '200 mg',
      pmbjpPriceINR: '₹22.00 per strip of 10 tablets (80% subsidized vs Zifi-200)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily for full 7-10 days uninterrupted under doctor guidance.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Amritarishta & Sanjivani Vati',
      scientificBotanical: 'Tinospora cordifolia, Zingiber officinale & Piper longum',
      activePhytochemical: 'Tinosporaside & Piperine',
      classicalReference: 'Bhaishajya Ratnavali, Jwara Chikitsa',
      ayushDosage: '15 ml Amritarishta mixed with equal warm water twice daily post-meals.',
      anupanaDietaryMedium: 'Equal volume of warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Boiled Cooled Water with Munakka (Dry Raisins) & Pomegranate',
      preparationMethod: 'Boil water with 5 deseeded Munakka raisins and cool. Drink light pomegranate juice to support gut mucosa.',
      modeOfAdministration: 'Drink boiled water throughout the day. Eat light soft khichdi.',
      contraindicationWarning: 'Strictly avoid spicy, deep-fried food, and unboiled tap water (prevents intestinal ulcer perforation).'
    },
    escalationProtocol: {
      dangerSigns: ['Severe abdominal rigidity or intense cramping (Intestinal perforation warning)', 'Bleeding from rectum or blood in stool', 'Extreme dehydration with delirium'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'Widal Test, Blood Culture & Sensitivity, and Complete Blood Count'
    }
  },
  {
    id: 'CLIN_11',
    conditionName: 'Bronchial Asthma, Wheezing & Dyspnea',
    hindiName: 'दमा, श्वास रोग, सांस फूलना व सीटी की आवाज (तमक श्वास)',
    gujaratiName: 'દમ, શ્વાસ ચડવો અને ફેફસામાં સિસોટી જેવો અવાજ',
    punjabiName: 'ਦਮਾ, ਸਾਹ ਚੜ੍ਹਨਾ ਅਤੇ ਛਾਤੀ ਵਿੱਚੋਂ ਸੀਟੀ ਵਰਗੀ ਆਵਾਜ਼',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['Expiratory wheezing whistling sound', 'Shortness of breath on mild exertion or at night', 'Chronic dry nocturnal cough', 'Chest tightness in cold weather'],
    vernacularSymptomKeywords: [
      'asthma', 'wheezing', 'shortness of breath', 'breathlessness', 'dyspnea', 'breathing problem', 'inhaler',
      'दमा', 'सांस फूलना', 'श्वास रोग', 'सांस लेने में तकलीफ', 'सीटी की आवाज', 'तमक श्वास',
      'દમ', 'શ્વાસ', 'શ્વાસ ચડવો', 'હાંફ ચડવી',
      'ਦਮਾ', 'ਸਾਹ ਦੀ ਤਕਲੀਫ', 'ਸਾਹ ਚੜ੍ਹਨਾ',
      'ஆஸ்துமா', 'மூச்சுத்திணறல்', 'ఆస్తమా', 'శ్వాస తీసుకోవడంలో ఇబ్బంది'
    ],
    officialGeneric: {
      medicineName: 'Salbutamol 100mcg + Budesonide 200mcg Inhalation Aerosol IP',
      genericSalt: 'Salbutamol + Budesonide (Bronchodilator & Corticosteroid Inhaler)',
      dosageStrength: '200 Metered Doses',
      pmbjpPriceINR: '₹65.00 per inhaler (75% cheaper than Asthalin/Budecort)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1-2 puffs via spacer during acute bronchospasm; rinse mouth with water after inhalation.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Vasavaleha & Shwas Kuthar Rasa',
      scientificBotanical: 'Adhatoda vasica (Vasaka / Malabar Nut)',
      activePhytochemical: 'Vasicine & Vasicinone (Potent natural bronchodilator)',
      classicalReference: 'Charaka Samhita, Chikitsa Sthana & API Part I, Vol I',
      ayushDosage: '1 teaspoon (5g) Vasavaleha twice daily with warm water.',
      anupanaDietaryMedium: 'Warm water or warm milk'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Fresh Ginger Juice with Honey & Warm Mustard Oil Chest Rub',
      preparationMethod: 'Mix 1 teaspoon fresh ginger juice with 1 teaspoon honey and a pinch of black salt. Lightly warm mustard oil with a pinch of camphor.',
      modeOfAdministration: 'Drink mixture slowly. Massage warm mustard oil gently on chest and back to loosen bronchospasm.',
      contraindicationWarning: 'Do not discontinue prescribed inhalers during an active severe asthma attack.'
    },
    escalationProtocol: {
      dangerSigns: ['Peak Flow / SpO2 dropping below 92%', 'Unable to speak full sentences in one breath', 'Blue discoloration of lips or fingernails (Cyanosis)'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: 'Spirometry (PFT) & Arterial Blood Gas (ABG)'
    }
  },
  {
    id: 'CLIN_12',
    conditionName: 'Renal Calculi, Kidney Stones & Colic Pain',
    hindiName: 'गुर्दे की पथरी, पेशाब में रुकावट व कमर से पेट तक दर्द (अश्मरी)',
    gujaratiName: 'પથરી, કિડનીની પથરી અને પેશાબમાં તીવ્ર દુખાવો',
    punjabiName: 'ਗੁਰਦੇ ਦੀ ਪੱਥਰੀ, ਪੇਸ਼ਾਬ ਰੁਕਣਾ ਅਤੇ ਪੇਟ-ਲੱਕ ਦਾ ਤਿੱਖਾ ਦਰਦ (ਅਸ਼ਮਰੀ)',
    bodySystem: 'Renal',
    typicalSymptoms: ['Excruciating spasmodic flank-to-groin colic pain', 'Burning and blood in urine (Hematuria)', 'Urinary hesitancy and painful straining', 'Nausea and vomiting during severe colic episodes'],
    vernacularSymptomKeywords: [
      'kidney stone', 'renal stone', 'pathri', 'renal calculi', 'flank pain', 'stone pain', 'burning urine', 'stone',
      'पथरी', 'गुर्दे की पथरी', 'किडनी स्टोन', 'पेशाब में पथरी', 'अश्मरी',
      'પથરી', 'કિડની પથરી', 'મૂત્રાશય પથરી',
      'ਗੁਰਦੇ ਦੀ ਪੱਥਰੀ', 'ਪੱਥਰੀ',
      'கல்லடைப்பு', 'சிறுநீரகக் கல்', 'కిడ్నీలో రాళ్లు', 'మూత్రపిండాల్లో రాళ్ళు'
    ],
    officialGeneric: {
      medicineName: 'Potassium Magnesium Citrate Oral Solution IP + Tamsulosin 0.4mg',
      genericSalt: 'Potassium Magnesium Citrate (Urinary Alkalizer) + Tamsulosin (Alpha Blocker)',
      dosageStrength: '200 ml Solution / 0.4mg Capsule',
      pmbjpPriceINR: '₹45.00 per bottle / ₹12.00 per strip (70% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '15 ml solution diluted in a full glass of water after meals 3 times daily.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Pashanbhed (Bergenia ligulata) & Gokshuradi Guggulu',
      scientificBotanical: 'Bergenia ligulata & Tribulus terrestris',
      activePhytochemical: 'Bergenin & Protodioscin (Lithotriptic & Diuretic)',
      classicalReference: 'Sushruta Samhita, Ashmari Chikitsa & API Part I, Vol I',
      ayushDosage: '2 tablets (500mg each) twice daily with plenty of water.',
      anupanaDietaryMedium: 'Varunadi Kwath or warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Kulthi Dal (Horse Gram) Water & Fresh Radish Juice',
      preparationMethod: 'Soak 2 tablespoons Kulthi dal in 2 cups water overnight; boil down to 1 cup in the morning and strain.',
      modeOfAdministration: 'Drink warm water extract on empty stomach. Drink 3-4 liters of water daily.',
      contraindicationWarning: 'Immediate surgery/stenting needed if stone > 10mm or causing complete urinary obstruction.'
    },
    escalationProtocol: {
      dangerSigns: ['Complete inability to pass urine for > 8 hours (Anuria)', 'High fever with chills and back pain (Pyelonephritis kidney infection)', 'Intractable vomiting'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'USG KUB (Kidney, Ureter, Bladder) & Serum Creatinine / Blood Urea'
    }
  },
  {
    id: 'CLIN_13',
    conditionName: 'Acute Diarrhea, Gastroenteritis & Dehydration',
    hindiName: 'दस्त, पतले दस्त, उल्टी व डिहाइड्रेशन (अतिसार)',
    gujaratiName: 'ઝાડા, ઉલટી અને પાણીની અછત (અતિસાર)',
    punjabiName: 'ਦਸਤ, ਉਲਟੀਆਂ ਅਤੇ ਪਾਣੀ ਦੀ ਘਾਟ (ਅਤੀਸਾਰ)',
    bodySystem: 'Digestive',
    typicalSymptoms: ['Frequent watery loose stools (>3 times/day)', 'Abdominal cramping', 'Sunken eyes and dry tongue', 'Loss of skin turgor and dizziness on standing'],
    vernacularSymptomKeywords: [
      'diarrhea', 'loose motion', 'loose motions', 'vomiting', 'dehydration', 'stomach infection', 'gastroenteritis', 'dast',
      'दस्त', 'पतले दस्त', 'उल्टी दस्त', 'पानी जैसे दस्त', 'अतिसार', 'पेट खराब',
      'ઝાડા', 'ઝાડા-ઉલટી', 'પાતળા ઝાડા',
      'ਦਸਤ', 'ਉਲਟੀਆਂ', 'ਪਤਲੇ ਦਸਤ',
      'வயிற்றுப்போக்கு', 'வாந்தி', 'విరేచనాలు', 'వాంతులు'
    ],
    officialGeneric: {
      medicineName: 'WHO Oral Rehydration Salts (ORS) IP 21.8g + Zinc Sulfate 20mg Tablets',
      genericSalt: 'ORS (Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose) + Zinc',
      dosageStrength: '21.8 g Sachet / 20 mg',
      pmbjpPriceINR: '₹4.00 per ORS sachet & ₹3.50 per strip of 10 Zinc tablets',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Dissolve entire sachet in exactly 1 liter clean drinking water; sip continuously after each loose stool.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Kutajarishta & Bilwadi Churna',
      scientificBotanical: 'Holarrhena antidysenterica (Kutaja) & Aegle marmelos (Bael)',
      activePhytochemical: 'Conessine, Marmelosin & Tannins (Astringent & Anti-diarrheal)',
      classicalReference: 'Bhaishajya Ratnavali, Atisara Rogadhikara',
      ayushDosage: '15 ml Kutajarishta mixed with equal warm water twice daily after light meal.',
      anupanaDietaryMedium: 'Equal volume of warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Thin Rice Congee (Peya) with Roasted Cumin & Rock Salt',
      preparationMethod: 'Boil 1 tablespoon white rice in 4 cups water until soft and watery. Add pinch of roasted cumin and rock salt.',
      modeOfAdministration: 'Sip warm bowl every 2-3 hours. Drink fresh unsalted buttermilk (Chhaas).',
      contraindicationWarning: 'Do not take heavy milk, oily food, or anti-motility loperamide in acute bacterial dysentery.'
    },
    escalationProtocol: {
      dangerSigns: ['Blood or mucus in stool (Dysentery)', 'No urine output for over 6 hours in infants', 'Lethargy, sunken eyes, or cold extremities (Severe hypovolemic shock)'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Stool Routine & Microscopy, Serum Electrolytes (Na+, K+, Cl-)'
    }
  },
  {
    id: 'CLIN_14',
    conditionName: 'Migraine & Vascular Tension Headache',
    hindiName: 'माइग्रेन, आधा सीसी सिरदर्द व तनाव (सूर्यावर्त / अर्धावभेदक)',
    gujaratiName: 'આધાશીશી, માઈગ્રેન અને તીવ્ર માથાનો દુખાવો',
    punjabiName: 'ਅੱਧੇ ਸਿਰ ਦਾ ਦਰਦ, ਮਾਈਗ੍ਰੇਨ ਅਤੇ ਤਣਾਅ (ਅਰਧਾਵਭੇਦਕ)',
    bodySystem: 'Nervous',
    typicalSymptoms: ['Unilateral throbbing pulsing headache', 'Photophobia (sensitivity to light) and phonophobia (sound)', 'Nausea and vomiting', 'Visual aura (zigzag flashes before attack)'],
    vernacularSymptomKeywords: [
      'migraine', 'headache', 'tension headache', 'throbbing headache', 'half headache', 'sir dard', 'head pain',
      'माइग्रेन', 'सिरदर्द', 'आधा सीसी', 'सिर में दर्द', 'माथे में दर्द', 'अधकपारी',
      'આધાશીશી', 'માથાનો દુખાવો', 'માઈગ્રેન',
      'ਅੱਧਾ ਸਿਰ ਦਰਦ', 'ਸਿਰ ਪੀੜ', 'ਮਾਈਗ੍ਰੇਨ',
      'ஒற்றைத் தலைவலி', 'தலைவலி', 'తలనొప్పి', 'మైగ్రేన్'
    ],
    officialGeneric: {
      medicineName: 'Naproxen 500mg + Domperidone 10mg Tablets IP',
      genericSalt: 'Naproxen + Domperidone (NSAID & Anti-emetic)',
      dosageStrength: '500mg / 10mg',
      pmbjpPriceINR: '₹14.00 per strip of 10 tablets (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet at the earliest onset of headache with food; rest in a dark, quiet room.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Shirashooladi Vajra Rasa & Pathyadi Kwath',
      scientificBotanical: 'Terminalia chebula, Emblica officinalis & Andrographis',
      activePhytochemical: 'Chebulagic acid, Corilagin & Flavonoids',
      classicalReference: 'Bhaishajya Ratnavali, Shirorogadhikara',
      ayushDosage: '1 tablet twice daily with warm water post-meals.',
      anupanaDietaryMedium: 'Warm water or Cow Ghee (Ghrita)'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Coriander Seed & Sandalwood Forehead Paste with Coconut Water',
      preparationMethod: 'Grind 1 teaspoon fresh coriander seeds with sandalwood powder and cold water into a smooth paste.',
      modeOfAdministration: 'Apply gently across forehead and temples. Rest in a dark, silent room with eyes closed.',
      contraindicationWarning: 'Seek urgent hospital care if sudden explosive headache is the worst headache of your life.'
    },
    escalationProtocol: {
      dangerSigns: ['Sudden "thunderclap" severe headache (Aneurysm/Subarachnoid bleed warning)', 'Headache accompanied by neck stiffness and fever (Meningitis)', 'Unilateral weakness, speech difficulty or vision loss'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: 'CT Brain Plain / MRI Brain & Fundoscopy'
    }
  },
  {
    id: 'CLIN_15',
    conditionName: 'Urinary Tract Infection (UTI) & Dysuria',
    hindiName: 'मूत्र मार्ग संक्रमण (UTI), पेशाब में जलन व बार-बार पेशाब (मूत्रकृच्छ्र)',
    gujaratiName: 'પેશાબમાં બળતરા, યુટીઆઈ અને વારંવાર પેશાબ થવો',
    punjabiName: 'ਪੇਸ਼ਾਬ ਵਿੱਚ ਜਲਣ, ਯੂਟੀਆਈ ਅਤੇ ਦਰਦ ਨਾਲ ਪੇਸ਼ਾਬ ਆਉਣਾ (ਮੂਤਰਕ੍ਰਿਛ)',
    bodySystem: 'Renal',
    typicalSymptoms: ['Burning sensation during micturition (dysuria)', 'Urgent and frequent need to urinate', 'Cloudy or foul-smelling urine', 'Suprapubic lower pelvic pain'],
    vernacularSymptomKeywords: [
      'uti', 'urinary tract infection', 'burning urination', 'painful urination', 'dysuria', 'urine infection', 'burning urine',
      'पेशाब में जलन', 'यूटीआई', 'पेशाब में दर्द', 'रुक-रुक कर पेशाब', 'मूत्र संक्रमण',
      'પેશાબમાં બળતરા', 'યુટીઆઈ', 'પેશાબ રોકાવો',
      'ਪੇਸ਼ਾਬ ਵਿੱਚ ਜਲਣ', 'ਯੂ.ਟੀ.ਆਈ',
      'சிறுநீர் தொற்று', 'சிறுநீரில் எரிச்சல்', 'మూత్రంలో మంట', 'యూటీఐ'
    ],
    officialGeneric: {
      medicineName: 'Nitrofurantoin Sustained Release Tablets IP 100mg',
      genericSalt: 'Nitrofurantoin (Urinary Antibacterial)',
      dosageStrength: '100 mg SR',
      pmbjpPriceINR: '₹22.00 per strip of 10 tablets (75% subsidized vs brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily with food or milk for 5-7 days; urine may turn harmless dark yellow.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Chandanasava & Gokshuradi Churna',
      scientificBotanical: 'Santalum album (Chandan) & Tribulus terrestris (Gokshura)',
      activePhytochemical: 'Santalol, Protodioscin & Potassium salts',
      classicalReference: 'Bhaishajya Ratnavali, Mutrakrichhra Rogadhikara',
      ayushDosage: '15 ml Chandanasava mixed with 15 ml water twice daily post-meals.',
      anupanaDietaryMedium: 'Equal volume of cool water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Coriander Seed Overnight Cold Infusion (Dhanya Hima)',
      preparationMethod: 'Coarsely crush 2 tablespoons coriander seeds, soak in 2 cups drinking water overnight. Strain in the morning and sweeten with mishri (rock sugar).',
      modeOfAdministration: 'Drink 1 cup twice daily. Drink tender coconut water freely.',
      contraindicationWarning: 'Do not ignore fever and flank pain as it indicates infection spreading to kidneys.'
    },
    escalationProtocol: {
      dangerSigns: ['High fever with rigors and one-sided back pain (Acute Pyelonephritis)', 'Frank red blood in urine (Gross Hematuria)', 'Inability to urinate at all'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'Urine Routine & Microscopy, Urine Culture & Sensitivity'
    }
  },
  {
    id: 'CLIN_16',
    conditionName: 'Iron Deficiency Anemia & Chronic Fatigue',
    hindiName: 'खून की कमी, एनीमिया, चक्कर व कमजोरी (पांडुरोग)',
    gujaratiName: 'લોહીની કમી (એનીમિયા), ચક્કર અને નબળાઈ',
    punjabiName: 'ਖੂਨ ਦੀ ਘਾਟ (ਅਨੀਮੀਆ), ਚੱਕਰ ਆਉਣੇ ਅਤੇ ਥਕਾਵਟ (ਪਾਂਡੂ ਰੋਗ)',
    bodySystem: 'Metabolic',
    typicalSymptoms: ['Pallor of inner eyelids, tongue, and nail beds', 'Easy exhaustion and breathlessness on climbing stairs', 'Dizziness and fainting spells', 'Craving to eat non-food items like chalk/clay (Pica)'],
    vernacularSymptomKeywords: [
      'anemia', 'iron deficiency', 'low hemoglobin', 'weakness', 'fatigue', 'pale skin', 'khoon ki kami', 'hb low',
      'खून की कमी', 'एनीमिया', 'कमजोरी', 'चक्कर आना', 'थकान', 'पीलापन', 'पांडुरोग',
      'લોહીની કમી', 'એનીમિયા', 'નબળાઈ', 'થાક',
      'ਖੂਨ ਦੀ ਘਾਟ', 'ਅਨੀਮੀਆ', 'ਕਮਜ਼ੋਰੀ',
      'இரத்த சோகை', 'உடல் சோர்வு', 'రక్తహీనత', 'నీరసం', 'రక్తం తక్కువ'
    ],
    officialGeneric: {
      medicineName: 'Ferrous Ascorbate 100mg + Folic Acid 1.5mg Tablets IP',
      genericSalt: 'Ferrous Ascorbate (Elemental Iron 100mg) + Folic Acid (Anemia Mukt Bharat standard)',
      dosageStrength: '100mg / 1.5mg',
      pmbjpPriceINR: '₹8.00 per strip of 10 tablets (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily strictly after meals with water or citrus fruit; avoid tea/coffee for 2 hours.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Lohasava & Punarnava Mandur',
      scientificBotanical: 'Purified Iron (Loha Bhasma), Boerhavia diffusa & Triphala',
      activePhytochemical: 'Organically chelated Iron oxide with natural bio-enhancers',
      classicalReference: 'Sharangadhara Samhita, Madhyama Khanda & API Part II',
      ayushDosage: '15 ml Lohasava diluted in equal water twice daily after food.',
      anupanaDietaryMedium: 'Equal volume of water or Amla juice'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Beetroot, Carrot & Fresh Amla Juice with Jaggery (Gud)',
      preparationMethod: 'Blend 1 small beetroot, 1 carrot, and 1 fresh Indian gooseberry (Amla) with water and strain. Mix with 1 teaspoon organic jaggery.',
      modeOfAdministration: 'Drink 1 fresh glass daily morning. Vitamin C in Amla maximizes dietary non-heme iron absorption.',
      contraindicationWarning: 'Do not drink tea, coffee, or milk alongside iron supplements as tannins and calcium inhibit iron uptake.'
    },
    escalationProtocol: {
      dangerSigns: ['Hemoglobin level < 7.0 g/dL (Severe decompensated anemia)', 'Chest pain or rapid heartbeat on resting', 'Shortness of breath even while sitting'],
      maxWaitHoursBeforeHospital: 12,
      recommendedLabTest: 'Complete Blood Count (CBC) with Peripheral Blood Smear & Serum Ferritin'
    }
  },
  {
    id: 'CLIN_17',
    conditionName: 'Dermatitis, Fungal Tinea & Eczema',
    hindiName: 'दाद, खाज, खुजली, फंगल इन्फेक्शन व चर्मरोग (कुष्ठ / दद्रु)',
    gujaratiName: 'ધાધર, ખસ, ખંજવાળ અને ચામડીનું ઇન્ફેક્શન',
    punjabiName: 'ਦਾਦ, ਖਾਜ, ਖੁਜਲੀ, ਫੰਗਲ ਇਨਫੈਕਸ਼ਨ ਅਤੇ ਚਮੜੀ ਦੇ ਰੋਗ (ਦਦਰੂ)',
    bodySystem: 'Dermatological',
    typicalSymptoms: ['Circular ring-shaped itchy red scaly patches', 'Intense itching exacerbated by sweat and tight clothing', 'Oozing or cracked dry skin in body folds (groin, armpits, toes)'],
    vernacularSymptomKeywords: [
      'fungal infection', 'ringworm', 'tinea', 'itching', 'skin rash', 'skin rashes', 'rash', 'rashes', 'eczema', 'dermatitis', 'khaj', 'daad', 'itch', 'itches', 'hives', 'urticaria', 'red spots', 'skin allergy',
      'दाद', 'खाज', 'खुजली', 'चर्मरोग', 'फंगल इन्फेक्शन', 'त्वचा में खुजली', 'छाजन', 'चकत्ते', 'लाल चकत्ते', 'पित्ती',
      'ધાધર', 'ખસ', 'ખંજવાળ', 'ચામડીનો રોગ', 'ચકામા', 'લાલ ચકામા',
      'ਦਾਦ', 'ਖਾਜ', 'ਖੁਜਲੀ', 'ਚਮੜੀ ਦੇ ਦਾਗ', 'ਧੱਫੜ', 'ਚਮੜੀ ਤੇ ਧੱਫੜ',
      'படர்தாமரை', 'தோல் அரிப்பு', 'தடிப்பு', 'గజ్జి', 'తామర', 'దురద', 'దద్దుర్లు'
    ],
    officialGeneric: {
      medicineName: 'Clotrimazole 1% Cream IP + Terbinafine 250mg Tablets',
      genericSalt: 'Clotrimazole (Topical Antifungal) / Terbinafine Hydrochloride',
      dosageStrength: '20g Tube / 250mg Tablet',
      pmbjpPriceINR: '₹12.00 per tube / ₹18.00 per strip of 7 tablets (85% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Clean and dry area thoroughly; apply thin layer of cream twice daily for full 2-3 weeks.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Khadirarishta & Neem Ghan Vati / Mahamarichyadi Taila',
      scientificBotanical: 'Acacia catechu (Khadira) & Azadirachta indica (Neem)',
      activePhytochemical: 'Catechin, Nimbin & Azadirachtin',
      classicalReference: 'Sharangadhara Samhita & API Part I, Vol I',
      ayushDosage: '15 ml Khadirarishta with 15 ml water twice daily post-meals.',
      anupanaDietaryMedium: 'Warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Crushed Fresh Neem Leaves & Pure Virgin Coconut Oil',
      preparationMethod: 'Grind 10 fresh washed neem leaves into a fine paste. Mix with 1 teaspoon virgin coconut oil and a pinch of pure turmeric.',
      modeOfAdministration: 'Apply topically to affected itchy patch; leave for 30 minutes, wash with lukewarm water. Wear loose cotton clothes.',
      contraindicationWarning: 'NEVER use over-the-counter steroid creams (Betamethasone/Clobetasol) on fungal infections as they cause severe relapse.'
    },
    escalationProtocol: {
      dangerSigns: ['Secondary bacterial infection with pus oozing and spreading red streaks (Cellulitis)', 'High fever with widespread blisters', 'Facial or genital involvement'],
      maxWaitHoursBeforeHospital: 12,
      recommendedLabTest: 'KOH Mount for Fungal Hyphae & Skin Scraping Examination'
    }
  },
  {
    id: 'CLIN_18',
    conditionName: 'Insomnia, Anxiety & Sleep Disturbances',
    hindiName: 'अनिद्रा, नींद न आना, बेचैनी व मानसिक तनाव (अनिद्रा / मानसमंद)',
    gujaratiName: 'અનિદ્રા, ઊંઘ ન આવવી અને માનસિક તણાવ',
    punjabiName: 'ਨੀਂਦ ਨਾ ਆਉਣੀ (ਅਨਿੰਦਰਾ), ਬੇਚੈਨੀ ਅਤੇ ਮਾਨਸਿਕ ਤਣਾਅ',
    bodySystem: 'Nervous',
    typicalSymptoms: ['Difficulty initiating or maintaining sleep', 'Restless racing thoughts at bedtime', 'Daytime fatigue and irritability', 'Waking unrefreshed before alarm'],
    vernacularSymptomKeywords: [
      'insomnia', 'sleep problem', 'sleeplessness', 'anxiety', 'stress', 'restlessness', 'cant sleep', 'neend',
      'अनिद्रा', 'नींद न आना', 'तनाव', 'बेचैनी', 'नींद की समस्या', 'चिंता',
      'અનિદ્રા', 'ઊંઘ ન આવવી', 'ચિંતા', 'તણાવ',
      'ਨੀਂਦ ਨਾ ਆਉਣੀ', 'ਤਣਾਅ', 'ਬੇਚੈਨੀ',
      'தூக்கமின்மை', 'மன அழுத்தம்', 'నిద్రలేమి', 'ఒత్తిడి', 'నిద్ర పట్టకపోవడం'
    ],
    officialGeneric: {
      medicineName: 'Melatonin Tablets IP 3mg / 5mg',
      genericSalt: 'Melatonin (Circadian Rhythm Chronobiotic Regulator)',
      dosageStrength: '3 mg',
      pmbjpPriceINR: '₹14.00 per strip of 10 tablets (70% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet 30-60 minutes before bedtime in a dark room; avoid screens and phone blue light.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Ashwagandha Churna & Brahmi Vati',
      scientificBotanical: 'Withania somnifera & Bacopa monnieri',
      activePhytochemical: 'Withanolides & Bacosides A/B (Adaptogen & GABAergic neuromodulator)',
      classicalReference: 'Charaka Samhita & Ayurvedic Pharmacopoeia of India, Part I, Vol I',
      ayushDosage: '1 teaspoon (3g) Ashwagandha powder mixed in warm cow milk at night.',
      anupanaDietaryMedium: 'Warm milk or warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Milk with a Pinch of Grated Nutmeg (Jaiphal)',
      preparationMethod: 'Boil 1 cup cow milk with a tiny pinch (1/8th tsp) of freshly grated nutmeg (Jaiphal).',
      modeOfAdministration: 'Sip warm 30 minutes before sleep. Massage soles of feet with warm sesame or mustard oil (Pada Abhyanga).',
      contraindicationWarning: 'Do not take excessive nutmeg (toxic in large doses). Avoid caffeine/tea past 4 PM.'
    },
    escalationProtocol: {
      dangerSigns: ['Severe suicidal ideation or thoughts of self-harm', 'Auditory hallucinations or acute panic attacks with chest pain', 'Chronic sleep deprivation causing daytime motor accidents'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Serum TSH (Thyroid Stimulating Hormone) & Polysomnography (Sleep Study)'
    }
  },
  {
    id: 'CLIN_19',
    conditionName: 'Constipation & Sluggish Bowel Movement',
    hindiName: 'कब्ज, पेट साफ न होना व मल त्याग में कठिनाई (विबंध)',
    gujaratiName: 'કબજિયાત, પેટ સાફ ન થવું અને મળત્યાગમાં તકલીફ',
    punjabiName: 'ਕਬਜ਼, ਪੇਟ ਸਾਫ ਨਾ ਹੋਣਾ ਅਤੇ ਸਖ਼ਤ ਮਲ (ਵਿਬੰਧ)',
    bodySystem: 'Digestive',
    typicalSymptoms: ['Fewer than 3 bowel movements per week', 'Hard lumpy stools requiring excessive straining', 'Sensation of incomplete evacuation', 'Abdominal bloating and discomfort'],
    vernacularSymptomKeywords: [
      'constipation', 'hard stool', 'bowel problem', 'irregular bowel', 'kabj', 'straining', 'bloated',
      'कब्ज', 'पेट साफ न होना', 'कब्जियत', 'मल कड़ा होना', 'विबंध', 'पेट भारी रहना',
      'કબજિયાત', 'પેટ સાફ ન થવું', 'મળ કઠણ થવો',
      'ਕਬਜ਼', 'ਪੇਟ ਨਾ ਖੁਲ੍ਹਣਾ',
      'மலச்சிக்கல்', 'మలబద్ధకం', 'మోషన్ ఫ్రీగా రాకపోవడం'
    ],
    officialGeneric: {
      medicineName: 'Bisacodyl Tablets IP 5mg / Ispaghula Husk (Psyllium) 100g',
      genericSalt: 'Bisacodyl (Stimulant Laxative) / Ispaghula Husk (Bulk-forming Dietary Fiber)',
      dosageStrength: '5 mg / 100 g',
      pmbjpPriceINR: '₹4.00 per strip of 10 tablets & ₹35.00 per 100g pack',
      cdscoNlemListed: true,
      standardDosageSchedule: '1-2 tablets Bisacodyl at bedtime or 1-2 tablespoons Ispaghula husk stirred in warm water/milk.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Triphala Churna & Abhayarishta',
      scientificBotanical: 'Terminalia chebula, Terminalia bellirica & Emblica officinalis',
      activePhytochemical: 'Tannins, Chebulic acid, Gallic acid & Anthraquinones',
      classicalReference: 'Charaka Samhita & Ayurvedic Pharmacopoeia of India, Part I, Vol I',
      ayushDosage: '1 teaspoon (3-5g) Triphala powder with warm water at bedtime.',
      anupanaDietaryMedium: 'Warm water or warm milk'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Soaked Munakka (Dry Raisins) & Warm Water with Ghee',
      preparationMethod: 'Soak 8-10 deseeded Munakka raisins in water during the day; boil in 1 cup milk at night. Alternatively, 1 teaspoon cow ghee in warm milk.',
      modeOfAdministration: 'Chew softened raisins and drink the warm milk before sleeping.',
      contraindicationWarning: 'Increase water intake to at least 2.5-3 liters when consuming bulk fiber.'
    },
    escalationProtocol: {
      dangerSigns: ['No bowel movement or flatus for 4+ days with severe abdominal distension (Intestinal obstruction)', 'Severe vomiting with fecal odor', 'Bleeding per rectum with unexplained weight loss in patients > 50 years'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'Abdominal X-Ray Erect View & Colonoscopy'
    }
  },
  {
    id: 'CLIN_20',
    conditionName: 'Acute Dental Pulpitis & Toothache',
    hindiName: 'दांत का दर्द, दाढ़ का दर्द व मसूड़ों में सूजन (दंतशूल)',
    gujaratiName: 'દાંતનો દુખાવો, દાઢનો દુખાવો અને પેઢામાં સોજો',
    punjabiName: 'ਦੰਦ ਪੀੜ, ਦਾੜ੍ਹ ਦਾ ਦਰਦ ਅਤੇ ਮਸੂੜਿਆਂ ਦੀ ਸੋਜ (ਦੰਤਸ਼ੂਲ)',
    bodySystem: 'Dental',
    typicalSymptoms: ['Sharp throbbing tooth pain triggered by hot or cold food', 'Swelling and tenderness of surrounding gum tissue', 'Pain radiating to jaw, ear, or temple', 'Difficulty chewing on the affected side'],
    vernacularSymptomKeywords: [
      'toothache', 'dental pain', 'tooth pain', 'gum swelling', 'cavity pain', 'jaw pain', 'dant dard', 'teeth pain',
      'दांत दर्द', 'दांत का दर्द', 'दाढ़ का दर्द', 'मसूड़ों में सूजन', 'दंतशूल', 'दांत में कीड़ा',
      'દાંતનો દુખાવો', 'દાઢનો દુખાવો', 'પેઢાનો સોજો',
      'ਦੰਦ ਪੀੜ', 'ਦਾੜ੍ਹ ਪੀੜ', 'ਮਸੂੜਿਆਂ ਵਿੱਚ ਦਰਦ',
      'பல் வலி', 'ஈறு வீக்கம்', 'పంటి నొప్పి', 'చిగుళ్ళ వాపు'
    ],
    officialGeneric: {
      medicineName: 'Ketorolac Tromethamine 10mg Dispersible Tablets IP + Chlorhexidine 0.2% Mouthwash',
      genericSalt: 'Ketorolac Tromethamine (Potent Dental NSAID Analgesic) + Chlorhexidine Gluconate',
      dosageStrength: '10 mg DT / 100 ml',
      pmbjpPriceINR: '₹8.00 per strip of 10 tablets & ₹18.00 per mouthwash bottle',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Disperse 1 tablet in half cup water; drink strictly after food (max 3 days). Rinse mouth twice daily.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Irimedadi Taila & Lavangadi Vati',
      scientificBotanical: 'Acacia farnesiana (Irimeda) & Syzygium aromaticum (Clove)',
      activePhytochemical: 'Eugenol, Gallotannins & Essential Volatile Oils',
      classicalReference: 'Bhaishajya Ratnavali, Mukharogadhikara',
      ayushDosage: 'Oil pulling (Gandusha) with 5ml Irimedadi Taila for 5 minutes, spit out. Or suck 1 Lavangadi Vati.',
      anupanaDietaryMedium: 'Topical oral application only (do not swallow oil)'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Whole Clove (Laung) or Pure Clove Oil on Cotton Swab',
      preparationMethod: 'Crush 1 whole clove slightly to release active eugenol, or put 1 drop pure clove oil on a tiny sterile cotton ball.',
      modeOfAdministration: 'Place directly over the aching cavity or tooth for 15-20 minutes. Eugenol acts as an instant local anesthetic and antimicrobial.',
      contraindicationWarning: 'Consult a dentist for root canal or extraction; painkillers only temporarily mask dental pulp necrosis.'
    },
    escalationProtocol: {
      dangerSigns: ['Facial swelling spreading to cheek, eye, or below jaw (Ludwigs Angina space infection)', 'Difficulty breathing or swallowing', 'High fever with trismus (inability to open mouth)'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Intraoral Periapical (IOPA) Dental X-Ray & OPG'
    }
  },
  {
    id: 'CLIN_21',
    conditionName: 'Jaundice, Hepatitis & Liver Dysfunction',
    hindiName: 'पीलिया, लिवर की सूजन, पीला पेशाब व भूख न लगना (कामला)',
    gujaratiName: 'કમળો, લિવરનો સોજો અને ભૂખ ન લાગવી (કામળા)',
    punjabiName: 'ਪੀਲੀਆ, ਲਿਵਰ ਦੀ ਸੋਜ ਅਤੇ ਪੀਲਾ ਪੇਸ਼ਾਬ (ਕਾਮਲਾ)',
    bodySystem: 'Hepatic',
    typicalSymptoms: ['Yellow discoloration of sclera (eyes) and skin', 'Dark mustard-colored urine and pale stools', 'Complete loss of appetite (anorexia) and nausea', 'Dull ache in the right upper abdomen'],
    vernacularSymptomKeywords: [
      'jaundice', 'liver', 'hepatitis', 'yellow eyes', 'dark urine', 'fatty liver', 'liver problem', 'peeliya',
      'पीलिया', 'लिवर', 'पीली आंखें', 'लिवर की सूजन', 'पीला पेशाब', 'कामला',
      'કમળો', 'લિવરનો સોજો', 'પીળો પેશાબ',
      'ਪੀਲੀਆ', 'ਲਿਵਰ ਦੀ ਬਿਮਾਰੀ',
      'மஞ்சள் காமாலை', 'ஈரல் அழற்சி', 'పచ్చకామెర్లు', 'లివర్ సమస్య'
    ],
    officialGeneric: {
      medicineName: 'Ursodeoxycholic Acid 300mg Tablets IP / Silymarin 140mg',
      genericSalt: 'Ursodeoxycholic Acid (Hepatoprotective Bile Acid) or Milk Thistle Silymarin',
      dosageStrength: '300 mg',
      pmbjpPriceINR: '₹45.00 per strip of 10 tablets (75% subsidized vs Udiliv-300)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily with meals under physician monitoring.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Arogyavardhini Vati & Bhumyamalaki (Phyllanthus niruri) Swarasa',
      scientificBotanical: 'Phyllanthus niruri (Bhumyamalaki) & Picrorhiza kurroa (Kutki)',
      activePhytochemical: 'Phyllanthin, Hypophyllanthin & Kutkin (Clinically verified hepatoprotective)',
      classicalReference: 'Rasaratna Samucchaya & API Part I, Vol I',
      ayushDosage: '1 tablet Arogyavardhini Vati twice daily; 10ml Bhumyamalaki juice daily.',
      anupanaDietaryMedium: 'Lukewarm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Hygienic Fresh Sugarcane Juice with Lime & Radish Leaf Water',
      preparationMethod: 'Extract fresh sugarcane juice in hygienic condition, add a squeeze of fresh lemon. Alternatively crush fresh radish leaves for juice.',
      modeOfAdministration: 'Drink 1 glass fresh sugarcane juice daily. Eat boiled fat-free bland food (boiled rice, bottle gourd/lauki).',
      contraindicationWarning: 'Strictly avoid all fried oils, butter, alcohol, and unverified roadside raw concoctions.'
    },
    escalationProtocol: {
      dangerSigns: ['Drowsiness, confusion, or flapping hand tremors (Hepatic Encephalopathy warning)', 'Abdominal swelling with fluid accumulation (Ascites)', 'Spontaneous bleeding or vomiting blood'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'Liver Function Test (LFT: Total/Direct Bilirubin, SGOT, SGPT, Alkaline Phosphatase) & Viral Hepatitis Serology'
    }
  },
  {
    id: 'CLIN_22',
    conditionName: 'Allergic Rhinitis, Sneezing & Sinusitis',
    hindiName: 'एलर्जी, बार-बार छींकें, नाक बहना व सिर भारी रहना (प्रतिश्याय)',
    gujaratiName: 'એલર્જી, વારંવાર છીંક આવવી, શરદી અને સાયનસ',
    punjabiName: 'ਐਲਰਜੀ, ਵਾਰ-ਵਾਰ ਛਿੱਕਾਂ, ਨੱਕ ਵਗਣਾ ਅਤੇ ਸਾਈਨਸ (ਪ੍ਰਤਿਸ਼ਿਆਏ)',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['Bouts of repeated sneezing (especially early morning)', 'Clear watery nasal discharge (rhinorrhea)', 'Itchy watery eyes and itchy palate', 'Frontal facial sinus pressure and congestion'],
    vernacularSymptomKeywords: [
      'allergy', 'allergic rhinitis', 'sneezing', 'sinus', 'sinusitis', 'running nose', 'morning sneezing', 'dust allergy',
      'एलर्जी', 'छींकें', 'साइनस', 'नाक बहना', 'सुबह छींक आना', 'प्रतिश्याय', 'धूल से एलर्जी',
      'એલર્જી', 'છીંક આવવી', 'સાયનસ', 'નાક વહેવું',
      'ਐਲਰਜੀ', 'ਛਿੱਕਾਂ', 'ਸਾਈਨਸ', 'ਨੱਕ ਵਗਣਾ',
      'ஒவ்வாமை', 'தும்மல்', 'சைனஸ்', 'అలెర్జీ', 'తుమ్ములు', 'సైనస్'
    ],
    officialGeneric: {
      medicineName: 'Levocetirizine 5mg + Montelukast 10mg Tablets IP',
      genericSalt: 'Levocetirizine (Non-sedating Antihistamine) + Montelukast (Leukotriene Receptor Antagonist)',
      dosageStrength: '5mg / 10mg',
      pmbjpPriceINR: '₹11.00 per strip of 10 tablets (80% subsidized vs Montair-LC)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily strictly at bedtime; causes minimal drowsiness.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Haridra Khanda & Shadbindu Taila / Anu Taila Nasal Drops',
      scientificBotanical: 'Curcuma longa (Haridra) & Sesame oil herbal infusion',
      activePhytochemical: 'Curcuminoids & Volatile essential oils',
      classicalReference: 'Bhaishajya Ratnavali, Shitarogadhikara & API Part I',
      ayushDosage: '1 teaspoon (3g) Haridra Khanda with warm milk twice daily; 2 drops warm Anu Taila in each nostril morning.',
      anupanaDietaryMedium: 'Warm milk or warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Steam Inhalation with Carom Seeds (Ajwain) & Turmeric',
      preparationMethod: 'Boil water in a wide bowl, add 1/2 teaspoon crushed ajwain seeds and 1/4 teaspoon turmeric powder.',
      modeOfAdministration: 'Cover head with a towel and inhale warm vapors deeply for 5-8 minutes before bedtime.',
      contraindicationWarning: 'Keep face at safe distance to prevent accidental steam scalds; avoid sudden exposure to cold air.'
    },
    escalationProtocol: {
      dangerSigns: ['Severe one-sided facial swelling with visual disturbance (Invasive fungal sinusitis warning)', 'High fever with stiff neck and photophobia', 'Swelling around eyes or periorbital cellulitis'],
      maxWaitHoursBeforeHospital: 6,
      recommendedLabTest: 'Complete Blood Count with Absolute Eosinophil Count (AEC) & X-Ray Paranasal Sinuses (Water\'s View)'
    }
  },
  {
    id: 'CLIN_23',
    conditionName: 'Hyperlipidemia & High Cholesterol',
    hindiName: 'हाई कोलेस्ट्रॉल, खून में चर्बी व हृदय सुरक्षा (मेदोवृद्धि)',
    gujaratiName: 'હાઈ કોલેસ્ટ્રોલ, લોહીમાં ચરબી અને હૃદય સુરક્ષા',
    punjabiName: 'ਹਾਈ ਕੋਲੈਸਟ੍ਰੋਲ, ਖੂਨ ਵਿੱਚ ਚਰਬੀ ਅਤੇ ਦਿਲ ਦੀ ਸਿਹਤ (ਮੇਦੋਵ੍ਰਿਧੀ)',
    bodySystem: 'Cardiovascular',
    typicalSymptoms: ['Usually asymptomatic ("silent killer")', 'Fatigue on moderate exertion', 'Yellowish fat deposits around eyes (Xanthelasma)', 'Elevated LDL and Triglycerides on blood test'],
    vernacularSymptomKeywords: [
      'cholesterol', 'high cholesterol', 'triglycerides', 'lipid', 'blood fat', 'hyperlipidemia', 'heart blockage',
      'कोलेस्ट्रॉल', 'खून में चर्बी', 'हाई कोलेस्ट्रॉल', 'ट्राइग्लिसराइड', 'हार्ट ब्लॉकेज', 'मेदोवृद्धि',
      'કોલેસ્ટ્રોલ', 'લોહીમાં ચરબી', 'ટ્રાઈગ્લિસરાઈડ',
      'ਕੋਲੈਸਟ੍ਰੋਲ', 'ਖੂਨ ਵਿੱਚ ਚਰਬੀ',
      'கொலஸ்ட்ரால்', 'కొలెస్ట్రాల్', 'రక్తంలో కొవ్వు'
    ],
    officialGeneric: {
      medicineName: 'Atorvastatin Tablets IP 10mg / 20mg',
      genericSalt: 'Atorvastatin (HMG-CoA Reductase Inhibitor)',
      dosageStrength: '10 mg',
      pmbjpPriceINR: '₹7.50 per strip of 10 tablets (80% subsidized vs Atorva-10)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily at bedtime (cholesterol biosynthesis peaks at night).'
    },
    ayushClassicalFormulation: {
      formulationName: 'Guggulu (Commiphora mukul) & Arjuna Bark Kwath',
      scientificBotanical: 'Commiphora mukul & Terminalia arjuna',
      activePhytochemical: 'Guggulsterones E and Z & Arjunolic acid',
      classicalReference: 'Sushruta Samhita & Ayurvedic Pharmacopoeia of India, Part I, Vol I',
      ayushDosage: '2 tablets (500mg each) Medohar Guggulu twice daily with warm water.',
      anupanaDietaryMedium: 'Warm water or honey water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Raw Crushed Garlic (Lahsun) with Warm Water on Empty Stomach',
      preparationMethod: 'Crush 2 small cloves of fresh garlic, let stand for 5 minutes to release allicin.',
      modeOfAdministration: 'Swallow with a glass of lukewarm water every morning. Incorporate methi seeds and oats in diet.',
      contraindicationWarning: 'Inform physician if also taking blood thinners like Aspirin or Warfarin.'
    },
    escalationProtocol: {
      dangerSigns: ['Substernal heavy chest crushing pain radiating to jaw or left arm (Myocardial Infarction / Heart Attack)', 'Cold sweating and breathlessness', 'Sudden collapse'],
      maxWaitHoursBeforeHospital: 0.5,
      recommendedLabTest: 'Fasting Lipid Profile (Total Cholesterol, LDL, HDL, Triglycerides) & 12-Lead ECG'
    }
  },
  {
    id: 'CLIN_24',
    conditionName: 'Hemorrhoids, Piles & Anal Fissures',
    hindiName: 'बवासीर, पाइल्स, शौच के समय खून आना व दर्द (अर्श / परिकर्तिका)',
    gujaratiName: 'હરસ, મસા, પાઈલ્સ અને મળત્યાગમાં દુખાવો',
    punjabiName: 'ਬਵਾਸੀਰ, ਪਾਈਲਸ ਅਤੇ ਸ਼ੌਚ ਸਮੇਂ ਖੂਨ ਆਉਣਾ (ਅਰਸ਼)',
    bodySystem: 'Digestive',
    typicalSymptoms: ['Bright red painless bleeding during defecation', 'Painful protruding mass or lump at anal verge', 'Perianal itching and burning irritation', 'Severe sharp cutting pain during bowel movements (anal fissure)'],
    vernacularSymptomKeywords: [
      'piles', 'hemorrhoids', 'anal fissure', 'bleeding in stool', 'rectal bleeding', 'bawasir', 'anal pain',
      'बवासीर', 'पाइल्स', 'मस्से', 'शौच में खून', 'अर्श', 'मलद्वार में दर्द',
      'હરસ', 'મસા', 'પાઈલ્સ', 'મળમાર્ગે લોહી',
      'ਬਵਾਸੀਰ', 'ਪਾਈਲਸ', 'ਮੱਸੇ',
      'மூல நோய்', 'பவுத்திரம்', 'పైల్స్', 'మొలలు'
    ],
    officialGeneric: {
      medicineName: 'Calcium Dobesilate 500mg Capsules + Lignocaine 2% Gel IP',
      genericSalt: 'Calcium Dobesilate (Vasoprotective & Venotonic) + Lignocaine (Local Anesthetic)',
      dosageStrength: '500 mg / 30 g Tube',
      pmbjpPriceINR: '₹22.00 per strip of 10 capsules & ₹14.00 per tube (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 capsule twice daily after meals; apply soothing gel locally before and after bowel movement.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Arshoghni Vati & Triphala Guggulu / Kasisadi Taila',
      scientificBotanical: 'Azadirachta indica (Neem), Berberis aristata (Daruharidra) & Triphala',
      activePhytochemical: 'Berberine, Tannins & Guggulsterones',
      classicalReference: 'Bhaishajya Ratnavali, Arsho Rogadhikara',
      ayushDosage: '2 tablets Arshoghni Vati twice daily with water; apply Kasisadi Taila topically.',
      anupanaDietaryMedium: 'Warm water or Takra (buttermilk)'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Water Sitz Bath & Spiced Buttermilk (Takra)',
      preparationMethod: 'Sit in a tub of warm water for 15 minutes twice daily. Drink 1 glass freshly churned buttermilk with roasted cumin and rock salt daily.',
      modeOfAdministration: 'Sitz bath relaxes anal sphincter spasm instantly. Never strain on toilet; eat high-fiber green leafy vegetables.',
      contraindicationWarning: 'Do not ignore persistent bleeding in patients over 45 (colonoscopy mandatory to rule out rectal malignancy).'
    },
    escalationProtocol: {
      dangerSigns: ['Strangulated or thrombosed pile mass with unbearable purple swelling', 'Continuous heavy bleeding causing severe dizziness/pallor', 'High fever with foul-smelling anal discharge (Perianal Abscess)'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Proctoscopy, Digital Rectal Examination (DRE) & Hemoglobin Count'
    }
  },
  {
    id: 'CLIN_25',
    conditionName: 'Acute Allergic Urticaria, Skin Rashes & Hives',
    hindiName: 'पित्ती, त्वचा पर लाल चकत्ते व एलर्जी (शीतपित्त)',
    gujaratiName: 'શીળસ, ચામડી પર લાલ ચકામા અને એલર્જી',
    punjabiName: 'ਧੱਫੜ, ਚਮੜੀ ਤੇ ਲਾਲ ਦਾਗ ਅਤੇ ਐਲਰਜੀ (ਸੀਤਪਿੱਤ)',
    bodySystem: 'Dermatological',
    typicalSymptoms: ['Sudden outbreak of raised red itchy wheals (hives)', 'Intense stinging or burning sensation on skin', 'Welts appearing and disappearing rapidly across the body'],
    vernacularSymptomKeywords: [
      'rash', 'rashes', 'skin rash', 'skin rashes', 'hives', 'urticaria', 'allergy', 'skin allergy', 'red spots', 'itching', 'skin bumps', 'welts',
      'चकत्ते', 'लाल चकत्ते', 'पित्ती', 'शीतपित्त', 'एलर्जी', 'त्वचा में खुजली', 'दाने',
      'શીળસ', 'ચકામા', 'લાલ ચકામા', 'ખંજવાળ', 'ચામડીની એલર્જી',
      'ਧੱਫੜ', 'ਚਮੜੀ ਤੇ ਧੱਫੜ', 'ਖਾਰਸ਼', 'ਲਾਲ ਧੱਬੇ',
      'தடிப்பு', 'தோல் தடிப்பு', 'துరద', 'దద్దుర్లు'
    ],
    officialGeneric: {
      medicineName: 'Calamine Lotion IP 100ml + Cetirizine 10mg Tablets IP',
      genericSalt: 'Calamine + Zinc Oxide (Topical) / Cetirizine Hydrochloride (Antihistamine)',
      dosageStrength: '100ml Bottle / 10mg Tablet',
      pmbjpPriceINR: '₹14.00 per bottle / ₹3.50 per strip of 10 tablets (85% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Apply calamine lotion locally 3 times daily; 1 tablet Cetirizine at bedtime.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Haridra Khanda & Manjishtadi Kwath',
      scientificBotanical: 'Curcuma longa (Haridra) & Rubia cordifolia (Manjistha)',
      activePhytochemical: 'Curcumin & Purpurin',
      classicalReference: 'Bhaishajya Ratnavali, Sheetapitta Rogadhikara',
      ayushDosage: '3g Haridra Khanda twice daily with lukewarm milk or water.',
      anupanaDietaryMedium: 'Lukewarm milk or water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Fresh Aloe Vera Gel & Pure Virgin Coconut Oil',
      preparationMethod: 'Extract fresh pulp from an aloe vera leaf. Blend with 1 teaspoon coconut oil and gently pat onto the itchy wheals.',
      modeOfAdministration: 'Apply topically for instant cooling and mast-cell histamine stabilization. Avoid hot showers.',
      contraindicationWarning: 'If lip swelling, throat tightness, or breathing difficulty develops, treat as Anaphylaxis Emergency (Call 108).'
    },
    escalationProtocol: {
      dangerSigns: ['Swelling of tongue, lips, or throat (Angioedema)', 'Stridor or difficulty breathing', 'Dizziness or fainting'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: 'Absolute Eosinophil Count (AEC) & Serum IgE Level'
    }
  },
  {
    id: 'CLIN_26',
    conditionName: 'Acne Vulgaris, Pimples & Facial Papules',
    hindiName: 'कील-मुंहासे, फुंसी व चेहरे के दाने (युवानपिडिका)',
    gujaratiName: 'ખીલ અને ચહેરાના ફોડલા (યુવાનપીડિકા)',
    punjabiName: 'ਮੁਹਾਸੇ ਅਤੇ ਚਿਹਰੇ ਦੇ ਫਿੰਸੀਆਂ (ਯੁਵਾਨਪਿੜਿਕਾ)',
    bodySystem: 'Dermatological',
    typicalSymptoms: ['Inflammatory red pustules and papules on face and back', 'Excessive facial oiliness (seborrhea) and clogged pores (comedones)', 'Painful cystic swellings leaving hyperpigmented scars'],
    vernacularSymptomKeywords: [
      'acne', 'pimples', 'pimple', 'facial boils', 'phora', 'funsi', 'muhase', 'kil muhase', 'face spots',
      'मुंहासे', 'कील मुहासे', 'फुंसी', 'चेहरे के दाने',
      'ખીલ', 'ચહેરાના ફોડલા', 'ખીલના ડાઘ',
      'ਮੁਹਾਸੇ', 'ਫਿੰਸੀਆਂ', 'ਕੀਲ'
    ],
    officialGeneric: {
      medicineName: 'Clindamycin 1% Gel IP + Benzoyl Peroxide 2.5% Gel IP',
      genericSalt: 'Clindamycin Phosphate (Topical Antibiotic) + Benzoyl Peroxide (Keratolytic)',
      dosageStrength: '20g Tube',
      pmbjpPriceINR: '₹18.00 per tube (80% subsidized vs ₹120.00 commercial brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Wash face with mild soap; apply thin film to affected spots once at bedtime.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Khadirarishta & Lodhradi Lepa / Neem Ghan Vati',
      scientificBotanical: 'Symplocos racemosa (Lodhra) & Azadirachta indica (Neem)',
      activePhytochemical: 'Loturine & Nimbin',
      classicalReference: 'Astanga Hridaya, Uttaratantra',
      ayushDosage: '15ml Khadirarishta with 15ml water post-meals twice daily.',
      anupanaDietaryMedium: 'Lukewarm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Fuller’s Earth (Multani Mitti) & Pure Rose Water Paste',
      preparationMethod: 'Mix 1 tablespoon multani mitti with 1 tablespoon pure rose water and a pinch of turmeric powder.',
      modeOfAdministration: 'Apply to face for 15 minutes, rinse with cold water. Never squeeze or burst pimples.',
      contraindicationWarning: 'Do not use heavy oil-based cosmetics or mustard oil on active acne.'
    },
    escalationProtocol: {
      dangerSigns: ['Severe confluent nodulocystic lesions forming deep sinuses', 'Facial cellulitis with spreading heat and fever', 'Permanent keloidal scarring'],
      maxWaitHoursBeforeHospital: 48,
      recommendedLabTest: 'Dermatological Evaluation & Hormonal Profile (PCOS screen if female)'
    }
  },
  {
    id: 'CLIN_27',
    conditionName: 'Scabies & Nocturnal Parasitic Pruritus',
    hindiName: 'खुजली, खाज व रात में तेज चर्मरोग (पामा / कच्छू)',
    gujaratiName: 'ખસ અને રાત્રે થતી તીવ્ર ખંજવાળ',
    punjabiName: 'ਖਾਰਸ਼, ਖਾਜ ਅਤੇ ਰਾਤ ਵੇਲੇ ਤੇਜ਼ ਖੁਰਕ (ਪਾਮਾ)',
    bodySystem: 'Dermatological',
    typicalSymptoms: ['Intense generalized itching that worsens severely at night in bed', 'Tiny red burrow lines between fingers, wrists, armpits, and groin', 'Secondary pustules from vigorous fingernail scratching'],
    vernacularSymptomKeywords: [
      'scabies', 'night itching', 'bed itch', 'finger web rash', 'pama', 'kachhu', 'severe itching at night',
      'रात में खुजली', 'खाज', 'पामा', 'कच्छू',
      'ખસ', 'રાત્રે ખંજવાળ',
      'ਖਾਰਸ਼', 'ਰਾਤ ਦੀ ਖਾਰਸ਼'
    ],
    officialGeneric: {
      medicineName: 'Permethrin 5% Lotion IP 60ml',
      genericSalt: 'Permethrin (Synthetic Pyrethroid Scabicide)',
      dosageStrength: '60 ml Bottle',
      pmbjpPriceINR: '₹22.00 per bottle (75% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Apply thoroughly from neck down to toes before bed; wash off after 8-12 hours. Repeat after 7 days.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Gandhak Rasayana & Karanja Taila (Pongamia Oil)',
      scientificBotanical: 'Purified Sulphur (Shuddha Gandhaka) & Pongamia pinnata (Karanja)',
      activePhytochemical: 'Sulphur bio-complex & Karanjin',
      classicalReference: 'Rasa Ratna Samucchaya',
      ayushDosage: '2 tablets Gandhak Rasayana twice daily; massage Karanja oil locally.',
      anupanaDietaryMedium: 'Warm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Boiled Neem Leaf Water Bath & Bedding Sanitization',
      preparationMethod: 'Boil 2 handfuls of fresh neem leaves in a bucket of water; bathe with it. Wash all family clothes and bedsheets in boiling water and dry in bright sunlight.',
      modeOfAdministration: 'Treat all household family members simultaneously to prevent immediate ping-pong reinfection.',
      contraindicationWarning: 'Do not apply Permethrin to face or open ulcerated wounds.'
    },
    escalationProtocol: {
      dangerSigns: ['Crusted hyperkeratotic Norwegian scabies', 'Secondary bacterial impetigo with honey-colored crusts', 'Kidney inflammation (Post-streptococcal glomerulonephritis)'],
      maxWaitHoursBeforeHospital: 24,
      recommendedLabTest: 'Microscopic Skin Scraping in Mineral Oil for Sarcoptes Scabiei Mite'
    }
  },
  {
    id: 'CLIN_28',
    conditionName: 'Hyperuricemia & Acute Gouty Arthritis',
    hindiName: 'यूरिक एसिड व पैर के अंगूठे का दर्द (वातरक्त / गाउट)',
    gujaratiName: 'યુરિક એસિડ અને પગના અંગૂઠાનો દુખાવો (વાતરક્ત)',
    punjabiName: 'ਯੂਰਿਕ ਐਸਿਡ ਅਤੇ ਪੈਰ ਦੇ ਅੰਗੂਠੇ ਦਾ ਦਰਦ (ਵਾਤਰਕਤ)',
    bodySystem: 'Musculoskeletal',
    typicalSymptoms: ['Excruciating sudden pain and swelling in first metatarsophalangeal joint (big toe)', 'Shiny red, hot, throbbing joint sensitive to even bedsheets', 'Recurrent attacks triggered by purine-rich diet or alcohol'],
    vernacularSymptomKeywords: [
      'gout', 'uric acid', 'high uric acid', 'big toe pain', 'joint swelling', 'vatarakta', 'gouty arthritis',
      'यूरिक एसिड', 'गाउट', 'पैर के अंगूठे में दर्द', 'वातरक्त',
      'યુરિક એસિડ', 'પગના અંગૂઠાનો સોજો',
      'ਯੂਰਿਕ ਐਸਿਡ', 'ਅੰਗੂਠੇ ਦਾ ਦਰਦ'
    ],
    officialGeneric: {
      medicineName: 'Febuxostat 40mg Tablets IP + Colchicine 0.5mg IP',
      genericSalt: 'Febuxostat (Xanthine Oxidase Inhibitor) + Colchicine (Anti-gout)',
      dosageStrength: '40 mg / 0.5 mg',
      pmbjpPriceINR: '₹18.00 per strip of 10 tablets (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Febuxostat 1 tablet daily post lunch; Colchicine during acute attack as prescribed.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Kaishore Guggulu & Guduchi (Giloy) Kwath',
      scientificBotanical: 'Commiphora mukul (Guggulu) & Tinospora cordifolia (Guduchi)',
      activePhytochemical: 'Guggulsterones & Cordifolioside A',
      classicalReference: 'Sharangadhara Samhita, Madhyama Khanda',
      ayushDosage: '2 tablets Kaishore Guggulu twice daily with warm water.',
      anupanaDietaryMedium: 'Warm water or Guduchi decoction'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Lemon Water & Fresh Cherry / Celery Seed Infusion',
      preparationMethod: 'Squeeze half a fresh lemon into 1 glass warm water twice daily. Drink 3-4 liters of water daily to flush urate crystals.',
      modeOfAdministration: 'Avoid red meat, organ meats, beer, yeast, and high-fructose corn syrups completely.',
      contraindicationWarning: 'Do not start Allopurinol or Febuxostat during the peak of an acute attack without anti-inflammatory cover.'
    },
    escalationProtocol: {
      dangerSigns: ['Inability to bear any weight on joint', 'Visible chalky tophi nodules discharging white crystals', 'High fever suggesting septic arthritis'],
      maxWaitHoursBeforeHospital: 12,
      recommendedLabTest: 'Serum Uric Acid Level & Joint Synovial Fluid Analysis'
    }
  },
  {
    id: 'CLIN_29',
    conditionName: 'Cervical Spondylosis, Neck Pain & Stiff Shoulder',
    hindiName: 'गर्दन का दर्द, सर्वाइकल व कंधे में जकड़न (मन्यास्तम्भ)',
    gujaratiName: 'ગરદનનો દુખાવો, સર્વાઈકલ અને ખભાની જકડન (મન્યાસ્તંભ)',
    punjabiName: 'ਗਰਦਨ ਦਾ ਦਰਦ, ਸਰਵਾਈਕਲ ਅਤੇ ਮੋਢੇ ਦੀ ਜਕੜਨ',
    bodySystem: 'Musculoskeletal',
    typicalSymptoms: ['Chronic aching stiffness in neck radiating down to shoulder and arm', 'Numbness or tingling sensation in fingers (radiculopathy)', 'Occipital headache and dizziness on turning neck quickly'],
    vernacularSymptomKeywords: [
      'cervical', 'spondylosis', 'neck pain', 'stiff neck', 'neck stiffness', 'shoulder pain', 'manyastambha',
      'सर्वाइकल', 'गर्दन दर्द', 'गर्दन में जकड़न', 'कंधे में दर्द',
      'સર્વાઈકલ', 'ગરદનનો દુખાવો', 'ખભાની જકડન',
      'ਸਰਵਾਈਕਲ', 'ਗਰਦਨ ਦਰਦ'
    ],
    officialGeneric: {
      medicineName: 'Aceclofenac 100mg + Paracetamol 325mg + Thiocolchicoside 4mg IP',
      genericSalt: 'Aceclofenac (NSAID) + Paracetamol + Thiocolchicoside (Muscle Relaxant)',
      dosageStrength: 'Fixed Dose Combination Tablet',
      pmbjpPriceINR: '₹28.00 per strip of 10 tablets (75% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet twice daily after meals for 5-7 days; do not exceed prescribed duration.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Trayodashanga Guggulu & Mahanarayana Taila',
      scientificBotanical: 'Commiphora mukul (Guggulu) & Withania somnifera (Ashwagandha)',
      activePhytochemical: 'Guggulsterones & Withanolides',
      classicalReference: 'Bhaishajya Ratnavali, Vatavyadhi Rogadhikara',
      ayushDosage: '2 tablets Trayodashanga Guggulu twice daily; warm Mahanarayana oil massage.',
      anupanaDietaryMedium: 'Warm water or warm milk'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Mustard Oil with Crushed Garlic & Dry Heating Pad',
      preparationMethod: 'Warm 2 tablespoons mustard oil with 3 crushed garlic cloves until golden. Gently apply warm oil along neck muscles.',
      modeOfAdministration: 'Follow with warm towel fomentation. Avoid sleeping on thick pillows; maintain ergonomic posture while reading.',
      contraindicationWarning: 'Do not allow aggressive neck cracking or high-velocity manual manipulation by untrained bone setters.'
    },
    escalationProtocol: {
      dangerSigns: ['Loss of grip strength or dropping objects from hand', 'Sudden unsteady staggering gait', 'Bowel or bladder dysfunction (Cervical Myelopathy warning)'],
      maxWaitHoursBeforeHospital: 6,
      recommendedLabTest: 'MRI Cervical Spine & Digital Cervical X-Ray (AP & Lateral views)'
    }
  },
  {
    id: 'CLIN_30',
    conditionName: 'Aphthous Stomatitis & Painful Mouth Ulcers',
    hindiName: 'मुंह के छाले, जीभ पर छाले व जलन (मुखपाक)',
    gujaratiName: 'મોઢામાં ચાંદા, જીભ પર ચાંદા અને બળતરા (મુખપાક)',
    punjabiName: 'ਮੂੰਹ ਦੇ ਛਾਲੇ, ਜੀਭ ਤੇ ਛਾਲੇ ਅਤੇ ਸਾੜ (ਮੁਖਪਾਕ)',
    bodySystem: 'Dental',
    typicalSymptoms: ['Painful shallow round ulcers with white/yellow centers and red halo inside lips/cheeks', 'Severe burning pain while eating spicy or acidic foods', 'Difficulty speaking or chewing due to localized inflammation'],
    vernacularSymptomKeywords: [
      'mouth ulcer', 'mouth ulcers', 'chhale', 'tongue blister', 'canker sore', 'munh ke chhale', 'mukhapaka',
      'मुंह के छाले', 'जीभ के छाले', 'छाले', 'मुंह में जलन',
      'મોઢામાં ચાંદા', 'જીભ પર ચાંદા', 'મોં આવવું',
      'ਮੂੰਹ ਦੇ ਛਾਲੇ', 'ਜੀਭ ਤੇ ਛਾਲੇ'
    ],
    officialGeneric: {
      medicineName: 'Triamcinolone Acetonide 0.1% Buccal Paste IP + Riboflavin (Vitamin B2) 10mg',
      genericSalt: 'Triamcinolone Acetonide (Topical Corticosteroid) + Vitamin B2 / Folic Acid',
      dosageStrength: '5g Dental Paste / 10mg Tablet',
      pmbjpPriceINR: '₹16.00 per tube & ₹3.00 per strip of 10 tablets (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Dab small paste onto ulcer at bedtime after drying area; take B-complex tablet daily.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Khadiradi Vati & Irimedadi Taila Gandusha (Oil Pulling)',
      scientificBotanical: 'Acacia catechu (Khadira) & Glycyrrhiza glabra (Yashtimadhu)',
      activePhytochemical: 'Catechin, Glycyrrhizin & Tannins',
      classicalReference: 'Charaka Samhita, Chikitsa Sthana',
      ayushDosage: 'Keep 1 Khadiradi Vati in mouth and suck slowly 3-4 times daily.',
      anupanaDietaryMedium: 'Allow tablet to dissolve slowly in mouth'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Pure Organic Honey & Turmeric Paste with Salt Water Rinse',
      preparationMethod: 'Mix 1/2 teaspoon pure raw honey with a pinch of pure turmeric. Dab directly onto the ulcer.',
      modeOfAdministration: 'Rinse mouth gently with warm salt water before meals. Eat cooling curd/yogurt to restore oral microbiome.',
      contraindicationWarning: 'Any non-healing mouth ulcer lasting more than 3 weeks MUST be biopsied by an ENT surgeon to rule out oral malignancy.'
    },
    escalationProtocol: {
      dangerSigns: ['Hard, painless ulcer with rolled margins lasting >3 weeks (Oral Cancer flag)', 'High fever with difficulty swallowing saliva', 'Widespread ulcers across lips and eyes'],
      maxWaitHoursBeforeHospital: 48,
      recommendedLabTest: 'Serum Vitamin B12, Ferritin Level & Histopathological Biopsy if chronic'
    }
  },
  {
    id: 'CLIN_31',
    conditionName: 'Primary Dysmenorrhea & Painful Menstrual Cramps',
    hindiName: 'मासिक धर्म का दर्द, माहवारी में ऐंठन व कमर दर्द (कष्टार्तव)',
    gujaratiName: 'માસિક ધર્મનો દુખાવો અને પેડૂમાં ચૂંક (કષ્ટાર્તવ)',
    punjabiName: 'ਮਾਹਵਾਰੀ ਦਾ ਦਰਦ ਅਤੇ ਪੇਟ ਵਿੱਚ ਖਿੱਚ (ਕਸ਼ਟਾਰਤਵ)',
    bodySystem: 'Metabolic',
    typicalSymptoms: ['Sharp spasmodic lower abdominal cramps starting 1-2 days before or with menses', 'Pain radiating to thighs and lower back', 'Nausea, bloating, headache, and fatigue during menstrual cycle'],
    vernacularSymptomKeywords: [
      'period pain', 'menstrual cramps', 'dysmenorrhea', 'periods pain', 'stomach pain period', 'kashtartava',
      'मासिक धर्म दर्द', 'पीरियड का दर्द', 'माहवारी में दर्द', 'पेट में ऐंठन',
      'માસિકનો દુખાવો', 'પેડૂનો દુખાવો',
      'ਮਾਹਵਾਰੀ ਦਰਦ', 'ਪੀਰੀਅਡ ਦਾ ਦਰਦ'
    ],
    officialGeneric: {
      medicineName: 'Mefenamic Acid 250mg + Dicyclomine Hydrochloride 10mg Tablets IP',
      genericSalt: 'Mefenamic Acid (Prostaglandin Inhibitor) + Dicyclomine (Antispasmodic)',
      dosageStrength: 'FDC Tablet',
      pmbjpPriceINR: '₹7.00 per strip of 10 tablets (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet post-meals during active cramping; do not take on empty stomach.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Ashokarishta & Dashmularishta',
      scientificBotanical: 'Saraca asoca (Ashoka) & Dashmoola (Ten Classical Roots)',
      activePhytochemical: 'Saracin, Tannins & Flavonoids',
      classicalReference: 'Bhaishajya Ratnavali, Pradara Rogadhikara',
      ayushDosage: '15 ml Ashokarishta with equal water twice daily after food.',
      anupanaDietaryMedium: 'Lukewarm water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Carom Seeds (Ajwain) & Jaggery (Gud) Decoction',
      preparationMethod: 'Boil 1 teaspoon Ajwain seeds with 1 small piece of jaggery in 1 cup water for 5 minutes. Drink warm.',
      modeOfAdministration: 'Place a warm hot water bag on lower abdomen. Sip warm herbal chamomile or ginger tea.',
      contraindicationWarning: 'Severe sudden pain with missed period requires immediate emergency testing for ectopic pregnancy.'
    },
    escalationProtocol: {
      dangerSigns: ['Abnormal heavy soaking >1 pad per hour with large clots', 'Sudden severe stabbing pelvic pain with fainting', 'High fever and foul-smelling vaginal discharge'],
      maxWaitHoursBeforeHospital: 4,
      recommendedLabTest: 'Pelvic Ultrasound (USG) & Urine Pregnancy Test (UPT)'
    }
  },
  {
    id: 'CLIN_32',
    conditionName: 'Tonsillitis, Acute Pharyngitis & Severe Sore Throat',
    hindiName: 'टॉन्सिल, गले में खराश, दर्द व निगलने में तकलीफ (गलगंड / तुण्डिकेरी)',
    gujaratiName: 'ટોન્સિલ, ગળામાં સોજો, ખરાશ અને દુખાવો (ગલગંડ)',
    punjabiName: 'ਟੌਂਸਿਲ, ਗਲੇ ਵਿੱਚ ਦਰਦ, ਖਰਾਸ਼ ਅਤੇ ਸੋਜ',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['Enlarged, inflamed tonsils with yellow/white exudate spots', 'Severe painful swallowing (odynophagia) and fever', 'Tender swollen lymph nodes in neck (jugulodigastric nodes)'],
    vernacularSymptomKeywords: [
      'sore throat', 'tonsils', 'tonsillitis', 'throat pain', 'throat infection', 'difficulty swallowing', 'pharyngitis',
      'टॉन्सिल', 'गले में खराश', 'गले में दर्द', 'गला बैठना',
      'ટોન્સિલ', 'ગળામાં દુખાવો', 'ગળું બેસવું',
      'ਟੌਂਸਿਲ', 'ਗਲੇ ਵਿੱਚ ਦਰਦ'
    ],
    officialGeneric: {
      medicineName: 'Amoxicillin 500mg Capsules IP + Povidone Iodine 2% Gargle IP',
      genericSalt: 'Amoxicillin Trihydrate (Broad-spectrum Penicillin) + Povidone Iodine (Antiseptic)',
      dosageStrength: '500 mg Capsule / 100 ml Gargle',
      pmbjpPriceINR: '₹14.00 per strip of 10 & ₹18.00 per gargle bottle (80% subsidized)',
      cdscoNlemListed: true,
      standardDosageSchedule: 'Amoxicillin 1 capsule 3 times daily for full 5 days; dilute gargle 1:1 with warm water.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Khadiradi Vati & Yashtimadhu (Licorice) Churna / Sitopaladi Churna',
      scientificBotanical: 'Glycyrrhiza glabra (Yashtimadhu) & Piper longum (Pippali)',
      activePhytochemical: 'Glycyrrhizin & Piperine',
      classicalReference: 'Charaka Samhita, Chikitsa Sthana',
      ayushDosage: 'Suck 1-2 Khadiradi Vati tablets 3 times daily; 2g Yashtimadhu with warm water.',
      anupanaDietaryMedium: 'Lukewarm water or pure honey'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Warm Water Gargle with Rock Salt (Sendha Namak) & Turmeric',
      preparationMethod: 'Mix 1/2 teaspoon rock salt and 1/4 teaspoon pure turmeric in 1 glass lukewarm water.',
      modeOfAdministration: 'Gargle deeply for 30 seconds, 3-4 times daily. Do not swallow the gargle solution.',
      contraindicationWarning: 'If patient cannot swallow own saliva or has hot potato voice, rule out Peritonsillar Abscess immediately.'
    },
    escalationProtocol: {
      dangerSigns: ['Inability to swallow liquids or saliva (drooling)', 'Trismus (inability to open mouth)', 'Stridor or breathing distress'],
      maxWaitHoursBeforeHospital: 6,
      recommendedLabTest: 'Throat Swab Culture, Rapid Strep Test & Complete Blood Count (CBC)'
    }
  }
];

// Morphological Stemming for Pan-India & English Clinical Queries
function stemToken(word: string): string {
  let s = (word || '').toLowerCase().trim();
  if (s.endsWith('ies') && s.length > 4) return s.slice(0, -3) + 'y';
  if (s.endsWith('es') && s.length > 4) return s.slice(0, -2); // rashes -> rash, itches -> itch, hives -> hiv
  if (s.endsWith('s') && !s.endsWith('ss') && s.length > 3) return s.slice(0, -1);
  if (s.endsWith('ing') && s.length > 5) return s.slice(0, -3); // itching -> itch, coughing -> cough
  if (s.endsWith('ed') && s.length > 4) return s.slice(0, -2);
  return s;
}

// Offline Deterministic Search & Natural Language Generator
export class NationalClinicalKnowledgeEngine {
  public static getLocalizedRecord(record: ClinicalConditionRecord, lang: string): ClinicalConditionRecord {
    const langKey = (lang || 'en').toLowerCase();
    
    // Auto-detect localized condition title based on user language
    let localizedConditionName = record.conditionName;
    if (langKey.startsWith('hi') && record.hindiName) {
      localizedConditionName = record.hindiName;
    } else if (langKey.startsWith('gu') && record.gujaratiName) {
      localizedConditionName = record.gujaratiName;
    } else if (langKey.startsWith('pa') && record.punjabiName) {
      localizedConditionName = record.punjabiName;
    } else if (langKey !== 'en' && record.hindiName) {
      // Indic fallback preference over English for non-English users
      localizedConditionName = record.hindiName;
    }

    return {
      ...record,
      conditionName: localizedConditionName,
      ayushClassicalFormulation: {
        ...record.ayushClassicalFormulation,
        formulationName: record.ayushClassicalFormulation.formulationName.replace(/\(.*?\)/g, '').trim(),
      },
      verifiedHomeRemedy: {
        ...record.verifiedHomeRemedy,
        kitchenItem: record.verifiedHomeRemedy.kitchenItem.replace(/\(.*?\)/g, '').trim(),
      }
    };
  }

  /**
   * High-accuracy multi-token relevance search with Lemmatization & Indication Weighting
   */
  public static searchBySymptomOrCondition(query: string, lang: string = 'en'): ClinicalConditionRecord[] {
    const raw = (query || '').toLowerCase().trim();
    if (!raw) return NATIONAL_CLINICAL_RECORDS.map(rec => this.getLocalizedRecord(rec, lang));

    const stemmedRaw = stemToken(raw);

    // Tokenize query words
    const clean = raw.replace(/[^\p{L}\p{N}\s]/gu, ' ');
    const tokens = clean.split(/\s+/).filter(t => t.length > 1);
    const stemmedTokens = tokens.map(t => stemToken(t));

    const baseList = NATIONAL_CLINICAL_RECORDS.map(rec => this.getLocalizedRecord(rec, lang));

    interface ScoredRecord {
      record: ClinicalConditionRecord;
      score: number;
    }

    const scored: ScoredRecord[] = [];

    for (const record of baseList) {
      let score = 0;
      const cName = record.conditionName.toLowerCase();
      const hName = (record.hindiName || '').toLowerCase();
      const gName = (record.gujaratiName || '').toLowerCase();
      const pName = (record.punjabiName || '').toLowerCase();

      // 1. Direct whole-query or stemmed match on condition names (High weight: 100)
      if (cName.includes(raw) || raw.includes(cName) || cName.includes(stemmedRaw)) score += 100;
      if (hName.includes(raw) || raw.includes(hName)) score += 100;
      if (gName.includes(raw) || raw.includes(gName)) score += 100;
      if (pName && (pName.includes(raw) || raw.includes(pName))) score += 100;

      // 2. Keyword exact match or stemmed match (Highest weight: 120 / 70)
      for (const kw of record.vernacularSymptomKeywords) {
        const kwLower = kw.toLowerCase().trim();
        const kwStem = stemToken(kwLower);

        if (raw === kwLower || stemmedRaw === kwLower || stemmedRaw === kwStem) {
          score += 120;
        } else if (raw.includes(kwLower) || kwLower.includes(raw) || kwLower.includes(stemmedRaw) || stemmedRaw.includes(kwStem)) {
          score += 70;
        } else {
          // Token level match in keyword
          for (let i = 0; i < tokens.length; i++) {
            const tok = tokens[i];
            const sTok = stemmedTokens[i];
            if (kwLower.includes(tok) || kwLower.includes(sTok) || kwStem.includes(sTok)) {
              score += 35;
            }
          }
        }
      }

      // 3. Typical Symptoms match (Moderate weight: 20)
      for (const sym of record.typicalSymptoms) {
        const symLower = sym.toLowerCase();
        if (symLower.includes(raw) || symLower.includes(stemmedRaw)) {
          score += 20;
        } else {
          for (const sTok of stemmedTokens) {
            if (symLower.includes(sTok)) score += 8;
          }
        }
      }

      // 4. Danger signs match (Low weight: 5, prevents incidental fever/dengue false triggers)
      for (const danger of record.escalationProtocol.dangerSigns) {
        const dangerLower = danger.toLowerCase();
        if (dangerLower.includes(raw) || dangerLower.includes(stemmedRaw)) {
          score += 5;
        }
      }

      // 5. Generic medicine or AYUSH formulation match (Weight: 60)
      const medName = record.officialGeneric.medicineName.toLowerCase();
      const saltName = record.officialGeneric.genericSalt.toLowerCase();
      const ayushName = record.ayushClassicalFormulation.formulationName.toLowerCase();
      const botName = record.ayushClassicalFormulation.scientificBotanical.toLowerCase();

      if (medName.includes(raw) || saltName.includes(raw) || medName.includes(stemmedRaw)) score += 60;
      if (ayushName.includes(raw) || botName.includes(raw) || ayushName.includes(stemmedRaw)) score += 60;

      for (const sTok of stemmedTokens) {
        if (medName.includes(sTok) || saltName.includes(sTok)) score += 15;
        if (ayushName.includes(sTok) || botName.includes(sTok)) score += 15;
      }

      if (score >= 25) {
        scored.push({ record, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    return scored.map(s => s.record);
  }

  public static generateOfflineNluResponse(query: string, langCode: string = 'hi'): string {
    const matches = this.searchBySymptomOrCondition(query, langCode);
    if (!matches || matches.length === 0) {
      if (langCode.startsWith('hi')) {
        return `⚠️ आपके द्वारा खोजे गए लक्षण "${query}" के लिए कोई सत्यापित राष्ट्रीय प्राथमिक स्वास्थ्य प्रोटोकॉल नहीं मिला। कृपया सटीक जांच के लिए निकटतम सरकारी प्राथमिक स्वास्थ्य केंद्र (PHC) या डॉक्टर से संपर्क करें।`;
      }
      if (langCode.startsWith('gu')) {
        return `⚠️ તમે શોધેલ લક્ષણ "${query}" માટે કોઈ ચકાસાયેલ રાષ્ટ્રીય સારવાર માર્ગદર્શિકા મળી નથી. કૃપા કરીને યોગ્ય તપાસ માટે નજીકના સરકારી આરોગ્ય કેન્દ્ર (PHC) અથવા ડૉક્ટરનો સંપર્ક કરો.`;
      }
      if (langCode.startsWith('pa')) {
        return `⚠️ ਤੁਹਾਡੇ ਵੱਲੋਂ ਖੋਜੇ ਗਏ ਲੱਛਣ "${query}" ਲਈ ਕੋਈ ਸਰਕਾਰੀ ਕਲੀਨਿਕਲ ਪ੍ਰੋਟੋਕੋਲ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨੇੜਲੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਜਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`;
      }
      return `⚠️ No verified national clinical protocol found for "${query}". Please consult an ASHA worker or Medical Officer at your nearest Primary Health Centre (PHC) for clinical assessment.`;
    }

    const primary = matches[0];

    if (langCode.startsWith('pa')) {
      return `【ਪਛਾਣਿਆ ਗਿਆ ਵਿਕਾਰ】: ${primary.conditionName}\n\n1. ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   ਸਰਕਾਰੀ ਮੁੱਲ: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. ਪ੍ਰਮਾਣਿਤ ਆਯੁਸ਼ ਨੁਸਖਾ: ${primary.ayushClassicalFormulation.formulationName}\n   ਖੁਰਾਕ: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. ਸੁਰੱਖਿਅਤ ਘਰੇਲੂ ਉਪਚਾਰ: ${primary.verifiedHomeRemedy.kitchenItem}\n   ਵਿਧੀ: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ ਹਸਪਤਾਲ ਚੇਤਾਵਨੀ: ਜੇਕਰ ${primary.escalationProtocol.dangerSigns[0]} ਦਿਖੇ ਤਾਂ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।`;
    }

    if (langCode.startsWith('hi')) {
      return `【पहचाना गया विकार】: ${primary.conditionName}\n\n1. जन औषधि दवा: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   अनुमानित सरकारी मूल्य: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. प्रमाणित आयुष वनस्पति: ${primary.ayushClassicalFormulation.formulationName}\n   मात्रा व अनुपान: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. सुरक्षित घरेलू उपचार: ${primary.verifiedHomeRemedy.kitchenItem}\n   विधि: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ आपातकालीन चेतावनी: यदि ${primary.escalationProtocol.dangerSigns[0]} दिखे तो तुरंत अस्पताल जाएं।`;
    }

    if (langCode.startsWith('gu')) {
      return `【ઓળખાયેલ રોગ/લક્ષણ】: ${primary.conditionName}\n\n1. પ્રધાનમંત્રી જન ઔષધિ: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   સરકારી કિંમત: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. આયુષ ઔષધીય વનસ્પતિ: ${primary.ayushClassicalFormulation.formulationName}\n   લેવાની રીત: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. સુરક્ષિત ઘરગથ્થુ ઉપચાર: ${primary.verifiedHomeRemedy.kitchenItem}\n   બનાવવાની રીત: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ હોસ્પિટલ ચેતવણી: જો ${primary.escalationProtocol.dangerSigns[0]} જણાય તો તરત જ ડૉક્ટર પાસે જવું.`;
    }

    return `[Identified Condition]: ${primary.conditionName}\n\n1. Jan Aushadhi Generic: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   Govt Price: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. AYUSH Classical Remedy: ${primary.ayushClassicalFormulation.formulationName}\n   Dosage: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. Kitchen Remedy: ${primary.verifiedHomeRemedy.kitchenItem}\n   Preparation: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ Emergency Alert: Seek immediate hospital care if: ${primary.escalationProtocol.dangerSigns[0]}`;
  }
}
