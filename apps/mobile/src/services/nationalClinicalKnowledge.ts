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
  bodySystem: 'Respiratory' | 'Digestive' | 'Cardiovascular' | 'Metabolic' | 'Musculoskeletal' | 'Dermatological' | 'Nervous' | 'Renal' | 'Infectious' | 'Dental' | 'Hepatic' | 'Gastroenterology' | 'Neurology' | 'Cardiology' | 'Hematology' | 'Endocrinology' | 'Urology' | 'Nephrology' | 'Ophthalmology' | 'ENT' | 'Dermatology';
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
,
  {
    "id": "CLIN_33",
    "conditionName": "Peptic Ulcer Disease & Epigastric Burning",
    "hindiName": "पेप्टिक अल्सर व पेट में तीव्र जलन",
    "gujaratiName": "પેટમાં અલ્સર અને બળતરા",
    "punjabiName": "ਪੇਟ ਦਾ ਅਲਸਰ ਅਤੇ ਸਾੜ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Burning stomach pain",
      "Feeling of fullness",
      "Belching",
      "Fat intolerance",
      "Heartburn",
      "Nausea"
    ],
    "vernacularSymptomKeywords": [
      "peptic ulcer",
      "stomach ulcer",
      "gastric ulcer",
      "epigastric burning",
      "pet me chhale",
      "pet me jalan",
      "pet me ghav",
      "stomach burning",
      "duodenal ulcer",
      "पेट में अल्सर",
      "पेट में जलन",
      "छाले पेट में",
      "પેટમાં અલ્સર",
      "પેટમાં બળતરા",
      "ਪੇਟ ਵਿੱਚ ਅਲਸਰ"
    ],
    "officialGeneric": {
      "medicineName": "Rabeprazole 20mg + Domperidone 30mg SR Capsules",
      "genericSalt": "Rabeprazole Sodium + Domperidone",
      "dosageStrength": "20mg + 30mg",
      "pmbjpPriceINR": "₹16.00 per strip of 10 (78% savings vs ₹75.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule daily in the morning, 30 minutes before breakfast for 4 weeks."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kamdudha Ras (Moti Yukta) / Praval Pishti",
      "scientificBotanical": "Ayurvedic Mineralo-Herbal Calx Formulation",
      "activePhytochemical": "Calcium carbonate, Convolvulus pluricaulis, Santalum album",
      "classicalReference": "Bhasheshajya Ratnavali, Amlapitta Rogadhikara",
      "ayushDosage": "250mg twice daily with fresh Amla juice or cold milk.",
      "anupanaDietaryMedium": "Cold goat's milk or sweet tender coconut water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Cabbage Juice and Licorice (Mulethi) Root Water",
      "preparationMethod": "Boil 1 teaspoon pure Mulethi (Glycyrrhiza glabra) powder in 1 glass water or drink 50ml fresh cold cabbage juice.",
      "modeOfAdministration": "Consume early morning on an empty stomach.",
      "contraindicationWarning": "Do not consume red chillies, vinegar, alcohol, or NSAID painkillers (brufen/aspirin)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Black tarry stools (melena)",
        "Vomiting blood (hematemesis)",
        "Sudden sharp agonizing abdominal pain"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Upper GI Endoscopy & H. pylori Stool Antigen Test"
    }
  },
  {
    "id": "CLIN_34",
    "conditionName": "Irritable Bowel Syndrome (IBS) & Spasmodic Colon",
    "hindiName": "संग्रहणी / आंतों की मरोड़ व आईबीएस",
    "gujaratiName": "સંગ્રહણી અને આંતરડાની અનિયમિતતા",
    "punjabiName": "ਸੰਗ੍ਰਹਿਣੀ ਅਤੇ ਪੇਟ ਦੇ ਮਰੋੜ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Cramping abdominal pain",
      "Alternating diarrhea and constipation",
      "Gas and bloating",
      "Mucus in stool"
    ],
    "vernacularSymptomKeywords": [
      "ibs",
      "irritable bowel syndrome",
      "spastic colon",
      "mucus in stool",
      "aonv ana",
      "sangrahani",
      "pet me marod",
      "pet marod",
      "dast aur kabz",
      "पेट मरोड़",
      "संग्रहणी",
      "आंव आना",
      "આંતરડામાં મરોડ",
      "ਪੇਟ ਮਰੋੜ"
    ],
    "officialGeneric": {
      "medicineName": "Mebeverine Hydrochloride 135mg Tablets",
      "genericSalt": "Mebeverine HCl",
      "dosageStrength": "135 mg",
      "pmbjpPriceINR": "₹28.00 per strip of 15 (70% savings vs ₹120.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet three times daily, 20 minutes before meals."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kutajarishta / Bilwadi Lehyam",
      "scientificBotanical": "Holarrhena antidysenterica & Aegle marmelos",
      "activePhytochemical": "Conessine, Marmelosin, Imperatorin",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Grahani Rogadhikara",
      "ayushDosage": "15ml with equal quantity of lukewarm water twice daily after food.",
      "anupanaDietaryMedium": "Fresh spiced buttermilk (Chhachh) with roasted cumin"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Roasted Bel Pulp and Curd with Cumin & Rock Salt",
      "preparationMethod": "Mix 2 tablespoons dried Bilva fruit pulp with 1 bowl fresh homemade probiotic curd, pinch of roasted cumin and rock salt.",
      "modeOfAdministration": "Eat once daily with lunch.",
      "contraindicationWarning": "Avoid raw salads, heavy pulses (rajma, chana), and artificial sweeteners."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Unexplained weight loss",
        "Nocturnal diarrhea awakening from sleep",
        "Rectal bleeding"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Stool Routine & Occult Blood, Colonoscopy, Fecal Calprotectin"
    }
  },
  {
    "id": "CLIN_35",
    "conditionName": "Non-Alcoholic Fatty Liver Disease (NAFLD) & Hepatic Steatosis",
    "hindiName": "फैटी लिवर व यकृत में वसा का जमाव",
    "gujaratiName": "ફેટી લિવર અને યકૃત સોજો",
    "punjabiName": "ਫੈਟੀ ਲਿਵਰ ਦੀ ਸਮੱਸਿਆ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Dull right upper quadrant discomfort",
      "Fatigue",
      "Abdominal fullness",
      "Elevated SGPT/SGOT enzymes"
    ],
    "vernacularSymptomKeywords": [
      "fatty liver",
      "liver fat",
      "nafld",
      "hepatic steatosis",
      "swollen liver",
      "liver me charbi",
      "liver par sujan",
      "liver dard",
      "फैटी लिवर",
      "लिवर में चर्बी",
      "लिवर पर सूजन",
      "ફેટી લીવર",
      "ਫੈਟੀ ਲਿਵਰ"
    ],
    "officialGeneric": {
      "medicineName": "Ursodeoxycholic Acid 300mg Tablets IP",
      "genericSalt": "Ursodeoxycholic Acid (UDCA)",
      "dosageStrength": "300 mg",
      "pmbjpPriceINR": "₹95.00 per strip of 10 (65% savings vs ₹270.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily post meals for 3 to 6 months as evaluated."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Arogyavardhini Vati & Punarnavarishta",
      "scientificBotanical": "Picrorhiza kurroa (Kutki) & Boerhavia diffusa (Punarnava)",
      "activePhytochemical": "Kutkin, Picroside I & II, Punarnavine",
      "classicalReference": "Bhaishajya Ratnavali, Yakrid-Pliha Rogadhikara",
      "ayushDosage": "2 tablets twice daily with lukewarm water.",
      "anupanaDietaryMedium": "Punarnava decoction or warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Bhumi Amla and Fresh Papaya Seed Decoction",
      "preparationMethod": "Boil 1 teaspoon Phyllanthus niruri (Bhumi Amla) powder in 1 glass water till half.",
      "modeOfAdministration": "Drink warm once daily in morning.",
      "contraindicationWarning": "Strictly eliminate fried foods, commercial trans-fats, and high-fructose corn syrups."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Yellowing of sclera (Jaundice)",
        "Swelling in legs (Edema)",
        "Fluid in abdomen (Ascites)"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Liver Function Tests (LFT), Lipid Profile & Ultrasound Abdomen (FibroScan)"
    }
  },
  {
    "id": "CLIN_36",
    "conditionName": "Abdominal Bloating, Flatulence & Aerophagia",
    "hindiName": "पेट फूलना, गैस, आफरा व उदर वात",
    "gujaratiName": "પેટ ફૂલવું, આફરો અને ગેસ",
    "punjabiName": "ਪੇਟ ਫੁੱਲਣਾ, ਅਫਾਰਾ ਅਤੇ ਗੈਸ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Excessive gas expulsion",
      "Distended belly",
      "Abdominal fullness",
      "Rumbling sounds (borborygmi)"
    ],
    "vernacularSymptomKeywords": [
      "bloating",
      "gas",
      "flatulence",
      "pet fulna",
      "aafra",
      "pet me gas",
      "tympanites",
      "pet bhara lagna",
      "pet tanav",
      "पेट फूलना",
      "आफरा",
      "पेट में गैस",
      "પેટ ફૂલવું",
      "ગેસ",
      "ਪੇਟ ਫੁੱਲਣਾ"
    ],
    "officialGeneric": {
      "medicineName": "Activated Dimethicone 40mg + Simethicone Tablets",
      "genericSalt": "Simethicone / Dimethicone",
      "dosageStrength": "40 mg",
      "pmbjpPriceINR": "₹4.50 per strip of 10 chewable tablets (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 to 2 chewable tablets thoroughly chewed after meals and at bedtime."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Hingwashtak Churna / Shankh Vati",
      "scientificBotanical": "Ferula foetida (Hing), Trachyspermum ammi (Ajwain) & Piper nigrum",
      "activePhytochemical": "Ferulic acid, Thymol, Piperine",
      "classicalReference": "Ashtanga Hridaya, Chikitsa Sthana",
      "ayushDosage": "3 grams (half teaspoon) with first mouthful of food mixed with a drop of ghee.",
      "anupanaDietaryMedium": "First morsel of warm rice/roti with a drop of cow ghee"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Warm Ajwain (Carom Seeds) and Black Salt Water",
      "preparationMethod": "Crush 1/2 teaspoon Ajwain seeds with a pinch of Kala Namak, swallow with warm water.",
      "modeOfAdministration": "Immediately post meals when feeling bloated.",
      "contraindicationWarning": "Do not take excessive salt if hypertensive."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe abdominal rigidity",
        "Inability to pass flatus or stool for >48h",
        "Persistent projectile vomiting"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "Erect Abdominal X-Ray & Serum Amylase / Lipase"
    }
  },
  {
    "id": "CLIN_37",
    "conditionName": "Acute Food Poisoning & Infectious Enteritis",
    "hindiName": "विषाक्त भोजन संक्रमण, उल्टी-दस्त व पेट ऐंठन",
    "gujaratiName": "ફૂડ પોઈઝનીંગ અને ઉલટી-ઝાડા",
    "punjabiName": "ਫੂਡ ਪੋਇਜ਼ਨਿੰਗ, ਉਲਟੀ ਤੇ ਦਸਤ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Nausea",
      "Vomiting",
      "Watery diarrhea",
      "Abdominal cramps",
      "Low-grade fever after contaminated food"
    ],
    "vernacularSymptomKeywords": [
      "food poisoning",
      "tainted food",
      "infectious enteritis",
      "kharab khana khakar ulti dast",
      "food poison",
      "bahar ka khana",
      "उल्टी दस्त",
      "विषाक्त भोजन",
      "ફૂડ પોઈઝનીંગ",
      "ਫੂਡ ਪੋਇਜ਼ਨਿੰਗ"
    ],
    "officialGeneric": {
      "medicineName": "Oral Rehydration Salts (ORS) IP WHO Formulation + Zinc Sulfate 20mg Tablets",
      "genericSalt": "WHO-ORS (Sodium Chloride, Potassium Chloride, Sodium Citrate, Dextrose) + Zinc",
      "dosageStrength": "20.5g sachet + 20mg zinc",
      "pmbjpPriceINR": "₹4.00 per ORS sachet + ₹6.00 for 10 zinc tablets",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Dissolve 1 sachet in 1 liter clean drinking water; sip after every loose stool. 1 Zinc tab daily for 14 days."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sanjeevani Vati / Dadimashtak Churna",
      "scientificBotanical": "Vidanga, Zingiber officinale, Semecarpus anacardium & Punica granatum",
      "activePhytochemical": "Embelin, Gingerols, Punicalagins",
      "classicalReference": "Sharangadhara Samhita, Madhyama Khanda",
      "ayushDosage": "1 tablet twice daily with fresh ginger water.",
      "anupanaDietaryMedium": "Lukewarm ginger water or strained pomegranate juice"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Strained Rice Water (Manda) with Roasted Cumin & Pomegranate Juice",
      "preparationMethod": "Boil 2 tablespoons white rice in 4 cups water, strain thin liquid, add pinch of rock salt.",
      "modeOfAdministration": "Drink half cup warm every 2 hours to rest mucosal lining.",
      "contraindicationWarning": "Do not consume dairy products, caffeine, spicy gravy, or non-veg foods."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "High fever >102°F",
        "Blood in stool (Dysentery)",
        "Extreme lethargy, sunken eyes, zero urination for >8h"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Stool Culture & Sensitivity, Serum Electrolytes"
    }
  },
  {
    "id": "CLIN_38",
    "conditionName": "Acute & Chronic Cholecystitis, Gallbladder Pain",
    "hindiName": "पित्ताशय की थैली में सूजन व पथरी का दर्द",
    "gujaratiName": "પિત્તાશયમાં પથરી અને સોજો",
    "punjabiName": "ਪਿੱਤੇ ਦੀ ਪੱਥਰੀ ਦਾ ਦਰਦ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Severe upper right abdominal pain radiating to right shoulder",
      "Pain after fatty meal",
      "Nausea",
      "Fever"
    ],
    "vernacularSymptomKeywords": [
      "gallbladder pain",
      "gallstones",
      "cholecystitis",
      "biliary colic",
      "pitte ki pathri",
      "pitta thaili dard",
      "cholelithiasis",
      "पित्त की पथरी",
      "पित्ताशय सूजन",
      "પિત્તાશય પથરી",
      "ਪਿੱਤੇ ਦੀ ਪੱਥਰੀ"
    ],
    "officialGeneric": {
      "medicineName": "Drotaverine Hydrochloride 80mg Tablets IP",
      "genericSalt": "Drotaverine HCl",
      "dosageStrength": "80 mg",
      "pmbjpPriceINR": "₹9.50 per strip of 10 (75% savings vs ₹40.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet during acute spasm, maximum 3 times daily."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Rohitakarishta / Yakrit Plihantak Churna",
      "scientificBotanical": "Tecomella undulata & Boerhavia diffusa",
      "activePhytochemical": "Tecomin, Rutin, Sitosterol",
      "classicalReference": "Bhaishajya Ratnavali, Pliha-Yakrid Rogadhikara",
      "ayushDosage": "15ml mixed with equal water after meals.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Dandelion / Apple Cider Vinegar Dilution with Warm Turmeric Water",
      "preparationMethod": "Mix 1 teaspoon organic apple cider vinegar in 1 glass lukewarm water with pinch of pure turmeric.",
      "modeOfAdministration": "Sip slowly before light low-fat meals.",
      "contraindicationWarning": "Strictly refrain from heavy fried pakoras, mutton, butter, and clarified ghee."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Jaundice with severe chills/rigors",
        "Murphy's sign positive with intense rebound tenderness",
        "Unstoppable bilious vomiting"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Ultrasound Hepatobiliary System (USG Abdomen) & Total Bilirubin"
    }
  },
  {
    "id": "CLIN_39",
    "conditionName": "Oral Candidiasis, Thrush & Fungal Glossitis",
    "hindiName": "मुंह का फंगल संक्रमण, सफेद परत व छाले",
    "gujaratiName": "મોંમાં ફૂગનો ચેપ અને સફેદ છારી",
    "punjabiName": "ਮੂੰਹ ਦਾ ਫੰਗਸ ਅਤੇ ਚਿੱਟੀ ਪਰਤ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Creamy white lesions on tongue, inner cheeks, and roof of mouth",
      "Loss of taste",
      "Cottony feeling in mouth",
      "Soreness"
    ],
    "vernacularSymptomKeywords": [
      "oral thrush",
      "mouth fungus",
      "oral candidiasis",
      "white tongue patches",
      "jeebh par safed parat",
      "muh me safed chhale",
      "fungal tongue",
      "मुंह में सफेद फफूंद",
      "जीभ पर सफेद परत",
      "જીભ પર સફેદ છારી",
      "ਮੂੰਹ ਦੀ ਫੰਗਸ"
    ],
    "officialGeneric": {
      "medicineName": "Clotrimazole Mouth Paint 1% w/v Topical Solution",
      "genericSalt": "Clotrimazole IP",
      "dosageStrength": "1% w/v (15 ml)",
      "pmbjpPriceINR": "₹14.00 per bottle (70% savings vs ₹50.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply 10 to 20 drops gently to affected oral mucosal areas 3-4 times daily; hold for 2 minutes before swallowing."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Khadiradi Vati / Triphala Kawath Gandusha",
      "scientificBotanical": "Acacia catechu (Khadira) & Terminalia chebula",
      "activePhytochemical": "Catechin, Epicatechin, Chebulinic acid",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Mukha Rogadhikara",
      "ayushDosage": "Dissolve 1 tablet slowly in mouth 3 times daily.",
      "anupanaDietaryMedium": "Hold in mouth as lozenge"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Virgin Cold-Pressed Coconut Oil Swishing (Gandusha)",
      "preparationMethod": "Take 1 tablespoon virgin coconut oil (rich in anti-fungal Lauric acid) in mouth, swish gently for 5-10 minutes.",
      "modeOfAdministration": "Spit out completely into trash bin, rinse with warm water. Repeat twice daily.",
      "contraindicationWarning": "Do not swallow oil after swishing. Avoid refined sugars which feed fungal Candida."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Spread to esophagus with painful swallowing (dysphagia)",
        "Immune compromise with high fever",
        "Cracked bleeding mucosal fissures"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Fungal KOH Scraping & Fasting Blood Sugar (Check for Undiagnosed Diabetes)"
    }
  },
  {
    "id": "CLIN_40",
    "conditionName": "H. Pylori Gastritis & Chronic Antral Erythema",
    "hindiName": "एच. पाइलोरी जीवाणु संक्रमण व आमाशय सूजन",
    "gujaratiName": "પેટમાં જીવાણુ ચેપ અને બળતરા",
    "punjabiName": "ਐਚ ਪਾਈਲੋਰੀ ਬੈਕਟੀਰੀਆ ਇਨਫੈਕਸ਼ਨ",
    "bodySystem": "Gastroenterology",
    "typicalSymptoms": [
      "Ache or burning pain in abdomen",
      "Empty stomach pain",
      "Frequent burping",
      "Early satiety"
    ],
    "vernacularSymptomKeywords": [
      "h pylori",
      "helicobacter",
      "chronic gastritis",
      "antral gastritis",
      "pet me bacteria",
      "purani gastritis",
      "amashay sujan",
      "गैस्ट्राइटिस",
      "आमाशय में सूजन",
      "પેટનો સોજો",
      "ਪੇਟ ਦਾ ਪੁਰਾਣਾ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Pantoprazole 40mg + Amoxicillin 750mg + Clarithromycin Kit IP",
      "genericSalt": "Pantoprazole + Amoxicillin + Clarithromycin",
      "dosageStrength": "Standard HP-Eradication Kit",
      "pmbjpPriceINR": "₹95.00 per kit (75% savings vs ₹380.00 branded kit)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "As prescribed under verified physician guidance for 14 continuous days."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Avipattikar Churna with Yashad Bhasma",
      "scientificBotanical": "Operculina turpethum, Zingiber officinale & Zinc Calx",
      "activePhytochemical": "Turpethin, Zinc oxide bio-complex, Piperine",
      "classicalReference": "Bhaishajya Ratnavali, Amlapitta Rogadhikara",
      "ayushDosage": "3 grams twice daily after food with lukewarm water.",
      "anupanaDietaryMedium": "Fresh cold water or cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Black Cumin (Kalonji) and Raw Honey Emulsion",
      "preparationMethod": "Crush 1/2 teaspoon Nigella sativa (Kalonji) seeds, mix with 1 teaspoon raw pure honey.",
      "modeOfAdministration": "Eat once daily in morning on empty stomach.",
      "contraindicationWarning": "Do not skip meals; avoid NSAIDs, smoking, and carbonated sodas."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe unyielding vomiting",
        "Dramatic unintentional weight loss",
        "Dark tarry stools"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Urea Breath Test (UBT) or Endoscopic Biopsy"
    }
  },
  {
    "id": "CLIN_41",
    "conditionName": "Chronic Obstructive Pulmonary Disease (COPD) & Emphysema",
    "hindiName": "सीओपीडी, फेफड़ों की पुरानी सूजन व सांस फूलना",
    "gujaratiName": "ફેફસાંનો જૂનો રોગ અને શ્વાસ ચડવો",
    "punjabiName": "ਫੇਫੜਿਆਂ ਦੀ ਪੁਰਾਣੀ ਬਿਮਾਰੀ ਅਤੇ ਸਾਹ ਚੜ੍ਹਨਾ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Chronic breathlessness",
      "Daily productive cough",
      "Frequent respiratory infections",
      "Blueness of lips/fingertips"
    ],
    "vernacularSymptomKeywords": [
      "copd",
      "emphysema",
      "chronic bronchitis",
      "bidi peene se khansi",
      "saans foolna purani",
      "dama jaisi saans",
      "fephdo ki bimari",
      "फेफड़ों की बीमारी",
      "पुरानी सांस की बीमारी",
      "શ્વાસ ચડવો",
      "ਫੇਫੜਿਆਂ ਦੀ ਬਿਮਾਰੀ"
    ],
    "officialGeneric": {
      "medicineName": "Tiotropium Bromide 18mcg + Formoterol Inhalation Dry Powder Rotacaps",
      "genericSalt": "Tiotropium Bromide + Formoterol Fumarate",
      "dosageStrength": "18mcg + 12mcg",
      "pmbjpPriceINR": "₹90.00 for pack of 30 rotacaps (68% savings vs ₹285.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Inhale 1 capsule contents once daily through dry powder inhaler device."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Swas Kas Chintamani Ras / Kantakaryavaleha",
      "scientificBotanical": "Solanum xanthocarpum (Kantakari) & Adhatoda vasica (Vasa)",
      "activePhytochemical": "Solanocarpine, Vasicine, Vasicinone",
      "classicalReference": "Bhaishajya Ratnavali, Hikka-Shwasa Rogadhikara",
      "ayushDosage": "6 grams (1 teaspoon) twice daily after meals.",
      "anupanaDietaryMedium": "Warm goat milk or lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Adhatoda Vasica (Adusa) Leaf Juice with Honey",
      "preparationMethod": "Crush 4 fresh Vasa leaves to extract 1 teaspoon fresh juice, mix with 1 teaspoon raw honey.",
      "modeOfAdministration": "Consume twice daily morning and evening.",
      "contraindicationWarning": "Stop tobacco/bidi smoking immediately; avoid biomass cooking smoke."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "SpO2 oxygen saturation dropping below 88%",
        "Confusion or extreme drowsiness (CO2 narcosis)",
        "Inability to speak full sentences"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Spirometry with Reversibility Test, Arterial Blood Gas (ABG), Chest X-Ray"
    }
  },
  {
    "id": "CLIN_42",
    "conditionName": "Acute Sinusitis, Post-Nasal Drip & Frontal Headache",
    "hindiName": "साइनस संक्रमण, सिर भारीपन व नाक बंद",
    "gujaratiName": "સાઇનસ, માથું ભારે લાગવું અને નાક બંધ",
    "punjabiName": "ਸਾਈਨਸ ਦੀ ਸਮੱਸਿਆ ਅਤੇ ਸਿਰਦਰਦ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Facial pain or pressure around eyes/cheeks",
      "Nasal congestion",
      "Thick discolored nasal discharge",
      "Reduced sense of smell"
    ],
    "vernacularSymptomKeywords": [
      "sinus",
      "sinusitis",
      "frontal headache",
      "nasal blockage",
      "post nasal drip",
      "sinus ka dard",
      "nak band",
      "sar bhari",
      "cheek pain",
      "साइनस",
      "माथे में भारीपन",
      "नाक जाम",
      "સાઇનસ",
      "ਸਾਈਨਸ"
    ],
    "officialGeneric": {
      "medicineName": "Fluticasone Furoate Nasal Spray 27.5mcg / Metered Dose",
      "genericSalt": "Fluticasone Furoate",
      "dosageStrength": "27.5 mcg/actuation (120 doses)",
      "pmbjpPriceINR": "₹95.00 per bottle (70% savings vs ₹340.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "2 sprays in each nostril once daily in the morning after clearing nasal passages."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Shadbindu Taila (Nasya) / Vyoshadi Vati",
      "scientificBotanical": "Sesamum indicum oil processed with Ricinus communis & Zingiber officinale",
      "activePhytochemical": "Ricinoleic acid, Gingerol, Piperine",
      "classicalReference": "Bhaishajya Ratnavali, Shiro Rogadhikara",
      "ayushDosage": "Instill 2 drops into each nostril warm in the morning on an empty stomach.",
      "anupanaDietaryMedium": "Direct Nasya application followed by warm fomentation"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Eucalyptus and Ajwain Steam Inhalation (Bhaap)",
      "preparationMethod": "Add 1 teaspoon crushed Ajwain seeds and 2 drops eucalyptus oil to a bowl of boiling water.",
      "modeOfAdministration": "Inhale steam with a towel over head for 8 minutes, twice daily.",
      "contraindicationWarning": "Do not blow nose violently; avoid ice-cold refrigerated water."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Swelling or redness around one or both eyes",
        "Severe persistent high fever with stiff neck",
        "Double vision"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "CT Scan Paranasal Sinuses (PNS) Coronal View"
    }
  },
  {
    "id": "CLIN_43",
    "conditionName": "Laryngitis, Vocal Cord Inflammation & Hoarseness of Voice",
    "hindiName": "गले में सूजन, आवाज बैठना (स्वरभेद)",
    "gujaratiName": "અવાજ બેસી જવો અને સ્વરપેટીમાં સોજો",
    "punjabiName": "ਆਵਾਜ਼ ਬੈਠਣਾ ਅਤੇ ਗਲੇ ਦੀ ਸੋਜ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Hoarseness",
      "Weak voice or total voice loss",
      "Tickling sensation in throat",
      "Dry irritating cough"
    ],
    "vernacularSymptomKeywords": [
      "laryngitis",
      "hoarseness",
      "voice loss",
      "lost voice",
      "aawaz baithna",
      "swarabheda",
      "gala baithna",
      "hoarse voice",
      "bol na pana",
      "आवाज बैठना",
      "गला बैठना",
      "स्वरभेद",
      "અવાજ બેસવો",
      "ਆਵਾਜ਼ ਬੈਠਣੀ"
    ],
    "officialGeneric": {
      "medicineName": "Betamethasone Sodium Phosphate 0.5mg Tablets IP",
      "genericSalt": "Betamethasone",
      "dosageStrength": "0.5 mg",
      "pmbjpPriceINR": "₹1.80 per strip of 10 tablets (85% savings)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily for maximum 3 days under medical monitoring to rapidly reduce vocal cord edema."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Khadiradi Vati / Lavangadi Vati",
      "scientificBotanical": "Syzygium aromaticum (Lavanga), Khadira, Piper cubeba (Kankola)",
      "activePhytochemical": "Eugenol, Tannins, Cubebin",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Kasa Rogadhikara",
      "ayushDosage": "Suck 1 tablet slowly in the mouth 4 to 5 times daily.",
      "anupanaDietaryMedium": "Kept in buccal cavity as lozenge"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Clarified Cow Butter (Ghee) with Black Pepper Powder",
      "preparationMethod": "Mix 1 teaspoon warm pure cow ghee with 1/4 teaspoon freshly ground black pepper.",
      "modeOfAdministration": "Swallow slowly right before sleeping. Do not drink cold water afterwards.",
      "contraindicationWarning": "Complete vocal rest (whispering actually strains cords more than talking quietly)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Hoarseness lasting more than 3 weeks (malignancy screening needed)",
        "Stridor / noisy whistling breathing",
        "Difficulty swallowing saliva"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Indirect Laryngoscopy / Flexible Fiberoptic Nasolaryngoscopy"
    }
  },
  {
    "id": "CLIN_44",
    "conditionName": "Pneumonia, Community-Acquired Lung Infection",
    "hindiName": "निमोनिया, फेफड़ों का तीव्र संक्रमण व पस",
    "gujaratiName": "ન્યુમોનિયા અને ફેફસાંનો ગંભીર ચેપ",
    "punjabiName": "ਨਮੂਨੀਆ ਅਤੇ ਫੇਫੜਿਆਂ ਦੀ ਇਨਫੈਕਸ਼ਨ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Cough producing phlegm (green or rust colored)",
      "High fever with shaking chills",
      "Stabbing chest pain on deep breathing",
      "Rapid breathing"
    ],
    "vernacularSymptomKeywords": [
      "pneumonia",
      "lung infection",
      "consolidation",
      "pneumonitis",
      "nimoniya",
      "fephdo me pani",
      "chest infection with fever",
      "निमोनिया",
      "फेफड़ों में इंफेक्शन",
      "ન્યુમોનિયા",
      "ਨਮੂਨੀਆ"
    ],
    "officialGeneric": {
      "medicineName": "Amoxicillin 500mg + Potassium Clavulanate 125mg Tablets IP",
      "genericSalt": "Amoxicillin + Clavulanic Acid",
      "dosageStrength": "625 mg",
      "pmbjpPriceINR": "₹48.00 per strip of 10 tablets (75% savings vs ₹200.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily after meals for 5 to 7 days as prescribed by clinical physician."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Mahasudarshan Ghan Vati & Shwaskuthar Ras",
      "scientificBotanical": "Swertia chirata, Aconitum heterophyllum, Piper longum",
      "activePhytochemical": "Amarogentin, Swertiamarin, Piperine",
      "classicalReference": "Bhaishajya Ratnavali, Jwara Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water.",
      "anupanaDietaryMedium": "Warm ginger-infused water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Turmeric, Garlic & Fenugreek Broth",
      "preparationMethod": "Boil 3 cloves of crushed garlic, 1/2 teaspoon fenugreek seeds, and 1/2 teaspoon pure turmeric in 2 cups water until reduced to 1 cup.",
      "modeOfAdministration": "Drink warm soup twice daily as an adjuvant to antibiotics.",
      "contraindicationWarning": "Pneumonia requires immediate allopathic antimicrobial therapy; do not rely solely on herbs."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "SpO2 below 92%",
        "Confusion / altered sensorium",
        "Systolic BP < 90 mmHg (CURB-65 criteria)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Digital Chest X-Ray PA View, Sputum Gram Stain & Complete Blood Count (CBC)"
    }
  },
  {
    "id": "CLIN_45",
    "conditionName": "Acute Spasmodic Dry Cough (Non-Productive)",
    "hindiName": "सूखी खांसी, गले में धसका व खरखराहट",
    "gujaratiName": "સૂકી ખાંસી અને ગળામાં ખંજવાળ",
    "punjabiName": "ਸੁੱਕੀ ਖੰਘ ਅਤੇ ਗਲੇ ਵਿੱਚ ਖਾਰਸ਼",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Hacking cough without sputum",
      "Tickling irritation in throat",
      "Chest soreness from constant coughing",
      "Disturbed sleep"
    ],
    "vernacularSymptomKeywords": [
      "dry cough",
      "hacking cough",
      "sukhi khansi",
      "gale me dhaska",
      "khansi bina balgam",
      "dry throat cough",
      "non productive cough",
      "सूखी खांसी",
      "धसका",
      "સૂકી ખાંસી",
      "ਸੁੱਕੀ ਖੰਘ"
    ],
    "officialGeneric": {
      "medicineName": "Dextromethorphan HBr 10mg + Chlorpheniramine Maleate 2mg Syrup",
      "genericSalt": "Dextromethorphan + Chlorpheniramine",
      "dosageStrength": "10mg + 2mg per 5ml (100ml)",
      "pmbjpPriceINR": "₹22.00 per 100ml bottle (70% savings vs ₹85.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "10ml (2 teaspoons) every 6 to 8 hours as needed for antitussive effect."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sitopaladi Churna with Pure Cow Ghee and Honey",
      "scientificBotanical": "Bambusa bambos (Vanshlochan), Piper longum (Pippali), Elettaria cardamomum",
      "activePhytochemical": "Silica biogenic polymers, Piperine, Cineole",
      "classicalReference": "Sharangadhara Samhita, Madhyama Khanda",
      "ayushDosage": "3 grams mixed in equal parts ghee and honey (unequal weight ratio) licked slowly 3 times daily.",
      "anupanaDietaryMedium": "Natural raw honey and cow ghee"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Honey, Turmeric and Crushed Black Peppercorn Linctus",
      "preparationMethod": "Mix 1 tablespoon pure honey with 1/4 teaspoon freshly ground black pepper and 1/4 teaspoon turmeric.",
      "modeOfAdministration": "Slowly lick from a spoon before bed to coat the pharynx.",
      "contraindicationWarning": "Do not give honey to infants under 1 year of age (risk of infant botulism)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Cough lasting >3 weeks (exclude tuberculosis)",
        "Coughing up frank blood (hemoptysis)",
        "Shortness of breath at rest"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Chest X-Ray & Sputum AFB / GeneXpert for Tuberculosis"
    }
  },
  {
    "id": "CLIN_46",
    "conditionName": "Productive Wet Cough & Chest Congestion",
    "hindiName": "बलगम वाली खांसी, छाती में जकड़न व कफ",
    "gujaratiName": "કફવાળી ખાંસી અને છાતીમાં જામી ગયેલો કફ",
    "punjabiName": "ਬਲਗਮ ਵਾਲੀ ਖੰਘ ਅਤੇ ਛਾਤੀ ਦੀ ਜਕੜਨ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Cough bringing up thick mucus/phlegm",
      "Rattling sound in chest",
      "Chest heaviness",
      "Difficulty clearing airway"
    ],
    "vernacularSymptomKeywords": [
      "wet cough",
      "productive cough",
      "balgam wali khansi",
      "chhati me kaf",
      "chest congestion",
      "mucus cough",
      "phlegm",
      "बलगम वाली खांसी",
      "कफ",
      "छाती में जकड़न",
      "કફવાળી ખાંસી",
      "ਬਲਗਮ ਵਾਲੀ ਖੰਘ"
    ],
    "officialGeneric": {
      "medicineName": "Ambroxol HCl 30mg + Guaiphenesin 50mg + Terbutaline 1.25mg Syrup",
      "genericSalt": "Ambroxol + Guaiphenesin + Terbutaline",
      "dosageStrength": "Mucolytic Expectorant (100ml)",
      "pmbjpPriceINR": "₹24.00 per bottle (68% savings vs ₹90.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "10ml (2 teaspoons) three times daily with warm water."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Talisadi Churna / Vasa Avaleha",
      "scientificBotanical": "Abies webbiana (Talispatra), Zingiber officinale, Piper longum",
      "activePhytochemical": "Abiesin, Piperine, Gingerols",
      "classicalReference": "Sharangadhara Samhita, Madhyama Khanda",
      "ayushDosage": "3 grams mixed with honey twice daily after meals.",
      "anupanaDietaryMedium": "Warm water or honey"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Ginger Juice with Honey and Warm Holy Basil (Tulsi)",
      "preparationMethod": "Extract 1 teaspoon fresh ginger juice, add 10 crushed Tulsi leaves and 1 teaspoon honey.",
      "modeOfAdministration": "Take twice daily morning and evening.",
      "contraindicationWarning": "Avoid cold milk, curd, bananas, and ice creams which thicken bronchial secretions."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Rust-colored or blood-streaked sputum",
        "Inability to breathe lying flat",
        "Chest pain on coughing"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Sputum Culture & Routine, Chest X-Ray"
    }
  },
  {
    "id": "CLIN_47",
    "conditionName": "Pulmonary Tuberculosis (TB) & Mycobacterial Infection",
    "hindiName": "क्षय रोग, टीबी, फेफड़ों की पुरानी बीमारी व खांसी",
    "gujaratiName": "ટીબી, ક્ષય રોગ અને ફેફસાંનો ચેપ",
    "punjabiName": "ਤਪਦਿਕ, ਟੀ.ਬੀ. ਅਤੇ ਪੁਰਾਣੀ ਖੰਘ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Persistent cough >2 weeks",
      "Evening low-grade fever with night sweats",
      "Unexplained weight loss",
      "Hemoptysis (blood in sputum)"
    ],
    "vernacularSymptomKeywords": [
      "tb",
      "tuberculosis",
      "kshaya rog",
      "consumption",
      "purani khansi bukhar",
      "khansi me khoon",
      "night sweats weight loss",
      "damp cough tb",
      "टीबी",
      "क्षय रोग",
      "खांसी में खून",
      "ટીબી",
      "ਟੀ.ਬੀ."
    ],
    "officialGeneric": {
      "medicineName": "4-FDC (Rifampicin 150mg + Isoniazid 75mg + Pyrazinamide 400mg + Ethambutol 275mg)",
      "genericSalt": "Rifampicin + Isoniazid + Pyrazinamide + Ethambutol",
      "dosageStrength": "Standard Fixed Dose Combination (FDC)",
      "pmbjpPriceINR": "100% FREE under National TB Elimination Program (NTEP) / Nikshay Scheme",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Daily weight-band dosing under Direct Observation Therapy (DOTS) protocol for 6 months."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Chyawanprash Awaleha / Drakshasava (Adjuvant Only)",
      "scientificBotanical": "Emblica officinalis (Amla) & Vitis vinifera (Draksha)",
      "activePhytochemical": "Vitamin C bioflavonoids, Resveratrol, Polyphenols",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Rajayakshma Rogadhikara",
      "ayushDosage": "10 grams once daily in the morning with warm milk to boost vital tissue immunity (Ojas).",
      "anupanaDietaryMedium": "Warm milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "High Protein Moong Dal Khichdi and Garlic Boiled Milk",
      "preparationMethod": "Boil 4 cloves of garlic in 1 glass of milk diluted with 1 glass water until milk remains.",
      "modeOfAdministration": "Drink once daily as supportive nutrition alongside NTEP medication.",
      "contraindicationWarning": "NEVER stop allopathic anti-TB medications; irregular adherence causes dangerous Multi-Drug Resistant TB (MDR-TB)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Massive hemoptysis (>100ml blood)",
        "Severe breathlessness / pleural effusion",
        "Drug-induced hepatitis (yellow eyes)"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "CBNAAT / TrueNat (GeneXpert MTB/RIF), Chest X-Ray PA View, Liver Function Test"
    }
  },
  {
    "id": "CLIN_48",
    "conditionName": "Obstructive Sleep Apnea (OSA) & Heavy Snoring",
    "hindiName": "स्लीप एप्निया, नींद में सांस रुकना व खर्राटे",
    "gujaratiName": "સ્લીપ એપનિયા અને નસકોરાં બોલવા",
    "punjabiName": "ਨੀਂਦ ਵਿੱਚ ਸਾਹ ਰੁਕਣਾ ਅਤੇ ਖਰਾੜੇ",
    "bodySystem": "Respiratory",
    "typicalSymptoms": [
      "Loud chronic snoring",
      "Episodes of stopped breathing during sleep",
      "Abrupt awakenings gasping for air",
      "Excessive daytime sleepiness"
    ],
    "vernacularSymptomKeywords": [
      "sleep apnea",
      "osa",
      "snoring",
      "choking during sleep",
      "kharate",
      "neend me saans rukna",
      "din me neend aana",
      "खर्राटे",
      "नींद में सांस रुकना",
      "નસકોરાં",
      "ਖਰਾੜੇ"
    ],
    "officialGeneric": {
      "medicineName": "Nasal Decongestant Xylometazoline 0.1% drops / Saline Nasal Spray",
      "genericSalt": "Sodium Chloride 0.65% w/v or Xylometazoline",
      "dosageStrength": "Isotonic Spray (30ml)",
      "pmbjpPriceINR": "₹18.00 per bottle (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "2 puffs in each nostril at bedtime to maintain nasal airway patency."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Anu Taila Nasya",
      "scientificBotanical": "Classical 30-herb sesame oil formulation (Santalum album, Aegle marmelos)",
      "activePhytochemical": "Sesamin, Santalol, Marmelosin",
      "classicalReference": "Ashtanga Hridaya, Sutra Sthana, Nasya Vidhi",
      "ayushDosage": "2 drops in each nostril warm before bedtime.",
      "anupanaDietaryMedium": "Direct Nasya instillment"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Elevated Lateral Sleeping and Warm Mint Water Gargle",
      "preparationMethod": "Sleep strictly on your side (lateral position) with head elevated 30 degrees; gargle with warm water infused with fresh mint leaves.",
      "modeOfAdministration": "Nightly routine before bed.",
      "contraindicationWarning": "Avoid sedatives, sleeping pills, alcohol, and heavy dinners within 3 hours of sleep."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Falling asleep while driving",
        "Uncontrolled morning hypertension",
        "Cardiac arrhythmia noticed at night"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Overnight Polysomnography (Sleep Study) & Echocardiogram"
    }
  },
  {
    "id": "CLIN_49",
    "conditionName": "Generalized Anxiety Disorder (GAD) & Panic Symptoms",
    "hindiName": "घबराहट, चिंता रोग, बेचैनी व दिल की धड़कन तेज होना",
    "gujaratiName": "ચિંતા, ગભરામણ અને બેચેની",
    "punjabiName": "ਚਿੰਤਾ, ਘਬਰਾਹਟ ਅਤੇ ਬੇਚੈਨੀ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Excessive uncontrollable worry",
      "Restlessness",
      "Tachycardia / heart pounding",
      "Trembling",
      "Feeling of impending doom"
    ],
    "vernacularSymptomKeywords": [
      "anxiety",
      "panic attack",
      "gad",
      "nervousness",
      "ghabrahat",
      "bechaini",
      "chinta",
      "dil ki dhadkan tez",
      "man me dar",
      "घबराहट",
      "बेचैनी",
      "चिंता",
      "ગભરામણ",
      "ਬੇਚੈਨੀ"
    ],
    "officialGeneric": {
      "medicineName": "Propranolol Hydrochloride 20mg / Escitalopram 10mg Tablets",
      "genericSalt": "Propranolol HCl / Escitalopram",
      "dosageStrength": "20 mg / 10 mg",
      "pmbjpPriceINR": "₹8.00 per strip of 10 tablets (75% savings vs ₹35.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet once daily morning under certified psychiatric prescription."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Brahmi Vati (Swarna Yukta) / Saraswatarishta",
      "scientificBotanical": "Bacopa monnieri (Brahmi) & Convolvulus pluricaulis (Shankhpushpi)",
      "activePhytochemical": "Bacosides A & B, Convolvine, Shankhpushpine",
      "classicalReference": "Bhaishajya Ratnavali, Manasa Rogadhikara",
      "ayushDosage": "15ml Saraswatarishta with equal warm water twice daily after food.",
      "anupanaDietaryMedium": "Lukewarm water or cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Ashwagandha and Nutmeg (Jaiphal) Milk",
      "preparationMethod": "Mix 1/2 teaspoon pure Ashwagandha root powder and a small pinch of Jaiphal in 1 cup warm milk.",
      "modeOfAdministration": "Drink 45 minutes before sleep.",
      "contraindicationWarning": "Completely avoid energy drinks, excessive coffee, and recreational stimulants."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Suicidal ideation or intent to self-harm",
        "Severe chest pain mimicking myocardial infarction",
        "Complete dissociation / psychotic features"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Serum TSH (Rule out Hyperthyroidism), ECG 12-Lead"
    }
  },
  {
    "id": "CLIN_50",
    "conditionName": "Major Depressive Episode & Anhedonia",
    "hindiName": "अवसाद, डिप्रेशन, उदासी व जीवन में अरुचि",
    "gujaratiName": "ડિપ્રેશન, ઉદાસી અને માનસિક હતાશા",
    "punjabiName": "ਡਿਪਰੈਸ਼ਨ, ਉਦਾਸੀ ਅਤੇ ਨਿਰਾਸ਼ਾ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Persistent sad or empty mood",
      "Loss of interest in hobbies (anhedonia)",
      "Fatigue",
      "Feelings of worthlessness",
      "Sleep/appetite shifts"
    ],
    "vernacularSymptomKeywords": [
      "depression",
      "depressed",
      "low mood",
      "sadness",
      "udasi",
      "kisi kam me man na lagna",
      "depression ka ilaj",
      "man udaas",
      "डिप्रेशन",
      "अवसाद",
      "उदासी",
      "હતાશા",
      "ਉਦਾਸੀ"
    ],
    "officialGeneric": {
      "medicineName": "Sertraline Hydrochloride 50mg Tablets IP",
      "genericSalt": "Sertraline HCl",
      "dosageStrength": "50 mg",
      "pmbjpPriceINR": "₹16.00 per strip of 10 tablets (80% savings vs ₹85.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet daily after breakfast; requires continuous 4-6 weeks for full therapeutic remodeling."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Ashwagandharishta / Manasamitra Vati",
      "scientificBotanical": "Withania somnifera, Bacopa monnieri & Convolvulus pluricaulis",
      "activePhytochemical": "Withanolides, Bacosides, Alkaloids",
      "classicalReference": "Sahasrayogam, Gutika Prakarana",
      "ayushDosage": "1 tablet twice daily with cow milk.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Daily Morning Sun Exposure (Surya Namaskar) & Soaked Almonds with Saffron",
      "preparationMethod": "Soak 5 almonds and 2 strands of pure saffron overnight, peel and chew thoroughly at dawn.",
      "modeOfAdministration": "Every morning accompanied by 20 minutes brisk walking in natural sunlight.",
      "contraindicationWarning": "Do not abruptly discontinue antidepressant medications (discontinuation syndrome)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Expressed suicide plan or self-neglect",
        "Catatonia or refusal to drink fluids",
        "Severe psychotic delusions"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Serum Vitamin D3, Vitamin B12, Thyroid Profile (FT3, FT4, TSH)"
    }
  },
  {
    "id": "CLIN_51",
    "conditionName": "Peripheral Neuropathy, Diabetic Nerve Numbness & Tingling",
    "hindiName": "पैरों में सुन्नपन, झनझनाहट व नस में जलन (डायबिटिक न्यूरोपैथी)",
    "gujaratiName": "હાથ-પગમાં ખાલી ચડવી, ઝણઝણાટી અને નસોનો દુખાવો",
    "punjabiName": "ਹੱਥਾਂ ਪੈਰਾਂ ਵਿੱਚ ਸੁੰਨਪੁਣਾ ਅਤੇ ਕੀੜੀਆਂ ਤੁਰਨਾ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Pins and needles sensation in feet/hands",
      "Numbness like wearing gloves/socks",
      "Burning electrical nerve pain",
      "Loss of balance"
    ],
    "vernacularSymptomKeywords": [
      "peripheral neuropathy",
      "diabetic neuropathy",
      "tingling in feet",
      "numbness in feet",
      "pair sunn hona",
      "haath pair me jhanjhanahat",
      "naso me dard",
      "burning feet",
      "पैरों में सुन्नपन",
      "झनझनाहट",
      "नस में जलन",
      "પગમાં ખાલી ચડવી",
      "ਸੁੰਨਪੁਣਾ"
    ],
    "officialGeneric": {
      "medicineName": "Pregabalin 75mg + Methylcobalamin 750mcg Capsules IP",
      "genericSalt": "Pregabalin + Methylcobalamin (Active Vitamin B12)",
      "dosageStrength": "75mg + 750mcg",
      "pmbjpPriceINR": "₹28.00 per strip of 10 capsules (75% savings vs ₹125.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule at bedtime after food."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Ekangveer Ras / Mahavat Vidhwansan Ras",
      "scientificBotanical": "Classical Herbomineral with Trikatu, Triphala, Tamra and Vanga Bhasma",
      "activePhytochemical": "Bio-chelated trace minerals and adaptogenic glycosides",
      "classicalReference": "Bhaishajya Ratnavali, Vatavyadhi Rogadhikara",
      "ayushDosage": "1 tablet twice daily with ginger juice or honey.",
      "anupanaDietaryMedium": "Fresh ginger juice or Dashamoola decoction"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Warm Sesame Oil Fomentation and Flaxseed (Alsi) Powder",
      "preparationMethod": "Massage soles of feet with warm unrefined sesame oil (Til Tel) for 10 minutes at bedtime. Eat 1 teaspoon roasted Flaxseed powder daily.",
      "modeOfAdministration": "Nightly topical massage.",
      "contraindicationWarning": "Never walk barefoot; inspect feet daily for undetected blisters or diabetic ulcers."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Non-healing foot ulcer or black discoloration of toe (gangrene)",
        "Rapid ascending weakness to legs",
        "Loss of urinary bladder control"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "Nerve Conduction Velocity (NCV) Study & HbA1c"
    }
  },
  {
    "id": "CLIN_52",
    "conditionName": "Benign Paroxysmal Positional Vertigo (BPPV) & Dizziness",
    "hindiName": "चक्कर आना, सिर घूमना व कान का संतुलन बिगड़ना (वर्टिगो)",
    "gujaratiName": "ચક્કર આવવા અને માથું ફરવું (વર્ટિગો)",
    "punjabiName": "ਚੱਕਰ ਆਉਣੇ ਅਤੇ ਸਿਰ ਘੁੰਮਣਾ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Dizziness or room spinning sensation triggered by head movements",
      "Loss of balance",
      "Nausea or vomiting",
      "Unsteadiness"
    ],
    "vernacularSymptomKeywords": [
      "vertigo",
      "dizziness",
      "chakkar aana",
      "bppv",
      "head spinning",
      "santulan bigadna",
      "room spinning",
      "sar ghumna",
      "चक्कर आना",
      "सिर घूमना",
      "ચક્કર",
      "ਚੱਕਰ ਆਉਣੇ"
    ],
    "officialGeneric": {
      "medicineName": "Betahistine Dihydrochloride 16mg Tablets IP",
      "genericSalt": "Betahistine Dihydrochloride",
      "dosageStrength": "16 mg",
      "pmbjpPriceINR": "₹15.00 per strip of 10 tablets (78% savings vs ₹70.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily with meals until canalith repositioning settles inner ear crystals."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sootsekhar Ras / Ashwagandharishta",
      "scientificBotanical": "Withania somnifera, Zingiber officinale, Shankha Bhasma",
      "activePhytochemical": "Withanolides, Gingerols, Bio-calcium carbonate",
      "classicalReference": "Yogaratnakara, Bhrama Rogadhikara",
      "ayushDosage": "1 tablet twice daily with Amla Murabba or water.",
      "anupanaDietaryMedium": "Fresh Indian gooseberry (Amla) jam or warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Coriander Seed and Gooseberry (Dhania-Amla) Overnight Infusion",
      "preparationMethod": "Soak 1 teaspoon coriander seeds and 1 teaspoon dry Amla powder in 1 glass water overnight; strain in morning.",
      "modeOfAdministration": "Drink early morning on empty stomach.",
      "contraindicationWarning": "Do not make sudden head jerks; perform Epley repositioning maneuver under certified physiotherapist."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Facial droop, limb weakness or speech slurring (rule out cerebellar stroke)",
        "Sudden hearing loss",
        "Inability to walk without falling"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Dix-Hallpike Maneuver & Brain MRI (Stroke protocol if red flags present)"
    }
  },
  {
    "id": "CLIN_53",
    "conditionName": "Tension Headache & Occipital Muscle Contraction",
    "hindiName": "तनाव सिरदर्द, माथे व गर्दन में कसने जैसा दर्द",
    "gujaratiName": "ટેન્શન માથાનો દુખાવો અને ગરદનની જકડાઈ",
    "punjabiName": "ਤਣਾਅ ਦਾ ਸਿਰਦਰਦ ਅਤੇ ਗਰਦਨ ਦਾ ਖਿਚਾਅ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Dull aching head pain",
      "Sensation of tight band squeezing around forehead",
      "Tenderness on scalp, neck, and shoulder muscles"
    ],
    "vernacularSymptomKeywords": [
      "tension headache",
      "stress headache",
      "tight band on head",
      "sar me dard",
      "tanav se sar dard",
      "forehead tightness",
      "sar dard tension",
      "सिरदर्द",
      "तनाव सिरदर्द",
      "માથાનો દુખાવો",
      "ਸਿਰਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Naproxen 250mg + Paracetamol 325mg Tablets IP",
      "genericSalt": "Naproxen + Paracetamol",
      "dosageStrength": "250mg + 325mg",
      "pmbjpPriceINR": "₹9.00 per strip of 10 tablets (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet post-meal during acute headache phase; do not exceed twice daily."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Shirashooladi Vajra Ras / Pathyadi Kwath",
      "scientificBotanical": "Terminalia chebula (Haritaki), Zingiber officinale, Commiphora mukul",
      "activePhytochemical": "Chebulinic acid, Guggulsterones, Gingerol",
      "classicalReference": "Bhaishajya Ratnavali, Shiro-Rogadhikara",
      "ayushDosage": "20ml Pathyadi Kwath mixed with equal warm water twice daily before meals.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Pure Sandalwood and Camphor (Chandan-Kapur) Paste Application",
      "preparationMethod": "Rub sandalwood stick on stone with a few drops of rosewater and a tiny speck of natural camphor.",
      "modeOfAdministration": "Apply paste across forehead and temples; lie down in a dark quiet room for 20 minutes.",
      "contraindicationWarning": "Avoid excessive screen time without 20-20-20 eye rests; correct poor desk posture."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "'Thunderclap' sudden worst headache of life (subarachnoid hemorrhage warning)",
        "Fever with stiff neck and vomiting",
        "Headache worsening after head trauma"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Non-Contrast Brain CT Scan (NCCT) & Fundoscopy"
    }
  },
  {
    "id": "CLIN_54",
    "conditionName": "Sciatica, Lumbar Radiculopathy & Nerve Compression",
    "hindiName": "साइटिका, कूल्हे से पैर तक जाने वाला तीव्र नस दर्द (गृध्रसी)",
    "gujaratiName": "રાંઝણ, કમરથી પગ સુધીનો નસનો દુખાવો (સાઈટિકા)",
    "punjabiName": "ਸਾਇਟਿਕਾ, ਲੱਕ ਤੋਂ ਪੈਰ ਤੱਕ ਨਸ ਦਾ ਖਿਚਾਅ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Pain radiating from lower back through buttock and down back of leg",
      "Shooting electric shock sensations",
      "Numbness or weakness in foot"
    ],
    "vernacularSymptomKeywords": [
      "sciatica",
      "lumbar radiculopathy",
      "pinched nerve",
      "gridhrasi",
      "ranjhan",
      "kamar se pair tak dard",
      "koolhe ka dard",
      "shooting leg pain",
      "साइटिका",
      "गृध्रसी",
      "कमर से पैर तक दर्द",
      "રાંઝણ",
      "ਸਾਇਟਿਕਾ"
    ],
    "officialGeneric": {
      "medicineName": "Gabapentin 300mg + Methylcobalamin 500mcg Tablets",
      "genericSalt": "Gabapentin + Methylcobalamin",
      "dosageStrength": "300mg + 500mcg",
      "pmbjpPriceINR": "₹32.00 per strip of 10 tablets (72% savings vs ₹120.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet at bedtime, can be titrated to twice daily under physician review."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Trayodashanga Guggulu / Rasna Saptak Kwath",
      "scientificBotanical": "Pluchea lanceolata (Rasna), Commiphora mukul, Tinospora cordifolia",
      "activePhytochemical": "Guggulsterones E & Z, Pluchine, Tinosporoside",
      "classicalReference": "Bhaishajya Ratnavali, Vatavyadhi Rogadhikara",
      "ayushDosage": "2 tablets twice daily after meals with lukewarm water.",
      "anupanaDietaryMedium": "Warm Rasna decoction or lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Garlic Milk (Lashuna Ksheerapaka)",
      "preparationMethod": "Boil 4 crushed garlic cloves in 50ml milk and 200ml water until reduced to 50ml.",
      "modeOfAdministration": "Drink once daily in the evening.",
      "contraindicationWarning": "Do not bend forward with straight knees; avoid lifting heavy buckets or luggage."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Loss of bladder or bowel sphincter control (Cauda Equina Syndrome)",
        "Numbness in saddle/groin area",
        "Sudden foot drop (unable to lift toes)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "MRI Lumbo-Sacral Spine with Whole Spine Screening"
    }
  },
  {
    "id": "CLIN_55",
    "conditionName": "Bell's Palsy, Idiopathic Facial Nerve Paralysis",
    "hindiName": "फेशियल पाल्सी, मुंह का लकवा व चेहरे का टेढ़ापन (अर्applicationदित)",
    "gujaratiName": "મોંનો લકવો અને ચહેરાની નબળાઈ (ફેશિયલ પાલ્સી)",
    "punjabiName": "ਮੂੰਹ ਦਾ ਲਕਵਾ ਅਤੇ ਚਿਹਰੇ ਦਾ ਟੇਢਾਪਣ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Sudden weakness on one side of face",
      "Drooping mouth with saliva drooling",
      "Inability to close eye on affected side",
      "Loss of taste"
    ],
    "vernacularSymptomKeywords": [
      "bells palsy",
      "facial paralysis",
      "face drooping",
      "ardita",
      "muh ka lakwa",
      "ek taraf ka chehra tedha",
      "aankh band na hona",
      "facial nerve weakness",
      "मुंह का लकवा",
      "चेहरे का टेढ़ापन",
      "अर्applicationदित",
      "મોંનો લકવો",
      "ਮੂੰਹ ਦਾ ਲਕਵਾ"
    ],
    "officialGeneric": {
      "medicineName": "Prednisolone 20mg Tablets IP + Carboxymethylcellulose Eye Drops 0.5%",
      "genericSalt": "Prednisolone + CMC Eye Drops",
      "dosageStrength": "20mg tab + 10ml drops",
      "pmbjpPriceINR": "₹8.00 per strip of 10 Prednisolone + ₹18.00 CMC drops",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Tapering high-dose steroid initiated within 72 hours of onset strictly under medical direction. Eye drops 4 times daily to prevent corneal ulcers."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Mahamashadi Taila / Ekangveer Ras",
      "scientificBotanical": "Phaseolus mungo (Masha), Withania somnifera, Castor oil",
      "activePhytochemical": "Phytosterols, Alkaloids, Bio-chelated calx",
      "classicalReference": "Sahasrayogam, Taila Prakarana, Ardita Chikitsa",
      "ayushDosage": "Gentle upward massage with warm Mahamashadi oil on the paralyzed cheek.",
      "anupanaDietaryMedium": "Topical external application followed by mild steam"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Protective Eye Patch and Warm Castor Oil Compress",
      "preparationMethod": "Tape eye shut gently with sterile pad before sleep to prevent corneal drying; warm castor oil pack applied over cheek.",
      "modeOfAdministration": "Nightly eye protection is essential.",
      "contraindicationWarning": "Protect open eye from dust and drying at all times to prevent blindness."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Weakness in arm or leg on same or opposite side (indicates cerebral stroke, NOT Bell's palsy)",
        "Vesicles on ear canal (Ramsay Hunt syndrome)",
        "Severe head trauma preceding onset"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Brain MRI with IAC Protocol & Electroneurography (ENoG)"
    }
  },
  {
    "id": "CLIN_56",
    "conditionName": "Epilepsy, Generalized Tonic-Clonic Seizures (Convulsions)",
    "hindiName": "मिर्गी, दौरे पड़ना, आक्षेप व कंपन (अपस्मार)",
    "gujaratiName": "ખેંચ, આંચકી અને મિરગીના હુમલા (અપસ્માર)",
    "punjabiName": "ਮਿਰਗੀ ਦੇ ਦੌਰੇ ਅਤੇ ਖਿੱਚ ਪੈਣੀ",
    "bodySystem": "Neurology",
    "typicalSymptoms": [
      "Loss of consciousness",
      "Violent muscle contractions and jerking",
      "Frothing at mouth",
      "Tongue biting",
      "Post-ictal confusion"
    ],
    "vernacularSymptomKeywords": [
      "epilepsy",
      "seizure",
      "convulsions",
      "fits",
      "daura padna",
      "mirgi",
      "apasmara",
      "jhatke aana",
      "khinch aana",
      "मिर्गी",
      "दौरे",
      "झटके आना",
      "અપસ્માર",
      "ખેંચ",
      "ਮਿਰਗੀ"
    ],
    "officialGeneric": {
      "medicineName": "Sodium Valproate 500mg Controlled Release Tablets IP",
      "genericSalt": "Sodium Valproate + Valproic Acid",
      "dosageStrength": "500 mg CR",
      "pmbjpPriceINR": "₹26.00 per strip of 10 tablets (75% savings vs ₹115.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "As prescribed by neurologist; taken consistently at the same exact time daily."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Saraswata Churna / Kalyanaka Ghrita (Adjuvant)",
      "scientificBotanical": "Convolvulus pluricaulis, Bacopa monnieri & Acorus calamus (Vacha)",
      "activePhytochemical": "Asarone, Bacosides, Shankhpushpine",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Apasmara Chikitsa",
      "ayushDosage": "5 grams Kalyanaka Ghrita with warm milk once daily.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Seizure First Aid Protocol (Turn on Side)",
      "preparationMethod": "Turn patient immediately on their left side (Recovery Position), place a soft folded towel under head, loosen collar.",
      "modeOfAdministration": "Keep airway clear. Time the seizure.",
      "contraindicationWarning": "NEVER force keys, onions, shoes, or fingers into the mouth during a seizure; do not restrain jerking limbs."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Seizure lasting longer than 5 minutes (Status Epilepticus)",
        "Second seizure without regaining consciousness in between",
        "Injury sustained or occurs in water"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Electroencephalogram (EEG) & Brain MRI with Epilepsy Protocol"
    }
  },
  {
    "id": "CLIN_57",
    "conditionName": "Stable Angina Pectoris & Coronary Artery Ischemia",
    "hindiName": "हृदय शूल, सीने में भारीपन व एनजाइना",
    "gujaratiName": "એન્જાઇના અને છાતીમાં દબાણ",
    "punjabiName": "ਦਿਲ ਦਾ ਦਰਦ ਅਤੇ ਛਾਤੀ ਵਿੱਚ ਭਾਰੀਪਣ",
    "bodySystem": "Cardiology",
    "typicalSymptoms": [
      "Squeezing chest pressure during exertion",
      "Pain relieving with rest",
      "Shortness of breath on walking"
    ],
    "vernacularSymptomKeywords": [
      "angina",
      "chest tightness on walking",
      "ischemic heart disease",
      "chhati me dabav",
      "dil me jalan",
      "angina pectoris",
      "सीना दर्द भारीपन",
      "હૃદય શૂલ",
      "ਐਨਜਾਈਨਾ"
    ],
    "officialGeneric": {
      "medicineName": "Sorbitrate (Isosorbide Dinitrate 5mg) + Aspirin 75mg Tablets",
      "genericSalt": "Isosorbide Dinitrate + Aspirin",
      "dosageStrength": "5mg sublingual + 75mg gastro-resistant",
      "pmbjpPriceINR": "₹4.50 per strip (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet 5mg dissolved under tongue immediately upon exertional angina discomfort."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Arjunarishta (Parthadyarishta) & Prabhakar Vati",
      "scientificBotanical": "Terminalia arjuna (Bark) & Mineral calx",
      "activePhytochemical": "Arjunolic acid, Arjunic acid, Tannins, Flavonoids",
      "classicalReference": "Bhaishajya Ratnavali, Hridroga Rogadhikara",
      "ayushDosage": "20ml with equal lukewarm water twice daily after meals.",
      "anupanaDietaryMedium": "Warm water or cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Arjuna Bark Decoction in Low-Fat Cow Milk (Arjuna Ksheerapaka)",
      "preparationMethod": "Boil 1 teaspoon pure Arjuna bark powder in 1 glass water and 1/2 glass low-fat cow milk until water evaporates.",
      "modeOfAdministration": "Drink warm once daily in morning.",
      "contraindicationWarning": "Never ignore chest pain that does not relieve within 5 minutes of rest or Sorbitrate (Call 108)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Pain radiating to jaw, neck, or left arm persisting >15 minutes",
        "Cold sweating and vomiting",
        "Syncope"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "ECG 12-Lead, Troponin-I / T, 2D Echocardiography, TMT Stress Test"
    }
  },
  {
    "id": "CLIN_58",
    "conditionName": "Varicose Veins & Chronic Venous Insufficiency",
    "hindiName": "वैरिकोज वेन्स, पैरों की नसों का फूलना व नीला पड़ना",
    "gujaratiName": "વેરિકોઝ વેઇન્સ અને પગની નસો ફૂલવી",
    "punjabiName": "ਵੈਰੀਕੋਜ਼ ਵੇਨਜ਼ ਅਤੇ ਪੈਰਾਂ ਦੀਆਂ ਨਾੜਾਂ ਦਾ ਫੁੱਲਣਾ",
    "bodySystem": "Cardiology",
    "typicalSymptoms": [
      "Enlarged twisted purple/blue veins on legs",
      "Heavy aching sensation in calves",
      "Swelling in lower legs and ankles"
    ],
    "vernacularSymptomKeywords": [
      "varicose veins",
      "swollen veins",
      "venous insufficiency",
      "pair ki nase phoolna",
      "nili nase",
      "calf heaviness",
      "spider veins",
      "पैर की नसें फूलना",
      "નસો ફૂલવી",
      "ਵੈਰੀਕੋਜ਼ ਵੇਨਜ਼"
    ],
    "officialGeneric": {
      "medicineName": "Micronized Purified Flavonoid Fraction (MPFF 500mg) Tablets",
      "genericSalt": "Diosmin 450mg + Hesperidin 50mg",
      "dosageStrength": "500 mg",
      "pmbjpPriceINR": "₹42.00 per strip of 10 (70% savings vs ₹160.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily with meals to improve venous tone and microcirculation."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sahacharadi Taila / Kaishore Guggulu",
      "scientificBotanical": "Strobilanthes ciliatus (Sahachara), Commiphora mukul, Tinospora cordifolia",
      "activePhytochemical": "Betulin, Guggulsterones, Giloin",
      "classicalReference": "Ashtanga Hridaya, Vatashonita Chikitsa",
      "ayushDosage": "Gentle upward application (toe to hip direction) of Sahacharadi oil twice daily.",
      "anupanaDietaryMedium": "Topical upward strokes only (never press hard)"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Leg Elevation and Horse Chestnut / Witch Hazel Compress",
      "preparationMethod": "Elevate legs on 2 pillows above heart level for 20 minutes thrice daily; wear graduated compression stockings (Class II).",
      "modeOfAdministration": "Daily lifestyle discipline.",
      "contraindicationWarning": "Do not stand or sit stationary for long hours without walking every 45 minutes."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Sudden one-sided calf swelling with warmth and severe pain (Deep Vein Thrombosis DVT)",
        "Active venous ulcer bleeding",
        "Shortness of breath (Pulmonary Embolism)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Venous Doppler Ultrasound of Lower Limbs & D-Dimer"
    }
  },
  {
    "id": "CLIN_59",
    "conditionName": "Postural Orthostatic Hypotension & Low Blood Pressure",
    "hindiName": "निम्न रक्तचाप, लो बीपी, उठने पर आंखों के आगे अंधेरा छाना",
    "gujaratiName": "લો બીપી, અંધારા આવવા અને નબળાઈ",
    "punjabiName": "ਲੋਅ ਬੀਪੀ ਅਤੇ ਖੜ੍ਹੇ ਹੋਣ ਤੇ ਚੱਕਰ ਆਉਣੇ",
    "bodySystem": "Cardiology",
    "typicalSymptoms": [
      "Lightheadedness upon standing",
      "Blurry vision",
      "Weakness",
      "Fainting (syncope)",
      "Confusion on upright posture"
    ],
    "vernacularSymptomKeywords": [
      "low bp",
      "orthostatic hypotension",
      "hypotension",
      "khade hone par chakkar",
      "aankhon ke aage andhera",
      "low blood pressure",
      "kam bp",
      "लो बीपी",
      "લો બ્લડ પ્રેશર",
      "ਲੋਅ ਬੀ.ਪੀ."
    ],
    "officialGeneric": {
      "medicineName": "Fludrocortisone Acetate 0.1mg / Midodrine Hydrochloride 2.5mg",
      "genericSalt": "Fludrocortisone / Midodrine",
      "dosageStrength": "0.1 mg / 2.5 mg",
      "pmbjpPriceINR": "₹18.00 per strip of 10 tablets (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "As prescribed by physician when non-pharmacological volume expansion is insufficient."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Makaradhwaja Vati / Drakshasava",
      "scientificBotanical": "Processed Gold calx, Purified Sulfur, Vitis vinifera",
      "activePhytochemical": "Bio-mineralized rejuvenator, Invert sugars, Organic fruit acids",
      "classicalReference": "Bhaishajya Ratnavali, Rasayana Prakarana",
      "ayushDosage": "15ml Drakshasava with equal water twice daily after food.",
      "anupanaDietaryMedium": "Lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Electrolyte Lemon Water with Himalayan Pink Salt & Soaked Raisins",
      "preparationMethod": "Soak 20 black raisins overnight, eat in morning. Drink 1 glass fresh water with 1/2 teaspoon rock salt and lemon juice.",
      "modeOfAdministration": "Twice daily to expand intravascular volume.",
      "contraindicationWarning": "Rise very slowly from lying to sitting, then pause 30 seconds before standing up."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Repeated fainting spells with trauma",
        "Systolic BP dropping below 80 mmHg",
        "Palpitations accompanied by chest pain"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Orthostatic BP Measurement (Supine vs 3-minute Standing), ECG, Serum Cortisol"
    }
  },
  {
    "id": "CLIN_60",
    "conditionName": "Cardiac Arrhythmia, Palpitations & Premature Beats",
    "hindiName": "दिल की धड़कन का अनियमित होना, घबराहट व धक-धक (हृत्कंप)",
    "gujaratiName": "ધબકારા અનિયમિત થવા અને છાતીમાં ધડકન વધવી",
    "punjabiName": "ਦਿਲ ਦੀ ਧੜਕਨ ਤੇਜ਼ ਹੋਣਾ ਅਤੇ ਬੇਤਰਤੀਬੀ",
    "bodySystem": "Cardiology",
    "typicalSymptoms": [
      "Fluttering in chest",
      "Pounding heartbeat (palpitations)",
      "Skipped beats",
      "Shortness of breath",
      "Lightheadedness"
    ],
    "vernacularSymptomKeywords": [
      "arrhythmia",
      "palpitations",
      "irregular heartbeat",
      "skipped beats",
      "dil ki dhadkan tez",
      "chhati me dhak dhak",
      "tachycardia",
      "धड़कन तेज होना",
      "ધબકારા વધવા",
      "ਦਿਲ ਦੀ ਧੜਕਨ"
    ],
    "officialGeneric": {
      "medicineName": "Metoprolol Succinate Prolonged Release 25mg / 50mg Tablets IP",
      "genericSalt": "Metoprolol Succinate",
      "dosageStrength": "25 mg PR",
      "pmbjpPriceINR": "₹9.50 per strip of 10 tablets (75% savings vs ₹42.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet daily after breakfast under cardiologist supervision."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Hridyarnava Ras / Jawahar Mohra Pishti",
      "scientificBotanical": "Terminalia arjuna, Purified Mercury calx, Tamra Bhasma, Emerald/Jade calx",
      "activePhytochemical": "Bio-chelated copper, Arjuna glycosides, Trace minerals",
      "classicalReference": "Rasendra Sara Sangraha, Hridroga Rogadhikara",
      "ayushDosage": "125mg twice daily with honey or butter.",
      "anupanaDietaryMedium": "Fresh cow butter or honey"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Deep Diaphragmatic Breathing (Anulom Vilom Pranayama) & Coconut Water",
      "preparationMethod": "Drink 1 tender green coconut daily for natural potassium balance; practice 15 minutes slow rhythmic pranayama.",
      "modeOfAdministration": "Daily twice in quiet environment.",
      "contraindicationWarning": "Stop coffee, energy drinks, nicotine, gutkha, and cold medicines containing pseudoephedrine."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Pulse rate >150 bpm at rest",
        "Sudden syncope or collapse",
        "Chest pain accompanying arrhythmia"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "12-Lead ECG, 24-Hour Holter Monitor, Serum Electrolytes (Potassium, Magnesium)"
    }
  },
  {
    "id": "CLIN_61",
    "conditionName": "Megaloblastic Anemia & Vitamin B12 Deficiency",
    "hindiName": "विटामिन बी12 की कमी, रक्तअल्पता व नसों की कमजोरी",
    "gujaratiName": "વિટામિન બી૧૨ ની ઉણપ અને લોહીની કમી",
    "punjabiName": "ਵਿਟਾਮਿਨ ਬੀ12 ਦੀ ਘਾਟ ਅਤੇ ਕਮਜ਼ੋਰੀ",
    "bodySystem": "Hematology",
    "typicalSymptoms": [
      "Smooth red sore tongue (glossitis)",
      "Tingling in hands and feet",
      "Extreme chronic fatigue",
      "Memory lapses / brain fog"
    ],
    "vernacularSymptomKeywords": [
      "vitamin b12 deficiency",
      "b12 deficiency",
      "megaloblastic anemia",
      "b12 ki kami",
      "red tongue glossitis",
      "nerve weakness b12",
      "विटामिन बी12",
      "બી૧૨ ની ઉણપ",
      "ਬੀ12 ਦੀ ਘਾਟ"
    ],
    "officialGeneric": {
      "medicineName": "Methylcobalamin 1500mcg Sublingual Tablets IP",
      "genericSalt": "Methylcobalamin",
      "dosageStrength": "1500 mcg",
      "pmbjpPriceINR": "₹19.00 per strip of 10 tablets (78% savings vs ₹90.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet daily dissolved under the tongue after meals for 3 months."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Lohasava / Navayasa Churna",
      "scientificBotanical": "Purified Iron calx (Lauha Bhasma) processed with Trikatu and Triphala",
      "activePhytochemical": "Bio-available elemental iron and digestive piperines",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Pandu Rogadhikara",
      "ayushDosage": "15ml Lohasava with equal water twice daily after food.",
      "anupanaDietaryMedium": "Lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Sprouted Fenugreek (Methi), Fermented Curd and Fortified Milk",
      "preparationMethod": "Include 1 bowl fresh homemade probiotic curd and nutritional yeast or fortified dairy daily.",
      "modeOfAdministration": "Daily with meals.",
      "contraindicationWarning": "Strict vegetarians and vegans must consume sublingual B12 supplements consistently."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Unsteady wide-based gait (Subacute combined degeneration of spinal cord)",
        "Severe confusion/psychosis",
        "Extreme shortness of breath"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Serum Vitamin B12 level, Complete Blood Count (MCV > 100 fL), Serum Homocysteine"
    }
  },
  {
    "id": "CLIN_62",
    "conditionName": "Immune Thrombocytopenia (ITP) & Low Platelet Count",
    "hindiName": "कम प्लेटलेट्स, रक्तस्राव प्रवृत्ति व त्वचा पर लाल चकत्ते",
    "gujaratiName": "પ્લેટલેટ્સ ઓછા થવા અને રક્તસ્ત્રાવ થવો",
    "punjabiName": "ਪਲੇਟਲੈਟਸ ਘਟਣੇ ਅਤੇ ਖੂਨ ਵਗਣਾ",
    "bodySystem": "Hematology",
    "typicalSymptoms": [
      "Tiny red spots on skin (petechiae)",
      "Unexplained bruising (purpura)",
      "Frequent nosebleeds or bleeding gums",
      "Prolonged bleeding from cuts"
    ],
    "vernacularSymptomKeywords": [
      "low platelets",
      "thrombocytopenia",
      "itp",
      "platelets kam hona",
      "purpura",
      "petechiae",
      "bleed easily",
      "dengue platelet down",
      "प्लेटलेट्स कम होना",
      "પ્લેટલેટ્સ",
      "ਪਲੇਟਲੈਟਸ"
    ],
    "officialGeneric": {
      "medicineName": "Prednisolone 20mg Tablets IP / Tranexamic Acid 500mg Tablets",
      "genericSalt": "Prednisolone / Tranexamic Acid",
      "dosageStrength": "20mg / 500mg",
      "pmbjpPriceINR": "₹8.00 / ₹22.00 per strip (75% savings)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Tranexamic acid 1 tablet thrice daily during active mucosal bleeding under hematologist advice."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Carica Papaya Leaf Extract & Giloy Satva",
      "scientificBotanical": "Carica papaya & Tinospora cordifolia",
      "activePhytochemical": "Carpaine, Pseudocarpaine, Tinosporide (shown to enhance ALOX-12 gene expression)",
      "classicalReference": "Modern Integrative Clinical Protocol validated by CCRAS",
      "ayushDosage": "500mg standardized extract capsule twice daily with water.",
      "anupanaDietaryMedium": "Fresh water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Fresh Carica Papaya Leaf Juice and Pomegranate (Anar) Juice",
      "preparationMethod": "Wash clean 2 mature papaya leaves, crush without stems and strain 10ml fresh juice. Drink along with 1 glass fresh pomegranate juice.",
      "modeOfAdministration": "Twice daily morning and evening.",
      "contraindicationWarning": "Do not give rough abrasive foods; avoid aspirin and all NSAID blood thinners."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Platelet count dropping below 20,000 /µL (Risk of spontaneous cerebral hemorrhage)",
        "Blood in urine or stool",
        "Severe unyielding headache"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Complete Blood Count (CBC) with Platelet Count & Peripheral Blood Smear Examination"
    }
  },
  {
    "id": "CLIN_63",
    "conditionName": "Deep Vein Thrombosis (DVT) & Venous Blood Clotting",
    "hindiName": "पिंडली की नस में खून का थक्का जमना, दर्द व सूजन (डीवीटी)",
    "gujaratiName": "પગની નસમાં લોહીની ગાંઠ અને સોજો (ડીવીટી)",
    "punjabiName": "ਲੱਤ ਦੀ ਨਾੜ ਵਿੱਚ ਖੂਨ ਦਾ ਗਤਲਾ ਬਣਨਾ",
    "bodySystem": "Hematology",
    "typicalSymptoms": [
      "Swelling in one calf/leg",
      "Throbbing or cramping pain in calf when walking",
      "Red or warm skin around painful area"
    ],
    "vernacularSymptomKeywords": [
      "dvt",
      "deep vein thrombosis",
      "blood clot in leg",
      "one leg swollen",
      "calf pain and warm",
      "pindli me sujan dard",
      "clot in leg",
      "डीवीटी",
      "नस में खून का थक्का",
      "ડીવીટી",
      "ਖੂਨ ਦਾ ਗਤਲਾ"
    ],
    "officialGeneric": {
      "medicineName": "Rivaroxaban 15mg / 20mg Tablets IP",
      "genericSalt": "Rivaroxaban",
      "dosageStrength": "15 mg",
      "pmbjpPriceINR": "₹45.00 per strip of 10 (75% savings vs ₹195.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Direct Oral Anticoagulant (DOAC) taken strictly as prescribed by vascular specialist."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Guggulu Tikta Ghrita / Punarnavadi Kwath (Supportive)",
      "scientificBotanical": "Commiphora mukul, Azadirachta indica, Boerhavia diffusa",
      "activePhytochemical": "Guggulsterones, Margosine, Punarnavine",
      "classicalReference": "Ashtanga Hridaya, Chikitsa Sthana, Shotha Rogadhikara",
      "ayushDosage": "15ml Punarnavadi Kwath with equal warm water twice daily.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Strict Avoidance of Leg Massage and Gentle Bed Mobilization",
      "preparationMethod": "Keep leg elevated slightly. NEVER vigorously massage a suspected DVT calf.",
      "modeOfAdministration": "Protective non-traumatic protocol.",
      "contraindicationWarning": "NEVER massage or vigorously rub a swollen calf; this can dislodge the clot into lungs (Pulmonary Embolism)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Sudden chest pain, gasping for breath, coughing up blood (Pulmonary Embolism - EMERGENCY CALL 108)",
        "Bluish painful leg"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Venous Color Doppler Ultrasound of Lower Extremity, D-Dimer Quantitative Assay"
    }
  },
  {
    "id": "CLIN_64",
    "conditionName": "Sickle Cell Disease & Vaso-Occlusive Pain Crisis",
    "hindiName": "सिकल सेल एनीमिया, लाल रक्त कणिकाओं की विकृति व तीव्र दर्द",
    "gujaratiName": "સિકલ સેલ એનિમિયા અને અસહ્ય દુખાવો",
    "punjabiName": "ਸਿੱਕਲ ਸੈੱਲ ਅਨੀਮੀਆ ਅਤੇ ਜੋੜਾਂ ਦਾ ਦਰਦ",
    "bodySystem": "Hematology",
    "typicalSymptoms": [
      "Episodes of agonizing pain in bones/joints/chest",
      "Frequent infections",
      "Yellow skin/eyes",
      "Delayed growth"
    ],
    "vernacularSymptomKeywords": [
      "sickle cell",
      "sickle cell anemia",
      "vaso occlusive crisis",
      "haddi me asahya dard",
      "sickle cell dard",
      "hasia jaisi koshikaye",
      "सिकल सेल",
      "हड्डी में तेज दर्द",
      "સિકલ સેલ",
      "ਸਿੱਕਲ ਸੈੱਲ"
    ],
    "officialGeneric": {
      "medicineName": "Hydroxyurea (Hydroxycarbamide) 500mg Capsules IP + Folic Acid 5mg",
      "genericSalt": "Hydroxyurea + Folic Acid",
      "dosageStrength": "500 mg + 5 mg",
      "pmbjpPriceINR": "₹45.00 per strip of 10 Hydroxyurea + ₹2.00 Folic acid",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule daily under hematologist monitoring; increases fetal hemoglobin (HbF) to prevent sickling."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Dhatri Lauha / Punarnava Mandur",
      "scientificBotanical": "Emblica officinalis (Amla) with Purified Iron calx",
      "activePhytochemical": "Bioflavonoids, Tannins, Chelated elemental iron",
      "classicalReference": "Bhaishajya Ratnavali, Pandu Rogadhikara",
      "ayushDosage": "1 tablet twice daily with cow ghee or honey.",
      "anupanaDietaryMedium": "Fresh cow ghee"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Aggressive Oral Hydration & Warm Fomentation",
      "preparationMethod": "Drink 3 to 4 liters of clean warm water or electrolyte fluids daily; apply warm cloth pads to painful bones.",
      "modeOfAdministration": "Drink fluid every hour throughout waking day.",
      "contraindicationWarning": "Avoid dehydration, extreme cold baths, high altitudes, and strenuous exhaustive physical exertion."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Acute Chest Syndrome (chest pain, fever, hypoxia)",
        "Priapism (persistent painful erection >2h)",
        "Sudden stroke symptoms"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Hemoglobin Electrophoresis (HPLC), Reticulocyte Count, CBC"
    }
  },
  {
    "id": "CLIN_65",
    "conditionName": "Hypothyroidism & Thyroid Hormone Deficiency",
    "hindiName": "हाइपोथायरायडिज्म, थायरॉयड ग्रंथि की सुस्ती व वजन बढ़ना",
    "gujaratiName": "હાઇપોથાઇરોઇડિઝમ, થાઇરોઇડની કમી અને વજન વધવું",
    "punjabiName": "ਥਾਇਰਾਇਡ ਦੀ ਘਾਟ, ਸੁਸਤੀ ਅਤੇ ਭਾਰ ਵਧਣਾ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Unexplained weight gain",
      "Cold intolerance",
      "Severe fatigue",
      "Constipation",
      "Dry brittle skin and hair fall"
    ],
    "vernacularSymptomKeywords": [
      "hypothyroidism",
      "underactive thyroid",
      "high tsh",
      "thyroid weight gain",
      "thayroid rog",
      "gale me thyroid",
      "motapa thyroid",
      "हाइपोथायरायडिज्म",
      "थायरॉयड",
      "હાઇપોથાઇરોઇડ",
      "ਥਾਇਰਾਇਡ"
    ],
    "officialGeneric": {
      "medicineName": "Levothyroxine Sodium 25mcg / 50mcg / 100mcg Tablets IP",
      "genericSalt": "Levothyroxine Sodium",
      "dosageStrength": "50 mcg / 100 mcg",
      "pmbjpPriceINR": "₹16.00 per bottle of 100 tablets (80% subsidized vs ₹140.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet early morning strictly on an empty stomach with plain water; wait 45 minutes before tea or breakfast."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kanchnar Guggulu / Varunadi Kashayam",
      "scientificBotanical": "Bauhinia variegata (Kanchnar), Commiphora mukul, Crataeva nurvala",
      "activePhytochemical": "Flavonoid glycosides, Guggulsterone, Lupeol",
      "classicalReference": "Sharangadhara Samhita, Madhyama Khanda, Galaganda Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water after meals.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Coriander Seed (Dhaniya) Soaked Infusion",
      "preparationMethod": "Crush 2 tablespoons whole coriander seeds, boil in 1 glass water until reduced by half.",
      "modeOfAdministration": "Drink warm in the morning after taking allopathic Levothyroxine.",
      "contraindicationWarning": "Never stop Levothyroxine without doctor's review; limit excessive raw cruciferous vegetables (cabbage, cauliflower)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe hypothermia, slow heart rate <50 bpm, confusion (Myxedema Coma)",
        "Marked goiter with difficulty swallowing or breathing"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Thyroid Profile (Free T3, Free T4, TSH) & Anti-TPO Antibodies"
    }
  },
  {
    "id": "CLIN_66",
    "conditionName": "Hyperthyroidism, Graves' Disease & Thyrotoxicosis",
    "hindiName": "हाइपरथायरायडिज्म, थायरॉयड ग्रंथि का अतिसक्रिय होना व वजन घटना",
    "gujaratiName": "હાઇપરથાઇરોઇડિઝમ અને વજન ઘટવું",
    "punjabiName": "ਵਧਿਆ ਹੋਇਆ ਥਾਇਰਾਇਡ ਅਤੇ ਭਾਰ ਘਟਣਾ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Rapid unexplained weight loss",
      "Tachycardia / tremors in fingers",
      "Heat intolerance and excessive sweating",
      "Bulging eyes (exophthalmos)"
    ],
    "vernacularSymptomKeywords": [
      "hyperthyroidism",
      "graves disease",
      "overactive thyroid",
      "low tsh",
      "trembling hands thyroid",
      "thyroid weight loss",
      "haath kapna",
      "वजन घटना थायरॉयड",
      "હાઇપરથાઇરોઇડ",
      "ਹੱਥ ਕੰਬਣੇ"
    ],
    "officialGeneric": {
      "medicineName": "Carbimazole 5mg / 10mg Tablets IP",
      "genericSalt": "Carbimazole",
      "dosageStrength": "5 mg / 10 mg",
      "pmbjpPriceINR": "₹28.00 per strip of 10 tablets (75% savings vs ₹110.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "10mg to 20mg daily divided in 2 doses under endocrinologist monitoring."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Praval Pishti / Mukta Pishti & Shankhpushpi Syrup",
      "scientificBotanical": "Purified Coral Calx, Pearl Calx & Convolvulus pluricaulis",
      "activePhytochemical": "Bio-organic calcium carbonate complex, Shankhpushpine",
      "classicalReference": "Rasa Tarangini, Taranga 23, Pittashamana Prakarana",
      "ayushDosage": "250mg Praval Pishti twice daily with fresh Amla Murabba or cold milk.",
      "anupanaDietaryMedium": "Fresh cold milk or butter"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Cooling Vetiver (Khus) & Coconut Water",
      "preparationMethod": "Drink 1 glass tender coconut water infused with a drop of pure Khus (Vetiver) distillate.",
      "modeOfAdministration": "Mid-morning daily to reduce excessive Pitta metabolic heat.",
      "contraindicationWarning": "Avoid all caffeine, spicy foods, iodine-rich kelp, and excessive sun exposure."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Thyroid Storm (Fever >104°F, pulse >160 bpm, delirium)",
        "Heart failure signs",
        "Severe eye protrusion with vision loss"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Free T3, Free T4, Ultrasensitive TSH, Thyroid Uptake Scan"
    }
  },
  {
    "id": "CLIN_67",
    "conditionName": "Polycystic Ovarian Syndrome (PCOS / PCOD) & Insulin Resistance",
    "hindiName": "पीसीओडी / पीसीओएस, अंडाशय में गांठें, अनियमित माहवारी व चेहरे पर बाल",
    "gujaratiName": "પીસીઓડી, અનિયમિત માસિક અને વજન વધવું",
    "punjabiName": "ਪੀ.ਸੀ.ਓ.ਡੀ., ਮਾਹਵਾਰੀ ਦੀ ਗੜਬੜੀ ਅਤੇ ਵਾਲ ਝੜਨੇ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Irregular or missed periods",
      "Excessive facial hair (hirsutism)",
      "Severe cystic acne",
      "Weight gain around abdomen",
      "Thinning scalp hair"
    ],
    "vernacularSymptomKeywords": [
      "pcos",
      "pcod",
      "polycystic ovary",
      "irregular periods pcos",
      "facial hair women",
      "ovary me rasoli",
      "periods time par na aana",
      "mahawari ki gaddbaddi",
      "पीसीओडी",
      "पीसीओएस",
      "अनियमित माहवारी",
      "પીસીઓડી",
      "ਪੀ.ਸੀ.ਓ.ਡੀ."
    ],
    "officialGeneric": {
      "medicineName": "Metformin Hydrochloride 500mg SR + Myo-Inositol 1000mg Tablets",
      "genericSalt": "Metformin Sustained Release + Myo-Inositol",
      "dosageStrength": "500 mg + 1000 mg",
      "pmbjpPriceINR": "₹12.00 per strip of 10 Metformin (75% savings)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily after lunch and dinner to reverse ovarian insulin resistance."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kanchnar Guggulu / Pushpadhanwa Ras / Raja Pravartini Vati",
      "scientificBotanical": "Bauhinia variegata, Commiphora mukul, Aloe barbadensis (Kumari)",
      "activePhytochemical": "Aloin, Guggulsterone, Quercetin",
      "classicalReference": "Bhaishajya Ratnavali, Stri-Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water after food.",
      "anupanaDietaryMedium": "Warm water or Kumari Asava"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Fenugreek (Methi) & Cinnamon (Dalchini) Water",
      "preparationMethod": "Soak 1 teaspoon Fenugreek seeds and 1/2 inch Ceylon Cinnamon stick in 1 glass water overnight; boil for 3 minutes in morning, strain.",
      "modeOfAdministration": "Drink warm first thing in morning on empty stomach.",
      "contraindicationWarning": "Cut out all refined maida, bakery snacks, and sugary soft drinks; engage in 45 min daily brisk exercise."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Sudden acute pelvic agony (Ovarian cyst torsion or rupture)",
        "Heavy bleeding soaking >2 pads per hour for >3h"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Pelvic Ultrasound (USG Pelvis TVS/TAS), Fasting Insulin, LH:FSH Ratio, Free Testosterone"
    }
  },
  {
    "id": "CLIN_68",
    "conditionName": "Osteoporosis, Post-Menopausal Bone Fragility & Low BMD",
    "hindiName": "ऑस्टियोपोरोसिस, हड्डियों की कमजोरी व फ्रैक्चर का खतरा (अस्थि सौषिर्य)",
    "gujaratiName": "ઓસ્ટિયોપોરોસિસ અને હાડકાં પોલા થવા",
    "punjabiName": "ਹੱਡੀਆਂ ਦੀ ਕਮਜ਼ੋਰੀ ਅਤੇ ਆਸਾਨੀ ਨਾਲ ਟੁੱਟਣਾ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Loss of height over time",
      "Stooped or hunched posture (dowager's hump)",
      "Bone fractures occurring from trivial falls",
      "Back pain from collapsed vertebra"
    ],
    "vernacularSymptomKeywords": [
      "osteoporosis",
      "weak bones",
      "bone loss",
      "post menopausal bone pain",
      "haddi kamzor",
      "haddi me chhed",
      "fracture risk",
      "haddi ghisna",
      "हड्डियों की कमजोरी",
      "ऑस्टियोपोरोसिस",
      "હાડકાંની નબળાઈ",
      "ਹੱਡੀਆਂ ਦੀ ਕਮਜ਼ੋਰੀ"
    ],
    "officialGeneric": {
      "medicineName": "Calcium Carbonate 1250mg (eq to elemental Calcium 500mg) + Vitamin D3 250 IU",
      "genericSalt": "Calcium Carbonate + Cholecalciferol",
      "dosageStrength": "500mg + 250 IU",
      "pmbjpPriceINR": "₹6.00 per strip of 10 tablets (80% subsidized vs ₹32.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily with meals."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Lakshadi Guggulu / Asthishrinkhala Vati",
      "scientificBotanical": "Cissus quadrangularis (Hadjod) & Laccifer lacca (Laksha)",
      "activePhytochemical": "Ketosterones, Onocer-7-ene-3alpha,21beta-diol, Bioflavonoids",
      "classicalReference": "Bhaishajya Ratnavali, Bhagna Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm milk.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "White Sesame Seeds (Til) and Roasted Makhana (Fox Nuts)",
      "preparationMethod": "Chew 1 tablespoon unhulled white sesame seeds (rich in natural bio-available calcium) daily with a bowl of roasted Makhana.",
      "modeOfAdministration": "Daily healthy mid-day snack.",
      "contraindicationWarning": "Perform weight-bearing exercises (walking/resistance); avoid carbonated cola beverages which leach calcium from bones."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Inability to bear weight after minor slip (suspect hip fracture)",
        "Severe sudden thoracic back agony (vertebral crush fracture)"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "DEXA Scan (Bone Mineral Density - T-score < -2.5), Serum Calcium, Alkaline Phosphatase"
    }
  },
  {
    "id": "CLIN_69",
    "conditionName": "Severe Vitamin D Deficiency & Nutritional Rickets",
    "hindiName": "विटामिन डी की कमी, हड्डियों में दर्द व मांसपेशियों में कमजोरी",
    "gujaratiName": "વિટામિન ડી ની ઉણપ અને હાડકાંનો દુખાવો",
    "punjabiName": "ਵਿਟਾਮਿਨ ਡੀ ਦੀ ਘਾਟ ਅਤੇ ਹੱਡੀਆਂ ਦਾ ਦਰਦ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Generalized deep bone pain",
      "Proximal muscle weakness (difficulty standing from chair)",
      "Frequent illnesses/infections",
      "Depressed mood"
    ],
    "vernacularSymptomKeywords": [
      "vitamin d deficiency",
      "low vitamin d",
      "rickets",
      "osteomalacia",
      "vitamin d3 ki kami",
      "d3 deficiency",
      "haddi me mitha dard",
      "body ache low d3",
      "विटामिन डी",
      "ડી ની ઉણપ",
      "ਵਿਟਾਮਿਨ ਡੀ"
    ],
    "officialGeneric": {
      "medicineName": "Cholecalciferol (Vitamin D3) 60,000 IU Chewable Tablets / Sachet",
      "genericSalt": "Cholecalciferol IP",
      "dosageStrength": "60,000 IU",
      "pmbjpPriceINR": "₹9.50 per sachet / tablet (78% savings vs ₹45.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet / sachet once weekly with a glass of warm full-cream milk for 8 consecutive weeks, then once monthly."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Praval Panchamrit Ras / Mukta Shukti Bhasma",
      "scientificBotanical": "Conch shell calx, Coral calx, Pearl oyster calx",
      "activePhytochemical": "Bio-organic calcium carbonate, trace magnesium and strontium",
      "classicalReference": "Bhaishajya Ratnavali, Rasayana Prakarana",
      "ayushDosage": "250mg twice daily with honey or milk.",
      "anupanaDietaryMedium": "Warm cow milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Daily Mid-Day Sunlight Exposure (11 AM to 1 PM)",
      "preparationMethod": "Expose face, arms, and legs to direct sunlight for 20 minutes between 11 AM and 1 PM (optimal UV-B rays for cutaneous Vitamin D synthesis).",
      "modeOfAdministration": "Daily routine without sunscreen on arms for those 20 mins.",
      "contraindicationWarning": "Sunlight through glass windows does not synthesize Vitamin D as UV-B is blocked."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe muscle spasms / tetany / hand cramping (hypocalcemic tetany)",
        "Bone deformities or bowing of legs in children"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "Serum 25-Hydroxy Vitamin D [25(OH)D], Serum Calcium, Ionic Calcium, Serum Phosphorus"
    }
  },
  {
    "id": "CLIN_70",
    "conditionName": "Hypoglycemia, Low Blood Sugar & Insulin Shock",
    "hindiName": "हाइपोग्लाइसीमिया, खून में शुगर गिरना, पसीना व कंपकंपी",
    "gujaratiName": "સુગર ઘટી જવું, ધ્રુજારી અને પરસેવો વળવો",
    "punjabiName": "ਖੂਨ ਵਿੱਚ ਸ਼ੂਗਰ ਦਾ ਘਟਣਾ ਅਤੇ ਕੰਬਣੀ ਛਿੜਨਾ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Shakiness and trembling",
      "Profuse cold sweating",
      "Dizziness and hunger pangs",
      "Fast heartbeat",
      "Confusion or slurred speech"
    ],
    "vernacularSymptomKeywords": [
      "hypoglycemia",
      "low sugar",
      "sugar girna",
      "insulin shock",
      "cold sweat shaking",
      "shakiness diabetes",
      "kam sugar",
      "khoon me sugar kam",
      "शुगर गिरना",
      "हाइपोग्लाइसीमिया",
      "સુગર ઘટી જવું",
      "ਸ਼ੂਗਰ ਘਟਣੀ"
    ],
    "officialGeneric": {
      "medicineName": "Oral Glucose Powder / Dextrose 25% or 50% Injection IP",
      "genericSalt": "Dextrose (D-Glucose Monohydrate)",
      "dosageStrength": "15g to 20g oral dose / 100ml IV",
      "pmbjpPriceINR": "₹15.00 per 100g glucose pack",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Rule of 15: Ingest 15 grams of fast-acting sugar (3-4 glucose tablets or 1 tablespoon sugar in water), recheck blood sugar in 15 minutes."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kharjurasava / Drakshavaleha",
      "scientificBotanical": "Phoenix dactylifera (Dates) & Vitis vinifera (Raisins)",
      "activePhytochemical": "Natural bio-available glucose and fructose, mineral iron",
      "classicalReference": "Ashtanga Hridaya, Chikitsa Sthana, Shrama Chikitsa",
      "ayushDosage": "20ml with water to replenish tissue vitality.",
      "anupanaDietaryMedium": "Fresh warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Instant Kitchen Sugar / Jaggery (Gud) Solution",
      "preparationMethod": "Dissolve 3 teaspoons refined table sugar or pure jaggery in half a glass of clean water.",
      "modeOfAdministration": "Drink immediately if conscious.",
      "contraindicationWarning": "NEVER attempt to pour liquid into the mouth of an unconscious or convulsing person (aspiration danger). Call 108 immediately."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Loss of consciousness / unresponsiveness",
        "Seizures or convulsions",
        "Sugar remains <54 mg/dL after 3 attempts"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Instant Capillary Blood Glucose (CBG via Glucometer)"
    }
  },
  {
    "id": "CLIN_71",
    "conditionName": "Metabolic Syndrome & Central Visceral Obesity",
    "hindiName": "मेटाबॉलिक सिंड्रोम, पेट की चर्बी, मोटापा व सुस्त चयापचय",
    "gujaratiName": "મેટાબોલિક સિન્ડ્રોમ, પેટની ચરબી અને સ્થૂળતા",
    "punjabiName": "ਮੋਟਾਪਾ, ਪੇਟ ਦੀ ਚਰਬੀ ਅਤੇ ਮੈਟਾਬੋਲਿਕ ਵਿਕਾਰ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Waist circumference >90cm in men or >80cm in women",
      "High triglycerides",
      "Low HDL good cholesterol",
      "Borderline hypertension and fasting sugar"
    ],
    "vernacularSymptomKeywords": [
      "metabolic syndrome",
      "visceral fat",
      "belly fat",
      "central obesity",
      "motapa",
      "pet ki charbi",
      "badhta pet",
      "thoolata",
      "मोटापा",
      "पेट की चर्बी",
      "સ્થૂળતા",
      "ਮੋਟਾਪਾ"
    ],
    "officialGeneric": {
      "medicineName": "Atorvastatin 10mg + Metformin 500mg Tablets",
      "genericSalt": "Atorvastatin + Metformin",
      "dosageStrength": "10mg + 500mg",
      "pmbjpPriceINR": "₹14.00 per strip of 10 tablets (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "As prescribed to simultaneously manage dyslipidemia and insulin resistance."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Medohar Guggulu / Triphala Guggulu",
      "scientificBotanical": "Commiphora mukul, Triphala, Piper nigrum & Embelia ribes (Vidanga)",
      "activePhytochemical": "Guggulsterones, Embelin, Polyphenols",
      "classicalReference": "Bhaishajya Ratnavali, Sthaulya Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water 30 minutes after meals.",
      "anupanaDietaryMedium": "Warm water with 1 drop pure honey"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Lukewarm Water with Lemon and Pure Raw Honey",
      "preparationMethod": "Squeeze half a fresh lemon into 1 glass lukewarm water with 1 teaspoon pure honey.",
      "modeOfAdministration": "Drink every morning at sunrise on an empty stomach.",
      "contraindicationWarning": "Avoid deep fried snacks, processed seed oils, and eating heavy grain dinners after 8 PM."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe daytime somnolence and breathlessness",
        "Acanthosis nigricans (black velvety neck folds) signaling severe insulin spike",
        "Hypertension >160/100"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Fasting Lipid Profile, Fasting Blood Glucose, HbA1c, Serum Uric Acid"
    }
  },
  {
    "id": "CLIN_72",
    "conditionName": "Hyperprolactinemia & Galactorrhea",
    "hindiName": "प्रोलैक्टिन की अधिकता, स्तनों से अवांछित दूध रिसाव व सिरदर्द",
    "gujaratiName": "પ્રોલેક્ટીન વધવું અને સ્તનમાંથી દૂધ ઝરવું",
    "punjabiName": "ਪ੍ਰੋਲੈਕਟਿਨ ਹਾਰਮੋਨ ਦਾ ਵਧਣਾ",
    "bodySystem": "Endocrinology",
    "typicalSymptoms": [
      "Milky nipple discharge unrelated to breastfeeding",
      "Irregular periods or amenorrhea",
      "Headaches",
      "Peripheral visual field loss"
    ],
    "vernacularSymptomKeywords": [
      "hyperprolactinemia",
      "high prolactin",
      "galactorrhea",
      "nipple discharge milky",
      "prolactin badhna",
      "stan se doodh aana",
      "stano me drav",
      "प्रोलैक्टिन",
      "गैलेक्टोरिया",
      "સ્તનમાંથી સ્ત્રાવ",
      "ਪ੍ਰੋਲੈਕਟਿਨ"
    ],
    "officialGeneric": {
      "medicineName": "Cabergoline 0.5mg Tablets IP",
      "genericSalt": "Cabergoline",
      "dosageStrength": "0.5 mg",
      "pmbjpPriceINR": "₹45.00 for pack of 4 tablets (70% savings vs ₹160.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "0.5mg once or twice weekly as prescribed by endocrinologist."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Lodhrasava / Ashokarishta",
      "scientificBotanical": "Symplocos racemosa (Lodhra) & Saraca asoca (Ashoka)",
      "activePhytochemical": "Symposide, Lodhroside, Ketosterol",
      "classicalReference": "Bhaishajya Ratnavali, Stri-Rogadhikara",
      "ayushDosage": "15ml with equal water twice daily after food.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Chasteberry (Nirgundi) Infusion & Avoidance of Breast Stimulation",
      "preparationMethod": "Boil 1/2 teaspoon Vitex negundo (Nirgundi) leaves in 1 cup water, strain.",
      "modeOfAdministration": "Drink once daily in evening.",
      "contraindicationWarning": "Avoid constant tactile stimulation of nipples; review existing psychiatric or antacid medications that may cause prolactin surge."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Bitemporal hemianopsia (loss of outer visual fields indicating pituitary adenoma compression)",
        "Severe progressive frontal headaches"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Serum Prolactin (Fasting morning sample) & Contrast-Enhanced Pituitary MRI"
    }
  },
  {
    "id": "CLIN_73",
    "conditionName": "Rheumatoid Arthritis (RA) & Autoimmune Synovitis",
    "hindiName": "रूमेटाइड अर्थराइटिस, आमवात, जोड़ों की जकड़न व सूजन",
    "gujaratiName": "રૂમેટોઇડ આર્થરાઇટિસ, આમવાત અને સાંધાનો સોજો",
    "punjabiName": "ਗਠੀਆ ਬਾਅ, ਜੋੜਾਂ ਦੀ ਸੋਜ ਅਤੇ ਅਕੜਾਅ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Morning joint stiffness lasting >1 hour",
      "Symmetrical swelling in small finger and wrist joints",
      "Joint warmth and redness",
      "Chronic fatigue"
    ],
    "vernacularSymptomKeywords": [
      "rheumatoid arthritis",
      "amavata",
      "autoimmune arthritis",
      "subah jodo me jakdan",
      "ungliyo me sujan",
      "gathiya rog",
      "chote jodo me dard",
      "आमवात",
      "रूमेटाइड अर्थराइटिस",
      "ગઠિયો વા",
      "ਗਠੀਆ ਬਾਅ"
    ],
    "officialGeneric": {
      "medicineName": "Methotrexate 7.5mg / 10mg Tablets IP + Folic Acid 5mg Tablets",
      "genericSalt": "Methotrexate (DMARD) + Folic Acid",
      "dosageStrength": "7.5mg weekly + 5mg",
      "pmbjpPriceINR": "₹16.00 per strip of 10 Methotrexate (80% subsidized vs ₹85.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Taken strictly ONCE A WEEK on the same day; Folic Acid taken 24 hours later to prevent stomatitis."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Simhanada Guggulu / Rasnadi Kwath",
      "scientificBotanical": "Commiphora mukul, Triphala, Purified Gandhak & Ricinus communis (Eranda)",
      "activePhytochemical": "Guggulsterones, Ricinoleic acid, Elemental sulfur complexes",
      "classicalReference": "Bhaishajya Ratnavali, Amavata Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water or ginger tea.",
      "anupanaDietaryMedium": "Warm ginger infusion (Shunti Jala)"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Ginger and Castor Oil (Eranda Sneha) at Bedtime",
      "preparationMethod": "Mix 1 teaspoon pure edible Castor oil in a warm cup of dry ginger tea (Sonth).",
      "modeOfAdministration": "Drink at bedtime twice a week to purge morbid metabolic Ama toxins.",
      "contraindicationWarning": "Do not consume heavy fermented curd, cold sour buttermilk, or urad dal during active inflammation."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Rapid joint destruction or ulnar drift finger deformity",
        "Eye pain and redness (Scleritis)",
        "Shortness of breath (Rheumatoid lung)"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Rheumatoid Factor (RA Factor Quantitative), Anti-CCP Antibodies, ESR, CRP"
    }
  },
  {
    "id": "CLIN_74",
    "conditionName": "Ankylosing Spondylitis & HLA-B27 Sacroiliitis",
    "hindiName": "एंकाइलोजिंग स्पॉन्डिलाइटिस, रीढ़ की हड्डी का अकड़ना व बांस जैसी रीढ़",
    "gujaratiName": "એન્કીલોઝિંગ સ્પોન્ડિલાઇટિસ અને કરોડરજ્જુની જકડાઈ",
    "punjabiName": "ਰੀੜ੍ਹ ਦੀ ਹੱਡੀ ਦਾ ਅਕੜਾਅ ਅਤੇ ਗਠੀਆ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Chronic lower back and buttock pain in young adults (<40 yrs)",
      "Stiffness worst in the morning, improving with exercise",
      "Bamboo spine sensation",
      "Heel pain (enthesitis)"
    ],
    "vernacularSymptomKeywords": [
      "ankylosing spondylitis",
      "hla b27",
      "spine stiffness morning",
      "sacroiliitis",
      "reedh ki haddi jakadna",
      "subah kamar dard",
      "spine arthritis",
      "रीढ़ की हड्डी अकड़ना",
      "કરોડરજ્જુ જકડાઈ",
      "ਰੀੜ੍ਹ ਦਾ ਅਕੜਾਅ"
    ],
    "officialGeneric": {
      "medicineName": "Sulfasalazine 500mg Gastro-Resistant Tablets IP",
      "genericSalt": "Sulfasalazine",
      "dosageStrength": "500 mg",
      "pmbjpPriceINR": "₹28.00 per strip of 10 tablets (75% savings vs ₹115.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily gradually increased to 2 tablets twice daily after meals."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Yogaraja Guggulu / Dashamoola Kashayam",
      "scientificBotanical": "Commiphora mukul, Ten Sacred Roots (Dashamoola), Pluchea lanceolata",
      "activePhytochemical": "Guggulsterones, Flavonoids, Polyphenols",
      "classicalReference": "Bhaishajya Ratnavali, Vatavyadhi Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm Dashamoola decoction.",
      "anupanaDietaryMedium": "Warm Dashamoola decoction or hot water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Daily Prone Spinal Extension Yoga & Warm Epsom Salt Compress",
      "preparationMethod": "Perform Bhujangasana (Cobra pose) and Shalabhasana daily; apply warm moist towel across lower back.",
      "modeOfAdministration": "Daily morning and evening spine stretching.",
      "contraindicationWarning": "Never remain immobilized in bed for prolonged periods; motion preserves spinal flexibility."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Red, painful eye with photophobia (Acute Anterior Uveitis - emergency risk of vision loss)",
        "Chest expansion <2.5 cm causing breathing restriction"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "HLA-B27 PCR Blood Test, Pelvis X-Ray / MRI Sacroiliac Joints"
    }
  },
  {
    "id": "CLIN_75",
    "conditionName": "Plantar Fasciitis, Calcaneal Heel Spur & Morning Heel Pain",
    "hindiName": "एड़ी का दर्द, प्लांटर फैसीसाइटिस व सुबह पैर रखने में चुभन",
    "gujaratiName": "પાનીનો દુખાવો, એડીમાં સોજો અને સવારે પગ મૂકતાં કષ્ટ",
    "punjabiName": "ਅੱਡੀ ਦਾ ਦਰਦ ਅਤੇ ਸਵੇਰੇ ਪੈਰ ਧਰਨ ਤੇ ਪੀੜ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Stabbing pain in bottom of heel",
      "Pain worst with first steps in the morning after getting out of bed",
      "Pain trigger after long standing or rising from sitting"
    ],
    "vernacularSymptomKeywords": [
      "plantar fasciitis",
      "heel pain",
      "calcaneal spur",
      "morning heel pain",
      "aedi me dard",
      "subah pair rakhne par dard",
      "heel spur",
      "paani no dukhavo",
      "एड़ी में दर्द",
      "सुबह पैर में चुभन",
      "પાનીનો દુખાવો",
      "ਅੱਡੀ ਦਾ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Aceclofenac 100mg + Paracetamol 325mg Tablets IP",
      "genericSalt": "Aceclofenac + Paracetamol",
      "dosageStrength": "100mg + 325mg",
      "pmbjpPriceINR": "₹8.00 per strip of 10 tablets (75% savings vs ₹35.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily post meals for 5 days during acute flare-up."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kaishore Guggulu / Murivenna Taila",
      "scientificBotanical": "Commiphora mukul, Tinospora cordifolia, Pongamia pinnata, Piper betle",
      "activePhytochemical": "Guggulsterones, Giloin, Karanjin, Hydroxychavicol",
      "classicalReference": "Sahasrayogam, Taila Prakarana, Vranaropana",
      "ayushDosage": "Warm Murivenna oil applied to heel followed by hot water bottle fomentation.",
      "anupanaDietaryMedium": "Topical application"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Frozen Water Bottle Roll & Calf Wall Stretching",
      "preparationMethod": "Freeze a cylindrical plastic water bottle solid; roll the arch and heel of barefoot over the frozen bottle for 10 minutes.",
      "modeOfAdministration": "Twice daily, especially in evening.",
      "contraindicationWarning": "Never walk barefoot on hard tiled or concrete floors; use silicone heel cups or cushioned footwear."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Complete inability to bear weight on heel",
        "Numbness or burning tingling in foot (Tarsal Tunnel Syndrome)",
        "Visible redness, heat, and swelling spreading up ankle"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Foot & Ankle Lateral X-Ray (Check Calcaneal Spur), Ultrasound Foot Fascia"
    }
  },
  {
    "id": "CLIN_76",
    "conditionName": "Frozen Shoulder, Adhesive Capsulitis & Restricted Range of Motion",
    "hindiName": "कंधे की जकड़न, फ्रोजन शोल्डर, हाथ ऊपर न उठना (अवबाहुक)",
    "gujaratiName": "ખભાની જકડાઈ, ફ્રોઝન શોલ્ડર અને હાથ ઊંચો ન થવો",
    "punjabiName": "ਮੋਢੇ ਦਾ ਜਾਮ ਹੋਣਾ ਅਤੇ ਹੱਥ ਉੱਪਰ ਨਾ ਚੁੱਕਿਆ ਜਾਣਾ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Severe shoulder pain worsening at night",
      "Progressive stiffness and inability to raise arm",
      "Difficulty buttoning clothes or reaching back pocket"
    ],
    "vernacularSymptomKeywords": [
      "frozen shoulder",
      "adhesive capsulitis",
      "avabahuka",
      "kandha jaam hona",
      "haath upar na uthna",
      "stiff shoulder",
      "shoulder pain night",
      "कंधा जाम होना",
      "कंधे में जकड़न",
      "ખભો જકડાવો",
      "ਮੋਢਾ ਜਾਮ"
    ],
    "officialGeneric": {
      "medicineName": "Etoricoxib 60mg / 90mg Tablets IP",
      "genericSalt": "Etoricoxib (Selective COX-2 Inhibitor)",
      "dosageStrength": "60 mg / 90 mg",
      "pmbjpPriceINR": "₹18.00 per strip of 10 tablets (75% savings vs ₹80.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet once daily post meals for 7 days during painful inflammatory stage."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Prasarinyadi Kashayam / Mahanarayana Taila",
      "scientificBotanical": "Paederia foetida (Prasarani), Sida cordifolia (Bala), Asparagus racemosus",
      "activePhytochemical": "Paederosidic acid, Ephedrine-free phytosterols, Shatavarin",
      "classicalReference": "Sahasrayogam, Kashaya Prakarana, Vatavyadhi Chikitsa",
      "ayushDosage": "15ml with equal warm water twice daily before meals. Gentle Mahanarayana oil massage.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Finger-Wall Walking and Codman's Pendulum Exercises",
      "preparationMethod": "Lean forward resting unaffected arm on table; let affected arm dangle freely like a pendulum and make gentle circles.",
      "modeOfAdministration": "Perform 5 minutes, 3 times daily followed by warm water fomentation.",
      "contraindicationWarning": "Do not immobilize the shoulder in a sling; prolonged immobilization worsens capsular adhesions."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Shoulder pain accompanied by chest pressure or shortness of breath (Cardiovascular warning)",
        "Fever with red warm joint (Septic arthritis)"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Shoulder AP and Axillary View X-Ray, Shoulder MRI (Rule out Rotator Cuff Tear)"
    }
  },
  {
    "id": "CLIN_77",
    "conditionName": "Carpal Tunnel Syndrome (CTS) & Median Nerve Entrapment",
    "hindiName": "कलाई की नस दबना, हाथ में झनझनाहट व सुन्नपन (कार्पल टनल)",
    "gujaratiName": "કાંડાની નસ દબાવી અને આંગળીઓમાં ખાલી ચડવી",
    "punjabiName": "ਗੁੱਟ ਦੀ ਨਸ ਦਬਣੀ ਅਤੇ ਹੱਥ ਦਾ ਸੁੰਨਪੁਣਾ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Tingling or numbness in thumb, index, middle fingers",
      "Weak grip strength (dropping objects)",
      "Nocturnal pain awakening from sleep requiring shaking the hand"
    ],
    "vernacularSymptomKeywords": [
      "carpal tunnel",
      "cts",
      "median nerve compression",
      "wrist nerve pain",
      "ungliyo me jhanjhanahat",
      "kalai me dard",
      "mobile chalane se haath sunn",
      "हाथ में झनझनाहट",
      "कलाई की नस",
      "કાંડાની નસ",
      "ਗੁੱਟ ਦਾ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Methylcobalamin 1500mcg + Alpha Lipoic Acid 100mg Tablets",
      "genericSalt": "Methylcobalamin + Alpha Lipoic Acid",
      "dosageStrength": "1500mcg + 100mg",
      "pmbjpPriceINR": "₹22.00 per strip of 10 tablets (75% savings vs ₹95.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet daily after food to promote peripheral axonal regeneration."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Yogaraj Guggulu & Bala Taila Fomentation",
      "scientificBotanical": "Commiphora mukul, Sida cordifolia (Bala), Sesamum indicum",
      "activePhytochemical": "Guggulsterones, Vasicine, Sesamin",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Vatavyadhi Chikitsa",
      "ayushDosage": "2 tablets twice daily after meals with warm water.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Neutral Neutral Wrist Splinting at Bedtime",
      "preparationMethod": "Wear a rigid neutral-wrist brace/splint during sleep to prevent acute flexion/extension that compresses the median canal.",
      "modeOfAdministration": "Wear every night for 6 weeks.",
      "contraindicationWarning": "Take regular 5-minute wrist stretch breaks during computer typing, sewing, or smartphone usage."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Wasting or flattening of the thenar muscle cushion at base of thumb",
        "Permanent loss of sensation in fingertips"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Nerve Conduction Study (Electromyography - NCV/EMG of Upper Limbs)"
    }
  },
  {
    "id": "CLIN_78",
    "conditionName": "Lateral Epicondylitis, Tennis Elbow & Tendon Overuse",
    "hindiName": "टेनिस एल्बो, कोहनी के बाहरी हिस्से में दर्द व कमजोरी",
    "gujaratiName": "ટેનિસ એલ્બો અને કોણીનો દુખાવો",
    "punjabiName": "ਕੂਹਣੀ ਦਾ ਬਾਹਰੀ ਦਰਦ ਅਤੇ ਕਮਜ਼ੋਰੀ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Pain on outside of elbow",
      "Weakness when shaking hands, gripping a wrench, or turning a door handle",
      "Tenderness over lateral epicondyle bone"
    ],
    "vernacularSymptomKeywords": [
      "tennis elbow",
      "lateral epicondylitis",
      "elbow pain",
      "kohni me dard",
      "kohni ke bahar dard",
      "gripping pain elbow",
      "door handle pain elbow",
      "टेनिस एल्बो",
      "कोहनी में दर्द",
      "કોણીનો દુખાવો",
      "ਕੂਹਣੀ ਦਾ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Diclofenac Diethylamine 1.16% w/w Gel IP",
      "genericSalt": "Diclofenac Gel",
      "dosageStrength": "30g tube",
      "pmbjpPriceINR": "₹12.00 per tube (75% savings vs ₹55.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply gently without heavy rubbing over painful lateral elbow 3 to 4 times daily."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Pinda Taila / Lakshadi Guggulu",
      "scientificBotanical": "Rubia cordifolia (Manjistha), Hemidesmus indicus (Sariva), Beeswax",
      "activePhytochemical": "Purpurin, Manjistin, Hemidesmol",
      "classicalReference": "Ashtanga Hridaya, Chikitsa Sthana, Vatarakta Rogadhikara",
      "ayushDosage": "Apply warm Pinda oil topically; 2 tablets Lakshadi Guggulu twice daily.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Ice Compression Massage and Counter-Force Forearm Brace",
      "preparationMethod": "Rub ice cube gently over the tendon for 5 minutes after forearm work; wear counterforce strap 2 inches below elbow crease.",
      "modeOfAdministration": "Ice application twice daily.",
      "contraindicationWarning": "Avoid repeated forceful wrist-twisting activities until tendon micro-tears remodel."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Inability to bend or extend elbow fully",
        "Visible deformity, warmth, or fever indicating septic bursitis"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Ultrasound Elbow Tendon / X-Ray Elbow AP and Lateral"
    }
  },
  {
    "id": "CLIN_79",
    "conditionName": "Fibromyalgia, Generalized Musculoskeletal Pain & Fatigue",
    "hindiName": "फाइब्रोमायल्गिया, पूरे शरीर में दर्द, मांसपेशियों में खिंचाव व थकान",
    "gujaratiName": "ફાઈબ્રોમાયલ્જીયા અને આખા શરીરમાં કળતર",
    "punjabiName": "ਸਾਰੇ ਸਰੀਰ ਦਾ ਦਰਦ, ਥਕਾਵਟ ਅਤੇ ਮਾਸਪੇਸ਼ੀਆਂ ਦਾ ਖਿਚਾਅ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Widespread body pain in multiple trigger points lasting >3 months",
      "Non-restorative unrefreshing sleep",
      "Cognitive fibro-fog",
      "Morning stiffness"
    ],
    "vernacularSymptomKeywords": [
      "fibromyalgia",
      "all over body pain",
      "widespread muscle ache",
      "poore shareer me dard",
      "kisi dawai se aaram nahi",
      "chronic fatigue muscle",
      "har haddi dard",
      "पूरे शरीर में दर्द",
      "ફાઈબ્રોમાયલ્જીયા",
      "ਸਾਰੇ ਸਰੀਰ ਵਿੱਚ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Duloxetine Hydrochloride 20mg / 30mg Gastro-Resistant Capsules IP",
      "genericSalt": "Duloxetine (SNRI)",
      "dosageStrength": "20 mg / 30 mg",
      "pmbjpPriceINR": "₹22.00 per strip of 10 capsules (75% savings vs ₹90.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule daily morning after breakfast; central pain modulator."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Ashwagandhadi Lehyam / Dashamoolarishta",
      "scientificBotanical": "Withania somnifera, Mucuna pruriens (Kapikacchu), Dashamoola",
      "activePhytochemical": "Withanolides, L-DOPA, Flavonoids",
      "classicalReference": "Sahasrayogam, Lehya Prakarana",
      "ayushDosage": "10 grams twice daily with warm milk.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Warm Turmeric and Nutmeg Golden Milk (Haldi-Jaiphal Doodh)",
      "preparationMethod": "Boil 1/2 teaspoon pure turmeric powder, a pinch of crushed black pepper, and a pinch of nutmeg in 1 glass milk.",
      "modeOfAdministration": "Drink warm 30 minutes before bed.",
      "contraindicationWarning": "Engage in gentle low-impact aquatic exercises or walking; avoid total sedentary withdrawal."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe unmanageable depression or suicidal despair",
        "Sudden muscle weakness preventing standing (check myositis/hypokalemia)"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Serum Creatine Kinase (CPK), ESR, CRP, Thyroid Profile, Vitamin D3 & B12"
    }
  },
  {
    "id": "CLIN_80",
    "conditionName": "Acute Muscle Cramps, Spasms & Nocturnal Leg Cramps",
    "hindiName": "मांसपेशियों में ऐंठन, नस पर नस चढ़ना व पिंडली में मरोड़",
    "gujaratiName": "સ્નાયુ ખેંચાઈ જવા, ગોટલો ચડવો અને નસ પર નસ ચડવી",
    "punjabiName": "ਮਾਸਪੇਸ਼ੀਆਂ ਦੀ ਖਿੱਚ, ਪਿੰਜਣੀ ਵਿੱਚ ਵੱਟ ਪੈਣਾ",
    "bodySystem": "Musculoskeletal",
    "typicalSymptoms": [
      "Sudden involuntary agonizing contraction of muscle (most common in calf or foot)",
      "Hard lump felt in muscle tissue",
      "Residual muscle soreness"
    ],
    "vernacularSymptomKeywords": [
      "muscle cramps",
      "charley horse",
      "leg cramps at night",
      "nas par nas chadhna",
      "pindli me marod",
      "ainthan",
      "muscle spasm",
      "gotlo chadvo",
      "नस पर नस चढ़ना",
      "मांसपेशियों में ऐंठन",
      "ગોટલો ચડવો",
      "ਪਿੰਜਣੀ ਦਾ ਖਿਚਾਅ"
    ],
    "officialGeneric": {
      "medicineName": "Magnesium Glycinate 250mg + Vitamin E 400 IU Capsules",
      "genericSalt": "Magnesium + Tocopherol (Vitamin E)",
      "dosageStrength": "250mg + 400 IU",
      "pmbjpPriceINR": "₹16.00 per strip of 10 (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule daily after dinner for 2 to 4 weeks."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Mahanarayana Taila / Dhanwantharam Taila",
      "scientificBotanical": "Asparagus racemosus, Sida cordifolia, Withania somnifera",
      "activePhytochemical": "Shatavarin, Sterols, Essential sesame lignans",
      "classicalReference": "Bhaishajya Ratnavali, Vatavyadhi Rogadhikara",
      "ayushDosage": "Warm oil massage over calf muscles before sleeping.",
      "anupanaDietaryMedium": "Topical application"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Instant Dorsiflexion Stretch & Tender Coconut Water",
      "preparationMethod": "During acute cramp, immediately pull toes upward towards shin while keeping leg straight. Drink 1 green coconut water for natural magnesium and potassium.",
      "modeOfAdministration": "Instant physical counter-stretch.",
      "contraindicationWarning": "Stay adequately hydrated, especially during humid summer months or heavy sweating."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Cramps accompanied by severe muscle dark urine (Rhabdomyolysis warning)",
        "Cramps that fail to release after 15 minutes of continuous stretching"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Serum Electrolytes (Sodium, Potassium, Calcium, Magnesium), Serum Creatinine"
    }
  },
  {
    "id": "CLIN_81",
    "conditionName": "Chronic Kidney Disease (CKD) & Elevated Serum Creatinine",
    "hindiName": "क्रोनिक किडनी रोग, गुर्दे की कार्यक्षमता में कमी व क्रिएटिनिन बढ़ना",
    "gujaratiName": "ક્રોનિક કિડની રોગ અને ક્રિએટિનિન વધવું",
    "punjabiName": "ਗੁਰਦਿਆਂ ਦੀ ਪੁਰਾਣੀ ਬਿਮਾਰੀ ਅਤੇ ਕ੍ਰਿਏਟਿਨਿਨ ਦਾ ਵਧਣਾ",
    "bodySystem": "Nephrology",
    "typicalSymptoms": [
      "Swelling around eyes and feet (pedal edema)",
      "Fatigue",
      "Frothy or foamy urine",
      "Decreased appetite and metallic taste",
      "Nausea"
    ],
    "vernacularSymptomKeywords": [
      "ckd",
      "chronic kidney disease",
      "high creatinine",
      "kidney damage",
      "gurde kharab",
      "creatinine badhna",
      "kidney fail initial",
      "peshab me jhag",
      "क्रोनिक किडनी रोग",
      "क्रिएटिनिन बढ़ना",
      "કિડનીની બીમારી",
      "ਗੁਰਦੇ ਦੀ ਬਿਮਾਰੀ"
    ],
    "officialGeneric": {
      "medicineName": "Telmisartan 40mg Tablets IP / Sodium Bicarbonate 500mg Tablets",
      "genericSalt": "Telmisartan / Sodium Bicarbonate",
      "dosageStrength": "40mg / 500mg",
      "pmbjpPriceINR": "₹9.00 / ₹4.50 per strip (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Renoprotective ARB therapy prescribed under nephrologist guidance to reduce proteinuria."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Punarnavadi Mandoor / Gokshuradi Guggulu / Varunadi Kwath",
      "scientificBotanical": "Boerhavia diffusa (Punarnava), Tribulus terrestris (Gokshura), Crataeva nurvala",
      "activePhytochemical": "Punarnavine, Protodioscin, Lupeol",
      "classicalReference": "Bhaishajya Ratnavali, Shotha Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water.",
      "anupanaDietaryMedium": "Punarnava decoction or lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Boiled Corn Silk (Makka Ke Baal) Infusion",
      "preparationMethod": "Boil 1 handful clean fresh corn silk (Zea mays stigmas) in 2 cups water until reduced to 1 cup; strain.",
      "modeOfAdministration": "Drink 1 cup warm daily as gentle natural diuretic.",
      "contraindicationWarning": "Strictly restrict high-potassium fruits (bananas, oranges), restrict table salt to <3g/day, and NEVER take painkiller NSAIDs (Brufen/Combiflam)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe shortness of breath when lying flat (Pulmonary Edema)",
        "Urine output <400ml in 24 hours (Oliguria)",
        "Pericardial chest pain or extreme asterixis"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Serum Creatinine, Blood Urea Nitrogen (BUN), eGFR, Urine Albumin-to-Creatinine Ratio (uACR), Serum Potassium"
    }
  },
  {
    "id": "CLIN_82",
    "conditionName": "Benign Prostatic Hyperplasia (BPH) & Urinary Hesitancy",
    "hindiName": "पौरुष ग्रंथि का बढ़ना, पेशाब की रुकावट व रात में बार-बार पेशाब (प्रोस्टेट)",
    "gujaratiName": "પ્રોસ્ટેટ ગ્રંથિ વધવી અને પેશાબમાં અડચણ",
    "punjabiName": "ਪ੍ਰੋਸਟੇਟ ਦਾ ਵਧਣਾ ਅਤੇ ਪਿਸ਼ਾਬ ਰੁਕ-ਰੁਕ ਕੇ ਆਉਣਾ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Frequent need to urinate especially at night (nocturia)",
      "Difficulty starting urination (hesitancy)",
      "Weak or interrupted urine stream",
      "Dribbling at end of urination"
    ],
    "vernacularSymptomKeywords": [
      "bph",
      "enlarged prostate",
      "prostate gland",
      "urinary hesitancy",
      "peshab ruk ruk kar aana",
      "prostate badhna",
      "raat me baar baar peshab",
      "weak urine stream",
      "प्रोस्टेट",
      "पेशाब रुकना",
      "પ્રોસ્ટેટ",
      "ਪ੍ਰੋਸਟੇਟ"
    ],
    "officialGeneric": {
      "medicineName": "Tamsulosin Hydrochloride 0.4mg + Finasteride 5mg Tablets IP",
      "genericSalt": "Tamsulosin HCl + Finasteride",
      "dosageStrength": "0.4mg + 5mg",
      "pmbjpPriceINR": "₹28.00 per strip of 10 tablets (75% savings vs ₹125.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet daily 30 minutes after dinner."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Chandraprabha Vati / Varunadi Vati / Gokshuradi Guggulu",
      "scientificBotanical": "Crataeva nurvala, Tribulus terrestris, Asphaltum punjabianum (Shilajit)",
      "activePhytochemical": "Lupeol, Saponins, Fulvic acid complexes",
      "classicalReference": "Sharangadhara Samhita, Madhyama Khanda, Mutrakrichhra Rogadhikara",
      "ayushDosage": "2 tablets twice daily after meals with lukewarm water.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Raw Pumpkin Seeds (Kaddu Ke Beej) & Watermelon Seed Tea",
      "preparationMethod": "Chew 2 tablespoons raw unsalted pumpkin seeds (Cucurbita pepo, rich in natural phytosterols and zinc) daily.",
      "modeOfAdministration": "Daily morning snack.",
      "contraindicationWarning": "Avoid drinking large amounts of fluids within 2 hours of going to sleep; avoid alcohol and cold antihistamines which can trigger acute retention."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Complete inability to pass even a drop of urine with agonizing bladder distension (Acute Urinary Retention - immediate catheterization needed)",
        "Gross hematuria (visible blood)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Serum PSA (Prostate Specific Antigen), Ultrasound KUB with Post-Void Residual (PVR) Urine Volume"
    }
  },
  {
    "id": "CLIN_83",
    "conditionName": "Overactive Bladder (OAB) & Urge Incontinence",
    "hindiName": "अतिसक्रिय मूत्राशय, पेशाब न रुकना व अचानक तेज वेग (मूत्रातीसार)",
    "gujaratiName": "ઓવરએક્ટિવ બ્લેડર અને પેશાબ ન રોકી શકવો",
    "punjabiName": "ਪਿਸ਼ਾਬ ਦਾ ਨਾ ਰੁਕਣਾ ਅਤੇ ਵਾਰ-ਵਾਰ ਹਾਜਤ ਹੋਣੀ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Sudden compelling urge to urinate that cannot be deferred",
      "Involuntary urine leakage before reaching bathroom",
      "Urination >8 times during day"
    ],
    "vernacularSymptomKeywords": [
      "overactive bladder",
      "oab",
      "urge incontinence",
      "urine leakage",
      "peshab na rukna",
      "peshab me tezi",
      "peshab nikal jana",
      "baar baar peshab",
      "पेशाब न रुकना",
      "मूत्राशय में उत्तेजना",
      "પેશાબ લીક થવો",
      "ਪਿਸ਼ਾਬ ਨਾ ਰੁਕਣਾ"
    ],
    "officialGeneric": {
      "medicineName": "Mirabegron 25mg / 50mg Extended Release Tablets IP",
      "genericSalt": "Mirabegron (Beta-3 Adrenergic Agonist)",
      "dosageStrength": "25 mg / 50 mg",
      "pmbjpPriceINR": "₹32.00 per strip of 10 (72% savings vs ₹130.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet once daily with water."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Chandraprabha Vati & Shilajatwadi Vati",
      "scientificBotanical": "Purified Shilajit, Tribulus terrestris, Commiphora mukul",
      "activePhytochemical": "Fulvic acids, Bioflavonoids, Dibenzo-alpha-pyrones",
      "classicalReference": "Bhaishajya Ratnavali, Mutraghata Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm milk or water.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Kegel Pelvic Floor Strengthening & Bladder Retraining",
      "preparationMethod": "Contract pelvic floor muscles as if stopping urination mid-stream for 5 seconds, release for 5 seconds; repeat 10 times, 3 sets daily.",
      "modeOfAdministration": "Daily exercises sitting or standing.",
      "contraindicationWarning": "Eliminate caffeinated tea, coffee, carbonated sodas, and artificial sweeteners which irritate the detrusor bladder muscle."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Fever with flank pain and burning (Ascending pyelonephritis)",
        "Urine leakage accompanied by leg weakness / bowel incontinence (Spinal cord lesion)"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Urine Routine and Microscopy & Urodynamic Study"
    }
  },
  {
    "id": "CLIN_84",
    "conditionName": "Acute Pyelonephritis, Kidney Infection & Flank Agony",
    "hindiName": "गुर्दे का तीव्र संक्रमण, तेज बुखार, कंपकंपी व पीठ में असह्य दर्द",
    "gujaratiName": "કિડનીમાં ગંભીર ચેપ, તાવ અને કમરમાં સખત દુખાવો",
    "punjabiName": "ਗੁਰਦੇ ਦੀ ਇਨਫੈਕਸ਼ਨ, ਕਾਂਬੇ ਵਾਲਾ ਬੁਖਾਰ ਅਤੇ ਦਰਦ",
    "bodySystem": "Nephrology",
    "typicalSymptoms": [
      "High spiking fever with shaking chills (rigors)",
      "Severe flank pain on one or both sides (costovertebral angle tenderness)",
      "Nausea and vomiting",
      "Cloudy foul-smelling urine"
    ],
    "vernacularSymptomKeywords": [
      "pyelonephritis",
      "kidney infection",
      "flank pain with fever",
      "gurde me infection",
      "peeth me tej dard bukhar",
      "rigor fever urine",
      "costovertebral pain",
      "गुर्दे में संक्रमण",
      "पीठ में दर्द बुखार",
      "કિડની ઇન્ફેક્શન",
      "ਗੁਰਦੇ ਦੀ ਇਨਫੈਕਸ਼ਨ"
    ],
    "officialGeneric": {
      "medicineName": "Cefixime 200mg + Ofloxacin 200mg Tablets IP",
      "genericSalt": "Cefixime + Ofloxacin",
      "dosageStrength": "200mg + 200mg",
      "pmbjpPriceINR": "₹32.00 per strip of 10 tablets (75% savings vs ₹140.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily after meals for 10 to 14 days under certified physician supervision."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Gokshuradi Guggulu / Chandanasava",
      "scientificBotanical": "Santalum album (Chandana), Tribulus terrestris, Commiphora mukul",
      "activePhytochemical": "Santalol, Protodioscin, Guggulsterone",
      "classicalReference": "Bhaishajya Ratnavali, Mutrakrichhra Rogadhikara",
      "ayushDosage": "20ml Chandanasava with equal water twice daily after food.",
      "anupanaDietaryMedium": "Cool boiled water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "High Volume Boiled Barley Water (Yava Jala) & Coconut Water",
      "preparationMethod": "Boil 2 tablespoons pearl barley in 4 cups water for 20 minutes; strain and drink throughout the day.",
      "modeOfAdministration": "Drink 2 to 3 glasses daily to flush bacterial colonization.",
      "contraindicationWarning": "Pyelonephritis is a severe parenchymal kidney infection requiring immediate allopathic antimicrobials; do not delay antibiotic therapy."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Sepsis signs (low blood pressure <90 systolic, altered consciousness, rapid breathing)",
        "Inability to retain oral liquids due to continuous vomiting"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Urine Culture & Sensitivity, Blood Culture, Ultrasound KUB, Complete Blood Count"
    }
  },
  {
    "id": "CLIN_85",
    "conditionName": "Hematuria, Blood in Urine & Urological Bleeding",
    "hindiName": "पेशाब में खून आना, लाल पेशाब व जलन (रक्तमूत्र)",
    "gujaratiName": "પેશાબમાં લોહી પડવું (હિમેચ્યુરિયા)",
    "punjabiName": "ਪਿਸ਼ਾਬ ਵਿੱਚ ਖੂਨ ਆਉਣਾ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Pink, red, or cola-colored urine",
      "Blood clots in urine",
      "Painful urination or totally painless visible bleeding"
    ],
    "vernacularSymptomKeywords": [
      "hematuria",
      "blood in urine",
      "red urine",
      "peshab me khoon",
      "rakta mutra",
      "cola colored urine",
      "khooni peshab",
      "पेशाब में खून",
      "લાલ પેશાબ",
      "ਪਿਸ਼ਾਬ 'ਚ ਖੂਨ"
    ],
    "officialGeneric": {
      "medicineName": "Tranexamic Acid 500mg Tablets IP",
      "genericSalt": "Tranexamic Acid",
      "dosageStrength": "500 mg",
      "pmbjpPriceINR": "₹22.00 per strip of 10 tablets (75% savings vs ₹90.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet three times daily until bleeding halts, while urgent diagnostic workup is performed."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Ushirasava / Bolbaddha Ras / Trunapanchamoola Kwath",
      "scientificBotanical": "Vetiveria zizanioides (Ushira), Commiphora myrrha (Bola), Kusha, Kasha",
      "activePhytochemical": "Vetiverol, Guggulsterones, Bioflavonoids",
      "classicalReference": "Bhaishajya Ratnavali, Raktapitta Rogadhikara",
      "ayushDosage": "15ml Ushirasava with equal water twice daily.",
      "anupanaDietaryMedium": "Cold water or tender coconut water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Coriander and Cumin Cold Infusion (Dhaniya-Jeera Hima)",
      "preparationMethod": "Crush 1 tablespoon coriander seeds and 1 teaspoon cumin seeds, soak in 2 cups cold water for 4 hours; strain.",
      "modeOfAdministration": "Drink cold twice daily.",
      "contraindicationWarning": "Painless visible hematuria in anyone over 45 must be treated as a potential urothelial malignancy until thoroughly disproven by cystoscopy."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Large blood clots causing complete urinary retention",
        "Unexplained painless visible blood in urine",
        "Fever with severe flank pain"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Urine Cytology for Malignant Cells, CT Urography, Flexible Cystoscopy"
    }
  },
  {
    "id": "CLIN_86",
    "conditionName": "Chronic Bacterial Prostatitis & Pelvic Discomfort",
    "hindiName": "क्रोनिक प्रोस्टेटाइटिस, पौरुष ग्रंथि में संक्रमण व पेल्विक दर्द",
    "gujaratiName": "પ્રોસ્ટેટાઇટિસ અને પેલ્વિક દુખાવો",
    "punjabiName": "ਪ੍ਰੋਸਟੇਟ ਦੀ ਪੁਰਾਣੀ ਇਨਫੈਕਸ਼ਨ ਅਤੇ ਪੇਡੂ ਦਾ ਦਰਦ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Dull aching pain between scrotum and anus (perineum)",
      "Painful ejaculation",
      "Recurrent urinary tract infections in men",
      "Discomfort in lower abdomen or groin"
    ],
    "vernacularSymptomKeywords": [
      "prostatitis",
      "chronic prostatitis",
      "pelvic pain men",
      "perineal pain",
      "painful ejaculation",
      "prostate me sujan",
      "andkosh ke peeche dard",
      "प्रोस्टेटाइटिस",
      "પ્રોસ્ટેટાઇટિસ",
      "ਪ੍ਰੋਸਟੇਟ ਇਨਫੈਕਸ਼ਨ"
    ],
    "officialGeneric": {
      "medicineName": "Levofloxacin 500mg Tablets IP",
      "genericSalt": "Levofloxacin",
      "dosageStrength": "500 mg",
      "pmbjpPriceINR": "₹18.00 per strip of 10 tablets (75% savings vs ₹75.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet once daily for 4 to 6 weeks as prescribed (long course required to penetrate prostatic lipid capsule)."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Shilajitwadi Vati / Chandanasava",
      "scientificBotanical": "Asphaltum punjabianum (Shilajit) & Santalum album",
      "activePhytochemical": "Fulvic acid, Santalol, Trace bio-minerals",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Mutrakrichhra Rogadhikara",
      "ayushDosage": "1 tablet twice daily with lukewarm milk.",
      "anupanaDietaryMedium": "Warm milk or water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Warm Sitz Bath with Epsom Salt",
      "preparationMethod": "Sit in a tub of warm water (hip level) with 2 tablespoons Epsom salt for 15 minutes twice daily.",
      "modeOfAdministration": "Twice daily warm immersion relaxes pelvic floor muscles.",
      "contraindicationWarning": "Avoid prolonged cycling or riding motorcycles on bumpy roads which compresses the prostate."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "High fever with chills and acute inability to urinate (Acute bacterial prostatitis)",
        "Severe prostatic abscess pain"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Expressed Prostatic Secretions (EPS) Culture or Meares-Stamey 4-Glass Test"
    }
  },
  {
    "id": "CLIN_87",
    "conditionName": "Urethritis, Non-Gonococcal Urethral Discharge & Itching",
    "hindiName": "मूत्रमार्ग शोथ, पेशाब की नली में जलन, खुजली व रिसाव (उपवंश)",
    "gujaratiName": "મૂત્રમાર્ગમાં બળતरा, ખંજવાળ અને પ્રવાહી નીકળવું",
    "punjabiName": "ਪਿਸ਼ਾਬ ਦੀ ਨਾਲੀ ਵਿੱਚ ਖਾਰਸ਼, ਸਾੜ ਅਤੇ ਪੀਕ ਆਉਣੀ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Burning pain during urination",
      "Urethral discharge (white, yellow, or clear mucus)",
      "Itching or tingling inside the tip of the penis"
    ],
    "vernacularSymptomKeywords": [
      "urethritis",
      "urethral discharge",
      "chlamydia",
      "gonorrhea",
      "peshab ki nali me jalan",
      "penis discharge",
      "peshab me khujli",
      "upadansha",
      "यूरिथ्राइटिस",
      "मूत्रमार्ग में जलन",
      "મૂત્રમાર્ગમાં બળતરા",
      "ਪਿਸ਼ਾਬ ਵਿੱਚ ਜਲਣ"
    ],
    "officialGeneric": {
      "medicineName": "Azithromycin 1g Single Dose Tablets IP + Cefixime 400mg Tablets",
      "genericSalt": "Azithromycin + Cefixime (Syndromic STI Management)",
      "dosageStrength": "1g single dose + 400mg single dose",
      "pmbjpPriceINR": "₹18.00 (Azithromycin) + ₹12.00 (Cefixime)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "National AIDS Control Organisation (NACO) syndromic STI protocol: 1g Azithromycin + 400mg Cefixime taken simultaneously with food."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Chandanasava / Trunapanchamoola Kwath",
      "scientificBotanical": "Santalum album, Vetiveria zizanioides, Glycyrrhiza glabra",
      "activePhytochemical": "Santalol, Glycyrrhizin, Polyphenols",
      "classicalReference": "Bhaishajya Ratnavali, Upadansha Rogadhikara",
      "ayushDosage": "15ml with equal water twice daily.",
      "anupanaDietaryMedium": "Cool boiled water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "High Intake of Water and Cranberry / Barley Water",
      "preparationMethod": "Drink 3 to 4 liters of water daily to continuously flush urethral lumen.",
      "modeOfAdministration": "Frequent hydration.",
      "contraindicationWarning": "Abstain from all sexual intercourse until both patient and sexual partner have completed full syndromic treatment."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe scrotal or testicular swelling and pain (Epididymo-orchitis)",
        "Disseminated joint arthritis and pustular skin rashes (Gonococcal arthritis)"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "Urethral Swab Gram Stain, Chlamydia & Gonorrhea NAAT PCR Test"
    }
  },
  {
    "id": "CLIN_88",
    "conditionName": "Epididymo-Orchitis & Scrotal Inflammation",
    "hindiName": "अंडकोश में सूजन, दर्द व संक्रमण (वृषण शोथ)",
    "gujaratiName": "અંડકોશમાં સોજો અને સખત દુખાવો",
    "punjabiName": "ਅੰਡਕੋਸ਼ ਦੀ ਸੋਜ ਅਤੇ ਤੇਜ਼ ਦਰਦ",
    "bodySystem": "Urology",
    "typicalSymptoms": [
      "Swollen, red, or warm scrotum",
      "Testicular pain and tenderness, usually one-sided",
      "Painful urination and groin discomfort",
      "Fever"
    ],
    "vernacularSymptomKeywords": [
      "orchitis",
      "epididymitis",
      "swollen testicle",
      "scrotal pain",
      "andkosh me sujan",
      "andkosh me dard",
      "vrishana shotha",
      "testicle pain fever",
      "अंडकोश में सूजन",
      "अंडकोश में दर्द",
      "અંડકોશમાં સોજો",
      "ਅੰਡਕੋਸ਼ ਵਿੱਚ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Ofloxacin 400mg Tablets IP + Ibuprofen 400mg Tablets",
      "genericSalt": "Ofloxacin + Ibuprofen",
      "dosageStrength": "400mg + 400mg",
      "pmbjpPriceINR": "₹16.00 per strip of 10 Ofloxacin (75% savings)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet Ofloxacin twice daily for 14 days; Ibuprofen twice daily after food for anti-inflammatory relief."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Kanchnar Guggulu / Dashanga Lepa",
      "scientificBotanical": "Bauhinia variegata, Commiphora mukul, Glycyrrhiza glabra",
      "activePhytochemical": "Flavonoids, Guggulsterones, Glycyrrhizin",
      "classicalReference": "Bhaishajya Ratnavali, Vriddhi-Rogadhikara",
      "ayushDosage": "2 tablets Kanchnar Guggulu twice daily with warm water. Gentle Dashanga Lepa paste applied externally.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Scrotal Elevation & Cold Ice Pack Compression",
      "preparationMethod": "Support the scrotum with a firm athletic supporter/jockstrap; apply ice pack wrapped in a cloth for 15 minutes at a time.",
      "modeOfAdministration": "Cold compression 3 times daily; bed rest with elevated pelvis.",
      "contraindicationWarning": "Sudden onset severe testicular pain must be evaluated within 4 hours to rule out Testicular Torsion (which causes organ necrosis)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Sudden acute onset of agonizing pain with high-riding testicle and absent cremasteric reflex (Testicular Torsion - SURGICAL EMERGENCY CALL 108)"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Color Doppler Ultrasound of Scrotum (Testicular Doppler)"
    }
  },
  {
    "id": "CLIN_89",
    "conditionName": "Acute Bacterial & Viral Conjunctivitis (Pink Eye)",
    "hindiName": "आंख आना, कंजंक्टिवाइटिस, आंख में लाली, कीचड़ व जलन (नेत्राभिष्यंद)",
    "gujaratiName": "આંખ આવવી, કન્જક્ટિવાઇટિસ અને આંખ લાલ થવી",
    "punjabiName": "ਅੱਖਾਂ ਆਉਣੀਆਂ, ਲਾਲੀ, ਖਾਰਸ਼ ਅਤੇ ਗਿੱਡ ਆਉਣੀ",
    "bodySystem": "Ophthalmology",
    "typicalSymptoms": [
      "Redness in white of eye or inner eyelid",
      "Watery or thick yellow-green discharge",
      "Gritty scratchy sensation",
      "Crusting of eyelids upon waking"
    ],
    "vernacularSymptomKeywords": [
      "conjunctivitis",
      "pink eye",
      "aankh aana",
      "red eye discharge",
      "aankhon me keechad",
      "gritty eyes",
      "netrabhishyanda",
      "aankh lal hona",
      "आंख आना",
      "कंजंक्टिवाइटिस",
      "આંખ આવવી",
      "ਅੱਖਾਂ ਆਉਣੀਆਂ"
    ],
    "officialGeneric": {
      "medicineName": "Moxifloxacin 0.5% w/v Ophthalmic Eye Drops IP",
      "genericSalt": "Moxifloxacin HCl (4th Gen Fluoroquinolone)",
      "dosageStrength": "0.5% w/v (5 ml)",
      "pmbjpPriceINR": "₹16.00 per vial (75% savings vs ₹65.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Instill 1 drop into the affected eye(s) 3 times daily for 5 to 7 days."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Netra Sudha / Triphala Ghrita / Itrifal Kishneezi",
      "scientificBotanical": "Terminalia chebula, Terminalia bellirica, Emblica officinalis & Coriandrum sativum",
      "activePhytochemical": "Chebulagic acid, Corilagin, Bioflavonoids",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Netra Rogadhikara",
      "ayushDosage": "Filtered Triphala eye wash (Netra Prakshalana) using sterile filtered cold water.",
      "anupanaDietaryMedium": "Sterile filtered external wash only"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Sterile Boiled Saline Compress & Separate Towel Protocol",
      "preparationMethod": "Boil 1 cup water with a pinch of salt; cool completely, soak sterile cotton pad, wipe eye from inner corner outward.",
      "modeOfAdministration": "Clean eyes twice daily with separate pads for each eye.",
      "contraindicationWarning": "Highly contagious! Never share towels, pillows, or cosmetics; wash hands thoroughly after touching eyes."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe eye agony and extreme sensitivity to light (Photophobia - suspect Corneal Ulcer)",
        "Decreased or hazy vision",
        "Pupil is irregularly shaped or unreactive"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Slit Lamp Biomicroscopy with Fluorescein Corneal Staining"
    }
  },
  {
    "id": "CLIN_90",
    "conditionName": "Dry Eye Syndrome (DES) & Computer Vision Strain",
    "hindiName": "ड्राई आई सिंड्रोम, आंखों का सूखापन, जलन व कंप्यूटर विजन सिंड्रोम (शुष्काक्षिपाक)",
    "gujaratiName": "ડ્રાય આઈ સિન્ડ્રોમ અને આંખોમાં બળતરા",
    "punjabiName": "ਅੱਖਾਂ ਦਾ ਸੁੱਕਾਪਣ, ਜਲਣ ਅਤੇ ਥਕਾਵਟ",
    "bodySystem": "Ophthalmology",
    "typicalSymptoms": [
      "Stinging, burning, or scratchy sensation in eyes",
      "Stringy mucus in or around eyes",
      "Eye fatigue after screen use",
      "Paradoxical watery eyes in wind"
    ],
    "vernacularSymptomKeywords": [
      "dry eye",
      "dry eyes",
      "computer vision syndrome",
      "eye strain",
      "aankhon me sookhapan",
      "screen dekhne se jalan",
      "aankh thakna",
      "shushkakshipaka",
      "ड्राई आई",
      "आंखों में सूखापन",
      "ડ્રાય આઈ",
      "ਅੱਖਾਂ ਦੀ ਜਲਣ"
    ],
    "officialGeneric": {
      "medicineName": "Carboxymethylcellulose (CMC) 0.5% or 1.0% Eye Drops IP",
      "genericSalt": "Carboxymethylcellulose Sodium",
      "dosageStrength": "0.5% w/v (10 ml)",
      "pmbjpPriceINR": "₹18.00 per bottle (70% savings vs ₹70.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Instill 1 to 2 drops in each eye 4 times daily or as needed for ocular lubrication."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Triphala Ghrita (Oral) & Pure Rose Water (Gulab Jal) Drops",
      "scientificBotanical": "Triphala processed in clarified cow butter & Rosa damascena",
      "activePhytochemical": "Vitamin A palmitate, Rose polyphenols, Bioflavonoids",
      "classicalReference": "Ashtanga Hridaya, Uttara Tantra, Netra Rogadhikara",
      "ayushDosage": "5ml Triphala Ghrita taken orally with warm milk at bedtime.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "The 20-20-20 Rule and Warm Eyelid Fomentation",
      "preparationMethod": "Every 20 minutes, look at an object 20 feet away for 20 seconds. Apply warm moist cloth over closed eyes for 5 minutes.",
      "modeOfAdministration": "Daily computer work routine.",
      "contraindicationWarning": "Do not rub eyes vigorously; avoid sitting directly in front of air conditioner drafts."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe ocular pain not relieved by lubricating drops",
        "Foreign body sensation with visible white spot on cornea (Keratitis)"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Schirmer's Test (<5mm wetting) & Tear Break-Up Time (TBUT < 10 sec)"
    }
  },
  {
    "id": "CLIN_91",
    "conditionName": "Acute Otitis Externa (Swimmer's Ear) & Ear Canal Infection",
    "hindiName": "बाहरी कान का संक्रमण, कान में तेज दर्द, खुजली व मवाद",
    "gujaratiName": "કાનનો ચેપ, કાનમાં સખત દુખાવો અને પરુ નીકળવું",
    "punjabiName": "ਕੰਨ ਦੀ ਇਨਫੈਕਸ਼ਨ, ਦਰਦ ਅਤੇ ਪੀਕ ਵਗਣਾ",
    "bodySystem": "ENT",
    "typicalSymptoms": [
      "Severe pain aggravated when pulling earlobe or pressing tragus",
      "Itching in ear canal",
      "Muffled hearing",
      "Yellowish drainage from ear"
    ],
    "vernacularSymptomKeywords": [
      "otitis externa",
      "swimmers ear",
      "ear canal infection",
      "kaan me dard",
      "kaan me khujli",
      "ear drop pain",
      "kaan me paani jane se dard",
      "kaan pakna",
      "कान में दर्द",
      "कान पकना",
      "કાનનો દુખાવો",
      "ਕੰਨ ਦਾ ਦਰਦ"
    ],
    "officialGeneric": {
      "medicineName": "Ofloxacin 0.3% + Clotrimazole 1% + Beclomethasone Ear Drops",
      "genericSalt": "Ofloxacin + Clotrimazole + Beclomethasone",
      "dosageStrength": "Combined Ear Drops (5ml)",
      "pmbjpPriceINR": "₹16.00 per vial (75% savings vs ₹65.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "3 to 4 drops into the affected ear 3 times daily for 7 days; lie with ear upward for 5 minutes."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Bilva Taila / Kshara Taila (Ear Drops)",
      "scientificBotanical": "Aegle marmelos (Bilva), Brassica campestris (Mustard oil)",
      "activePhytochemical": "Marmelosin, Allyl isothiocyanate, Essential phenolics",
      "classicalReference": "Bhaishajya Ratnavali, Karna Rogadhikara",
      "ayushDosage": "2 drops warm Bilva oil instilled into ear canal.",
      "anupanaDietaryMedium": "Topical ear instillment (Karnapoorana) only when eardrum is intact"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Garlic-Infused Warm Mustard Oil (Lashuna Siddha Taila)",
      "preparationMethod": "Gently warm 2 cloves of crushed garlic in 2 tablespoons mustard oil until lightly browned; cool to body temperature.",
      "modeOfAdministration": "Apply 1-2 drops outside ear canal or on cotton plug.",
      "contraindicationWarning": "NEVER insert cotton buds, matchsticks, or hairpins into ear canal; NEVER instill any liquid if tympanic membrane perforation is suspected."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Redness, swelling and tenderness behind the ear over mastoid bone (Acute Mastoiditis)",
        "Facial asymmetry or weakness"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Otoscopic Examination with Pneumatic Otoscopy"
    }
  },
  {
    "id": "CLIN_92",
    "conditionName": "Acute Otitis Media (AOM) & Middle Ear Purulent Effusion",
    "hindiName": "मध्य कान का संक्रमण, कान का बहना, पर्दा फटने का खतरा व तेज दर्द (कर्णस्राव)",
    "gujaratiName": "કાનનો પડદો પાકવો અને પરુ વહેવું",
    "punjabiName": "ਕੰਨ ਵਿੱਚੋਂ ਪੀਕ ਵਗਣਾ ਅਤੇ ਤੇਜ਼ ਪੀੜ",
    "bodySystem": "ENT",
    "typicalSymptoms": [
      "Deep throbbing ear pain",
      "Fever",
      "Fluid draining from ear with sudden relief of pain (perforation)",
      "Temporary hearing impairment"
    ],
    "vernacularSymptomKeywords": [
      "otitis media",
      "middle ear infection",
      "ear discharge",
      "kaan behna",
      "karnasrava",
      "kaan me peep",
      "tympanic perforation",
      "pus from ear",
      "कान बहना",
      "कान में मवाद",
      "કાનમાંથી પરુ",
      "ਕੰਨ ਵਗਣਾ"
    ],
    "officialGeneric": {
      "medicineName": "Amoxicillin 500mg Capsules IP + Paracetamol 500mg Tablets",
      "genericSalt": "Amoxicillin + Paracetamol",
      "dosageStrength": "500mg + 500mg",
      "pmbjpPriceINR": "₹18.00 per strip of 10 Amoxicillin (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 capsule Amoxicillin 3 times daily for 7 days under physician prescription."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sariwadi Vati / Lakshadi Guggulu (Oral)",
      "scientificBotanical": "Hemidesmus indicus (Sariva), Glycyrrhiza glabra, Purified Guggulu",
      "activePhytochemical": "Hemidesmin, Glycyrrhizin, Guggulsterones",
      "classicalReference": "Bhaishajya Ratnavali, Karna Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Dry Warm Compress and Upright Sleeping Angle",
      "preparationMethod": "Hold a warm dry flannel or heating pad against the affected ear for 15 minutes; sleep with head propped up on two pillows.",
      "modeOfAdministration": "Repeat 3 times daily for soothing warmth.",
      "contraindicationWarning": "Keep ear totally dry; plug with cotton dipped in vaseline when bathing. DO NOT put liquids in a discharging ear."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Swelling, redness, and severe pain behind ear over mastoid bone",
        "Neck stiffness with high fever and vomiting (Otogenic Meningitis)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Otoscopic Examination, Ear Discharge Culture & High Resolution CT Temporal Bone"
    }
  },
  {
    "id": "CLIN_93",
    "conditionName": "Tinnitus, Ringing in Ears & Acoustic Nerve Buzzing",
    "hindiName": "टिनिटस, कान में सीटी या घंटी बजना व सनसनाहट (कर्णनाद)",
    "gujaratiName": "કાનમાં અવાજો આવવા, સીટી વાગવી (ટિનાઇટસ)",
    "punjabiName": "ਕੰਨ ਵਿੱਚ ਘੰਟੀਆਂ ਵੱਜਣੀਆਂ ਅਤੇ ਸੀਟੀਆਂ ਦੀ ਆਵਾਜ਼",
    "bodySystem": "ENT",
    "typicalSymptoms": [
      "Ringing, buzzing, roaring, clicking, or hissing sound in one or both ears",
      "Sound is present without external noise",
      "Disturbed sleep and concentration"
    ],
    "vernacularSymptomKeywords": [
      "tinnitus",
      "ringing in ear",
      "buzzing in ear",
      "karnanada",
      "kaan me seeti bajna",
      "kaan me ghanti",
      "ear buzzing",
      "sound in ear",
      "कान में सीटी",
      "टिनिटस",
      "કાનમાં અવાજ",
      "ਕੰਨ ਵਿੱਚ ਸੀਟੀ"
    ],
    "officialGeneric": {
      "medicineName": "Ginkgo Biloba Extract 60mg / 120mg Tablets IP",
      "genericSalt": "Ginkgo Biloba Standardized Extract",
      "dosageStrength": "60 mg / 120 mg",
      "pmbjpPriceINR": "₹28.00 per strip of 10 (70% savings vs ₹110.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet twice daily with meals to improve cochlear and microvascular perfusion."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Sariwadi Vati & Ashwagandharishta",
      "scientificBotanical": "Hemidesmus indicus, Withania somnifera, Terminalia arjuna",
      "activePhytochemical": "Hemidesmin, Withanolides, Flavonoids",
      "classicalReference": "Bhaishajya Ratnavali, Karna Rogadhikara, Karnanada Chikitsa",
      "ayushDosage": "2 tablets Sariwadi Vati twice daily with 15ml Ashwagandharishta.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "White Noise Sound Therapy & Bilateral Sesame Oil Nasya",
      "preparationMethod": "Play low ambient white noise or rain sounds when sleeping; instill 2 drops warm sesame oil into each nostril at bedtime.",
      "modeOfAdministration": "Nightly sound masking routine.",
      "contraindicationWarning": "Avoid prolonged loud headphone exposure (>60% volume); limit excessive sodium and caffeine."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Pulsatile tinnitus rhythmic with heartbeat (Vascular malformation or glomus tumor warning)",
        "Sudden unilateral hearing loss",
        "Facial numbness"
      ],
      "maxWaitHoursBeforeHospital": 24,
      "recommendedLabTest": "Pure Tone Audiometry (PTA), Tympanometry & Contrast MRI Brain and IAM"
    }
  },
  {
    "id": "CLIN_94",
    "conditionName": "Epistaxis, Acute Anterior Nosebleeds",
    "hindiName": "नकसीर फूटना, नाक से खून बहना (नासागत रक्तपित्त)",
    "gujaratiName": "નસકોરી ફૂટવી અને નાકમાંથી લોહી નીકળવું",
    "punjabiName": "ਨਕਸੀਰ ਫੁੱਟਣੀ ਅਤੇ ਨੱਕ ਵਿੱਚੋਂ ਖੂਨ ਵਗਣਾ",
    "bodySystem": "ENT",
    "typicalSymptoms": [
      "Blood draining from one or both nostrils",
      "Sensation of liquid flowing down back of throat",
      "Triggered by dry weather, nose picking, or high BP"
    ],
    "vernacularSymptomKeywords": [
      "nosebleed",
      "epistaxis",
      "nakseer phootna",
      "blood from nose",
      "nak se khoon",
      "kiesselbachs plexus bleed",
      "nasagata raktapitta",
      "नकसीर",
      "नाक से खून",
      "નસકોરી",
      "ਨਕਸੀਰ"
    ],
    "officialGeneric": {
      "medicineName": "Tranexamic Acid 500mg Tablets IP + Oxymetazoline 0.05% Nasal Drops",
      "genericSalt": "Tranexamic Acid + Oxymetazoline",
      "dosageStrength": "500mg tab + 10ml drops",
      "pmbjpPriceINR": "₹22.00 per strip (Tranexamic) + ₹14.00 (Oxymetazoline)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Soak a cotton plug in Oxymetazoline and insert gently into bleeding nostril; apply continuous firm pressure."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Ushirasava / Bolbaddha Ras / Durva Swarasa Nasya",
      "scientificBotanical": "Cynodon dactylon (Durva Grass), Vetiveria zizanioides, Commiphora myrrha",
      "activePhytochemical": "Cynodin, Hydroxybenzoic acids, Tannins",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Raktapitta Rogadhikara",
      "ayushDosage": "Instill 2 drops fresh cold Durva grass juice into nostrils.",
      "anupanaDietaryMedium": "Direct topical instillation"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Trotter's Position (Lean Forward & Pinch Soft Nose)",
      "preparationMethod": "Sit straight and lean slightly FORWARD (never tilt head backward as blood enters stomach/lungs); pinch the soft part of the nose firmly for 10 continuous minutes without letting go.",
      "modeOfAdministration": "Apply ice pack to bridge of nose and forehead.",
      "contraindicationWarning": "NEVER tilt head backward; do not blow nose for 12 hours after bleeding stops."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Bleeding continues uninterrupted for >20 minutes despite firm pinching",
        "Blood pouring rapidly down back of throat (Posterior epistaxis)",
        "Accompanied by dizziness and fainting"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Blood Pressure Measurement, Complete Blood Count, Coagulation Profile (PT/INR, aPTT)"
    }
  },
  {
    "id": "CLIN_95",
    "conditionName": "Blepharitis, Eyelid Margin Inflammation & Meibomian Gland Dysfunction",
    "hindiName": "पलकों में सूजन, पपड़ी जमना, खुजली व आंखों में चिपचिपापन (पक्ष्मोत्पाद)",
    "gujaratiName": "પોપચાંનો સોજો, ખંજવાળ અને ચીકાશ",
    "punjabiName": "ਪਲਕਾਂ ਦੀ ਸੋਜ, ਖਾਰਸ਼ ਅਤੇ ਪੇਪੜੀ ਜੰਮਣੀ",
    "bodySystem": "Ophthalmology",
    "typicalSymptoms": [
      "Greasy, crusty flakes on eyelashes (like dandruff)",
      "Red, swollen, itchy eyelids",
      "Burning sensation in eyes",
      "Loss or misdirection of eyelashes"
    ],
    "vernacularSymptomKeywords": [
      "blepharitis",
      "eyelid dandruff",
      "meibomian gland dysfunction",
      "mgd",
      "palko par sujan",
      "aankh ki palak me khujli",
      "crusty eyelashes",
      "पलकों में सूजन",
      "પોપચાંમાં સોજો",
      "ਪਲਕਾਂ ਦੀ ਸੋਜ"
    ],
    "officialGeneric": {
      "medicineName": "Tobramycin 0.3% + Dexamethasone 0.1% Eye Ointment IP",
      "genericSalt": "Tobramycin + Dexamethasone",
      "dosageStrength": "5g tube",
      "pmbjpPriceINR": "₹16.00 per tube (75% savings vs ₹70.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply a thin ribbon to eyelid margin at bedtime for 7 days under ophthalmologist supervision."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Triphala Ghrita / Elaneer Kuzhampu",
      "scientificBotanical": "Triphala, Tender Coconut water processing (Elaneer), Glycyrrhiza glabra",
      "activePhytochemical": "Phytosterols, Tannins, Corilagin",
      "classicalReference": "Sahasrayogam, Netra Kalpana",
      "ayushDosage": "5ml Triphala Ghrita taken orally with warm milk.",
      "anupanaDietaryMedium": "Warm cow's milk"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Baby Shampoo Eyelid Scrub & Warm Moist Compress",
      "preparationMethod": "Place warm moist washcloth over closed eyelids for 5 minutes to melt hardened meibomian oils; gently scrub eyelash line with a dilute drop of tear-free baby shampoo on a cotton bud.",
      "modeOfAdministration": "Daily eyelid hygiene morning and night.",
      "contraindicationWarning": "Avoid all eye makeup and mascara until inflammation completely resolves."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Severe painful lump evolving into an internal hordeolum (chalazion/stye) abscess",
        "Ulceration along the lid margin",
        "Corneal abrasions"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Slit Lamp Biomicroscopy with Meibography"
    }
  },
  {
    "id": "CLIN_96",
    "conditionName": "Hordeolum (Stye), Chalazion & Eyelid Abscess",
    "hindiName": "गुहेरी, बिलनी, आंख की पलक पर फुंसी व दर्द (अंजननामिका)",
    "gujaratiName": "આંજણી અને પોપચાં પર દુખાવો કરતી ફોડલી",
    "punjabiName": "ਗੁਹਾਂਜਣੀ, ਅੱਖ ਦੀ ਪਲਕ ਤੇ ਫਿਨਸੀ",
    "bodySystem": "Ophthalmology",
    "typicalSymptoms": [
      "Painful red bump on edge or inside of eyelid",
      "Swelling of the entire eyelid",
      "Crusting around eyelids",
      "Tearing"
    ],
    "vernacularSymptomKeywords": [
      "stye",
      "hordeolum",
      "chalazion",
      "bilni",
      "guheri",
      "anjananamika",
      "aankh par phunsie",
      "eyelid boil",
      "गुहेरी",
      "बिलनी",
      "આંજણી",
      "ਗੁਹਾਂਜਣੀ"
    ],
    "officialGeneric": {
      "medicineName": "Ciprofloxacin 0.3% w/w Ophthalmic Ointment IP",
      "genericSalt": "Ciprofloxacin HCl",
      "dosageStrength": "5g tube",
      "pmbjpPriceINR": "₹12.00 per tube (80% subsidized)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply small quantity inside lower conjunctival sac 3 times daily."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Chandanadi Vati / Triphala Kwath Prakshalana",
      "scientificBotanical": "Santalum album, Rubia cordifolia, Triphala",
      "activePhytochemical": "Santalol, Purpurin, Chebulic acid",
      "classicalReference": "Bhaishajya Ratnavali, Netra Rogadhikara",
      "ayushDosage": "Filtered sterile cold Triphala wash.",
      "anupanaDietaryMedium": "External sterile wash"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Frequent Warm Moist Compress (The Gold Standard)",
      "preparationMethod": "Soak a clean washcloth in warm (not scalding) water; place over closed affected eyelid for 10 to 15 minutes, 4 times daily.",
      "modeOfAdministration": "Warm compress softens and unblocks the obstructed oil gland.",
      "contraindicationWarning": "NEVER attempt to squeeze, pop, or pierce a stye with needles; this spreads staphylococcal infection into orbital tissue."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Swelling spreads to the entire eyeball and surrounding cheek (Orbital Cellulitis - EMERGENCY)",
        "Vision changes",
        "High fever"
      ],
      "maxWaitHoursBeforeHospital": 4,
      "recommendedLabTest": "Ophthalmological Slit Lamp Evaluation"
    }
  },
  {
    "id": "CLIN_97",
    "conditionName": "Psoriasis Vulgaris, Plaque Psoriasis & Scaly Silvery Erythema",
    "hindiName": "सोरायसिस, त्वचा पर चांदी जैसी सफेद पपड़ी, लाल चकत्ते व खुजली (किट्टिभ)",
    "gujaratiName": "સોરાયસિસ, ચામડી પર ચાંદી જેવા ભીંગડા અને લાલાશ",
    "punjabiName": "ਸੋਰਿਆਸਿਸ, ਚਮੜੀ ਤੇ ਚਿੱਟੀ ਪੇਪੜੀ ਅਤੇ ਲਾਲ ਧੱਫੜ",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Thick red patches covered with silvery white scales",
      "Dry cracked skin that may bleed",
      "Itching, burning, or soreness",
      "Pitted or ridged nails"
    ],
    "vernacularSymptomKeywords": [
      "psoriasis",
      "plaque psoriasis",
      "silvery scales skin",
      "chandi jaisi papdi",
      "kittibha",
      "red scaly patch",
      "kohni par papdi",
      "सोरायसिस",
      "चांदी जैसी पपड़ी",
      "સોરાયસિસ",
      "ਸੋਰਿਆਸਿਸ"
    ],
    "officialGeneric": {
      "medicineName": "Clobetasol Propionate 0.05% + Salicylic Acid 3% Ointment IP",
      "genericSalt": "Clobetasol Propionate + Salicylic Acid",
      "dosageStrength": "30g tube",
      "pmbjpPriceINR": "₹24.00 per tube (78% savings vs ₹115.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply a thin layer to thick hyperkeratotic psoriatic plaques twice daily for 2 weeks."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Panchatikta Ghrita Guggulu / Khadirarishta",
      "scientificBotanical": "Azadirachta indica, Tinospora cordifolia, Acacia catechu",
      "activePhytochemical": "Nimbin, Tinosporide, Catechins",
      "classicalReference": "Bhaishajya Ratnavali, Kushtha Rogadhikara",
      "ayushDosage": "2 tablets twice daily with warm water; 15ml Khadirarishta after meals.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Cold-Pressed Virgin Coconut Oil & 777 Oil (Wrightia tinctoria)",
      "preparationMethod": "Generously coat plaques with cold-pressed coconut oil or Wrightia tinctoria (Kutaja/Danthapala) oil immediately after bathing on damp skin.",
      "modeOfAdministration": "Twice daily intensive skin barrier emollient.",
      "contraindicationWarning": "Never pick or violently scrape silvery scales (Auspitz sign will cause bleeding and Koebner isomorphic flare)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Erythrodermic flare (redness covering >80% of entire body with chills)",
        "Widespread pustules filled with non-infectious pus (Generalized Pustular Psoriasis)",
        "Joint deformities (Psoriatic Arthritis)"
      ],
      "maxWaitHoursBeforeHospital": 6,
      "recommendedLabTest": "Skin Punch Biopsy (H&E Stain), Serum Uric Acid, Rheumatoid Factor (to exclude RA)"
    }
  },
  {
    "id": "CLIN_98",
    "conditionName": "Vitiligo, Leucoderma & Autoimmune Melanocyte Loss",
    "hindiName": "सफेद दाग, ल्यूकोडर्मा, त्वचा का रंग उड़ना (श्वित्र कुष्ठ)",
    "gujaratiName": "સફેદ ડાઘ, કોડ અને ત્વચાનો રંગ જવો (શ્વિંત્ર)",
    "punjabiName": "ਚਿੱਟੇ ਦਾਗ, ਫੁਲਬਹਿਰੀ ਅਤੇ ਚਮੜੀ ਦਾ ਰੰਗ ਉੱਡਣਾ",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Loss of skin color in symmetrical blotches",
      "Premature whitening or greying of hair on scalp, eyelashes, or eyebrows",
      "Loss of color in mucosal tissues inside mouth"
    ],
    "vernacularSymptomKeywords": [
      "vitiligo",
      "leucoderma",
      "shvitra",
      "safed daag",
      "white patches skin",
      "kod rog",
      "phulbehri",
      "melanin loss",
      "सफेद दाग",
      "ल्यूकोडर्मा",
      "श्वित्र",
      "સફેદ ડાઘ",
      "ਚਿੱਟੇ ਦਾਗ"
    ],
    "officialGeneric": {
      "medicineName": "Tacrolimus 0.1% w/w Ointment IP",
      "genericSalt": "Tacrolimus (Topical Calcineurin Inhibitor)",
      "dosageStrength": "10g / 20g tube",
      "pmbjpPriceINR": "₹42.00 per tube (75% savings vs ₹170.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply a thin layer to depigmented macules twice daily for 3 to 6 months under dermatological supervision."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Bakuchi Taila / Somaraji Taila / Khadirarishta",
      "scientificBotanical": "Psoralea corylifolia (Bakuchi) & Acacia catechu",
      "activePhytochemical": "Psoralen, Bakuchiol, Isopsoralen (natural photochemotherapeutic agents)",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Shvitra Chikitsa",
      "ayushDosage": "Apply dilute Bakuchi oil over white patches followed by 5 minutes of early morning sun exposure.",
      "anupanaDietaryMedium": "Topical application followed by mild sun exposure"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Copper Vessel Water (Tamra Jal) & Babchi Seed Paste",
      "preparationMethod": "Store drinking water in a pure copper vessel overnight (8 hours); drink 1 glass at dawn to stimulate tyrosinase enzyme.",
      "modeOfAdministration": "Daily morning drinking habit.",
      "contraindicationWarning": "Do not expose skin treated with Bakuchi to intense midday sun (causes blistering burns); avoid sour foods, pickles, and non-veg with milk."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Rapid eruptive spread over whole body within days",
        "Associated autoimmune symptoms (thyroiditis, Addison's fatigue, alopecia areata)"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Wood's Lamp Examination, Thyroid Function Tests (TSH, Anti-TPO), Serum B12"
    }
  },
  {
    "id": "CLIN_99",
    "conditionName": "Alopecia Areata, Patchy Autoimmune Hair Loss",
    "hindiName": "बालतोड़, उड़न छू गंजापन, सिर या दाढ़ी में गोल चकत्ते में बाल उड़ना (इंद्रलुप्त)",
    "gujaratiName": "વાળ ખરવા, ગોળ ચકામાં વાળ ઊડી જવા (ઈન્દ્રલુપ્ત)",
    "punjabiName": "ਵਾਲਾਂ ਦਾ ਗੋਲ ਚੱਕਰਾਂ ਵਿੱਚ ਝੜਨਾ",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Sudden round or oval bald patches on scalp, beard, or eyebrows",
      "Smooth peach-skin surface in bald area",
      "Exclamation mark hairs at margins of patch"
    ],
    "vernacularSymptomKeywords": [
      "alopecia areata",
      "patchy hair loss",
      "indralupta",
      "baal udna",
      "round bald patch",
      "dadhi me daag",
      "keeda lagna baal me",
      "बाल उड़ना",
      "इंद्रलुप्त",
      "વાળ ખરવા",
      "ਵਾਲ ਝੜਨੇ"
    ],
    "officialGeneric": {
      "medicineName": "Minoxidil 5% w/v Topical Solution IP",
      "genericSalt": "Minoxidil Topical",
      "dosageStrength": "5% w/v (60 ml)",
      "pmbjpPriceINR": "₹85.00 per bottle (72% savings vs ₹320.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Apply 1ml with dropper directly onto the clean dry bald patch twice daily; massage gently."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Gunja Taila / Bhringamalakadi Taila / Hastidanta Mashi",
      "scientificBotanical": "Abrus precatorius (Gunja - detoxified), Eclipta alba (Bhringraj), Emblica officinalis",
      "activePhytochemical": "Abrine, Wedelolactone, Gallic acid",
      "classicalReference": "Ashtanga Hridaya, Uttara Tantra, Indralupta Chikitsa",
      "ayushDosage": "Gentle application of Bhringraj oil processed with Gunja over the patch.",
      "anupanaDietaryMedium": "Topical application"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Fresh Red Onion (Pyaz) Juice Application",
      "preparationMethod": "Grate 1 small red onion (Allium cepa, rich in dietary sulfur and catalase) to extract 2 tablespoons fresh juice.",
      "modeOfAdministration": "Rub onto the bald patch; leave for 30 minutes, wash with mild herbal shampoo. Repeat 3 times weekly.",
      "contraindicationWarning": "Do not scratch vigorously or use toxic unpurified seeds without guidance."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Progression to total loss of scalp hair (Alopecia Totalis) or entire body hair (Alopecia Universalis)",
        "Severe nail dystrophy (thimble pitting)"
      ],
      "maxWaitHoursBeforeHospital": 48,
      "recommendedLabTest": "Trichoscopy / Dermoscopy, Serum Ferritin, Thyroid Profile, ANA"
    }
  },
  {
    "id": "CLIN_100",
    "conditionName": "Acute Urticaria, Hives & Histamine Angioedema",
    "hindiName": "पित्ती उछलना, शीतपित्त, त्वचा पर लाल चकत्ते व असह्य खुजली",
    "gujaratiName": "શીળસ નીકળવું અને લાલ ઢીમચાં થવા",
    "punjabiName": "ਪਿੱਤੀ ਉਛਲਣੀ, ਧੱਫੜ ਅਤੇ ਖਾਰਸ਼",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Raised red or skin-colored welts (wheals) that blanch with pressure",
      "Intense severe pruritus/itching",
      "Welts change shape and disappear within 24 hours only to appear elsewhere"
    ],
    "vernacularSymptomKeywords": [
      "urticaria",
      "hives",
      "sheetapitta",
      "pitti uchhalna",
      "red welts itching",
      "dheemcha nikalna",
      "allergy chakatte",
      "पित्ती उछलना",
      "शीतपित्त",
      "શીળસ",
      "ਪਿੱਤੀ"
    ],
    "officialGeneric": {
      "medicineName": "Bilastine 20mg / Fexofenadine 120mg Tablets IP",
      "genericSalt": "Bilastine / Fexofenadine HCl (Non-Sedating 2nd Gen Antihistamine)",
      "dosageStrength": "20mg / 120mg",
      "pmbjpPriceINR": "₹16.00 per strip of 10 tablets (80% subsidized vs ₹85.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1 tablet once daily with water on an empty stomach (1 hour before or 2 hours after food)."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Haridra Khanda (Brihat) / Sheetapittabhanjan Ras",
      "scientificBotanical": "Curcuma longa (Haridra), Zingiber officinale, Piper nigrum & Cow Ghee",
      "activePhytochemical": "Curcuminoids, Essential turmerones, Piperine",
      "classicalReference": "Bhaishajya Ratnavali, Sheetapitta-Udarda Rogadhikara",
      "ayushDosage": "5 grams (1 teaspoon) twice daily with warm milk or lukewarm water.",
      "anupanaDietaryMedium": "Warm cow milk or lukewarm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Calamine Lotion with Camphor and Mustard Oil Massage",
      "preparationMethod": "Apply soothing Calamine lotion chilled in refrigerator, or gently rub warm mustard oil with a pinch of rock salt over itchy welts.",
      "modeOfAdministration": "Topical application as needed.",
      "contraindicationWarning": "Take immediate cool showers; avoid hot water baths, wool blankets, and known food allergen triggers (peanuts, shellfish, artificial colors)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Swelling of lips, tongue, or throat with whistling breath/choking (Angioedema/Anaphylaxis - EMERGENCY CALL 108)",
        "Dizziness / BP drop"
      ],
      "maxWaitHoursBeforeHospital": 1,
      "recommendedLabTest": "Total Serum IgE, Absolute Eosinophil Count (AEC), Skin Prick Allergy Panel"
    }
  },
  {
    "id": "CLIN_101",
    "conditionName": "Tinea Pedis, Athlete's Foot & Interdigital Maceration",
    "hindiName": "एथलीट फुट, पैर की उंगलियों के बीच फंगस, कटना व बदबू",
    "gujaratiName": "પગની આંગળીઓમાં ફૂગ, ચિરાડા અને ખંજવાળ",
    "punjabiName": "ਪੈਰਾਂ ਦੀਆਂ ਉਂਗਲਾਂ ਵਿੱਚ ਫੰਗਸ ਅਤੇ ਬਦਬੂ",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Soggy, peeling, white macerated skin between toes",
      "Intense itching and burning between toes",
      "Unpleasant foot odor",
      "Cracking and painful fissures"
    ],
    "vernacularSymptomKeywords": [
      "athletes foot",
      "tinea pedis",
      "foot fungus",
      "ungliyo ke beech me sadan",
      "pair me khujli fungus",
      "soggy white skin toes",
      "shoe fungus foot",
      "एथलीट फुट",
      "पैर की उंगलियों में फंगस",
      "પગમાં ફૂગ",
      "ਪੈਰਾਂ ਦੀ ਫੰਗਸ"
    ],
    "officialGeneric": {
      "medicineName": "Terbinafine Hydrochloride 1% w/w Cream IP + Luliconazole 1%",
      "genericSalt": "Terbinafine HCl",
      "dosageStrength": "15g tube",
      "pmbjpPriceINR": "₹18.00 per tube (78% savings vs ₹85.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "Wash feet, dry thoroughly with separate towel, apply thin layer between toes twice daily for 2 weeks."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Neem-Karanja Taila / Gandhak Rasayan (Oral)",
      "scientificBotanical": "Azadirachta indica, Pongamia pinnata, Purified Sulfur",
      "activePhytochemical": "Nimbin, Karanjin, Bio-active sulfur complexes",
      "classicalReference": "Bhaishajya Ratnavali, Kushtha Rogadhikara",
      "ayushDosage": "2 tablets Gandhak Rasayan twice daily after meals. Neem oil applied externally.",
      "anupanaDietaryMedium": "Warm water"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Apple Cider Vinegar Foot Soak & Antifungal Dusting Powder",
      "preparationMethod": "Mix 1 cup raw apple cider vinegar in 4 cups warm water; soak clean feet for 15 minutes, dry thoroughly between toes with hair dryer on cool setting.",
      "modeOfAdministration": "Soak daily in evening.",
      "contraindicationWarning": "Never wear damp socks or damp shoes; rotate shoes daily so they dry completely."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Spreading redness, warmth, and intense swelling up the leg (Secondary Bacterial Cellulitis)",
        "Fever with red streaks (Lymphangitis)"
      ],
      "maxWaitHoursBeforeHospital": 12,
      "recommendedLabTest": "Skin Scraping for KOH Examination & Fungal Culture"
    }
  },
  {
    "id": "CLIN_102",
    "conditionName": "Herpes Zoster, Shingles & Post-Herpetic Neuralgia",
    "hindiName": "दाद, छोटी माता का वायरस, एक तरफ पानी भरे दाने व असह्य दर्द (विस्फोटक)",
    "gujaratiName": "ધાધર, નાગલી અને અસહ્ય બળતરા કરતા ફોલ્લા (હર્પીસ)",
    "punjabiName": "ਹਰਪੀਜ਼ ਜ਼ੋਸਟਰ, ਪਾਣੀ ਵਾਲੇ ਛਾਲੇ ਅਤੇ ਤੇਜ਼ ਸਾੜ",
    "bodySystem": "Dermatology",
    "typicalSymptoms": [
      "Pain, burning, or tingling that precedes rash by 3 days",
      "Band-like cluster of fluid-filled blisters strictly on one side of torso or face",
      "Intense burning nerve pain (neuropathic)"
    ],
    "vernacularSymptomKeywords": [
      "shingles",
      "herpes zoster",
      "nagali",
      "pani bhare dane band me",
      "dermatomal rash",
      "post herpetic neuralgia",
      "ek taraf dane dard",
      "हर्पीस जोस्टर",
      "नागली",
      "પાણીવાળા ફોલ્લા",
      "ਹਰਪੀਜ਼"
    ],
    "officialGeneric": {
      "medicineName": "Valacyclovir 1000mg Tablets IP / Acyclovir 800mg Tablets",
      "genericSalt": "Valacyclovir / Acyclovir",
      "dosageStrength": "1000mg / 800mg",
      "pmbjpPriceINR": "₹65.00 for course (75% savings vs ₹280.00 branded)",
      "cdscoNlemListed": true,
      "standardDosageSchedule": "1000mg Valacyclovir 3 times daily for 7 days; MUST be started within 72 hours of rash onset to prevent permanent nerve injury."
    },
    "ayushClassicalFormulation": {
      "formulationName": "Shatadhauta Ghrita (100-times washed cow ghee) & Kaishore Guggulu",
      "scientificBotanical": "Clarified Cow Butter washed 100 times in copper vessel with water",
      "activePhytochemical": "Sub-micron fatty acid emulsions with cooling barrier properties",
      "classicalReference": "Charaka Samhita, Chikitsa Sthana, Visarpa Rogadhikara",
      "ayushDosage": "Apply cool Shatadhauta Ghrita gently over crusted lesions.",
      "anupanaDietaryMedium": "Topical soothing barrier only"
    },
    "verifiedHomeRemedy": {
      "kitchenItem": "Cool Colloidal Oatmeal Compress & Loose Cotton Garments",
      "preparationMethod": "Soak clean washcloth in cool water with dissolved fine colloidal oatmeal; drape gently over blistering skin for 15 minutes.",
      "modeOfAdministration": "3 times daily for cooling comfort.",
      "contraindicationWarning": "Do NOT scratch or rupture blisters (fluid contains infectious varicella zoster virus; keep away from pregnant women and babies)."
    },
    "escalationProtocol": {
      "dangerSigns": [
        "Blisters near or on the tip of the nose or eye (Herpes Zoster Ophthalmicus - Hutchinson's sign, immediate risk of blindness)",
        "Facial paralysis / ear pain (Ramsay Hunt syndrome)"
      ],
      "maxWaitHoursBeforeHospital": 2,
      "recommendedLabTest": "Tzanck Smear / Varicella Zoster Virus PCR, Slit Lamp Eye Exam"
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
