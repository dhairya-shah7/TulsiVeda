// Alternative Medicine & Home Remedy Engine for Bharat Health AI
// Generates 3-Tier Alternatives when allopathic medicines are out-of-stock or clinics are unavailable.

export interface AlternativeOption {
  tier: 'Tier 1: Jan Aushadhi Generic' | 'Tier 2: AYUSH Botanical' | 'Tier 3: Kitchen Home Remedy';
  name: string;
  activeComponent: string;
  dosagePreparation: string;
  costProfile: string;
  clinicalSuitability: string;
  safetyCaution: string;
  availability: 'Jan Aushadhi Kendra' | 'Ayurvedic Store / Garden' | 'Kitchen / Local Grocery';
}

export interface AlternativeQueryResult {
  targetIndication: string;
  queriedDrugOrCondition: string;
  urgencyLevel: 'Emergency / Consult Doctor' | 'Manageable with Alternatives' | 'Routine Dietary Support';
  alternatives: AlternativeOption[];
  safetyCrossCheckWarning: string;
}

export interface AlternativeBundle {
  condition: string;
  tier1JanAushadhi: {
    genericName: string;
    strength: string;
    estimatedGovtPrice: string;
    mechanism: string;
  };
  tier2AyushHerb: {
    botanicalName: string;
    scientificName: string;
    activeConstituent: string;
    formulation: string;
    dosage: string;
  };
  tier3KitchenRemedy: {
    kitchenItem: string;
    preparationMethod: string;
    frequency: string;
    contraindications: string;
  };
  escalationCriteria: string;
}

export class AlternativeMedicineEngine {
  public static resolveAlternatives(inputQuery: string, lang: string = 'en'): AlternativeQueryResult {
    const q = (inputQuery || '').toLowerCase();
    const l = (lang || 'en').toLowerCase();

    // 1. Diabetes / Metformin / Blood Sugar
    if (q.includes('diabetes') || q.includes('sugar') || q.includes('glycomet') || q.includes('metformin') || q.includes('ਸ਼ੂਗਰ') || q.includes('मधुमेह') || q.includes('ડાયાબિટીસ') || q.includes('amaryl')) {
      if (l.startsWith('pa')) {
        return {
          targetIndication: 'ਟਾਈਪ 2 ਸ਼ੂਗਰ ਅਤੇ ਬਲੱਡ ਸ਼ੂਗਰ ਨਿਯੰਤਰਣ',
          queriedDrugOrCondition: inputQuery,
          urgencyLevel: 'Manageable with Alternatives',
          alternatives: [
            {
              tier: 'Tier 1: Jan Aushadhi Generic',
              name: 'ਮੈਟਫਾਰਮਿਨ ਹਾਈਡ੍ਰੋਕਲੋਰਾਈਡ 500mg (ਜਨ ਔਸ਼ਧੀ)',
              activeComponent: 'Metformin HCl 500mg',
              dosagePreparation: 'ਰਾਤ ਦੇ ਖਾਣੇ ਨਾਲ 1 ਗੋਲੀ। ਬ੍ਰਾਂਡ ਵਾਲੀ ਦਵਾਈ ਜਿੰਨੀ ਹੀ ਅਸਰਦਾਰ।',
              costProfile: '₹1.50 ਪ੍ਰਤੀ ਸਟ੍ਰਿਪ (ਬ੍ਰਾਂਡ ਨਾਲੋਂ 90% ਸਸਤੀ)',
              clinicalSuitability: 'ਜਿਗਰ ਵਿੱਚ ਗਲੂਕੋਜ਼ ਬਣਨ ਦੀ ਪ੍ਰਕਿਰਿਆ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਦੀ ਹੈ।',
              safetyCaution: 'ਗੁਰਦੇ ਦੀ ਗੰਭੀਰ ਬਿਮਾਰੀ ਵਿੱਚ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਬਿਨਾਂ ਨਾ ਲਵੋ।',
              availability: 'Jan Aushadhi Kendra',
            },
            {
              tier: 'Tier 2: AYUSH Botanical',
              name: 'ਗੁੜਮਾਰ ਚੂਰਨ (Gymnema sylvestre)',
              activeComponent: 'ਜਿਮਨੇਮਿਕ ਐਸਿਡ (Gymnemic Acid)',
              dosagePreparation: '1 ਚਮਚਾ (3-5 ਗ੍ਰਾਮ) ਪਾਊਡਰ ਕੋਸੇ ਪਾਣੀ ਨਾਲ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਖਾਣੇ ਤੋਂ ਪਹਿਲਾਂ।',
              costProfile: '₹40 - ₹60 ਪ੍ਰਤੀ 100 ਗ੍ਰਾਮ',
              clinicalSuitability: "ਜੀਭ 'ਤੇ ਮਿੱਠੇ ਦੇ ਸਵਾਦ ਨੂੰ ਘਟਾਉਂਦਾ ਹੈ ਅਤੇ ਪੈਨਕ੍ਰੀਆਜ਼ ਨੂੰ ਸੁਰਜੀਤ ਕਰਦਾ ਹੈ।",
              safetyCaution: 'ਜੇਕਰ ਪਹਿਲਾਂ ਤੋਂ ਸ਼ੂਗਰ ਦੀਆਂ ਗੋਲੀਆਂ ਲੈ ਰਹੇ ਹੋ ਤਾਂ ਸ਼ੂਗਰ ਦੀ ਜਾਂਚ ਕਰਦੇ ਰਹੋ।',
              availability: 'Ayurvedic Store / Garden',
            },
            {
              tier: 'Tier 3: Kitchen Home Remedy',
              name: 'ਰਾਤ ਭਰ ਭਿਓਂ ਕੇ ਰੱਖਿਆ ਮੇਥੀ ਦਾਣਾ ਪਾਣੀ',
              activeComponent: 'ਗੈਲੈਕਟੋਮੈਨਨ ਫਾਈਬਰ',
              dosagePreparation: '2 ਚਮਚੇ ਮੇਥੀ ਦਾਣੇ 1 ਗਿਲਾਸ ਪਾਣੀ ਵਿੱਚ ਰਾਤ ਭਰ ਭਿਓਂ ਦਿਓ; ਸਵੇਰੇ ਪਾਣੀ ਪੀਓ ਅਤੇ ਦਾਣੇ ਚਬਾਓ।',
              costProfile: 'ਮੁਫ਼ਤ (ਘਰੇਲੂ ਰਸੋਈ ਵਿੱਚ ਉਪਲਬਧ)',
              clinicalSuitability: 'ਖਾਣੇ ਤੋਂ ਬਾਅਦ ਸ਼ੂਗਰ ਦੇ ਅਚਾਨਕ ਵਧਣ ਨੂੰ ਰੋਕਦਾ ਹੈ।',
              safetyCaution: 'ਜ਼ਿਆਦਾ ਮਾਤਰਾ ਲੈਣ ਨਾਲ ਪੇਟ ਖਰਾਬ ਹੋ ਸਕਦਾ ਹੈ।',
              availability: 'Kitchen / Local Grocery',
            },
          ],
          safetyCrossCheckWarning: 'ਟਾਈਪ 1 ਸ਼ੂਗਰ ਵਿੱਚ ਇਨਸੁਲਿਨ ਬੰਦ ਨਾ ਕਰੋ।',
        };
      }

      return {
        targetIndication: 'Type 2 Diabetes Mellitus & Hyperglycemia Management',
        queriedDrugOrCondition: inputQuery,
        urgencyLevel: 'Manageable with Alternatives',
        alternatives: [
          {
            tier: 'Tier 1: Jan Aushadhi Generic',
            name: 'Metformin Hydrochloride 500mg (Jan Aushadhi)',
            activeComponent: 'Metformin HCl (Biguanide)',
            dosagePreparation: '1 tablet with dinner. Same bio-availability as branded Glycomet.',
            costProfile: '₹1.50 per strip (90% cheaper than branded ₹18.00)',
            clinicalSuitability: 'Direct therapeutic equivalent. Reduces hepatic gluconeogenesis and sensitizes insulin.',
            safetyCaution: 'Contraindicated in severe renal impairment (eGFR < 30). Stop if severe diarrhea occurs.',
            availability: 'Jan Aushadhi Kendra',
          },
          {
            tier: 'Tier 2: AYUSH Botanical',
            name: 'Gudmar Churna (Gymnema sylvestre)',
            activeComponent: 'Gymnemic Acids & Gurmarin',
            dosagePreparation: '1 teaspoon (3-5 gm) powder with warm water twice daily before meals.',
            costProfile: '₹40 - ₹60 per 100gm container',
            clinicalSuitability: 'Selectively suppresses sugar taste receptors and regenerates pancreatic beta-islets.',
            safetyCaution: 'Do not combine with full-dose sulfonylureas without monitoring to avoid hypoglycemia.',
            availability: 'Ayurvedic Store / Garden',
          },
          {
            tier: 'Tier 3: Kitchen Home Remedy',
            name: 'Soaked Fenugreek (Methi Seed) Water',
            activeComponent: 'Galactomannan Fiber & 4-Hydroxyisoleucine',
            dosagePreparation: 'Soak 2 tablespoons of methi seeds in 1 glass water overnight; drink water and chew seeds in the morning.',
            costProfile: 'Nearly Zero Cost (Available in every Indian kitchen)',
            clinicalSuitability: 'Slows carbohydrate digestion and reduces postprandial glycemic spikes.',
            safetyCaution: 'Excessive consumption may cause mild loose stools.',
            availability: 'Kitchen / Local Grocery',
          },
        ],
        safetyCrossCheckWarning: 'Never discontinue prescribed insulin abruptly in Type-1 diabetes.',
      };
    }

    // 2. Default / Fever / Paracetamol
    if (l.startsWith('pa')) {
      return {
        targetIndication: 'ਤੇਜ਼ ਵਾਇਰਲ ਬੁਖਾਰ ਅਤੇ ਸਰੀਰ ਦਰਦ (ਜਵਰ)',
        queriedDrugOrCondition: inputQuery || 'ਬੁਖਾਰ ਅਤੇ ਦਰਦ',
        urgencyLevel: 'Manageable with Alternatives',
        alternatives: [
          {
            tier: 'Tier 1: Jan Aushadhi Generic',
            name: 'ਪੈਰਾਸੀਟਾਮੋਲ 650mg / 500mg ਜੈਨੇਰਿਕ (ਜਨ ਔਸ਼ਧੀ)',
            activeComponent: 'Paracetamol (Acetaminophen)',
            dosagePreparation: "100°F ਤੋਂ ਵੱਧ ਬੁਖਾਰ ਹੋਣ 'ਤੇ ਭੋਜਨ ਤੋਂ ਬਾਅਦ ਹਰ 6 ਤੋਂ 8 ਘੰਟੇ ਬਾਅਦ 1 ਗੋਲੀ ਲਵੋ।",
            costProfile: '₹2.50 ਪ੍ਰਤੀ 10 ਗੋਲੀਆਂ (ਡੋਲੋ-650 ਨਾਲੋਂ 85% ਸਸਤੀ)',
            clinicalSuitability: 'ਸਰੀਰ ਦੇ ਤਾਪਮਾਨ ਨੂੰ ਸੰਤੁਲਿਤ ਕਰਦਾ ਹੈ ਅਤੇ ਸਰੀਰ ਦਾ ਦਰਦ ਘਟਾਉਂਦਾ ਹੈ।',
            safetyCaution: 'ਜਿਗਰ ਦੀ ਸੁਰੱਖਿਆ ਲਈ 24 ਘੰਟਿਆਂ ਵਿੱਚ 3,000 ਮਿਲੀਗ੍ਰਾਮ (4 ਗੋਲੀਆਂ) ਤੋਂ ਵੱਧ ਨਾ ਲਵੋ।',
            availability: 'Jan Aushadhi Kendra',
          },
          {
            tier: 'Tier 2: AYUSH Botanical',
            name: 'ਗਿਲੋਏ ਕਵਾਥ (Tinospora cordifolia)',
            activeComponent: 'ਟੀਨੋਸਪੋਰਾਈਡ ਅਤੇ ਬਰਬੇਰੀਨ',
            dosagePreparation: '2 ਇੰਚ ਤਾਜ਼ਾ ਗਿਲੋਏ ਤਣਾ 2 ਕੱਪ ਪਾਣੀ ਵਿੱਚ ਉਬਾਲੋ ਜਦੋਂ ਤੱਕ 1 ਕੱਪ ਨਾ ਰਹਿ ਜਾਵੇ। 2 ਚਮਚੇ ਦਿਨ ਵਿੱਚ ਦੋ ਵਾਰ ਪੀਓ।',
            costProfile: 'ਘਰ ਦੇ ਬਗੀਚੇ ਵਿੱਚ ਮੁਫ਼ਤ ਜਾਂ ₹50 ਪ੍ਰਤੀ ਬੋਤਲ',
            clinicalSuitability: 'ਸ਼ਾਸਤਰੀ ਜਵਰਨਾਸ਼ਕ ਅਤੇ ਰੋਗ-ਪ੍ਰਤੀਰੋਧਕ, ਵਾਇਰਲ ਬੁਖਾਰ ਵਿੱਚ ਪਲੇਟਲੈਟਸ ਵਧਾਉਣ ਵਿੱਚ ਮਦਦ ਕਰਦਾ ਹੈ।',
            safetyCaution: 'ਹਲਕੇ ਭੋਜਨ ਤੋਂ ਬਾਅਦ ਲਵੋ।',
            availability: 'Ayurvedic Store / Garden',
          },
          {
            tier: 'Tier 3: Kitchen Home Remedy',
            name: 'ਤੁਲਸੀ, ਅਦਰਕ ਅਤੇ ਕਾਲੀ ਮਿਰਚ ਦਾ ਕਾੜ੍ਹਾ (ਗੁੜ ਦੇ ਨਾਲ)',
            activeComponent: 'ਯੂਜੀਨੋਲ, ਪਾਈਪਰੀਨ ਅਤੇ ਜਿੰਜਰੋਲ',
            dosagePreparation: '7 ਤੁਲਸੀ ਦੇ ਪੱਤੇ, ਅੱਧਾ ਇੰਚ ਕੁੱਟਿਆ ਹੋਇਆ ਅਦਰਕ ਅਤੇ 3 ਕਾਲੀ ਮਿਰਚਾਂ 5 ਮਿੰਟ ਉਬਾਲੋ। ਛਾਣ ਕੇ ਕੋਸਾ ਪੀਓ।',
            costProfile: 'ਮੁਫ਼ਤ (ਰਸੋਈ ਦੀਆਂ ਆਮ ਚੀਜ਼ਾਂ)',
            clinicalSuitability: 'ਪਸੀਨਾ ਲਿਆ ਕੇ ਬੁਖਾਰ ਉਤਾਰਦਾ ਹੈ, ਬਲਗਮ ਸਾਫ਼ ਕਰਦਾ ਹੈ ਅਤੇ ਸਿਰ ਦਰਦ ਤੋਂ ਰਾਹਤ ਦਿੰਦਾ ਹੈ।',
            safetyCaution: 'ਜੇਕਰ ਬੁਖਾਰ 72 ਘੰਟਿਆਂ ਤੋਂ ਵੱਧ ਰਹੇ ਤਾਂ ਤੁਰੰਤ ਖੂਨ ਦੀ ਜਾਂਚ ਕਰਵਾਓ।',
            availability: 'Kitchen / Local Grocery',
          },
        ],
        safetyCrossCheckWarning: "ਛੋਟੇ ਬੱਚਿਆਂ ਵਿੱਚ 103°F ਤੋਂ ਵੱਧ ਤੇਜ਼ ਬੁਖਾਰ ਹੋਣ 'ਤੇ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।",
      };
    }

    return {
      targetIndication: 'Acute Fever, Body Ache & Musculoskeletal Inflammation',
      queriedDrugOrCondition: inputQuery || 'Fever & Pain',
      urgencyLevel: 'Manageable with Alternatives',
      alternatives: [
        {
          tier: 'Tier 1: Jan Aushadhi Generic',
          name: 'Paracetamol 650mg / 500mg Generic (Jan Aushadhi)',
          activeComponent: 'Acetaminophen (Antipyretic / Analgesic)',
          dosagePreparation: '1 tablet after food every 6 to 8 hours as needed for fever > 100°F.',
          costProfile: '₹2.50 for 10 tablets (85% cheaper than branded Dolo)',
          clinicalSuitability: 'Hypothalamic heat-regulating center reset and central COX-3 inhibition.',
          safetyCaution: 'Do not exceed 3,000 mg (4 tablets) in 24 hours to prevent hepatotoxicity.',
          availability: 'Jan Aushadhi Kendra',
        },
        {
          tier: 'Tier 2: AYUSH Botanical',
          name: 'Giloy Kwath (Tinospora cordifolia)',
          activeComponent: 'Tinosporide, Berberine & Arabinogalactan',
          dosagePreparation: 'Boil 2-inch fresh stem in 2 cups water until 1 cup remains. Drink 2 tablespoons twice daily.',
          costProfile: 'Free from garden or ₹50/bottle in store',
          clinicalSuitability: 'Classical Jwarahara (antipyretic) and immunomodulatory, helps platelet stabilization in viral fevers.',
          safetyCaution: 'Take after light meals. Avoid in severe acute liver failure.',
          availability: 'Ayurvedic Store / Garden',
        },
        {
          tier: 'Tier 3: Kitchen Home Remedy',
          name: 'Tulsi, Ginger & Black Pepper (Kadha) with Jaggery',
          activeComponent: 'Eugenol, Piperine & Gingerol',
          dosagePreparation: 'Boil 7 tulsi leaves, 1/2 inch crushed ginger, and 3 crushed black peppercorns in water for 5 minutes. Strain and sip warm.',
          costProfile: 'Zero Cost (Household garden staples)',
          clinicalSuitability: 'Induces gentle diaphoresis to break fever, clears bronchial mucus, and alleviates headache.',
          safetyCaution: 'If fever persists past 72 hours, obtain a blood smear test for Dengue/Malaria.',
          availability: 'Kitchen / Local Grocery',
        },
      ],
      safetyCrossCheckWarning: 'High fever in young children (<5 years) with convulsions requires urgent emergency clinic attendance.',
    };
  }
}

// Standalone functions for UI screens
export const resolveAlternative = (query: string, lang: string = 'en'): AlternativeBundle => {
  const result = AlternativeMedicineEngine.resolveAlternatives(query, lang);
  const alt1 = result.alternatives.find(a => a.tier.includes('Jan Aushadhi')) || result.alternatives[0];
  const alt2 = result.alternatives.find(a => a.tier.includes('AYUSH')) || result.alternatives[1] || result.alternatives[0];
  const alt3 = result.alternatives.find(a => a.tier.includes('Kitchen')) || result.alternatives[2] || result.alternatives[0];

  return {
    condition: result.targetIndication,
    tier1JanAushadhi: {
      genericName: alt1.name,
      strength: alt1.activeComponent,
      estimatedGovtPrice: alt1.costProfile.split('(')[0].trim(),
      mechanism: alt1.clinicalSuitability
    },
    tier2AyushHerb: {
      botanicalName: alt2.name.split('/')[0].trim(),
      scientificName: alt2.name,
      activeConstituent: alt2.activeComponent,
      formulation: alt2.dosagePreparation,
      dosage: alt2.dosagePreparation
    },
    tier3KitchenRemedy: {
      kitchenItem: alt3.name,
      preparationMethod: alt3.dosagePreparation,
      frequency: 'Twice Daily (Morning / Evening)',
      contraindications: alt3.safetyCaution
    },
    escalationCriteria: result.safetyCrossCheckWarning
  };
};

export const getAllConditions = (): string[] => [
  'Paracetamol',
  'Diabetes',
  'Hypertension',
  'Acidity',
  'Fever',
  'Joint Pain',
  'Cough & Cold'
];
