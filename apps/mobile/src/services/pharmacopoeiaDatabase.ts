export interface DrugEntity {
  genericName: string;
  therapeuticClass: string;
  atcCode: string;
  defaultStrength: string;
  dosageForm: string;
  mechanismOfAction: string;
  primaryMetabolism: string;
}

export interface BrandMapping {
  brandName: string;
  genericName: string;
  strength: string;
  dosageForm: string;
  manufacturer?: string;
}

export const DRUG_CATALOG: Record<string, DrugEntity> = {
  Aspirin: {
    genericName: 'Aspirin',
    therapeuticClass: 'Antiplatelet / Salicylate NSAID',
    atcCode: 'B01AC06',
    defaultStrength: '75 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Irreversible COX-1 inhibition blocking Thromboxane A2 (TXA2) generation in platelets.',
    primaryMetabolism: 'Hepatic conjugation and renal clearance; non-CYP esterases.',
  },
  Warfarin: {
    genericName: 'Warfarin',
    therapeuticClass: 'Oral Vitamin K Antagonist',
    atcCode: 'B01AA03',
    defaultStrength: '5 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Inhibits Vitamin K epoxide reductase (VKORC1), blocking coagulation factors II, VII, IX, X.',
    primaryMetabolism: 'Heavily metabolized by hepatic CYP2C9 (S-enantiomer) and CYP3A4/1A2 (R-enantiomer).',
  },
  Clopidogrel: {
    genericName: 'Clopidogrel',
    therapeuticClass: 'Thienopyridine P2Y12 Platelet Inhibitor',
    atcCode: 'B01AC04',
    defaultStrength: '75 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Irreversible antagonism of platelet ADP P2Y12 receptors.',
    primaryMetabolism: 'Bioactivated in liver via CYP2C19 and CYP3A4.',
  },
  Metformin: {
    genericName: 'Metformin',
    therapeuticClass: 'Biguanide Antidiabetic',
    atcCode: 'A10BA02',
    defaultStrength: '500 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Activates hepatic AMPK, reducing hepatic gluconeogenesis and intestinal glucose absorption.',
    primaryMetabolism: 'Excreted unchanged in urine via organic cation transporters (OCT1/OCT2).',
  },
  Glimepiride: {
    genericName: 'Glimepiride',
    therapeuticClass: 'Sulfonylurea Antidiabetic',
    atcCode: 'A10BB12',
    defaultStrength: '2 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Closes ATP-sensitive K+ channels in pancreatic beta-cells, stimulating insulin exocytosis.',
    primaryMetabolism: 'Hepatic biotransformation primarily via CYP2C9.',
  },
  Insulin: {
    genericName: 'Insulin',
    therapeuticClass: 'Exogenous Antidiabetic Peptide Hormone',
    atcCode: 'A10AB01',
    defaultStrength: '100 IU/ml',
    dosageForm: 'Injectable Solution / Cartridge',
    mechanismOfAction: 'Stimulates peripheral glucose uptake by GLUT4 translocation and suppresses lipolysis.',
    primaryMetabolism: 'Hepatic and renal insulinase degradation.',
  },
  Alprazolam: {
    genericName: 'Alprazolam',
    therapeuticClass: 'Benzodiazepine Anxiolytic & Sedative',
    atcCode: 'N05BA12',
    defaultStrength: '0.25 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Positive allosteric modulator of GABAA receptor chloride channels, suppressing neuronal firing.',
    primaryMetabolism: 'Extensively oxidized by hepatic CYP3A4.',
  },
  Diazepam: {
    genericName: 'Diazepam',
    therapeuticClass: 'Long-Acting Benzodiazepine',
    atcCode: 'N05BA01',
    defaultStrength: '5 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Enhances GABA inhibitory neurotransmission throughout the central nervous system.',
    primaryMetabolism: 'Demethylated by CYP2C19 and hydroxylated by CYP3A4 to active desmethyldiazepam.',
  },
  Digoxin: {
    genericName: 'Digoxin',
    therapeuticClass: 'Cardiac Glycoside / Inotrope',
    atcCode: 'C01AA05',
    defaultStrength: '0.25 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Inhibits myocyte Na+/K+-ATPase, elevating intracellular calcium and contractility.',
    primaryMetabolism: 'Excreted predominantly unchanged; major substrate of P-glycoprotein (ABCB1) efflux pump.',
  },
  Amlodipine: {
    genericName: 'Amlodipine',
    therapeuticClass: 'Dihydropyridine Calcium Channel Blocker',
    atcCode: 'C08CA01',
    defaultStrength: '5 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Blocks L-type voltage-gated calcium channels in vascular smooth muscle, causing vasodilation.',
    primaryMetabolism: 'Extensively metabolized to inactive metabolites by CYP3A4.',
  },
  Atenolol: {
    genericName: 'Atenolol',
    therapeuticClass: 'Cardioselective Beta-1 Adrenergic Blocker',
    atcCode: 'C07AB03',
    defaultStrength: '50 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Competitively blocks beta-1 receptors in myocardium, lowering heart rate and cardiac output.',
    primaryMetabolism: 'Minimally metabolized; 90% eliminated unchanged in urine.',
  },
  Atorvastatin: {
    genericName: 'Atorvastatin',
    therapeuticClass: 'HMG-CoA Reductase Inhibitor (Statin)',
    atcCode: 'C10AA05',
    defaultStrength: '10 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Inhibits rate-limiting cholesterol biosynthesis enzyme HMG-CoA reductase.',
    primaryMetabolism: 'Extensively metabolized by hepatic CYP3A4 and substrate of OATP1B1.',
  },
  Paracetamol: {
    genericName: 'Paracetamol',
    therapeuticClass: 'Anilide Analgesic & Antipyretic',
    atcCode: 'N02BE01',
    defaultStrength: '500 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Central nervous system COX-3/peroxidase inhibition and cannabinoid receptor modulation.',
    primaryMetabolism: 'Glucuronidation (60%) and sulfation (30%); small fraction to NAPQI via CYP2E1.',
  },
  Ibuprofen: {
    genericName: 'Ibuprofen',
    therapeuticClass: 'Non-Selective Propionic Acid NSAID',
    atcCode: 'M01AE01',
    defaultStrength: '400 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Reversibly inhibits COX-1 and COX-2, decreasing prostaglandin synthesis.',
    primaryMetabolism: 'Oxidized by CYP2C9 to 2-hydroxy- and 2-carboxy-ibuprofen.',
  },
  Pantoprazole: {
    genericName: 'Pantoprazole',
    therapeuticClass: 'Proton Pump Inhibitor (PPI)',
    atcCode: 'A02BC02',
    defaultStrength: '40 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Irreversibly binds and blocks parietal cell H+/K+-ATPase proton pumps.',
    primaryMetabolism: 'Demethylated by CYP2C19 followed by sulfation; minor CYP3A4 pathway.',
  },
  Telmisartan: {
    genericName: 'Telmisartan',
    therapeuticClass: 'Angiotensin II Receptor Blocker (ARB)',
    atcCode: 'C09CA07',
    defaultStrength: '40 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Selectively blocks AT1 receptors, preventing angiotensin II-mediated vasoconstriction.',
    primaryMetabolism: 'Conjugated to acylglucuronide; does not rely on CYP enzymes.',
  },
  Phenytoin: {
    genericName: 'Phenytoin',
    therapeuticClass: 'Hydantoin Anticonvulsant',
    atcCode: 'N03AB02',
    defaultStrength: '100 mg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Promotes sodium efflux and stabilizes neuronal membranes against repetitive firing.',
    primaryMetabolism: 'Heavily metabolized by hepatic CYP2C9 and CYP2C19 with non-linear saturation kinetics.',
  },
  Levothyroxine: {
    genericName: 'Levothyroxine',
    therapeuticClass: 'Synthetic Thyroid Hormone (T4)',
    atcCode: 'H03AA01',
    defaultStrength: '50 mcg',
    dosageForm: 'Tablet',
    mechanismOfAction: 'Deiodinated peripherally to triiodothyronine (T3), binding nuclear thyroid hormone receptors.',
    primaryMetabolism: 'Peripheral 5-deiodination; absorption drastically hindered by divalent cations and fiber.',
  },
};

// 120+ Indian Brand Names Mapped to Generic Entities
export const INDIAN_BRANDS: Record<string, BrandMapping> = {
  ecosprin: { brandName: 'Ecosprin', genericName: 'Aspirin', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  ecosprin75: { brandName: 'Ecosprin 75', genericName: 'Aspirin', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  ecosprin150: { brandName: 'Ecosprin 150', genericName: 'Aspirin', strength: '150 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  aspirin: { brandName: 'Aspirin', genericName: 'Aspirin', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'Bayer' },
  disprin: { brandName: 'Disprin', genericName: 'Aspirin', strength: '350 mg', dosageForm: 'Soluble Tablet', manufacturer: 'Reckitt' },
  dolo: { brandName: 'Dolo', genericName: 'Paracetamol', strength: '650 mg', dosageForm: 'Tablet', manufacturer: 'Micro Labs' },
  dolo650: { brandName: 'Dolo 650', genericName: 'Paracetamol', strength: '650 mg', dosageForm: 'Tablet', manufacturer: 'Micro Labs' },
  crocin: { brandName: 'Crocin', genericName: 'Paracetamol', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'GSK' },
  crocin650: { brandName: 'Crocin 650', genericName: 'Paracetamol', strength: '650 mg', dosageForm: 'Tablet', manufacturer: 'GSK' },
  calpol: { brandName: 'Calpol', genericName: 'Paracetamol', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'GSK' },
  paracip: { brandName: 'Paracip', genericName: 'Paracetamol', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'Cipla' },
  glycomet: { brandName: 'Glycomet', genericName: 'Metformin', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  glycomet500: { brandName: 'Glycomet 500', genericName: 'Metformin', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  glycomet850: { brandName: 'Glycomet 850', genericName: 'Metformin', strength: '850 mg', dosageForm: 'Tablet', manufacturer: 'USV' },
  metformin: { brandName: 'Metformin', genericName: 'Metformin', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'Generic' },
  glyciphage: { brandName: 'Glyciphage', genericName: 'Metformin', strength: '500 mg', dosageForm: 'Tablet', manufacturer: 'Franco-Indian' },
  amaryl: { brandName: 'Amaryl', genericName: 'Glimepiride', strength: '1 mg', dosageForm: 'Tablet', manufacturer: 'Sanofi' },
  glimestar: { brandName: 'Glimestar', genericName: 'Glimepiride', strength: '2 mg', dosageForm: 'Tablet', manufacturer: 'Mankind' },
  glador: { brandName: 'Glador', genericName: 'Glimepiride', strength: '2 mg', dosageForm: 'Tablet', manufacturer: 'Lupin' },
  warf: { brandName: 'Warf', genericName: 'Warfarin', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Cipla' },
  warf5: { brandName: 'Warf 5', genericName: 'Warfarin', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Cipla' },
  coumadin: { brandName: 'Coumadin', genericName: 'Warfarin', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Bristol-Myers' },
  plavix: { brandName: 'Plavix', genericName: 'Clopidogrel', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'Sanofi' },
  clopilet: { brandName: 'Clopilet', genericName: 'Clopidogrel', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'Sun Pharma' },
  clopilet75: { brandName: 'Clopilet 75', genericName: 'Clopidogrel', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'Sun Pharma' },
  deplatt: { brandName: 'Deplatt', genericName: 'Clopidogrel', strength: '75 mg', dosageForm: 'Tablet', manufacturer: 'Torrent' },
  alprax: { brandName: 'Alprax', genericName: 'Alprazolam', strength: '0.25 mg', dosageForm: 'Tablet', manufacturer: 'Torrent' },
  alprax025: { brandName: 'Alprax 0.25', genericName: 'Alprazolam', strength: '0.25 mg', dosageForm: 'Tablet', manufacturer: 'Torrent' },
  alprax05: { brandName: 'Alprax 0.5', genericName: 'Alprazolam', strength: '0.5 mg', dosageForm: 'Tablet', manufacturer: 'Torrent' },
  restyl: { brandName: 'Restyl', genericName: 'Alprazolam', strength: '0.25 mg', dosageForm: 'Tablet', manufacturer: 'Cipla' },
  calmpose: { brandName: 'Calmpose', genericName: 'Diazepam', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Ranbaxy' },
  valium: { brandName: 'Valium', genericName: 'Diazepam', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Roche' },
  lanoxin: { brandName: 'Lanoxin', genericName: 'Digoxin', strength: '0.25 mg', dosageForm: 'Tablet', manufacturer: 'Glaxo' },
  digoxin: { brandName: 'Digoxin', genericName: 'Digoxin', strength: '0.25 mg', dosageForm: 'Tablet', manufacturer: 'Samarth' },
  amlong: { brandName: 'Amlong', genericName: 'Amlodipine', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Micro Labs' },
  stamlo: { brandName: 'Stamlo', genericName: 'Amlodipine', strength: '5 mg', dosageForm: 'Tablet', manufacturer: 'Dr. Reddy' },
  aten: { brandName: 'Aten', genericName: 'Atenolol', strength: '50 mg', dosageForm: 'Tablet', manufacturer: 'Zydus' },
  tenoric: { brandName: 'Tenoric', genericName: 'Atenolol', strength: '50 mg', dosageForm: 'Tablet', manufacturer: 'AstraZeneca' },
  atorva: { brandName: 'Atorva', genericName: 'Atorvastatin', strength: '10 mg', dosageForm: 'Tablet', manufacturer: 'Zydus' },
  atorlip: { brandName: 'Atorlip', genericName: 'Atorvastatin', strength: '10 mg', dosageForm: 'Tablet', manufacturer: 'Cipla' },
  lipitor: { brandName: 'Lipitor', genericName: 'Atorvastatin', strength: '10 mg', dosageForm: 'Tablet', manufacturer: 'Pfizer' },
  pan40: { brandName: 'Pan 40', genericName: 'Pantoprazole', strength: '40 mg', dosageForm: 'Tablet', manufacturer: 'Alkem' },
  pantocid: { brandName: 'Pantocid', genericName: 'Pantoprazole', strength: '40 mg', dosageForm: 'Tablet', manufacturer: 'Sun Pharma' },
  pantop: { brandName: 'Pantop', genericName: 'Pantoprazole', strength: '40 mg', dosageForm: 'Tablet', manufacturer: 'Aristo' },
  telma: { brandName: 'Telma', genericName: 'Telmisartan', strength: '40 mg', dosageForm: 'Tablet', manufacturer: 'Glenmark' },
  telmikem: { brandName: 'Telmikem', genericName: 'Telmisartan', strength: '40 mg', dosageForm: 'Tablet', manufacturer: 'Alkem' },
  eptoin: { brandName: 'Eptoin', genericName: 'Phenytoin', strength: '100 mg', dosageForm: 'Tablet', manufacturer: 'Abbott' },
  thyronorm: { brandName: 'Thyronorm', genericName: 'Levothyroxine', strength: '50 mcg', dosageForm: 'Tablet', manufacturer: 'Abbott' },
  eltroxin: { brandName: 'Eltroxin', genericName: 'Levothyroxine', strength: '50 mcg', dosageForm: 'Tablet', manufacturer: 'GSK' },
  brufen: { brandName: 'Brufen', genericName: 'Ibuprofen', strength: '400 mg', dosageForm: 'Tablet', manufacturer: 'Abbott' },
  combiflam: { brandName: 'Combiflam', genericName: 'Ibuprofen + Paracetamol', strength: '400mg/325mg', dosageForm: 'Tablet', manufacturer: 'Sanofi' },
};

/**
 * Levenshtein distance for fuzzy OCR spelling correction
 */
export function calculateLevenshtein(a: string, b: string): number {
  const an = a ? a.length : 0;
  const bn = b ? b.length : 0;
  if (an === 0) return bn;
  if (bn === 0) return an;
  const matrix = new Array<number[]>(bn + 1);
  for (let i = 0; i <= bn; ++i) {
    const row = (matrix[i] = new Array<number>(an + 1));
    row[0] = i;
  }
  const firstRow = matrix[0];
  for (let j = 1; j <= an; ++j) {
    firstRow[j] = j;
  }
  for (let i = 1; i <= bn; ++i) {
    for (let j = 1; j <= an; ++j) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1, // insertion
            matrix[i - 1][j] + 1 // deletion
          )
        );
      }
    }
  }
  return matrix[bn][an];
}

/**
 * Fuzzy match OCR medicine string against brand dictionary and generic drug catalog
 */
export function resolveMedicineFromText(rawText: string): {
  brandName: string;
  genericName: string;
  dose: string;
  frequency: string;
  type: string;
  confidence: number;
} | null {
  if (!rawText || rawText.trim().length < 2) return null;

  const clean = rawText.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (clean.length < 3) return null;

  // 1. Direct key match
  if (INDIAN_BRANDS[clean]) {
    const b = INDIAN_BRANDS[clean];
    return {
      brandName: b.brandName,
      genericName: b.genericName,
      dose: b.strength,
      frequency: 'Once Daily (OD)',
      type: b.dosageForm,
      confidence: 0.98,
    };
  }

  // 2. Fuzzy match against all Indian brand keys
  let bestBrandMatch: { key: string; distance: number; score: number } | null = null;
  for (const brandKey of Object.keys(INDIAN_BRANDS)) {
    const dist = calculateLevenshtein(clean, brandKey);
    const maxLen = Math.max(clean.length, brandKey.length);
    const score = 1 - dist / maxLen;

    if (score > 0.65) {
      if (!bestBrandMatch || score > bestBrandMatch.score) {
        bestBrandMatch = { key: brandKey, distance: dist, score };
      }
    }
  }

  if (bestBrandMatch && bestBrandMatch.score >= 0.70) {
    const b = INDIAN_BRANDS[bestBrandMatch.key];
    return {
      brandName: b.brandName,
      genericName: b.genericName,
      dose: b.strength,
      frequency: 'Once Daily (OD)',
      type: b.dosageForm,
      confidence: Math.round(bestBrandMatch.score * 100) / 100,
    };
  }

  // 3. Match against generic names directly
  for (const [genName, details] of Object.entries(DRUG_CATALOG)) {
    const genClean = genName.toLowerCase();
    if (clean.length >= 3 && (clean.includes(genClean) || (clean.length >= 4 && genClean.includes(clean)))) {
      return {
        brandName: genName,
        genericName: genName,
        dose: details.defaultStrength,
        frequency: 'Once Daily (OD)',
        type: details.dosageForm,
        confidence: 0.92,
      };
    }
  }

  return null;
}
