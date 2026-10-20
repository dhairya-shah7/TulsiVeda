import { BOTANICAL_DATABASE, BotanicalSpecies, getLocalizedBotanicalName } from './botanicalDatabase';
import { DRUG_CATALOG, INDIAN_BRANDS, resolveMedicineFromText } from './pharmacopoeiaDatabase';
import { SafetyEngine, SafetyAnalysisResult } from './safetyEngine';
import { 
  NATIONAL_CLINICAL_RECORDS, 
  ClinicalConditionRecord, 
  NationalClinicalKnowledgeEngine 
} from './nationalClinicalKnowledge';

export interface UnifiedQueryResponse {
  type: 'symptom_3tier' | 'direct_safety_check' | 'herb_vice_versa' | 'multi_herb_combination' | 'unrecognized';
  queryText: string;
  conditionRecord?: ClinicalConditionRecord;
  detectedPlant?: BotanicalSpecies;
  detectedPlants?: BotanicalSpecies[];
  detectedHerbName?: string;
  detectedDrugName?: string;
  detectedDrugGeneric?: string;
  safetyAnalysis?: SafetyAnalysisResult;
  localizedNarrationText: string;
  suggestedPrescriptionCheckHerb?: string;
  viceVersaConditions?: ClinicalConditionRecord[];
  viceVersaGenericMedicine?: {
    medicineName: string;
    genericSalt: string;
    price: string;
    conditionName: string;
  };
  multiHerbSynergy?: {
    primaryHerb: string;
    secondaryHerb: string;
    synergyNotes: string;
    precautions: string;
  };
}

export class QueryResolverService {
  /**
   * Normalize text by removing diacritics and excessive whitespace
   */
  private static cleanText(text: string): string {
    return (text || '').toLowerCase().trim();
  }

  /**
   * Detect single botanical species from text across 12 Indian languages & English
   */
  public static extractBotanicalSpecies(text: string): BotanicalSpecies | null {
    const list = this.extractAllBotanicalSpecies(text);
    return list.length > 0 ? list[0] : null;
  }

  /**
   * Detect ALL botanical species or classical formulations mentioned in query text
   */
  public static extractAllBotanicalSpecies(text: string): BotanicalSpecies[] {
    const clean = this.cleanText(text);
    if (!clean) return [];

    const found: BotanicalSpecies[] = [];

    for (const plant of BOTANICAL_DATABASE) {
      let isMatch = false;

      // 1. Scientific name check
      if (clean.includes(plant.scientificName.toLowerCase())) isMatch = true;

      // 2. English name check
      if (!isMatch && plant.englishName && clean.includes(plant.englishName.toLowerCase())) isMatch = true;

      // 3. Common name check
      if (!isMatch) {
        const commonParts = plant.commonName.toLowerCase().split(/[\/,]/).map(s => s.trim());
        if (commonParts.some(p => p.length > 2 && clean.includes(p))) isMatch = true;
      }

      // 4. Vernacular aliases check
      if (!isMatch) {
        for (const alias of plant.vernacularAliases) {
          const lowerAlias = alias.toLowerCase().trim();
          if (lowerAlias.length > 2 && clean.includes(lowerAlias)) {
            isMatch = true;
            break;
          }
        }
      }

      // 5. Hindi, Gujarati, Punjabi, Tamil
      if (!isMatch && plant.hindiName && clean.includes(plant.hindiName.toLowerCase())) isMatch = true;
      if (!isMatch && plant.gujaratiName && clean.includes(plant.gujaratiName.toLowerCase())) isMatch = true;
      if (!isMatch && plant.punjabiName && clean.includes(plant.punjabiName.toLowerCase())) isMatch = true;
      if (!isMatch && plant.tamilName && clean.includes(plant.tamilName.toLowerCase())) isMatch = true;

      if (isMatch && !found.some(f => f.scientificName === plant.scientificName)) {
        found.push(plant);
      }
    }

    return found;
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
   * Handles multi-herb queries, single-herb discovery, disease queries, and herb-drug clash checks.
   */
  public static async resolveQuery(rawQuery: string, currentLang: string = 'en'): Promise<UnifiedQueryResponse> {
    const query = this.cleanText(rawQuery);
    if (!query) {
      const emptyMsg = currentLang === 'hi' 
        ? 'कृपया अपनी बीमारी या दवा के बारे में पूछें।'
        : currentLang === 'gu'
        ? 'કૃપા કરીને તમારી બીમારી અથવા દવા વિશે પૂછો.'
        : 'Please ask a health question or describe your symptom.';

      return {
        type: 'unrecognized',
        queryText: rawQuery,
        localizedNarrationText: emptyMsg,
      };
    }

    const detectedPlants = this.extractAllBotanicalSpecies(query);
    const detectedDrug = this.extractDrugEntity(query);

    // ========================================================
    // CASE 1: MULTIPLE BOTANICALS + PRESCRIPTION DRUG CLASH
    // ========================================================
    if (detectedPlants.length >= 2 && detectedDrug) {
      const primaryPlant = detectedPlants[0];
      const safetyResult = await SafetyEngine.analyze({
        plantSpecies: primaryPlant.scientificName,
        drugGenericName: detectedDrug.genericName,
        isClinicianConfirmed: true,
      });

      const plantNamesStr = detectedPlants.map(p => getLocalizedBotanicalName(p, currentLang)).join(' + ');
      const narration = this.buildClashNarration(
        plantNamesStr,
        detectedDrug.brandOrGenericName,
        safetyResult,
        currentLang
      );

      return {
        type: 'direct_safety_check',
        queryText: rawQuery,
        detectedPlant: primaryPlant,
        detectedPlants,
        detectedHerbName: plantNamesStr,
        detectedDrugName: detectedDrug.brandOrGenericName,
        detectedDrugGeneric: detectedDrug.genericName,
        safetyAnalysis: safetyResult,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: primaryPlant.scientificName,
      };
    }

    // ========================================================
    // CASE 2: MULTIPLE BOTANICALS DETECTED (e.g. Triphala + Turmeric)
    // ========================================================
    if (detectedPlants.length >= 2) {
      const p1 = detectedPlants[0];
      const p2 = detectedPlants[1];
      const p1Name = getLocalizedBotanicalName(p1, currentLang);
      const p2Name = getLocalizedBotanicalName(p2, currentLang);

      let synergyNotes = '';
      let precautions = '';
      let narration = '';

      if (currentLang === 'hi') {
        synergyNotes = `${p1Name} और ${p2Name} का सम्मिश्रण: पाचन शोधन, चयापचय संतुलन एवं सूजन निवारण के लिए एक उत्तम शास्त्रीय आयुर्वेदिक योग है।`;
        precautions = `यदि आप रक्तचाप (BP), मधुमेह (Sugar) या खून पतला करने की कोई गोली लेते हैं, तो नीचे दिए गए बॉक्स में जांच अवश्य करें।`;
        narration = `आपने ${p1Name} और ${p2Name} के बारे में पूछा है। यह सम्मिश्रण शरीर के शोधन और सूजन निवारण के लिए गुणकारी है। यदि कोई नियमित गोली लेते हैं तो टकराव की जांच अवश्य करें।`;
      } else if (currentLang === 'gu') {
        synergyNotes = `${p1Name} અને ${p2Name}નું મિશ્રણ: પાચન શુદ્ધિ, ચયાપચય સંતુલન અને સોજાના શમન માટે શ્રેષ્ઠ શાસ્ત્રીય આયુર્વેદિક યોગ છે.`;
        precautions = `જો તમે બીપી, સુગર કે લોહી પાતળું કરવાની દવા લેતા હોવ, તો નીચેના ખાનામાં તેનું નામ લખીને ચકાસો.`;
        narration = `તમે ${p1Name} અને ${p2Name} વિશે પૂછ્યું છે. આ આયુર્વેદિક યોગ પાચન અને સ્વાસ્થ્ય માટે હિતકારી છે. કોઈ એલોપેથિક દવા ચાલુ હોય તો નીચે વિરોધાભાસ ચકાસો.`;
      } else {
        synergyNotes = `Combination of ${p1Name} and ${p2Name}: Traditional Ayurvedic synergy providing dual benefits of deep digestive detoxification, tissue rejuvenation, and systemic anti-inflammatory protection.`;
        precautions = `If you take prescription medications (blood pressure, diabetes, or anticoagulants), check below to ensure no metabolic clearance clashes occur.`;
        narration = `You asked about combining ${p1Name} with ${p2Name}. This classical combination supports digestive balance and anti-inflammatory wellness. Please check with your ongoing prescription tablets below.`;
      }

      return {
        type: 'multi_herb_combination',
        queryText: rawQuery,
        detectedPlant: p1,
        detectedPlants,
        detectedHerbName: `${p1Name} + ${p2Name}`,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: p1.scientificName,
        multiHerbSynergy: {
          primaryHerb: p1Name,
          secondaryHerb: p2Name,
          synergyNotes,
          precautions,
        },
      };
    }

    // ========================================================
    // CASE 3: 1 BOTANICAL + 1 PHARMACEUTICAL DRUG CLASH
    // ========================================================
    if (detectedPlants.length === 1 && detectedDrug) {
      const plant = detectedPlants[0];
      const safetyResult = await SafetyEngine.analyze({
        plantSpecies: plant.scientificName,
        drugGenericName: detectedDrug.genericName,
        isClinicianConfirmed: true,
      });

      const plantDisplayName = getLocalizedBotanicalName(plant, currentLang);
      const narration = this.buildClashNarration(
        plantDisplayName,
        detectedDrug.brandOrGenericName,
        safetyResult,
        currentLang
      );

      return {
        type: 'direct_safety_check',
        queryText: rawQuery,
        detectedPlant: plant,
        detectedPlants: [plant],
        detectedHerbName: plantDisplayName,
        detectedDrugName: detectedDrug.brandOrGenericName,
        detectedDrugGeneric: detectedDrug.genericName,
        safetyAnalysis: safetyResult,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: plant.scientificName,
      };
    }

    // ========================================================
    // CASE 4: CLINICAL SYMPTOM / DISEASE -> 3-TIER TREATMENT
    // ========================================================
    const matchedConditions = NationalClinicalKnowledgeEngine.searchBySymptomOrCondition(rawQuery, currentLang);
    if (matchedConditions && matchedConditions.length > 0) {
      const condition = matchedConditions[0];
      const narration = this.buildConditionNarration(condition, currentLang);
      
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

    // ========================================================
    // CASE 5: SINGLE HERB / FORMULATION / LIQUID -> VICE-VERSA LOOKUP
    // ========================================================
    if (detectedPlants.length === 1) {
      const detectedPlant = detectedPlants[0];
      const plantSciLower = detectedPlant.scientificName.toLowerCase();
      const plantCommonLower = detectedPlant.commonName.toLowerCase();
      const localizedName = getLocalizedBotanicalName(detectedPlant, currentLang);

      // Find conditions in National Clinical Knowledge that match this botanical
      const matchingConditions = NATIONAL_CLINICAL_RECORDS.filter(rec => {
        const ayushSci = rec.ayushClassicalFormulation.scientificBotanical.toLowerCase();
        const ayushForm = rec.ayushClassicalFormulation.formulationName.toLowerCase();
        const kitchenItem = rec.verifiedHomeRemedy.kitchenItem.toLowerCase();
        const kitchenPrep = rec.verifiedHomeRemedy.preparationMethod.toLowerCase();

        return ayushSci.includes(plantSciLower) || 
               ayushForm.includes(plantCommonLower) ||
               kitchenItem.includes(plantCommonLower) ||
               kitchenPrep.includes(plantCommonLower) ||
               detectedPlant.traditionalUses.some(use => rec.typicalSymptoms.some(s => s.toLowerCase().includes(use.toLowerCase())));
      });

      const primaryCond = matchingConditions.length > 0 
        ? NationalClinicalKnowledgeEngine.getLocalizedRecord(matchingConditions[0], currentLang)
        : null;

      let viceVersaGenericMedicine = undefined;
      if (primaryCond) {
        viceVersaGenericMedicine = {
          medicineName: primaryCond.officialGeneric.medicineName,
          genericSalt: primaryCond.officialGeneric.genericSalt,
          price: primaryCond.officialGeneric.pmbjpPriceINR,
          conditionName: primaryCond.conditionName,
        };
      }

      let narration = '';
      if (currentLang === 'hi') {
        narration = primaryCond
          ? `${localizedName} का मुख्य उपयोग ${primaryCond.conditionName} के लिए होता है। इसके समान सरकारी जन औषधि दवा है: ${primaryCond.officialGeneric.medicineName} (मूल्य ${primaryCond.officialGeneric.pmbjpPriceINR})।`
          : `${localizedName} (${detectedPlant.scientificName})। मुख्य घटक: ${detectedPlant.activeConstituents.join(', ')}। पारंपरिक उपयोग: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}।`;
      } else if (currentLang === 'gu') {
        narration = primaryCond
          ? `${localizedName}નો મુખ્ય ઉપયોગ ${primaryCond.conditionName} માટે થાય છે. આના જેવી સરકારી જન ઔષધિ દવા છે: ${primaryCond.officialGeneric.medicineName} (કિંમત ${primaryCond.officialGeneric.pmbjpPriceINR})।`
          : `${localizedName} (${detectedPlant.scientificName})। મુખ્ય ઘટકો: ${detectedPlant.activeConstituents.join(', ')}। પરંપરાગત ઉપયોગ: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}।`;
      } else if (currentLang === 'pa') {
        narration = primaryCond
          ? `${localizedName} ਦਾ ਮੁੱਖ ਉਪਯੋਗ ${primaryCond.conditionName} ਲਈ ਹੁੰਦਾ ਹੈ। ਇਸਦੇ ਸਮਾਨ ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ: ${primaryCond.officialGeneric.medicineName}।`
          : `${localizedName} (${detectedPlant.scientificName})। ਮੁੱਖ ਘਟਕ: ${detectedPlant.activeConstituents.join(', ')}।`;
      } else {
        narration = primaryCond
          ? `${localizedName} is indicated for ${primaryCond.conditionName}. Its Jan Aushadhi generic equivalent is ${primaryCond.officialGeneric.medicineName} (${primaryCond.officialGeneric.pmbjpPriceINR}).`
          : `${localizedName} (${detectedPlant.scientificName}). Active compounds: ${detectedPlant.activeConstituents.join(', ')}. Primary indications: ${detectedPlant.traditionalUses.slice(0, 3).join(', ')}.`;
      }

      return {
        type: 'herb_vice_versa',
        queryText: rawQuery,
        detectedPlant,
        detectedPlants: [detectedPlant],
        detectedHerbName: localizedName,
        conditionRecord: primaryCond || undefined,
        viceVersaConditions: matchingConditions.map(c => NationalClinicalKnowledgeEngine.getLocalizedRecord(c, currentLang)),
        viceVersaGenericMedicine,
        localizedNarrationText: narration,
        suggestedPrescriptionCheckHerb: detectedPlant.scientificName,
      };
    }

    // ========================================================
    // CASE 6: FALLBACK FOR UNLISTED QUERY
    // ========================================================
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
      const lower = botanicalOrRemedyName.toLowerCase();
      if (lower.includes('turmeric') || lower.includes('haldi') || lower.includes('curcuma') || lower.includes('હળદર')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Curcuma longa') || null;
      } else if (lower.includes('triphala') || lower.includes('trifala') || lower.includes('ત્રિફળા') || lower.includes('त्रिफला')) {
        plant = BOTANICAL_DATABASE.find(p => p.commonName.includes('Triphala')) || null;
      } else if (lower.includes('shilajit') || lower.includes('salajeet') || lower.includes('શિલાજીત') || lower.includes('शिलाजीत')) {
        plant = BOTANICAL_DATABASE.find(p => p.commonName.includes('Shilajit')) || null;
      } else if (lower.includes('tulsi') || lower.includes('ocimum') || lower.includes('तुलसी') || lower.includes('તુલસી')) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Ocimum sanctum') || null;
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

    const plantDisplayName = plant ? getLocalizedBotanicalName(plant, currentLang) : botanicalOrRemedyName;
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
