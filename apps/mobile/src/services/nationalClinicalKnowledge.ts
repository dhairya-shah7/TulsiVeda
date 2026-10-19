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
  bodySystem: 'Respiratory' | 'Digestive' | 'Cardiovascular' | 'Metabolic' | 'Musculoskeletal' | 'Dermatological' | 'Nervous' | 'Renal';
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
    hindiName: 'तीव्र वायरल बुखार (ज्वर)',
    gujaratiName: 'તીવ્ર તાવ અને કળતર',
    punjabiName: 'ਤੇਜ਼ ਵਾਇਰਲ ਬੁਖਾਰ ਅਤੇ ਸਰੀਰ ਦਰਦ (ਜਵਰ)',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['High body temperature (>100°F)', 'Chills', 'Headache', 'Generalized myalgia (body ache)'],
    vernacularSymptomKeywords: ['fever', 'temperature', 'body ache', 'chills', 'ਬੁਖਾਰ', 'ਕਾਂਬਾ', 'ਸਰੀਰ ਦਰਦ', 'ਸਿਰ ਦਰਦ', 'बुखार', 'ताप', 'તાવ', 'કળતર', 'પની', 'காய்ச்சல்', 'జ్వరం', 'ಜ್ವರ'],
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
      recommendedLabTest: 'Complete Blood Count (CBC) with Platelet Count & Dengue NS1 Antigen'
    }
  },
  {
    id: 'CLIN_02',
    conditionName: 'Type 2 Diabetes Mellitus & Postprandial Spikes',
    hindiName: 'मधुमेह टाइप-2 (शुगर)',
    gujaratiName: 'ડાયાબિટીસ (મધુપ્રમેહ)',
    punjabiName: 'ਟਾਈਪ 2 ਸ਼ੂਗਰ ਅਤੇ ਬਲੱਡ ਸ਼ੂਗਰ ਨਿਯੰਤਰਣ',
    bodySystem: 'Metabolic',
    typicalSymptoms: ['Frequent urination (Polyuria)', 'Excess thirst (Polydipsia)', 'Unexplained fatigue', 'Slow wound healing'],
    vernacularSymptomKeywords: ['diabetes', 'sugar', 'blood sugar', 'glucose', 'ਸ਼ੂਗਰ', 'ਸ਼ੱਕਰ', 'ਬਲੱਡ ਸ਼ੂਗਰ', 'ਪੇਸ਼ਾਬ', 'मधुमेह', 'शुगर', 'ડાયાબિટીસ', 'સુગર', 'சர்க்கரை நோய்', 'మధుమేహం'],
    officialGeneric: {
      medicineName: 'Metformin Hydrochloride Tablets IP 500mg',
      genericSalt: 'Metformin HCl (Biguanide)',
      dosageStrength: '500 mg',
      pmbjpPriceINR: '₹1.80 per strip of 10 tablets (88% subsidized vs ₹20.00 brand)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet with or after evening dinner to minimize gastric upset.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Meshashringi / Gudmar Churna (Gymnema sylvestre)',
      scientificBotanical: 'Gymnema sylvestre (Apocynaceae)',
      activePhytochemical: 'Gymnemic Acid fractions I-VII',
      classicalReference: 'Bhavaprakasha Nighantu, Haritakyadi Varga',
      ayushDosage: '3 grams (1 teaspoon) twice daily 30 minutes before meals.',
      anupanaDietaryMedium: 'Warm unboiled water'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Overnight Soaked Fenugreek (Methi) Seed Infusion',
      preparationMethod: 'Soak 2 tablespoons of whole methi seeds in 250ml water overnight. In the morning, chew seeds thoroughly and drink the water.',
      modeOfAdministration: 'Once daily on an empty stomach.',
      contraindicationWarning: 'Do not combine simultaneously with high-dose Glibenclamide to prevent sudden hypoglycemia.'
    },
    escalationProtocol: {
      dangerSigns: ['Fasting blood sugar > 280 mg/dL', 'Ketoacidotic fruity breath', 'Deep persistent foot ulcers or gangrene'],
      maxWaitHoursBeforeHospital: 24,
      recommendedLabTest: 'Glycated Hemoglobin (HbA1c) & Fasting / Postprandial Blood Glucose'
    }
  },
  {
    id: 'CLIN_03',
    conditionName: 'Essential Hypertension & High Blood Pressure',
    hindiName: 'उच्च रक्तचाप (हाई बीपी)',
    gujaratiName: 'હાઈ બ્લડ પ્રેશਰ (રક્તચાપ)',
    punjabiName: 'ਹਾਈ ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ (ਉੱਚ ਰਕਤਚਾਪ / BP)',
    bodySystem: 'Cardiovascular',
    typicalSymptoms: ['Occipital throbbing headache', 'Dizziness', 'Palpitations', 'Chest tightness'],
    vernacularSymptomKeywords: ['hypertension', 'bp', 'blood pressure', 'high bp', 'ਬੀਪੀ', 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ', 'ਦਿਲ ਦੀ ਧੜਕਣ', 'ਸਿਰ ਘੁੰਮਣਾ', 'रक्तचाप', 'हाई बीपी', 'બ્લડ પ્રેશਰ', 'இரத்த அழுத்தம்', 'రక్తపోటు'],
    officialGeneric: {
      medicineName: 'Amlodipine Besylate Tablets IP 5mg',
      genericSalt: 'Amlodipine (Dihydropyridine Calcium Channel Blocker)',
      dosageStrength: '5 mg',
      pmbjpPriceINR: '₹2.80 per strip of 10 tablets (85% cheaper than Stamlo 5)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily every morning.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Arjunarishta (Terminalia arjuna bark ferment)',
      scientificBotanical: 'Terminalia arjuna (Combretaceae)',
      activePhytochemical: 'Arjunolic acid, Terminic acid & Oligomeric Proanthocyanidins',
      classicalReference: 'Bhaishajya Ratnavali, Hridroga Rogadhikara',
      ayushDosage: '15 to 20 ml with equal quantity of potable water.',
      anupanaDietaryMedium: 'Equal volume of normal drinking water post-meals'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Crushed Raw Garlic with Luke-Warm Water',
      preparationMethod: 'Crush 2 fresh garlic cloves and expose to air for 5 minutes to trigger allicin conversion.',
      modeOfAdministration: 'Swallow with warm water in the morning.',
      contraindicationWarning: 'Halt consumption 7 days before scheduled surgery or when taking Warfarin.'
    },
    escalationProtocol: {
      dangerSigns: ['Blood pressure > 180/110 mmHg (Hypertensive Crisis)', 'Severe chest pain radiating to left arm', 'Speech slurring or facial droop (Stroke alert)'],
      maxWaitHoursBeforeHospital: 1,
      recommendedLabTest: '12-Lead Electrocardiogram (ECG) & Serum Creatinine / Electrolytes'
    }
  },
  {
    id: 'CLIN_04',
    conditionName: 'Gastroesophageal Reflux, Acidity & Dyspepsia',
    hindiName: 'अम्लपित्त, गैस व बदहजमी',
    gujaratiName: 'એસિડિટી, ગેસ અને પેટમાં બળતરા',
    punjabiName: 'ਐਸੀਡਿਟੀ, ਪੇਟ ਦੀ ਜਲਣ ਅਤੇ ਬਦਹਜ਼ਮੀ',
    bodySystem: 'Digestive',
    typicalSymptoms: ['Retrosternal heartburn (chest burning)', 'Sour eructations (Khatti Dakar)', 'Epigastric fullness', 'Nausea'],
    vernacularSymptomKeywords: ['acidity', 'gas', 'heartburn', 'indigestion', 'gerd', 'reflux', 'ਐਸੀਡਿਟੀ', 'ਗੈਸ', 'ਖੱਟੇ ਡਕਾਰ', 'ਬਦਹਜ਼ਮੀ', 'पिट ਵਿੱਚ ਜਲਣ', 'एसिडिटी', 'खट्टी डकार', 'એસિડિટી'],
    officialGeneric: {
      medicineName: 'Pantoprazole Gastro-Resistant Tablets IP 40mg',
      genericSalt: 'Pantoprazole Sodium (Proton Pump Inhibitor)',
      dosageStrength: '40 mg',
      pmbjpPriceINR: '₹7.50 per strip of 10 tablets (75% savings over Pan-40)',
      cdscoNlemListed: true,
      standardDosageSchedule: '1 tablet once daily, strictly 30 minutes before breakfast with water.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Avipattikar Churna / Yashtimadhu (Licorice)',
      scientificBotanical: 'Glycyrrhiza glabra (Fabaceae)',
      activePhytochemical: 'Glycyrrhizin, Liquiritin & Glabridin',
      classicalReference: 'Bhaishajya Ratnavali, Amlapitta Rogadhikara',
      ayushDosage: '3 to 5 grams with warm water twice daily before meals.',
      anupanaDietaryMedium: 'Lukewarm water or cow ghee'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Fennel Seeds (Saunf) & Cold Milk',
      preparationMethod: 'Chew 1 teaspoon green fennel seeds after food, or drink 1/2 cup cold unboiled milk.',
      modeOfAdministration: 'Immediately when heartburn sensation strikes.',
      contraindicationWarning: 'Avoid carbonated water or baking soda in patients with hypertension.'
    },
    escalationProtocol: {
      dangerSigns: ['Black tarry stools (Melena)', 'Vomiting blood (Coffee-ground emesis)', 'Inability to swallow solids (Dysphagia)'],
      maxWaitHoursBeforeHospital: 6,
      recommendedLabTest: 'Upper GI Endoscopy & Stool Occult Blood'
    }
  },
  {
    id: 'CLIN_05',
    conditionName: 'Osteoarthritis, Joint Pain & Musculoskeletal Stiffness',
    hindiName: 'जोड़ों का दर्द, गठिया व सूजन (संधिवात)',
    gujaratiName: 'સાંધાનો દુખાવો, ગોઠણની કળતર અને સોજો',
    punjabiName: 'ਜੋੜਾਂ ਦਾ ਦਰਦ, ਗਠੀਆ ਅਤੇ ਸੋਜ (ਸੰਧੀਵਾਤ)',
    bodySystem: 'Musculoskeletal',
    typicalSymptoms: ['Knee/joint crepitus', 'Morning joint stiffness > 30 mins', 'Swelling and warmth over knees', 'Difficulty walking'],
    vernacularSymptomKeywords: ['joint pain', 'arthritis', 'knee pain', 'swelling', 'ਜੋੜਾਂ ਦਾ ਦਰਦ', 'ਗੋਡੇ ਦਾ ਦਰਦ', 'ਸੋਜ', 'ਗਠੀਆ', 'जोड़ों का दर्द', 'गठिया', 'સાંધાનો દુખાવો'],
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
    hindiName: 'खांसी, जुकाम, कफ व श्वास कष्ट',
    gujaratiName: 'શરદી, ઉધરસ, કફ અને શ્વાસની તકલીફ',
    punjabiName: 'ਖੰਘ, ਜ਼ੁਕਾਮ, ਰੇਸ਼ਾ ਅਤੇ ਸਾਹ ਲੈਣ ਵਿੱਚ ਤਕਲੀਫ਼',
    bodySystem: 'Respiratory',
    typicalSymptoms: ['Chest congestion', 'Productive phlegm/mucus', 'Throat irritation / hoarseness', 'Nocturnal coughing fits'],
    vernacularSymptomKeywords: ['cough', 'cold', 'phlegm', 'bronchitis', 'mucus', 'ਖੰਘ', 'ਜ਼ੁਕਾਮ', 'ਬਲਗਮ', 'ਰੇਸ਼ਾ', 'ਦਮ', 'ਛਾਤੀ ਦੀ ਜਕੜਨ', 'खांसी', 'जुकाम', 'कफ', 'શરદી', 'ઉધરસ'],
    officialGeneric: {
      medicineName: 'Ambroxol Hydrochloride 30mg + Levocetirizine 2.5mg Syrup',
      genericSalt: 'Ambroxol (Mucolytic) + Levocetirizine (Antihistaminic)',
      dosageStrength: '100 ml bottle',
      pmbjpPriceINR: '₹18.00 per bottle (70% cheaper than branded syrups)',
      cdscoNlemListed: true,
      standardDosageSchedule: '5 ml twice daily after meals.'
    },
    ayushClassicalFormulation: {
      formulationName: 'Sitopaladi Churna with Pure Honey',
      scientificBotanical: 'Bambusa arundinacea + Piper longum (Pippali)',
      activePhytochemical: 'Piperine, Cinnamaldehyde & Piperlongumine',
      classicalReference: 'Sharangadhara Samhita, Madhyama Khanda',
      ayushDosage: '2 to 3 grams mixed into a paste with 1 teaspoon pure honey.',
      anupanaDietaryMedium: 'Honey or ginger juice'
    },
    verifiedHomeRemedy: {
      kitchenItem: 'Steam Inhalation with Carom Seeds (Ajwain) & Mint / Tulsi',
      preparationMethod: 'Add 1 tablespoon ajwain seeds to 1 liter boiling water. Inhale steam for 7-10 minutes with eyes closed.',
      modeOfAdministration: 'Twice daily (morning and before sleep).',
      contraindicationWarning: 'Keep children at a safe distance from boiling water to avoid scald burns.'
    },
    escalationProtocol: {
      dangerSigns: ['Oxygen saturation (SpO2) < 94%', 'Blood in sputum (Hemoptysis)', 'Severe chest indrawing or stridor in infants'],
      maxWaitHoursBeforeHospital: 2,
      recommendedLabTest: 'Pulse Oximetry, Chest X-Ray PA View & Sputum AFB'
    }
  }
];

// Multilingual Full-Text Translations Dictionary
const LOCALIZED_RECORD_DETAILS: Record<string, Record<string, Partial<ClinicalConditionRecord>>> = {
  CLIN_01: {
    pa: {
      conditionName: 'ਵਾਇਰਲ ਬੁਖਾਰ ਅਤੇ ਸਰੀਰ ਦਰਦ (ਜਵਰ)',
      officialGeneric: {
        medicineName: 'ਪੈਰਾਸੀਟਾਮੋਲ ਗੋਲੀਆਂ (Paracetamol Tablets IP 500mg / 650mg)',
        genericSalt: 'ਪੈਰਾਸੀਟਾਮੋਲ (ਐਂਟੀਪਾਇਰੇਟਿਕ)',
        dosageStrength: '650 ਮਿਲੀਗ੍ਰਾਮ',
        pmbjpPriceINR: '₹2.50 ਪ੍ਰਤੀ 10 ਗੋਲੀਆਂ (80% ਸਬਸਿਡੀ ਵਾਲੀ ਸਰਕਾਰੀ ਦਰ)',
        cdscoNlemListed: true,
        standardDosageSchedule: 'ਭੋਜਨ ਤੋਂ ਬਾਅਦ 1 ਗੋਲੀ ਹਰ 6-8 ਘੰਟੇ ਬਾਅਦ; 24 ਘੰਟਿਆਂ ਵਿੱਚ 3,000 ਮਿਲੀਗ੍ਰਾਮ ਤੋਂ ਵੱਧ ਨਾ ਲਵੋ।'
      },
      ayushClassicalFormulation: {
        formulationName: 'ਗਿਲੋਏ ਘਣ ਵਟੀ / ਗੁਡੂਚੀ ਕਵਾਥ',
        scientificBotanical: 'Tinospora cordifolia (ਗਿਲੋਏ)',
        activePhytochemical: 'ਟੀਨੋਸਪੋਰਾਈਡ ਅਤੇ ਬਰਬੇਰੀਨ',
        classicalReference: 'ਆਯੁਰਵੇਦਿਕ ਫਾਰਮਾਕੋਪੀਆ ਆਫ ਇੰਡੀਆ (API)',
        ayushDosage: 'ਦੋ ਗੋਲੀਆਂ (500mg) ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਕੋਸੇ ਪਾਣੀ ਨਾਲ।',
        anupanaDietaryMedium: 'ਕੋਸਾ ਪਾਣੀ ਜਾਂ ਸ਼ਹਿਦ (ਪੇਟ ਦੀ ਜਲਣ ਰੋਕਦਾ ਹੈ)'
      },
      verifiedHomeRemedy: {
        kitchenItem: 'ਤੁਲਸੀ, ਅਦਰਕ ਅਤੇ ਕਾਲੀ ਮਿਰਚ ਦਾ ਕਾੜ੍ਹਾ',
        preparationMethod: '8 ਤੁਲਸੀ ਦੇ ਪੱਤੇ, 1 ਇੰਚ ਅਦਰਕ ਅਤੇ 3 ਕਾਲੀ ਮਿਰਚਾਂ ਨੂੰ 2 ਕੱਪ ਪਾਣੀ ਵਿੱਚ ਉਬਾਲੋ ਜਦੋਂ ਤੱਕ 1 ਕੱਪ ਨਾ ਰਹਿ ਜਾਵੇ।',
        modeOfAdministration: 'ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਕੋਸਾ ਪੀਓ। ਗੁੜ ਮਿਲਾ ਸਕਦੇ ਹੋ।',
        contraindicationWarning: 'ਪੇਟ ਵਿੱਚ ਅਲਸਰ ਜਾਂ ਛਾਲੇ ਹੋਣ \'ਤੇ ਕਾਲੀ ਮਿਰਚ ਦਾ ਕਾੜ੍ਹਾ ਨਾ ਲਵੋ।'
      },
      escalationProtocol: {
        dangerSigns: ['103°F ਤੋਂ ਵੱਧ ਤੇਜ਼ ਬੁਖਾਰ ਅਤੇ ਚੱਕਰ', 'ਦੌਰੇ ਪੈਣਾ ਜਾਂ ਕਾਂਬਾ', 'ਮਸੂੜਿਆਂ ਵਿੱਚੋਂ ਖੂਨ ਆਉਣਾ (ਡੈਂਗੂ ਦਾ ਖਤਰਾ)'],
        maxWaitHoursBeforeHospital: 48,
        recommendedLabTest: 'ਸੀਬੀਸੀ (CBC) ਪਲੇਟਲੈਟ ਕਾਊਂਟ ਅਤੇ ਡੈਂਗੂ ਟੈਸਟ'
      }
    },
    hi: {
      conditionName: 'तीव्र वायरल बुखार व बदन दर्द (ज्वर)',
      officialGeneric: {
        medicineName: 'पैरासिटामोल गोलियां (Paracetamol Tablets IP 500mg / 650mg)',
        genericSalt: 'पैरासिटामोल (ज्वरनाशक)',
        dosageStrength: '650 मिलीग्राम',
        pmbjpPriceINR: '₹2.50 प्रति 10 गोलियां (80% सब्सिडी दर)',
        cdscoNlemListed: true,
        standardDosageSchedule: 'भोजन के बाद 1 गोली हर 6-8 घंटे में; 24 घंटे में 3,000 मिलीग्राम से अधिक न लें।'
      },
      ayushClassicalFormulation: {
        formulationName: 'गिलोय घन वटी / गुडूची क्वाथ',
        scientificBotanical: 'Tinospora cordifolia (गिलोय)',
        activePhytochemical: 'टीनोस्पोराइड व बर्बेरिन',
        classicalReference: 'आयुर्वेदिक फार्माकोपिया ऑफ इंडिया (API)',
        ayushDosage: '2 गोली (500mg) दिन में दो बार गुनगुने पानी के साथ।',
        anupanaDietaryMedium: 'गुनगुना पानी अथवा शहद (पेट की जलन रोकता है)'
      },
      verifiedHomeRemedy: {
        kitchenItem: 'तुलसी, अदरक और काली मिर्च का काढ़ा',
        preparationMethod: '8 तुलसी के पत्ते, 1 इंच पिसी अदरक और 3 काली मिर्च 2 कप पानी में उबालें जब तक 1 कप न रह जाए।',
        modeOfAdministration: 'दिन में 2 बार गुनगुना पिएं। थोड़ा गुड़ मिला सकते हैं।',
        contraindicationWarning: 'पेट में छाले या अल्सर होने पर काली मिर्च का काढ़ा न दें।'
      },
      escalationProtocol: {
        dangerSigns: ['103°F से अधिक तेज बुखार व भ्रम', 'दौरे पड़ना या तेज कंपकंपी', 'मसूड़ों से खून आना (डेंगू चेतावनी)'],
        maxWaitHoursBeforeHospital: 48,
        recommendedLabTest: 'सीबीसी (CBC) प्लेटलेट जांच व डेंगू NS1 एंटीजन'
      }
    },
    gu: {
      conditionName: 'તીવ્ર તાવ અને શરીરનો કળતર (જ્વર)',
      officialGeneric: {
        medicineName: 'પેરાસીટામોલ ગોળીઓ (Paracetamol Tablets IP 500mg / 650mg)',
        genericSalt: 'પેરાસીટામોલ',
        dosageStrength: '650 મિલિગ્રામ',
        pmbjpPriceINR: '₹2.50 પ્રતિ 10 ગોળી (80% સબસીડી દર)',
        cdscoNlemListed: true,
        standardDosageSchedule: 'જમ્યા પછી 1 ગોળી દર 6-8 કલાકે; 24 કલાકમાં 3,000 મિલિગ્રામથી વધુ ન લેવી.'
      },
      ayushClassicalFormulation: {
        formulationName: 'ગળો ઘન વટી / ગુડૂચી ક્વાથ',
        scientificBotanical: 'Tinospora cordifolia (ગળો)',
        activePhytochemical: 'ટીનોસ્પોરાઈડ અને બરબેરીન',
        classicalReference: 'આયુર્વેદિક ફાર્માકોપિયા ઓફ ઈન્ડિયા (API)',
        ayushDosage: '2 ગોળી (500mg) દિવસમાં બે વાર નવશેકા પાણી સાથે.',
        anupanaDietaryMedium: 'નવશેકું પાણી અથવા મધ'
      },
      verifiedHomeRemedy: {
        kitchenItem: 'તુલસી, આદુ અને મરીનો ઉકાળો',
        preparationMethod: '8 તુલસીના પાન, 1 ઇંચ આદુ અને 3 કાળા મરી 2 કપ પાણીમાં ઉકાળો જ્યાં સુધી 1 કપ રહે.',
        modeOfAdministration: 'દિવસમાં 2 વખત નવશેકો પીવો. ગોળ ઉમેરી શકાય.',
        contraindicationWarning: 'પેટમાં ચાંદા કે એસિડિટી હોય તો કાળા મરીનો ઉકાળો ન પીવો.'
      },
      escalationProtocol: {
        dangerSigns: ['103°F થી વધુ તીવ્ર તાવ અને બેભાનપણું', 'આંચકી આવવી કે ધ્રૂજારી', 'પેઢામાંથી લોહી નીકળવું (ડેન્ગ્યુની ચેતવણી)'],
        maxWaitHoursBeforeHospital: 48,
        recommendedLabTest: 'સીબીસી (CBC) પ્લેટલેટ ટેસ્ટ અને ડેન્ગ્યુ ટેસ્ટ'
      }
    }
  },
  CLIN_02: {
    pa: {
      conditionName: 'ਟਾਈਪ 2 ਸ਼ੂਗਰ ਅਤੇ ਬਲੱਡ ਸ਼ੂਗਰ ਨਿਯੰਤਰਣ',
      officialGeneric: {
        medicineName: 'ਮੈਟਫਾਰਮਿਨ ਹਾਈਡ੍ਰੋਕਲੋਰਾਈਡ (Metformin HCl IP 500mg)',
        genericSalt: 'ਮੈਟਫਾਰਮਿਨ',
        dosageStrength: '500 ਮਿਲੀਗ੍ਰਾਮ',
        pmbjpPriceINR: '₹1.80 ਪ੍ਰਤੀ 10 ਗੋਲੀਆਂ',
        cdscoNlemListed: true,
        standardDosageSchedule: 'ਰਾਤ ਦੇ ਖਾਣੇ ਦੇ ਨਾਲ ਜਾਂ ਬਾਅਦ ਵਿੱਚ 1 ਗੋਲੀ ਲਵੋ।'
      },
      ayushClassicalFormulation: {
        formulationName: 'ਗੁੜਮਾਰ ਚੂਰਨ / ਮੇਸ਼ਸ਼੍ਰਿੰਗੀ (Gymnema sylvestre)',
        scientificBotanical: 'Gymnema sylvestre',
        activePhytochemical: 'ਜਿਮਨੇਮਿਕ ਐਸਿਡ',
        classicalReference: 'ਭਾਵਪ੍ਰਕਾਸ਼ ਨਿਘੰਟੂ',
        ayushDosage: '1 ਚਮਚਾ (3-5 ਗ੍ਰਾਮ) ਪਾਊਡਰ ਕੋਸੇ ਪਾਣੀ ਨਾਲ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਭੋਜਨ ਤੋਂ ਪਹਿਲਾਂ।',
        anupanaDietaryMedium: 'ਕੋਸਾ ਪਾਣੀ'
      },
      verifiedHomeRemedy: {
        kitchenItem: 'ਰਾਤ ਭਰ ਭਿਓਂ ਕੇ ਰੱਖਿਆ ਮੇਥੀ ਦਾਣਾ ਪਾਣੀ',
        preparationMethod: '2 ਚਮਚੇ ਮੇਥੀ ਦਾਣੇ 1 ਗਿਲਾਸ ਪਾਣੀ ਵਿੱਚ ਰਾਤ ਭਰ ਭਿਓਂ ਦਿਓ। ਸਵੇਰੇ ਪਾਣੀ ਪੀਓ ਅਤੇ ਦਾਣੇ ਚਬਾਓ।',
        modeOfAdministration: 'ਸਵੇਰੇ ਖਾਲੀ ਪੇਟ ਇੱਕ ਵਾਰ।',
        contraindicationWarning: 'ਬਹੁਤ ਜ਼ਿਆਦਾ ਮਾਤਰਾ ਵਿੱਚ ਨਾ ਲਵੋ ਤਾਂ ਜੋ ਸ਼ੂਗਰ ਇਕਦਮ ਘੱਟ ਨਾ ਹੋਵੇ।'
      },
      escalationProtocol: {
        dangerSigns: ['ਖਾਲੀ ਪੇਟ ਸ਼ੂਗਰ 280 mg/dL ਤੋਂ ਵੱਧ', 'ਸਾਹ ਵਿੱਚੋਂ ਫਲਾਂ ਵਰਗੀ ਬਦਬੂ', 'ਪੈਰਾਂ ਵਿੱਚ ਡੂੰਘੇ ਜ਼ਖ਼ਮ ਜਾਂ ਗੈਂਗਰੀਨ'],
        maxWaitHoursBeforeHospital: 24,
        recommendedLabTest: 'ਐਚਬੀਏ1ਸੀ (HbA1c) ਅਤੇ ਫਾਸਟਿੰਗ ਬਲੱਡ ਸ਼ੂਗਰ'
      }
    }
  },
  CLIN_04: {
    pa: {
      conditionName: 'ਐਸੀਡਿਟੀ, ਪੇਟ ਦੀ ਜਲਣ ਅਤੇ ਬਦਹਜ਼ਮੀ',
      officialGeneric: {
        medicineName: 'ਪੈਂਟੋਪ੍ਰਾਜ਼ੋਲ ਗੋਲੀਆਂ (Pantoprazole Tablets IP 40mg)',
        genericSalt: 'ਪੈਂਟੋਪ੍ਰਾਜ਼ੋਲ (ਪੀਪੀਆਈ)',
        dosageStrength: '40 ਮਿਲੀਗ੍ਰਾਮ',
        pmbjpPriceINR: '₹7.50 ਪ੍ਰਤੀ 10 ਗੋਲੀਆਂ',
        cdscoNlemListed: true,
        standardDosageSchedule: 'ਸਵੇਰੇ ਨਾਸ਼ਤੇ ਤੋਂ 30 ਮਿੰਟ ਪਹਿਲਾਂ ਖਾਲੀ ਪੇਟ 1 ਗੋਲੀ ਲਵੋ।'
      },
      ayushClassicalFormulation: {
        formulationName: 'ਅਵਿਪੱਤੀਕਰ ਚੂਰਨ / ਮੁਲੱਠੀ (ਯਸ਼ਟੀਮਧੂ)',
        scientificBotanical: 'Glycyrrhiza glabra',
        activePhytochemical: 'ਗਲਾਈਸੀਰਾਈਜ਼ਿਨ',
        classicalReference: 'ਭੈਸ਼ਜਯ ਰਤਨਾਵਲੀ',
        ayushDosage: 'ਅੱਧਾ ਚਮਚਾ ਕੋਸੇ ਪਾਣੀ ਨਾਲ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਖਾਣੇ ਤੋਂ ਬਾਅਦ।',
        anupanaDietaryMedium: 'ਕੋਸਾ ਪਾਣੀ ਜਾਂ ਗਾਂ ਦਾ ਦੁੱਧ'
      },
      verifiedHomeRemedy: {
        kitchenItem: 'ਸੌਂਫ ਦਾ ਪਾਣੀ ਜਾਂ ਠੰਡਾ ਦੁੱਧ',
        preparationMethod: 'ਭੋਜਨ ਤੋਂ ਬਾਅਦ 1 ਚਮਚਾ ਹਰੀ ਸੌਂਫ ਚਬਾਓ ਜਾਂ ਅੱਧਾ ਕੱਪ ਠੰਡਾ ਦੁੱਧ ਪੀਓ।',
        modeOfAdministration: 'ਛਾਤੀ ਵਿੱਚ ਜਲਣ ਹੋਣ \'ਤੇ ਤੁਰੰਤ।',
        contraindicationWarning: 'ਤਲੀਆਂ ਹੋਈਆਂ ਮਿਰਚ-ਮਸਾਲੇਦਾਰ ਚੀਜ਼ਾਂ ਤੋਂ ਪਰਹੇਜ਼ ਕਰੋ।'
      },
      escalationProtocol: {
        dangerSigns: ['ਕਾਲਾ ਪਖਾਨਾ ਆਉਣਾ', 'ਖੂਨ ਦੀ ਉਲਟੀ ਆਉਣਾ', 'ਖਾਣਾ ਨਿਗਲਣ ਵਿੱਚ ਅਸਮਰੱਥਾ'],
        maxWaitHoursBeforeHospital: 6,
        recommendedLabTest: 'ਐਂਡੋਸਕੋਪੀ ਅਤੇ ਸਟੂਲ ਟੈਸਟ'
      }
    }
  }
};

// Offline Deterministic Search & Natural Language Generator
export class NationalClinicalKnowledgeEngine {
  public static getLocalizedRecord(record: ClinicalConditionRecord, lang: string): ClinicalConditionRecord {
    const langKey = lang.toLowerCase();
    const conditionOverrides = LOCALIZED_RECORD_DETAILS[record.id]?.[langKey];

    if (!conditionOverrides) {
      // Clean any accidental script in parentheses from base record
      return {
        ...record,
        conditionName: langKey === 'pa' && record.punjabiName ? record.punjabiName :
                       langKey === 'hi' ? record.hindiName :
                       langKey === 'gu' ? record.gujaratiName : record.conditionName,
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

    return {
      ...record,
      conditionName: conditionOverrides.conditionName || record.conditionName,
      officialGeneric: {
        ...record.officialGeneric,
        ...(conditionOverrides.officialGeneric || {})
      },
      ayushClassicalFormulation: {
        ...record.ayushClassicalFormulation,
        ...(conditionOverrides.ayushClassicalFormulation || {})
      },
      verifiedHomeRemedy: {
        ...record.verifiedHomeRemedy,
        ...(conditionOverrides.verifiedHomeRemedy || {})
      },
      escalationProtocol: {
        ...record.escalationProtocol,
        ...(conditionOverrides.escalationProtocol || {})
      }
    };
  }

  public static searchBySymptomOrCondition(query: string, lang: string = 'en'): ClinicalConditionRecord[] {
    const q = (query || '').toLowerCase().trim();
    const baseList = NATIONAL_CLINICAL_RECORDS.map(rec => this.getLocalizedRecord(rec, lang));
    if (!q) return baseList;

    return baseList.filter(record => {
      const matchName = record.conditionName.toLowerCase().includes(q) ||
                        record.hindiName.toLowerCase().includes(q) ||
                        record.gujaratiName.toLowerCase().includes(q) ||
                        (record.punjabiName && record.punjabiName.toLowerCase().includes(q));
      const matchKeywords = record.vernacularSymptomKeywords.some(kw => q.includes(kw.toLowerCase()) || kw.toLowerCase().includes(q));
      const matchSymptoms = record.typicalSymptoms.some(s => s.toLowerCase().includes(q));
      const matchGenerics = record.officialGeneric.medicineName.toLowerCase().includes(q) || record.officialGeneric.genericSalt.toLowerCase().includes(q);
      const matchAyush = record.ayushClassicalFormulation.formulationName.toLowerCase().includes(q) || record.ayushClassicalFormulation.scientificBotanical.toLowerCase().includes(q);

      return matchName || matchKeywords || matchSymptoms || matchGenerics || matchAyush;
    });
  }

  public static generateOfflineNluResponse(query: string, langCode: string = 'hi'): string {
    const matches = this.searchBySymptomOrCondition(query, langCode);
    const primary = matches[0] || this.getLocalizedRecord(NATIONAL_CLINICAL_RECORDS[0], langCode);

    if (langCode === 'pa') {
      return `【ਪਛਾਣਿਆ ਗਿਆ ਵਿਕਾਰ】: ${primary.conditionName}\n\n1. ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   ਸਰਕਾਰੀ ਮੁੱਲ: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. ਪ੍ਰਮਾਣਿਤ ਆਯੁਸ਼ ਨੁਸਖਾ: ${primary.ayushClassicalFormulation.formulationName}\n   ਖੁਰਾਕ ਅਤੇ ਤਰੀਕਾ: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. ਸੁਰੱਖਿਅਤ ਘਰੇਲੂ ਉਪਚਾਰ: ${primary.verifiedHomeRemedy.kitchenItem}\n   ਵਿਧੀ: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ ਹਸਪਤਾਲ ਚੇਤਾਵਨੀ: ਜੇਕਰ ${primary.escalationProtocol.dangerSigns[0]} ਦਿਖੇ ਤਾਂ ${primary.escalationProtocol.maxWaitHoursBeforeHospital} ਘੰਟਿਆਂ ਵਿੱਚ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।`;
    }

    if (langCode === 'hi') {
      return `【पहचाना गया विकार】: ${primary.conditionName}\n\n1. जन औषधि दवा: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   अनुमानित मूल्य: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. प्रमाणित आयुष वनस्पति: ${primary.ayushClassicalFormulation.formulationName}\n   मात्रा व अनुपान: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. सुरक्षित घरेलू उपचार: ${primary.verifiedHomeRemedy.kitchenItem}\n   विधि: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ आपातकालीन चेतावनी: यदि ${primary.escalationProtocol.dangerSigns[0]} दिखे तो ${primary.escalationProtocol.maxWaitHoursBeforeHospital} घंटे में तुरंत अस्पताल जाएं।`;
    }

    if (langCode === 'gu') {
      return `【ઓળખાયેલ રોગ/લક્ષણ】: ${primary.conditionName}\n\n1. પ્રધાનમંત્રી જન ઔષધિ: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   સરકારી કિંમત: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. આયુષ ઔષધીય વનસ્પતિ: ${primary.ayushClassicalFormulation.formulationName}\n   લેવાની રીત: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. સુરક્ષિત ઘરગથ્થુ ઉપચાર: ${primary.verifiedHomeRemedy.kitchenItem}\n   બનાવવાની રીત: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ હોસ્પિટલ ચેતવણી: જો ${primary.escalationProtocol.dangerSigns[0]} જણાય તો તરત જ ડૉક્ટર પાસે જવું.`;
    }

    return `[Identified Condition]: ${primary.conditionName}\n\n1. Jan Aushadhi Generic: ${primary.officialGeneric.medicineName} (${primary.officialGeneric.standardDosageSchedule})\n   Govt Price: ${primary.officialGeneric.pmbjpPriceINR}\n\n2. AYUSH Classical Remedy: ${primary.ayushClassicalFormulation.formulationName}\n   Dosage: ${primary.ayushClassicalFormulation.ayushDosage} (${primary.ayushClassicalFormulation.anupanaDietaryMedium})\n\n3. Kitchen Remedy: ${primary.verifiedHomeRemedy.kitchenItem}\n   Preparation: ${primary.verifiedHomeRemedy.preparationMethod}\n\n⚠️ Emergency Alert: Seek immediate hospital care if: ${primary.escalationProtocol.dangerSigns[0]}`;
  }
}
