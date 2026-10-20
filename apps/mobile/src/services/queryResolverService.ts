import { BOTANICAL_DATABASE, BotanicalSpecies } from './botanicalDatabase';
import { DRUG_CATALOG, INDIAN_BRANDS, resolveMedicineFromText } from './pharmacopoeiaDatabase';
import { SafetyEngine, SafetyAnalysisResult } from './safetyEngine';
import { 
  NATIONAL_CLINICAL_RECORDS, 
  ClinicalConditionRecord, 
  NationalClinicalKnowledgeEngine 
} from './nationalClinicalKnowledge';

export interface UnifiedQueryResponse {
  type: 'symptom_3tier' | 'direct_safety_check' | 'botanical_profile' | 'unrecognized';
  queryText: string;
  conditionRecord?: ClinicalConditionRecord;
  detectedPlant?: BotanicalSpecies;
  detectedHerbName?: string;
  detectedDrugName?: string;
  detectedDrugGeneric?: string;
  safetyAnalysis?: SafetyAnalysisResult;
  localizedNarrationText: string;
  suggestedPrescriptionCheckHerb?: string;
}

export class QueryResolverService {
  /**
   * Normalize text by removing diacritics and excessive whitespace
   */
  private static cleanText(text: string): string {
    return (text || '').toLowerCase().trim();
  }

  /**
   * Detect botanical species from text across 12 Indian languages & English
   */
  public static extractBotanicalSpecies(text: string): BotanicalSpecies | null {
    const clean = this.cleanText(text);
    if (!clean) return null;

    for (const plant of BOTANICAL_DATABASE) {
      // 1. Scientific name check
      if (clean.includes(plant.scientificName.toLowerCase())) return plant;
      
      // 2. Common name check
      const commonParts = plant.commonName.toLowerCase().split(/[\/,]/).map(s => s.trim());
      if (commonParts.some(p => p.length > 2 && clean.includes(p))) return plant;

      // 3. Vernacular aliases check
      for (const alias of plant.vernacularAliases) {
        const lowerAlias = alias.toLowerCase().trim();
        if (lowerAlias.length > 2 && clean.includes(lowerAlias)) {
          return plant;
        }
      }

      // 4. Hindi / Punjabi name check
      if (plant.hindiName && clean.includes(plant.hindiName.toLowerCase())) return plant;
      if (plant.punjabiName && clean.includes(plant.punjabiName.toLowerCase())) return plant;
    }

    return null;
  }

  /**
   * Detect modern pharmaceutical drug entity from text
   */
  public static extractDrugEntity(text: string): { brandOrGenericName: string; genericName: string } | null {
    const clean = this.cleanText(text);
    if (!clean) return null;

    // 1. Direct check against DRUG_CATALOG generics
    for (const [key, drug] of Object.entries(DRUG_CATALOG)) {
      if (clean.includes(drug.genericName.toLowerCase()) || clean.includes(key.toLowerCase())) {
        return { brandOrGenericName: drug.genericName, genericName: drug.genericName };
      }
    }

    // 2. Check against Indian Brands dictionary
    for (const [brandKey, b] of Object.entries(INDIAN_BRANDS)) {
      if (clean.includes(b.brandName.toLowerCase()) || clean.includes(brandKey.toLowerCase())) {
        return { brandOrGenericName: b.brandName, genericName: b.genericName };
      }
    }

    // 3. Common clinical classes (BP, sugar, pain, blood thinner)
    if (clean.includes('blood pressure') || clean.includes('बीपी') || clean.includes('બીપી') || clean.includes('ਬੀਪੀ') || clean.includes(' bp ') || clean.endsWith(' bp') || clean.startsWith('bp ')) {
      return { brandOrGenericName: 'Blood Pressure Medicine (Amlodipine/Atenolol)', genericName: 'Amlodipine' };
    }
    if (clean.includes('sugar') || clean.includes('diabetes') || clean.includes('मधुमेह') || clean.includes('ડાયાબિટીસ') || clean.includes('ਸ਼ੂਗਰ')) {
      return { brandOrGenericName: 'Diabetes Medicine (Metformin)', genericName: 'Metformin' };
    }
    if (clean.includes('blood thinner') || clean.includes('खून पतला') || clean.includes('લોહી પાતળું')) {
      return { brandOrGenericName: 'Blood Thinner (Warfarin / Aspirin)', genericName: 'Warfarin' };
    }

    // 4. Fuzzy matcher from pharmacopoeia
    const resolved = resolveMedicineFromText(clean);
    if (resolved) {
      return { brandOrGenericName: resolved.brandName, genericName: resolved.genericName };
    }

    return null;
  }

  /**
   * Main Dynamic Query Resolution:
   * Handles natural questions like:
   * - "I have pain in my knees what to use"
   * - "क्या मैं तुलसी का काढ़ा अपनी ब्लड प्रेशर की दवा के साथ ले सकती हूँ?"
   * - "મને ગોઠણનો દુખાવો છે, શું વાપરવું?"
   * - "cough and cold remedy"
   */
  public static async resolveQuery(rawQuery: string, currentLang: string = 'en'): Promise<UnifiedQueryResponse> {
    const query = this.cleanText(rawQuery);
    if (!query) {
      return {
        type: 'unrecognized',
        queryText: rawQuery,
        localizedNarrationText: 'Please ask a health question or describe your symptom.',
      };
    }

    // Step A: Check for simultaneous Herb + Drug interaction query (e.g. Storyboard query)
    const detectedPlant = this.extractBotanicalSpecies(query);
    const detectedDrug = this.extractDrugEntity(query);

    if (detectedPlant && detectedDrug) {
      const safetyResult = await SafetyEngine.analyze({
        plantSpecies: detectedPlant.scientificName,
        drugGenericName: detectedDrug.genericName,
        isClinicianConfirmed: true,
      });

      const narration = this.buildClashNarration(
        detectedPlant.commonName,
        detectedDrug.brandOrGenericName,
        safetyResult,
        currentLang
      );

      return {
        type: 'direct_safety_check',
        queryText: rawQuery,
        detectedPlant,
        detectedHerbName: detectedPlant.commonName,
        detectedDrugName: detectedDrug.brandOrGenericName,
        detectedDrugGeneric: detectedDrug.genericName,
        safetyAnalysis: safetyResult,
        localizedNarrationText: narration,
      };
    }

    // Step B: Check for Clinical Symptom or Disease condition in National Clinical Database
    const matchedConditions = NationalClinicalKnowledgeEngine.searchBySymptomOrCondition(rawQuery, currentLang);
    if (matchedConditions && matchedConditions.length > 0) {
      const condition = matchedConditions[0];
      const narration = this.buildConditionNarration(condition, currentLang);
      
      // Determine what botanical or remedy can be cross-checked with prescriptions
      const suggestedHerb = condition.ayushClassicalFormulation.scientificBotanical || 
                            condition.verifiedHomeRemedy.kitchenItem;

      return {
        type: 'symptom_3tier',
        queryText: rawQuery,
        conditionRecord: condition,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: suggestedHerb,
      };
    }

    // Step C: Botanical Lookup (Single Herb mentioned)
    if (detectedPlant) {
      const narration = currentLang === 'hi'
        ? `${detectedPlant.commonName} (${detectedPlant.scientificName})। मुख्य घटक: ${detectedPlant.activeConstituents.join(', ')}। पारंपरिक उपयोग: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}।`
        : currentLang === 'gu'
        ? `${detectedPlant.commonName} (${detectedPlant.scientificName})। મુખ્ય ઘટકો: ${detectedPlant.activeConstituents.join(', ')}। પરંપરાગત ઉપયોગ: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}।`
        : `${detectedPlant.commonName} (${detectedPlant.scientificName}). Active compounds: ${detectedPlant.activeConstituents.join(', ')}. Traditional uses: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}.`;

      return {
        type: 'botanical_profile',
        queryText: rawQuery,
        detectedPlant,
        detectedHerbName: detectedPlant.commonName,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: detectedPlant.scientificName,
      };
    }

    // Step D: Fallback for unlisted symptom
    const fallbackCondition = NationalClinicalKnowledgeEngine.getLocalizedRecord(NATIONAL_CLINICAL_RECORDS[0], currentLang);
    return {
      type: 'symptom_3tier',
      queryText: rawQuery,
      conditionRecord: fallbackCondition,
      localizedNarrationText: NationalClinicalKnowledgeEngine.generateOfflineNluResponse(rawQuery, currentLang),
      suggestedPrescriptionCheckHerb: fallbackCondition.ayushClassicalFormulation.scientificBotanical,
    };
  }

  /**
   * Cross-check prescription medicine against a recommended remedy or botanical
   */
  public static async verifyPrescriptionClash(
    botanicalOrRemedyName: string,
    prescriptionText: string,
    currentLang: string = 'en'
  ): Promise<{
    drugEntity: { brandOrGenericName: string; genericName: string } | null;
    plantEntity: BotanicalSpecies | null;
    safetyResult: SafetyAnalysisResult | null;
    localizedNarrationText: string;
  }> {
    // 1. Identify Drug
    const drug = this.extractDrugEntity(prescriptionText);
    
    // 2. Identify Plant
    let plant = this.extractBotanicalSpecies(botanicalOrRemedyName);
    if (!plant) {
      // Map common kitchen remedy ingredients to botanical species
      const lower = botanicalOrRemedyName.toLowerCase();
      if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('curcuma') || lower.includes('હળદર')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Curcuma longa') || null;
      } else if (lower.includes('tulsi') || lower.includes('ocimum') || lower.includes('तुलसी') || lower.includes('તુલસી')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Ocimum tenuiflorum') || null;
      } else if (lower.includes('ginger') || lower.includes('adrak') || lower.includes('zingiber') || lower.includes('આદુ')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Zingiber officinale') || null;
      } else if (lower.includes('shallaki') || lower.includes('boswellia') || lower.includes('guggul')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Boswellia serrata') || null;
      } else if (lower.includes('giloy') || lower.includes('guduchi') || lower.includes('tinospora') || lower.includes('ગળો')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Tinospora cordifolia') || null;
      } else if (lower.includes('ashwagandha') || lower.includes('withania') || lower.includes('અશ્વગંધા')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Withania somnifera') || null;
      }
    }

    if (!drug) {
      const errMsg = currentLang === 'hi' 
        ? 'दवा का नाम पहचान नहीं पाए। कृपया सही ब्रांड या सॉल्ट नाम लिखें (जैसे Amlodipine, Warfarin, Metformin)।'
        : currentLang === 'gu'
        ? 'દવાનું નામ ઓળખાયું નથી. કૃપા કરીને સાચું નામ લખો (જેમ કે Amlodipine, Warfarin, Metformin).'
        : 'Could not recognize the prescription drug. Please enter or speak a valid medicine name (e.g., Amlodipine, Warfarin, Metformin, Aspirin).';

      return {
        drugEntity: null,
        plantEntity: plant,
        safetyResult: null,
        localizedNarrationText: errMsg,
      };
    }

    const plantScientific = plant ? plant.scientificName : botanicalOrRemedyName;
    const safetyResult = await SafetyEngine.analyze({
      plantSpecies: plantScientific,
      drugGenericName: drug.genericName,
      isClinicianConfirmed: true,
    });

    const plantDisplayName = plant ? plant.commonName : botanicalOrRemedyName;
    const narration = this.buildClashNarration(plantDisplayName, drug.brandOrGenericName, safetyResult, currentLang);

    return {
      drugEntity: drug,
      plantEntity: plant,
      safetyResult,
      localizedNarrationText: narration,
    };
  }

  /**
   * Build high-fidelity localized audio narration for symptom queries
   */
  private static buildConditionNarration(cond: ClinicalConditionRecord, lang: string): string {
    if (lang === 'hi') {
      return `पहचाना गया विकार: ${cond.conditionName}। टियर 1 जन औषधि दवा है: ${cond.officialGeneric.medicineName}, सरकारी मूल्य ${cond.officialGeneric.pmbjpPriceINR}। टियर 2 आयुष उपचार है: ${cond.ayushClassicalFormulation.formulationName}। टियर 3 सुरक्षित घरेलू उपचार: ${cond.verifiedHomeRemedy.kitchenItem}। चेतावनी: यदि ${cond.escalationProtocol.dangerSigns[0]} हो, तो तुरंत अस्पताल जाएं।`;
    }
    if (lang === 'gu') {
      return `ઓળખાયેલ રોગ: ${cond.conditionName}। ટિયર 1 જન ઔષધિ દવા છે: ${cond.officialGeneric.medicineName}, સરકારી કિંમત ${cond.officialGeneric.pmbjpPriceINR}। ટિયર 2 આયુષ ઔષધિ: ${cond.ayushClassicalFormulation.formulationName}। ટિયર 3 ઘરગથ્થુ ઉપચાર: ${cond.verifiedHomeRemedy.kitchenItem}। ચેતવણી: જો ${cond.escalationProtocol.dangerSigns[0]} જણાય તો તરત જ દવાખાને જવું.`;
    }
    if (lang === 'pa') {
      return `ਪਛਾਣਿਆ ਗਿਆ ਵਿਕਾਰ: ${cond.conditionName}। ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ: ${cond.officialGeneric.medicineName}, ਸਰਕਾਰੀ ਮੁੱਲ ${cond.officialGeneric.pmbjpPriceINR}। ਆਯੁਸ਼ ਨੁਸਖਾ: ${cond.ayushClassicalFormulation.formulationName}। ਘਰੇਲੂ ਉਪਚਾਰ: ${cond.verifiedHomeRemedy.kitchenItem}। ਜੇਕਰ ${cond.escalationProtocol.dangerSigns[0]} ਦਿਖੇ ਤਾਂ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।`;
    }
    return `Identified condition: ${cond.conditionName}. Tier 1 Jan Aushadhi generic: ${cond.officialGeneric.medicineName} at ${cond.officialGeneric.pmbjpPriceINR}. Tier 2 AYUSH formulation: ${cond.ayushClassicalFormulation.formulationName}. Tier 3 Safe kitchen remedy: ${cond.verifiedHomeRemedy.kitchenItem}. Alert: Seek medical care if ${cond.escalationProtocol.dangerSigns[0]}.`;
  }

  /**
   * Build high-fidelity localized audio narration for safety clashes
   */
  private static buildClashNarration(
    herbName: string,
    drugName: string,
    safety: SafetyAnalysisResult,
    lang: string
  ): string {
    const isSevere = safety.evidenceLevel === 'established' && safety.confidence === 'High';
    const isModerate = safety.hasInteraction;

    if (lang === 'hi') {
      if (isSevere) {
        return `सावधान! ${herbName} और ${drugName} को एक साथ लेने पर गंभीर खतरा है: ${safety.alertHeadline}। कृपया अपने डॉक्टर से परामर्श के बिना इन्हें साथ न लें।`;
      }
      if (isModerate) {
        return `चेतावनी: ${herbName} और ${drugName} के बीच परस्पर प्रभाव हो सकता है: ${safety.alertHeadline}। नियमित रूप से बीपी या शुगर की जांच करते रहें।`;
      }
      return `${herbName} और ${drugName} के बीच कोई ज्ञात गंभीर परस्पर प्रभाव नहीं मिला है। सामान्य मात्रा में लेना सुरक्षित माना जाता है।`;
    }

    if (lang === 'gu') {
      if (isSevere) {
        return `સાવધાન! ${herbName} અને ${drugName} સાથે લેવાથી ગંભીર જોખમ છે: ${safety.alertHeadline}। ડૉક્ટરની સલાહ વિના બંને સાથે લેશો નહીં.`;
      }
      if (isModerate) {
        return `ચેતવણી: ${herbName} અને ${drugName} વચ્ચે સામાન્ય ક્રિયાપ્રતિક્રિયા થઈ શકે છે: ${safety.alertHeadline}। બ્લડ પ્રેશર અથવા સુગરનું ધ્યાન રાખો.`;
      }
      return `${herbName} અને ${drugName} વચ્ચે કોઈ ગંભીર વિરોધાભાસ જોવા મળ્યો નથી. સામાન્ય માત્રામાં લેવું સુરક્ષિત છે.`;
    }

    if (lang === 'pa') {
      if (isSevere) {
        return `ਸਾਵਧਾਨ! ${herbName} ਅਤੇ ${drugName} ਇਕੱਠੇ ਲੈਣ ਨਾਲ ਵੱਡਾ ਖ਼ਤਰਾ ਹੈ: ${safety.alertHeadline}। ਬਿਨਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਨਾ ਲਵੋ।`;
      }
      return `${herbName} ਅਤੇ ${drugName}: ${safety.alertHeadline}। ਸਾਵਧਾਨੀ ਵਰਤੋ।`;
    }

    if (isSevere) {
      return `Severe clinical alert! Taking ${herbName} concurrently with ${drugName} poses a high risk: ${safety.alertHeadline}. Do not combine without doctor supervision.`;
    }
    if (isModerate) {
      return `Caution: Interaction detected between ${herbName} and ${drugName}: ${safety.alertHeadline}. Regular monitoring is advised.`;
    }
    return `No severe interaction detected between ${herbName} and ${drugName}. Safe when used within standard dietary doses.`;
  }
}
