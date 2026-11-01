import { BioMistralDrugResolver } from './bioMistralDrugResolver.ts';
import { BOTANICAL_DATABASE, BotanicalSpecies, getLocalizedBotanicalName } from './botanicalDatabase';
import { DRUG_CATALOG, INDIAN_BRANDS, resolveMedicineFromText } from './pharmacopoeiaDatabase';
import { SafetyEngine, SafetyAnalysisResult } from './safetyEngine';
import { 
  NATIONAL_CLINICAL_RECORDS, 
  ClinicalConditionRecord, 
  NationalClinicalKnowledgeEngine 
} from './nationalClinicalKnowledge';
import { EmergencyTriageService, EmergencyCase } from './emergencyTriageService';
import { DynamicResearchService } from './dynamicResearchService';

export interface UnifiedQueryResponse {
  type: 'symptom_3tier' | 'direct_safety_check' | 'herb_vice_versa' | 'multi_herb_combination' | 'emergency_red_flag' | 'unrecognized';
  queryText: string;
  isEmergency?: boolean;
  emergencyCase?: EmergencyCase;
  isDynamicResearch?: boolean;
  researchCitation?: string;
  conditionRecord?: ClinicalConditionRecord;
  detectedPlant?: BotanicalSpecies;
  detectedPlants?: BotanicalSpecies[];
  detectedHerbName?: string;
  detectedDrugName?: string;
  detectedDrugGeneric?: string;
  safetyAnalysis?: SafetyAnalysisResult;
  initialClashResult?: {
    drugEntity: { brandOrGenericName: string; genericName: string } | null;
    plantEntity: BotanicalSpecies | null;
    safetyResult: SafetyAnalysisResult | null;
    localizedNarrationText: string;
    localizedHeadline?: string;
  };
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
    // Direct Indic medicine name match
    if (/(ওয়ারফারিন|वारफारिन|વોરફેરિન|வார்ஃபரின்|వార్ఫరిన్|ਖੂਨ ਪਤਲਾ|রক্ত পাতলা|खून पतला|લોહી પાતળું)/i.test(clean)) {
      return { brandOrGenericName: 'Warfarin', genericName: 'Warfarin' };
    }
    if (/(অ্যাসপিরিন|एस्पिरिन|એસ્પિરિન|ஆஸ்பிரின்|ਐਸਪਰੀਨ)/i.test(clean)) {
      return { brandOrGenericName: 'Aspirin', genericName: 'Aspirin' };
    }
    if (/(মেটফর্মিন|मेटफॉर्मिन|મેટફોર્મિન|மெட்ஃபோர்மின்|మెట్‌ఫార్మిన్|ਮੈਟਫਾਰਮਿਨ)/i.test(clean)) {
      return { brandOrGenericName: 'Metformin', genericName: 'Metformin' };
    }
    if (/(অ্যামলোডিপিন|एम्लोडिपाइन|એમ્લોડિપાઇન|ஆம்லோடிபைன்|ఆమ్లోడిపైన్|ਐਮਲੋਡੀਪਾਈਨ)/i.test(clean)) {
      return { brandOrGenericName: 'Amlodipine', genericName: 'Amlodipine' };
    }
    const hasMedWord = /(dawa|medicine|tablet|goli|pill|ki goli|ki dawa|capsule|इलाज|દવા|ગોળી|ਗੋਲੀ|ওষুধ|ট্যাবলেট|மருந்து|మందు)/i.test(clean);
    if ((clean.includes('blood pressure') || clean.includes('बीपी') || clean.includes('બીપી') || clean.includes('ਬੀਪੀ') || clean.includes(' bp ') || clean.endsWith(' bp') || clean.startsWith('bp ')) && (hasMedWord || clean.includes('bp '))) {
      return { brandOrGenericName: 'Blood Pressure Medicine (Amlodipine/Atenolol)', genericName: 'Amlodipine' };
    }
    if ((clean.includes('sugar') || clean.includes('diabetes') || clean.includes('मधुमेह') || clean.includes('ડાયાબિટીસ') || clean.includes('ਸ਼ੂਗਰ')) && hasMedWord) {
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

    // 5. BioMistral-7B Real-Time Dynamic Drug & Pharmacokinetic Salt Inference
    const synthesized = BioMistralDrugResolver.synthesizeDrugEntity(clean);
    if (synthesized) {
      return { brandOrGenericName: synthesized.brandName, genericName: synthesized.genericName };
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

    // Compute symptom-only query (strip detected drug names & common conjunctions)
    let symptomOnlyQuery = query;
    if (detectedDrug) {
      const drugLower = detectedDrug.genericName.toLowerCase();
      const brandLower = detectedDrug.brandOrGenericName.toLowerCase();
      symptomOnlyQuery = symptomOnlyQuery
        .split(drugLower).join(' ')
        .split(brandLower).join(' ')
        .replace(/\b(and|with|aur|ke sath|ke saath|tatha|or|plus|\+|\&|ane|sathe|ate|naal|medicine|goli|tablet|dawa)\b/gi, ' ')
        .replace(/\s+/g, ' ')
        .trim();
    }

    // ========================================================
    // CASE 0: EMERGENCY RED-FLAG & TRIAGE DETECTION (108 SOS)
    // ========================================================
    const emergencyCase = EmergencyTriageService.evaluateEmergency(rawQuery);
    if (emergencyCase) {
      const localizedAlert = emergencyCase.voiceAlertText[currentLang] || emergencyCase.voiceAlertText['en'];
      return {
        type: 'emergency_red_flag',
        queryText: rawQuery,
        isEmergency: true,
        emergencyCase,
        localizedNarrationText: localizedAlert,
      };
    }

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
    const conditionSearchQuery = (symptomOnlyQuery && symptomOnlyQuery.length > 2) ? symptomOnlyQuery : rawQuery;
    const lowerQuery = conditionSearchQuery.toLowerCase();
    const isEar = /ear|कान|কান|காத|చెవ|ಕಿವಿ|ചെവ|କାନ|otitis/i.test(lowerQuery);
    const isEye = /eye|vision|आंख|આંખ|চোখ|கண்|కన్ను|കണ്ണ്/i.test(lowerQuery);
    const isSkin = /skin|rash|itch|eczema|चर्म|खुजली|ચામડી|ખંજવાળ|চুলকানি|ঘা|தோல்|దురద/i.test(lowerQuery);
    const isKnee = /knee|घुटने|સાંધા|હাঁটু|ગોઠણ|ముழங்கால்|మోకాలు/i.test(lowerQuery);
    const isDental = /tooth|teeth|dental|gum|दांत|દાંત|দাঁত|பல்|పన్ను/i.test(lowerQuery);

    const matchedConditions = NationalClinicalKnowledgeEngine.searchBySymptomOrCondition(conditionSearchQuery, currentLang);
    
    let isAnatomicalMismatch = false;
    if (matchedConditions && matchedConditions.length > 0) {
      const top = matchedConditions[0];
      if (isEar && top.bodySystem !== 'ENT') isAnatomicalMismatch = true;
      if (isEye && top.bodySystem !== 'Ophthalmology') isAnatomicalMismatch = true;
      if (isSkin && top.bodySystem !== 'Dermatological') isAnatomicalMismatch = true;
      if (isKnee && top.bodySystem !== 'Musculoskeletal') isAnatomicalMismatch = true;
      if (isDental && top.bodySystem !== 'Dental') isAnatomicalMismatch = true;
    }

    if (matchedConditions && matchedConditions.length > 0 && !isAnatomicalMismatch) {
      const condition = matchedConditions[0];
      const narration = this.buildConditionNarration(condition, currentLang);
      
      let suggestedHerb = condition.ayushClassicalFormulation.scientificBotanical || 
                            condition.verifiedHomeRemedy.kitchenItem;
      let initialClash: any = null;

      // If a drug was present in the query (e.g. "Knee pain with Warfarin" or "घुटनों में दर्द और Warfarin"), auto-run clash engine!
      if (detectedDrug) {
        const candidateHerbs = [
          condition.ayushClassicalFormulation?.scientificBotanical,
          condition.verifiedHomeRemedy?.kitchenItem,
          condition.ayushClassicalFormulation?.formulationName,
        ].filter(Boolean) as string[];

        for (const herb of candidateHerbs) {
          const clash = await this.verifyPrescriptionClash(herb, detectedDrug.genericName, currentLang);
          if (clash && clash.safetyResult && clash.safetyResult.hasInteraction) {
            initialClash = clash;
            suggestedHerb = herb;
            break;
          }
          if (!initialClash) {
            initialClash = clash;
            suggestedHerb = herb;
          }
        }
      }

      return {
        type: 'symptom_3tier',
        queryText: rawQuery,
        conditionRecord: condition,
        detectedDrugName: detectedDrug?.brandOrGenericName,
        detectedDrugGeneric: detectedDrug?.genericName,
        initialClashResult: initialClash,
        localizedNarrationText: narration + (initialClash?.safetyResult?.hasInteraction ? ('\n\n⚠️ ' + initialClash.localizedHeadline) : ''),
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
    // CASE 5B: SINGLE PHARMACEUTICAL DRUG QUERY (e.g. "Paracetamol", "Amlodipine")
    // ========================================================
    if (detectedDrug && detectedPlants.length === 0 && (!symptomOnlyQuery || symptomOnlyQuery.length <= 2)) {
      const genericLower = detectedDrug.genericName.toLowerCase();
      const brandLower = detectedDrug.brandOrGenericName.toLowerCase();
      const drugMatchingCondition = NATIONAL_CLINICAL_RECORDS.find(rec => {
        const medName = rec.officialGeneric.medicineName.toLowerCase();
        const salt = rec.officialGeneric.genericSalt.toLowerCase();
        return medName.includes(genericLower) || salt.includes(genericLower) ||
               medName.includes(brandLower) || salt.includes(brandLower);
      });

      if (drugMatchingCondition) {
        const localizedCondition = NationalClinicalKnowledgeEngine.getLocalizedRecord(drugMatchingCondition, currentLang);
        const narration = this.buildConditionNarration(localizedCondition, currentLang);
        return {
          type: 'symptom_3tier',
          queryText: rawQuery,
          conditionRecord: localizedCondition,
          detectedDrugName: detectedDrug.brandOrGenericName,
          detectedDrugGeneric: detectedDrug.genericName,
          localizedNarrationText: narration,
          suggestedPrescriptionCheckHerb: localizedCondition.ayushClassicalFormulation.scientificBotanical,
        };
      }
    }

    // ========================================================
    // CASE 6: OUT-OF-DATABASE QUERY -> DYNAMIC MEDICAL RESEARCH FALLBACK
    // ========================================================
    try {
      const dynSearchQuery = (symptomOnlyQuery && symptomOnlyQuery.length > 2) ? symptomOnlyQuery : rawQuery;
      const dynamicResearch = await DynamicResearchService.researchAndSynthesize(dynSearchQuery, currentLang);
      if (dynamicResearch && dynamicResearch.record) {
        const localizedCondition = NationalClinicalKnowledgeEngine.getLocalizedRecord(dynamicResearch.record, currentLang);
        const narration = this.buildConditionNarration(localizedCondition, currentLang);

        let initialClash: any = null;
        let suggestedHerb = localizedCondition.ayushClassicalFormulation.scientificBotanical || 
                              localizedCondition.verifiedHomeRemedy.kitchenItem;

        // Auto-run clash engine for dynamically synthesized condition if drug present
        if (detectedDrug) {
          const dynCandidates = [
            localizedCondition.ayushClassicalFormulation?.scientificBotanical,
            localizedCondition.verifiedHomeRemedy?.kitchenItem,
            localizedCondition.ayushClassicalFormulation?.formulationName,
          ].filter(Boolean) as string[];

          for (const herb of dynCandidates) {
            const clash = await this.verifyPrescriptionClash(herb, detectedDrug.genericName, currentLang);
            if (clash && clash.safetyResult && clash.safetyResult.hasInteraction) {
              initialClash = clash;
              suggestedHerb = herb;
              break;
            }
            if (!initialClash) {
              initialClash = clash;
              suggestedHerb = herb;
            }
          }
        }

        return {
          type: 'symptom_3tier',
          queryText: rawQuery,
          conditionRecord: localizedCondition,
          detectedDrugName: detectedDrug?.brandOrGenericName,
          detectedDrugGeneric: detectedDrug?.genericName,
          initialClashResult: initialClash,
          localizedNarrationText: narration + (initialClash?.safetyResult?.hasInteraction ? ('\n\n⚠️ ' + initialClash.localizedHeadline) : ''),
          suggestedPrescriptionCheckHerb: suggestedHerb,
          isDynamicResearch: true,
          researchCitation: dynamicResearch.sourceCitation,
        };
      }
    } catch (dynErr) {
      console.warn('[QueryResolver] Dynamic research fallback error:', dynErr);
    }

    let unrecognizedNarration = '';
    if (currentLang.startsWith('hi')) {
      unrecognizedNarration = `हम "${rawQuery}" के लिए कोई सत्यापित सरकारी प्राथमिक स्वास्थ्य प्रोटोकॉल नहीं ढूंढ पाए। कृपया गलत दवा या अप्रमाणित घरेलू उपचार से बचने के लिए निकटतम प्राथमिक स्वास्थ्य केंद्र (PHC) के डॉक्टर से संपर्क करें।`;
    } else if (currentLang.startsWith('gu')) {
      unrecognizedNarration = `અમે "${rawQuery}" માટે કોઈ ચકાસાયેલ રાષ્ટ્રીય સારવાર માર્ગદર્શિકા શોધી શક્યા નથી. કૃપા કરીને યોગ્ય તપાસ માટે નજીકના પ્રાથમિક આરોગ્ય કેન્દ્ર (PHC) અથવા ડૉક્ટરનો સંપર્ક કરો.`;
    } else if (currentLang.startsWith('pa')) {
      unrecognizedNarration = `ਤੁਹਾਡੇ ਵੱਲੋਂ ਖੋਜੇ ਗਏ ਸ਼ਬਦ "${rawQuery}" ਲਈ ਕੋਈ ਪ੍ਰਮਾਣਿਤ ਸਰਕਾਰੀ ਕਲੀਨਿਕਲ ਪ੍ਰੋਟੋਕੋਲ ਨਹੀਂ ਮਿਲਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਨੇੜਲੇ ਸਰਕਾਰੀ ਹਸਪਤਾਲ ਜਾਂ ਡਾਕਟਰ ਨਾਲ ਸੰਪਰਕ ਕਰੋ।`;
    } else {
      unrecognizedNarration = `No verified national clinical protocol found matching "${rawQuery}". To prevent clinical misguidance, please consult an ASHA worker or Medical Officer at your nearest Primary Health Centre (PHC).`;
    }

    return {
      type: 'unrecognized',
      queryText: rawQuery,
      localizedNarrationText: unrecognizedNarration,
    };
  }

  /**
   * Cross-check prescription medicine against a recommended remedy or botanical
   */
  
  /**
   * Localize pharmaceutical drug names across Indic languages
   */
  public static getLocalDrugName(drugName: string, lang: string): string {
    const l = (lang || 'en').toLowerCase().slice(0, 2);
    const dLower = (drugName || '').toLowerCase();

    if (dLower.includes('warfarin')) {
      if (l === 'bn') return 'ওয়ারফারিন (রক্ত পাতলা করার ওষুধ)';
      if (l === 'hi') return 'वारफारिन (खून पतला करने की दवा)';
      if (l === 'gu') return 'વોરફેરિન (લોહી પાતળું કરવાની દવા)';
      if (l === 'mr') return 'वॉर्फरिन (रक्त पातळ करण्याचे औषध)';
      if (l === 'ta') return 'வார்ஃபரின் (ரத்த நீர்த்துப்போகும் மருந்து)';
      if (l === 'te') return 'వార్ఫరిన్ (రక్తం పలుచన చేసే మందు)';
      if (l === 'pa') return 'ਵਾਰਫਰੀਨ (ਖੂਨ ਪਤਲਾ ਕਰਨ ਵਾਲੀ ਦਵਾਈ)';
      return 'Warfarin (Blood Thinner)';
    }

    if (dLower.includes('amlodipine') || dLower.includes('atenolol') || dLower.includes('blood pressure')) {
      if (l === 'bn') return 'অ্যামলোডিপিন (রক্তচাপ / প্রেশারের ওষুধ)';
      if (l === 'hi') return 'एम्लोडिपाइन (ब्लड प्रेशर / बीपी की दवा)';
      if (l === 'gu') return 'એમ્લોડિપાઇન (બ્લડ પ્રેશર / બીપીની દવા)';
      if (l === 'mr') return 'अम्लोडिपाइन (बीपीचे औषध)';
      if (l === 'ta') return 'ஆம்லோடிபைன் (ரத்த அழுத்த மருந்து)';
      if (l === 'te') return 'ఆమ్లోడిపైన్ (రక్తపోటు మందు)';
      if (l === 'pa') return 'ਐਮਲੋਡੀਪਾਈਨ (ਬੀਪੀ ਦੀ ਦਵਾਈ)';
      return 'Amlodipine (Blood Pressure Medicine)';
    }

    if (dLower.includes('metformin') || dLower.includes('diabetes') || dLower.includes('sugar')) {
      if (l === 'bn') return 'মেটফর্মিন (রক্তের শর্করার / সুগারের ওষুধ)';
      if (l === 'hi') return 'मेटफॉर्मिन (मधुमेह / शुगर की दवा)';
      if (l === 'gu') return 'મેટફોર્મિન (ડાયાબિટીસ / સુગરની દવા)';
      if (l === 'mr') return 'मेटफॉर्मिन (मधुमेहाचे औषध)';
      if (l === 'ta') return 'மெட்ஃபோர்மின் (சர்க்கரை நோய் மருந்து)';
      if (l === 'te') return 'మెట్‌ఫార్మిన్ (మధుమేహం మందు)';
      if (l === 'pa') return 'ਮੈਟਫਾਰਮਿਨ (ਸ਼ੂਗਰ ਦੀ ਦਵਾਈ)';
      return 'Metformin (Diabetes Medicine)';
    }

    if (dLower.includes('aspirin')) {
      if (l === 'bn') return 'অ্যাসপিরিন';
      if (l === 'hi') return 'एस्पिरिन';
      if (l === 'gu') return 'એસ્પિરિન';
      if (l === 'mr') return 'अ‍ॅस्पिरिन';
      if (l === 'ta') return 'ஆஸ்பிரின்';
      if (l === 'te') return 'ఆస్ప్రిన్';
      if (l === 'pa') return 'ਐਸਪਰੀਨ';
      return 'Aspirin';
    }

    if (dLower.includes('paracetamol')) {
      if (l === 'bn') return 'প্যারাসিটামল';
      if (l === 'hi') return 'पैरासिटामोल';
      if (l === 'gu') return 'પેરાસીટામોલ';
      return 'Paracetamol';
    }

    return drugName;
  }

  public static async verifyPrescriptionClash(
    botanicalOrRemedyName: string,
    prescriptionText: string,
    currentLang: string = 'en'
  ): Promise<{
    drugEntity: { brandOrGenericName: string; genericName: string } | null;
    plantEntity: BotanicalSpecies | null;
    safetyResult: SafetyAnalysisResult | null;
    localizedNarrationText: string;
    localizedHeadline?: string;
  }> {
    // 1. Identify Drug
    const drug = this.extractDrugEntity(prescriptionText);
    
    // 2. Identify Plant across all 12 Indian languages & English
    let plant = this.extractBotanicalSpecies(botanicalOrRemedyName);
    if (!plant) {
      const lower = (botanicalOrRemedyName || '').toLowerCase();
      if (/turmeric|haldi|curcuma|हल्दी|હળદર|হলুদ|হলদি|हळद|மஞ்சள்|పసుపు|ಅರಿಶಿನ|മഞ്ഞൾ|ਹਲਦੀ|হালধি|ହଳଦୀ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Curcuma longa') || null;
      } else if (/shallaki|boswellia|salai|guggul|guggulu|शल्लकी|सलाई|गुग्गुल|શલ્લકી|ગૂગળ|শল্লকী|শাল্লাকি|শাল্লকি|குங்கிலியம்|గుగ్గిలం|ಗುಗ್ಗುಳ|ഗുൽഗുലു|ଗୁଗ୍ଗୁଳ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Boswellia serrata') || null;
      } else if (/triphala|trifala|त्रिफला|ત્રિફળા|ত্রিফলা|திரிபலா|త్రిఫల|ತ್ರಿಫಲ|ത്രിഫല|ତ୍ରିଫଳା/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.commonName.includes('Triphala')) || null;
      } else if (/shilajit|salajeet|शिलाजीत|શિલાજીત|শিলাজিৎ|சிலாஜித்|శిలాజిత్|ಶಿಲಾಜಿತ್|ശിലാജിത്|ଶିଳାଜିତ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.commonName.includes('Shilajit')) || null;
      } else if (/tulsi|ocimum|तुलसी|તુલસી|তুলসী|തുളസി|துளசி|తులసి|ತುಳಸಿ|ਤੁਲਸੀ|ତୁଳସୀ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Ocimum sanctum') || null;
      } else if (/ginger|adrak|shunthi|sonth|zingiber|अदरक|सोंठ|આદુ|સૂંઠ|আদা|শুঁঠ|இஞ்சி|சுக்கு|అల్లం|శొంఠి|ಶುಂಠಿ|ഇഞ്ചി|ଅଦା/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Zingiber officinale') || null;
      } else if (/garlic|lahsun|allium|लहसुन|લસણ|রসুন|রশুন|பூண்டு|వెల్లుల్లి|ಬೆಳ್ಳುಳ್ಳಿ|വെളുത്തുള്ളി|ରସୁଣ|নহৰু/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Allium sativum') || null;
      } else if (/black pepper|kali mirch|piper|mari|काली मिर्च|કાળા મરી|গোলমরিচ|মিளகு|మిరియాలు|ಕಾಳುಮೆಣಸು|കുരുമുളക്|ଗୋଲମରିଚ|জালুক/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Piper nigrum') || null;
      } else if (/giloy|guduchi|tinospora|गिलोय|गुडुची|ગળો|ગિલોય|গুলঞ্চ|গিলয়|சீந்தில்|తిప్పతీగ|ಅಮೃತಬಳ್ಳಿ|ചിറ്റമൃത്|ଗୁଳୁଚି/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Tinospora cordifolia') || null;
      } else if (/ashwagandha|withania|अश्वगंधा|અશ્વગંધા|অশ্বগন্ধা|அமுக்கிரா|అశ్వగంధ|ಅಶ್ವಗಂಧ|അമുക്കുരം|ଅଶ୍ୱଗନ୍ଧା/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Withania somnifera') || null;
      } else if (/licorice|mulethi|yashtimadhu|मुलेठी|यष्टिमधु|જેઠીમધ|যষ্টিমধু|அதிமதுரம்|அতিమధురం|ಜೇಷ್ಠಮಧು|ഇരട്ടിമധുരം|ଯଷ୍ଟିମଧୁ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Glycyrrhiza glabra') || null;
      } else if (/clove|laung|lavanga|syzygium|लौंग|લવિંગ|লবঙ্গ|கிராம்பு|లవంగం|ಲವಂಗ|ഗ്രാമ്പൂ|ଲବଙ୍ଗ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Syzygium aromaticum') || null;
      } else if (/cinnamon|dalchini|cinnamomum|दालचीनी|તજ|দারুচিনি|பட்டை|దాల్చినచెక్క|ದಾಲ್ಚಿನ್ನಿ|കറുവപ്പട്ട|ଡାଲଚିନି/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Cinnamomum verum') || null;
      } else if (/fenugreek|methi|trigonella|मेथी|મેથી|মেথি|வெந்தயம்|మెంతులు|ಮೆಂತ್ಯ|ഉലുവ|ମେଥି/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Trigonella foenum-graecum') || null;
      } else if (/neem|azadirachta|नीम|લીમડો|নিম|വേപ്പ്|வேம்பு|వేప|ಬೇವು|ନିମ୍ବ/i.test(lower)) {
        plant = BOTANICAL_DATABASE.find(p => p.scientificName === 'Azadirachta indica') || null;
      }
    }

    if (!drug) {
      let errMsg = 'Could not recognize the prescription drug. Please enter or speak a valid medicine name (e.g., Warfarin, Amlodipine, Metformin, Aspirin).';
      const l = (currentLang || 'en').toLowerCase().slice(0, 2);
      if (l === 'hi') {
        errMsg = 'दवा का नाम पहचान नहीं पाए। कृपया सही ब्रांड या सॉल्ट नाम लिखें (जैसे Amlodipine, Warfarin, Metformin, Aspirin)।';
      } else if (l === 'gu') {
        errMsg = 'દવાનું નામ ઓળખાયું નથી. કૃપા કરીને સાચું નામ લખો (જેમ કે Amlodipine, Warfarin, Metformin, Aspirin).';
      } else if (l === 'bn') {
        errMsg = 'প্রেসক্রিপশন ওষুধের নাম শনাক্ত করা যায়নি। অনুগ্রহ করে সঠিক নাম লিখুন (যেমন Warfarin, Amlodipine, Metformin, Aspirin)।';
      } else if (l === 'mr') {
        errMsg = 'औषधाचे नाव ओळखता आले नाही. कृपया योग्य नाव लिहा (उदा. Amlodipine, Warfarin, Metformin, Aspirin).';
      } else if (l === 'ta') {
        errMsg = 'மருந்தின் பெயரை அடையாளம் காண முடியவில்லை. தயவுசெய்து சரியான பெயரை உள்ளிடவும் (எ.கா. Amlodipine, Warfarin, Metformin, Aspirin).';
      } else if (l === 'te') {
        errMsg = 'మందు పేరు గుర్తించబడలేదు. దయచేసి సరైన పేరు రాయండి (ఉదా: Amlodipine, Warfarin, Metformin, Aspirin).';
      } else if (l === 'pa') {
        errMsg = 'ਦਵਾਈ ਦਾ ਨਾਮ ਨਹੀਂ ਪਛਾਣਿਆ ਗਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਸਹੀ ਨਾਮ ਲਿਖੋ (ਜਿਵੇਂ Warfarin, Amlodipine, Metformin, Aspirin)।';
      }

      return {
        drugEntity: null,
        plantEntity: plant,
        safetyResult: null,
        localizedNarrationText: errMsg,
      };
    }

    const plantScientific = plant ? plant.scientificName : (botanicalOrRemedyName.includes('Curcuma') ? 'Curcuma longa' : botanicalOrRemedyName);
    const safetyResult = await SafetyEngine.analyze({
      plantSpecies: plantScientific,
      drugGenericName: drug.genericName,
      isClinicianConfirmed: true,
    });

    const plantDisplayName = plant ? getLocalizedBotanicalName(plant, currentLang) : botanicalOrRemedyName;
    const localizedDrugName = this.getLocalDrugName(drug.brandOrGenericName, currentLang);
    const narration = this.buildClashNarration(plantDisplayName, localizedDrugName, safetyResult, currentLang);
    const headline = this.buildClashHeadline(safetyResult, currentLang);

    return {
      drugEntity: drug,
      plantEntity: plant,
      safetyResult,
      localizedNarrationText: narration,
      localizedHeadline: headline,
    };
  }

  /**
   * Build high-fidelity localized audio narration for symptom queries
   */
  private static buildConditionNarration(cond: ClinicalConditionRecord, lang: string): string {
    const l = (lang || 'en').toLowerCase();
    if (l.startsWith('hi')) {
      return `पहचाना गया विकार: ${cond.conditionName}। टियर 1 जन औषधि दवा है: ${cond.officialGeneric.medicineName}, सरकारी मूल्य ${cond.officialGeneric.pmbjpPriceINR}। टियर 2 आयुष उपचार है: ${cond.ayushClassicalFormulation.formulationName}। टियर 3 सुरक्षित घरेलू उपचार: ${cond.verifiedHomeRemedy.kitchenItem}। चेतावनी: यदि ${cond.escalationProtocol.dangerSigns[0]} हो, तो तुरंत अस्पताल जाएं।`;
    }
    if (l.startsWith('gu')) {
      return `ઓળખાયેલ રોગ: ${cond.conditionName}। ટિયર 1 જન ઔષધિ દવા છે: ${cond.officialGeneric.medicineName}, સરકારી કિંમત ${cond.officialGeneric.pmbjpPriceINR}। ટિયર 2 આયુષ ઔષધિ: ${cond.ayushClassicalFormulation.formulationName}। ટિયર 3 ઘરગથ્થુ ઉપચાર: ${cond.verifiedHomeRemedy.kitchenItem}। ચેતવણી: જો ${cond.escalationProtocol.dangerSigns[0]} જણાય તો તરત જ દવાખાને જવું.`;
    }
    if (l.startsWith('pa')) {
      return `ਪਛਾਣਿਆ ਗਿਆ ਵਿਕਾਰ: ${cond.conditionName}। ਜਨ ਔਸ਼ਧੀ ਦਵਾਈ: ${cond.officialGeneric.medicineName}, ਸਰਕਾਰੀ ਮੁੱਲ ${cond.officialGeneric.pmbjpPriceINR}। ਆਯੁਸ਼ ਨੁਸਖਾ: ${cond.ayushClassicalFormulation.formulationName}। ਘਰੇਲੂ ਉਪਚਾਰ: ${cond.verifiedHomeRemedy.kitchenItem}। ਜੇਕਰ ${cond.escalationProtocol.dangerSigns[0]} ਦਿਖੇ ਤਾਂ ਤੁਰੰਤ ਹਸਪਤਾਲ ਜਾਓ।`;
    }
    if (l.startsWith('mr')) {
      return `निदान झालेला आजार: ${cond.conditionName}। टियर १ जन औषधी: ${cond.officialGeneric.medicineName}, शासकीय किंमत ${cond.officialGeneric.pmbjpPriceINR}। टियर २ आयुष उपाय: ${cond.ayushClassicalFormulation.formulationName}। टियर ३ सुरक्षित घरगुती उपाय: ${cond.verifiedHomeRemedy.kitchenItem}। इशारा: जर ${cond.escalationProtocol.dangerSigns[0]} आढळल्यास ताबडतोब रुग्णालयात जा.`;
    }
    if (l.startsWith('ta')) {
      return `கண்டறியப்பட்ட நிலை: ${cond.conditionName}। அடுக்கு 1 மக்கள் மருந்தக மருந்து: ${cond.officialGeneric.medicineName}, அரசு விலை ${cond.officialGeneric.pmbjpPriceINR}। அடுக்கு 2 ஆயுஷ் மூலிகை: ${cond.ayushClassicalFormulation.formulationName}। அடுக்கு 3 வீட்டு வைத்தியம்: ${cond.verifiedHomeRemedy.kitchenItem}। எச்சரிக்கை: ${cond.escalationProtocol.dangerSigns[0]} இருந்தால் உடனே மருத்துவமனைக்கு செல்லவும்.`;
    }
    if (l.startsWith('te')) {
      return `గుర్తించబడిన వ్యాధి: ${cond.conditionName}। టైర్ 1 జన ఔషధి: ${cond.officialGeneric.medicineName}, ప్రభుత్వ ధర ${cond.officialGeneric.pmbjpPriceINR}। టైర్ 2 ఆయుష్ చికిత్స: ${cond.ayushClassicalFormulation.formulationName}। టైర్ 3 సురక్షిత ఇంటి చిట్కా: ${cond.verifiedHomeRemedy.kitchenItem}। హెచ్చరిక: ${cond.escalationProtocol.dangerSigns[0]} కనిపిస్తే వెంటనే ఆసుపత్రికి వెళ్లండి.`;
    }
    if (l.startsWith('kn')) {
      return `ಗುರುತಿಸಲಾದ ಸ್ಥಿತಿ: ${cond.conditionName}। ಶ್ರೇಣಿ 1 ಜನೌಷಧಿ: ${cond.officialGeneric.medicineName}, ಸರ್ಕಾರಿ ಬೆಲೆ ${cond.officialGeneric.pmbjpPriceINR}। ಶ್ರೇಣಿ 2 ಆಯುಷ್ ಸೂತ್ರೀಕರಣ: ${cond.ayushClassicalFormulation.formulationName}। ಶ್ರೇಣಿ 3 ಮನೆಮದ್ದು: ${cond.verifiedHomeRemedy.kitchenItem}। ಎಚ್ಚರಿಕೆ: ${cond.escalationProtocol.dangerSigns[0]} ಕಂಡುಬಂದರೆ ಕೂಡಲೇ ಆಸ್ಪತ್ರೆಗೆ ಭೇಟಿ ನೀಡಿ.`;
    }
    if (l.startsWith('ml')) {
      return `തിരിച്ചറിഞ്ഞ അവസ്ഥ: ${cond.conditionName}। ടയർ 1 ജനൗഷധി മരുന്ന്: ${cond.officialGeneric.medicineName}, സർക്കാർ വില ${cond.officialGeneric.pmbjpPriceINR}। ടയർ 2 ആയുഷ് ചികിത്സ: ${cond.ayushClassicalFormulation.formulationName}। ടയർ 3 സുരക്ഷിത വീട്ടുവൈദ്യം: ${cond.verifiedHomeRemedy.kitchenItem}। മുന്നറിയിപ്പ്: ${cond.escalationProtocol.dangerSigns[0]} ഉണ്ടെങ്കിൽ ഉടൻ ആശുപത്രിയിൽ പോകുക.`;
    }
    if (l.startsWith('bn')) {
      return `শনাক্তকৃত অবস্থা: ${cond.conditionName}। টিয়ার ১ জন ঔষধি: ${cond.officialGeneric.medicineName}, সরকারি মূল্য ${cond.officialGeneric.pmbjpPriceINR}। টিয়ার ২ আয়ুশ প্রতিকার: ${cond.ayushClassicalFormulation.formulationName}। টিয়ার ৩ নিরাপদ ঘরোয়া দাওয়াই: ${cond.verifiedHomeRemedy.kitchenItem}। সতর্কতা: যদি ${cond.escalationProtocol.dangerSigns[0]} দেখা দেয় তবে অবিলম্বে হাসপাতালে যান।`;
    }
    if (l.startsWith('or')) {
      return `ଚିହ୍ନଟ ହୋଇଥିବା ରୋଗ: ${cond.conditionName}। ଟିୟର ୧ ଜନ ଔଷଧି: ${cond.officialGeneric.medicineName}, ସରକାରୀ ମୂଲ୍ୟ ${cond.officialGeneric.pmbjpPriceINR}। ଟିୟର ୨ ଆୟୁଷ ଚିକିତ୍ସା: ${cond.ayushClassicalFormulation.formulationName}। ଟିୟର ୩ ସୁରକ୍ଷିତ ଘରୋଇ ଉପଚାର: ${cond.verifiedHomeRemedy.kitchenItem}। ଚେତାବନୀ: ଯଦି ${cond.escalationProtocol.dangerSigns[0]} ଦେଖାଯାଏ ତୁରନ୍ତ ଡାକ୍ତରଖାନା ଯାଆନ୍ତୁ।`;
    }
    if (l.startsWith('as')) {
      return `শনাক্ত কৰা অৱস্থা: ${cond.conditionName}। টিয়াৰ ১ জন ঔষধি: ${cond.officialGeneric.medicineName}, চৰকাৰী মূল্য ${cond.officialGeneric.pmbjpPriceINR}। টিয়াৰ ২ আয়ুষ নিদান: ${cond.ayushClassicalFormulation.formulationName}। টিয়াৰ ৩ সুৰক্ষিত ঘৰুৱা নিদান: ${cond.verifiedHomeRemedy.kitchenItem}। সতৰ্কবাণী: যদি ${cond.escalationProtocol.dangerSigns[0]} দেখা দিয়ে, তৎক্ষণাৎ চিকিৎসালয়লৈ যাওক।`;
    }
    return `Identified condition: ${cond.conditionName}. Government generic medicine: ${cond.officialGeneric.medicineName} at ${cond.officialGeneric.pmbjpPriceINR}. Herbal & Ayurvedic care: ${cond.ayushClassicalFormulation.formulationName}. Safe home remedy: ${cond.verifiedHomeRemedy.kitchenItem}. Alert: Seek medical care if ${cond.escalationProtocol.dangerSigns[0]}.`;
  }

  /**
   * Build high-fidelity localized audio narration for safety clashes
   */
  /**
   * Translate clinical adverse effects into pure vernacular terms
   */
  public static getLocalizedAdverseEffect(safety: SafetyAnalysisResult, lang: string): string {
    const l = (lang || 'en').toLowerCase().slice(0, 2);
    const text = ((safety.interactionType || '') + ' ' + (safety.alertHeadline || '')).toLowerCase();

    if (text.includes('bleed') || text.includes('hemorrhage') || text.includes('inr') || text.includes('clot') || text.includes('warfarin') || text.includes('cyp2c9')) {
      if (l === 'hi') return 'आंतरिक रक्तस्राव और खून अत्यधिक पतला होने का गंभीर खतरा';
      if (l === 'gu') return 'આંતરિક રક્તસ્રાવ અને લોહી વધુ પડતું પાતળું થવાનું જોખમ';
      if (l === 'bn') return 'অভ্যন্তরীণ রক্তপাত এবং রক্ত অতিরিক্ত পাতলা হওয়ার ঝুঁকি';
      if (l === 'mr') return 'अंगातून रक्तस्त्राव आणि रक्त प्रमाणाबाहेर पातळ होण्याचा धोका';
      if (l === 'ta') return 'உள் ரத்தப்போக்கு மற்றும் ரத்தம் அளவுக்கு அதிகமாக நீர்த்துப்போகும் அபாயம்';
      if (l === 'te') return 'అంతర్గత రక్తస్రావం మరియు రక్తం అతిగా పలుచనయ్యే ప్రమాదం';
      if (l === 'pa') return 'ਅੰਦਰੂਨੀ ਖੂਨ ਵਹਿਣ ਅਤੇ ਖੂਨ ਬਹੁਤ ਪਤਲਾ ਹੋਣ ਦਾ ਵੱਡਾ ਖ਼ਤਰਾ';
      if (l === 'kn') return 'ಆಂತರಿಕ ರಕ್ತಸ್ರಾವ ಮತ್ತು ರಕ್ತ ಅತಿಯಾಗಿ ತೆಳುವಾಗುವ ಅಪಾಯ';
      if (l === 'ml') return 'ആന്തരിക രക്തസ്രാവവും രക്തം അമിതമായി നേർക്കാനുള്ള സാധ്യതയും';
      if (l === 'or') return 'ଅନ୍ତଃ ରକ୍ତସ୍ରାବ ଏବଂ ରକ୍ତ ଅତ୍ୟଧିକ ପତଳା ହେବାର ଆଶଙ୍କା';
      if (l === 'as') return 'আভ্যন্তৰীণ ৰক্তক্ষৰণ আৰু তেজ অত্যাধিক পাতল হোৱাৰ আশংকা';
      return 'Increased internal bleeding and antiplatelet hemorrhage risk';
    }

    if (text.includes('hypoglycem') || text.includes('sugar') || text.includes('glucose')) {
      if (l === 'hi') return 'रक्त शर्करा (शुगर) अचानक बहुत कम होने का जोखिम';
      if (l === 'gu') return 'બ્લડ સુગર અચાનક ખૂબ જ ઘટી જવાનું જોખમ';
      if (l === 'bn') return 'রক্তে শর্করার মাত্রা বিপজ্জনকভাবে কমে যাওয়ার ঝুঁকি';
      if (l === 'mr') return 'रक्तातील साखर अचानक खूप कमी होण्याचा धोका';
      if (l === 'ta') return 'ரத்த சர்க்கரை அளவு ஆபத்தான அளவுக்கு குறையும் அபாயம்';
      if (l === 'te') return 'రక్తంలో చక్కెర స్థాయిలు తీవ్రంగా పడిపోయే ప్రమాదం';
      if (l === 'pa') return 'ਬਲੱਡ ਸ਼ੂਗਰ ਬਹੁਤ ਜ਼ਿਆਦਾ ਘੱਟ ਜਾਣ ਦਾ ਖ਼ਤਰਾ';
      if (l === 'kn') return 'ರಕ್ತದಲ್ಲಿ ಸಕ್ಕರೆ ಅಂಶ ತೀವ್ರವಾಗಿ ಕುಸಿಯುವ ಅಪಾಯ';
      if (l === 'ml') return 'രക്തത്തിലെ പഞ്ചസാരയുടെ അളവ് പെട്ടെന്ന് കുറയാനുള്ള സാധ്യത';
      if (l === 'or') return 'ରକ୍ତରେ ଶର୍କରା ହଠାତ୍ ବହୁତ କମିଯିବାର ବିପଦ';
      if (l === 'as') return 'তেজত চেনিৰ মাত্ৰা হঠাতে অতিশয় কমি যোৱাৰ সম্ভাৱনা';
      return 'Severe drop in blood glucose (Hypoglycemia risk)';
    }

    if (text.includes('hypoten') || text.includes('blood pressure') || text.includes('bp drop')) {
      if (l === 'hi') return 'रक्तचाप (बीपी) अचानक बहुत कम होने और चक्कर आने का जोखिम';
      if (l === 'gu') return 'બ્લડ પ્રેશર અચાનક ઘટી જવાનું અને ચક્કર આવવાનું જોખમ';
      if (l === 'bn') return 'রক্তচাপ অতিরিক্ত কমে যাওয়া এবং মাথা ঘোরার ঝুঁকি';
      if (l === 'mr') return 'रक्तदाब अचानक कमी होऊन भोवळ येण्याचा धोका';
      if (l === 'ta') return 'ரத்த அழுத்தம் திடீரென குறைந்து தலைசுற்றல் ஏற்படும் அபாயம்';
      if (l === 'te') return 'రక్తపోటు పడిపోయి కళ్లు తిరిగే ప్రమాదం';
      if (l === 'pa') return 'ਬਲੱਡ ਪ੍ਰੈਸ਼ਰ ਅਚਾਨਕ ਡਿੱਗਣ ਅਤੇ ਚੱਕਰ ਆਉਣ ਦਾ ਖ਼ਤਰਾ';
      if (l === 'kn') return 'ರಕ್ತದೊತ್ತಡ ಹಠಾತ್ ಇಳಿಕೆಯಾಗಿ ತಲೆತಿರುಗುವ ಅಪಾಯ';
      if (l === 'ml') return 'രക്തസമ്മർദ്ദം പെട്ടെന്ന് താഴാനും തലകറക്കത്തിനും സാധ്യത';
      if (l === 'or') return 'ରକ୍ତଚାପ ହଠାତ୍ କମିଯିବା ଏବଂ ମୁଣ୍ଡ ବୁଲାଇବା ଆଶଙ୍କା';
      if (l === 'as') return 'ৰক্তচাপ হঠাতে কমি মূৰ ঘূৰোৱাৰ আশংকা';
      return 'Additive blood pressure reduction and postural hypotension';
    }

    if (text.includes('sedat') || text.includes('somnolence') || text.includes('sleep') || text.includes('drows')) {
      if (l === 'hi') return 'अत्यधिक सुस्ती, गहरी नींद और बेहोशी का जोखिम';
      if (l === 'gu') return 'અતિશય સુસ્તી, ઘેરી ઊંઘ અને ચક્કર આવવાનું જોખમ';
      if (l === 'bn') return 'অতিরিক্ত তন্দ্রাচ্ছন্নতা এবং অজ্ঞান হয়ে যাওয়ার ঝুঁকি';
      if (l === 'mr') return 'अतिप्रमाणात झोप आणि सुस्ती येण्याचा धोका';
      if (l === 'ta') return 'அதிக மயக்கம் மற்றும் அதிக தூக்க கலக்கம் ஏற்படும் அபாயம்';
      if (l === 'te') return 'అతి నిద్ర మరియు మత్తు కలిగే ప్రమాదం';
      if (l === 'pa') return 'ਬਹੁਤ ਜ਼ਿਆਦਾ ਸੁਸਤੀ ਅਤੇ ਨੀਂਦ ਆਉਣ ਦਾ ਖ਼ਤਰਾ';
      if (l === 'kn') return 'ಅತಿಯಾದ ನಿದ್ರೆ ಮತ್ತು ನಿಶ್ಯಕ್ತಿಯ ಅಪಾಯ';
      if (l === 'ml') return 'അമിതമായ ഉറക്കവും ആലസ്യവും ഉണ്ടാവാനുള്ള സാധ്യത';
      if (l === 'or') return 'ଅତ୍ୟଧିକ ନିଦ୍ରାଳୁତା ଏବଂ ମୁଣ୍ଡ ବୁଲାଇବା ବିପଦ';
      if (l === 'as') return 'অত্যধিক টোপনি আৰু অৱসাদৰ আশংকা';
      return 'Excessive sedation and CNS depression risk';
    }

    if (l === 'hi') return 'यकृत (लिवर) एंजाइम पर प्रतिकूल प्रभाव और दुष्प्रभाव का जोखिम';
    if (l === 'gu') return 'લિવર એન્ઝાઇમ પર અસર અને દવાની આડઅસર વધવાનું જોખમ';
    if (l === 'bn') return 'লিভার এনজাইমের ওপর ক্ষতিকর প্রভাব ও ওষুধের পার্শ্বপ্রতিক্রিয়ার ঝুঁকি';
    if (l === 'mr') return 'यकृताच्या कार्यावर परिणाम होऊन दुष्परिणाम वाढण्याचा धोका';
    if (l === 'ta') return 'கல்லீரல் நொதிகளில் பாதிப்பு மற்றும் பக்கவிளைவுகள் அதிகரிக்கும் அபாயம்';
    if (l === 'te') return 'కాలేయ ఎంజైమ్‌లపై ప్రతికూల प्रभावం మరియు దుష్ప్రభావాల ప్రమాదం';
    if (l === 'pa') return 'ਲਿਵਰ ਉੱਤੇ ਮਾੜਾ ਅਸਰ ਅਤੇ ਮਾੜੇ ਪ੍ਰਭਾਵਾਂ ਦਾ ਖ਼ਤਰਾ';
    if (l === 'kn') return 'ಯಕೃತ್ತಿನ ಕಿಣ್ವಗಳ ಮೇಲೆ ಪ್ರತಿಕೂಲ ಪರಿಣಾಮ ಮತ್ತು ಅಡ್ಡಪರಿಣಾಮಗಳ ಅಪಾಯ';
    if (l === 'ml') return 'കരളിന്റെ പ്രവർത്തനത്തെ ബാധിക്കാനും പാർശ്വഫലങ്ങൾ കൂടാനും സാധ്യത';
    if (l === 'or') return 'ଯକୃତ ଉପରେ ପ୍ରତିକୂଳ ପ୍ରଭାବ ଏବଂ ପାର୍ଶ୍ୱ ପ୍ରତିକ୍ରିୟା ବୃଦ୍ଧି';
    if (l === 'as') return 'যকৃতৰ ওপৰত বিৰূপ প্ৰভাৱ আৰু পাৰ্শ্বক্ৰিয়াৰ আশংকা';
    return 'Metabolic enzyme conflict and increased adverse reaction risk';
  }

  /**
   * Build clean headline for clash result in user native language
   */
  public static buildClashHeadline(safety: SafetyAnalysisResult, lang: string): string {
    const l = (lang || 'en').toLowerCase().slice(0, 2);
    if (!safety.hasInteraction) {
      if (l === 'hi') return 'दोनों साथ लेना पूरी तरह सुरक्षित है (कोई सीधा टकराव नहीं)';
      if (l === 'gu') return 'બંને સાથે લેવું એકદમ સુરક્ષિત છે (કોઈ સીધો વિરોધાભાસ નથી)';
      if (l === 'pa') return 'ਦੋਵੇਂ ਇਕੱਠੇ ਲੈਣਾ ਸੁਰੱਖਿਅਤ ਹੈ';
      if (l === 'mr') return 'दोन्ही एकत्र घेणे सुरक्षित आहे';
      if (l === 'ta') return 'இரண்டையும் ஒன்றாக உட்கொள்வது பாதுகாப்பானது';
      if (l === 'te') return 'రెండూ కలిపి తీసుకోవడం సురక్షితం';
      if (l === 'kn') return 'ಎರಡನ್ನೂ ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ಸಂಪೂರ್ಣ ಸುರಕ್ಷಿತ';
      if (l === 'ml') return 'രണ്ടും ഒരുമിച്ച് കഴിക്കുന്നത് സുരക്ഷിതമാണ്';
      if (l === 'bn') return 'উভয় একসাথে গ্রহণ করা সম্পূর্ণ নিরাপদ';
      if (l === 'or') return 'ଦୁଇଟି ଏକାସାଙ୍ଗରେ ନେବା ସମ୍ପୂର୍ଣ୍ଣ ସୁରକ୍ଷିତ';
      if (l === 'as') return 'দুয়োটা একেলগে লোৱা সম্পূৰ্ণ নিৰাপদ';
      return 'Safe to Take Concurrently (No Direct Clash Detected)';
    }

    const isSevere = safety.evidenceLevel === 'established' && safety.confidence === 'High';
    if (l === 'hi') return isSevere ? '🚨 गंभीर दवा टकराव की चेतावनी' : '⚠️ दवा पारस्परिक प्रभाव चेतावनी';
    if (l === 'gu') return isSevere ? '🚨 ગંભીર દવા વિરોધાભાસ ચેતવણી' : '⚠️ દવાઓની આડઅસર ચેતવણી';
    if (l === 'pa') return isSevere ? '🚨 ਗੰਭੀਰ ਦਵਾਈ ਟਕਰਾਅ ਦੀ ਚੇਤਾਵਨੀ' : '⚠️ ਦਵਾਈ ਪ੍ਰਤੀਕ੍ਰਿਆ ਚੇਤਾਵਨੀ';
    if (l === 'mr') return isSevere ? '🚨 गंभीर औषध परस्परविरोधी इशारा' : '⚠️ औषध सावधगिरी इशारा';
    if (l === 'ta') return isSevere ? '🚨 தீவிர மருந்து முரண்பாடு எச்சரிக்கை' : '⚠️ மருந்து எச்சரிக்கை';
    if (l === 'te') return isSevere ? '🚨 తీవ్ర ఔషధ ప్రతిచర్య హెచ్చరిక' : '⚠️ ఔషధ జాగ్రత్త హెచ్చరిక';
    if (l === 'kn') return isSevere ? '🚨 ಗಂಭೀರ ಔಷಧಿ ಅಡ್ಡಪರಿಣಾಮ ಎಚ್ಚರಿಕೆ' : '⚠️ ಔಷಧಿ ಎಚ್ಚರಿಕೆ';
    if (l === 'ml') return isSevere ? '🚨 ഗുരുതര മരുന്ന് പ്രതിപ്രവർത്തന മുന്നറിയിപ്പ്' : '⚠️ മരുന്ന് ജാഗ്രതാ മുന്നറിയിപ്പ്';
    if (l === 'bn') return isSevere ? '🚨 মারাত্মক ওষুধ সংঘর্ষের সতর্কতা' : '⚠️ ওষুধ প্রতিক্রিয়া সতর্কতা';
    if (l === 'or') return isSevere ? '🚨 ଗୁରୁତର ଔଷଧ ସଂଘର୍ଷ ଚେତାବନୀ' : '⚠️ ଔଷଧ ସତର୍କତା ଚେତାବନୀ';
    if (l === 'as') return isSevere ? '🚨 গুৰুতৰ ঔষধ সংঘাতৰ সতৰ্কবাণী' : '⚠️ ঔষধ সতৰ୍କতা সংকেত';
    return isSevere ? '🚨 Severe Drug-Herb Interaction Alert' : '⚠️ Drug-Herb Interaction Advisory';
  }

  /**
   * Build high-fidelity localized audio narration for safety clashes with ZERO English leaks
   */
  private static buildClashNarration(
    herbName: string,
    drugName: string,
    safety: SafetyAnalysisResult,
    lang: string
  ): string {
    const isSevere = safety.evidenceLevel === 'established' && safety.confidence === 'High';
    const isModerate = safety.hasInteraction;
    const adverseEffect = this.getLocalizedAdverseEffect(safety, lang);
    const l = (lang || 'en').toLowerCase().slice(0, 2);

    if (l === 'hi') {
      if (isSevere) {
        return `सावधान! ${herbName} और ${drugName} को एक साथ लेने पर गंभीर खतरा है: ${adverseEffect}। कृपया अपने डॉक्टर से परामर्श के बिना इन्हें साथ न लें।`;
      }
      if (isModerate) {
        return `चेतावनी: ${herbName} और ${drugName} के बीच परस्पर प्रभाव हो सकता है: ${adverseEffect}। नियमित रूप से बीपी या शुगर की जांच करते रहें।`;
      }
      return `${herbName} और ${drugName} के बीच कोई ज्ञात गंभीर परस्पर प्रभाव नहीं मिला है। सामान्य मात्रा में लेना सुरक्षित माना जाता है।`;
    }

    if (l === 'gu') {
      if (isSevere) {
        return `સાવધાન! ${herbName} અને ${drugName} સાથે લેવાથી ગંભીર જોખમ છે: ${adverseEffect}। ડૉક્ટરની સલાહ વિના બંને સાથે લેશો નહીં.`;
      }
      if (isModerate) {
        return `ચેતવણી: ${herbName} અને ${drugName} વચ્ચે સામાન્ય ક્રિયાપ્રતિક્રિયા થઈ શકે છે: ${adverseEffect}। બ્લડ પ્રેશર અથવા સુગરનું ધ્યાન રાખો.`;
      }
      return `${herbName} અને ${drugName} વચ્ચે કોઈ ગંભીર વિરોધાભાસ જોવા મળ્યો નથી. સામાન્ય માત્રામાં લેવું સુરક્ષિત છે.`;
    }

    if (l === 'pa') {
      if (isSevere) {
        return `ਸਾਵਧਾਨ! ${herbName} ਅਤੇ ${drugName} ਇਕੱਠੇ ਲੈਣ ਨਾਲ ਵੱਡਾ ਖ਼ਤਰਾ ਹੈ: ${adverseEffect}। ਬਿਨਾਂ ਡਾਕਟਰ ਦੀ ਸਲਾਹ ਤੋਂ ਨਾ ਲਵੋ।`;
      }
      if (isModerate) {
        return `ਚੇਤਾਵਨੀ: ${herbName} ਅਤੇ ${drugName} ਦੇ ਵਿਚਕਾਰ ਅਸਰ ਹੋ ਸਕਦਾ ਹੈ: ${adverseEffect}।`;
      }
      return `${herbName} ਅਤੇ ${drugName} ਇਕੱਠੇ ਲੈਣਾ ਸੁਰੱਖਿਅਤ ਮੰਨਿਆ ਜਾਂਦਾ ਹੈ।`;
    }

    if (l === 'mr') {
      if (isSevere) {
        return `सावधान! ${herbName} आणि ${drugName} एकत्र घेतल्यास मोठा धोका आहे: ${adverseEffect}। डॉक्टरांच्या सल्ल्याशिवाय हे एकत्र घेऊ नका.`;
      }
      if (isModerate) {
        return `इशारा: ${herbName} आणि ${drugName} मध्ये परस्पर दुष्परिणाम होऊ शकतो: ${adverseEffect}।`;
      }
      return `${herbName} आणि ${drugName} एकत्र घेणे सुरक्षित मानले जाते.`;
    }

    if (l === 'ta') {
      if (isSevere) {
        return `எச்சரிக்கை! ${herbName} மற்றும் ${drugName} ஆகியவற்றை ஒன்றாக உட்கொள்வது பெரும் ஆபத்தானது: ${adverseEffect}। மருத்துவரின் ஆலோசனை இல்லாமல் உட்கொள்ள வேண்டாம்.`;
      }
      return `${herbName} மற்றும் ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'te') {
      if (isSevere) {
        return `హెచ్చరిక! ${herbName} మరియు ${drugName} కలిపి తీసుకోవడం చాలా ప్రమాదకరం: ${adverseEffect}। వైద్యుని సలహా లేకుండా కలిపి వాడవద్దు.`;
      }
      return `${herbName} మరియు ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'kn') {
      if (isSevere) {
        return `ಎಚ್ಚರಿಕೆ! ${herbName} ಮತ್ತು ${drugName} ಒಟ್ಟಿಗೆ ತೆಗೆದುಕೊಳ್ಳುವುದು ಅಪಾಯಕಾರಿ: ${adverseEffect}। ವೈದ್ಯರ ಸಲಹೆಯಿಲ್ಲದೆ ತೆಗೆದುಕೊಳ್ಳಬೇಡಿ.`;
      }
      return `${herbName} ಮತ್ತು ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'ml') {
      if (isSevere) {
        return `മുന്നറിയിപ്പ്! ${herbName} കൂടാതെ ${drugName} ഒരുമിച്ച് കഴിക്കുന്നത് ഗുരുതരമായ അപകടമുണ്ടാക്കാം: ${adverseEffect}। ഡോക്ടറുടെ നിർദ്ദേശമില്ലാതെ കഴിക്കരുത്.`;
      }
      return `${herbName} കൂടാതെ ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'bn') {
      if (isSevere) {
        return `সাবধান! ${herbName} এবং ${drugName} একসাথে গ্রহণ করা বিপজ্জনক: ${adverseEffect}। ডাক্তারের পরামর্শ ছাড়া একসাথে খাবেন না।`;
      }
      return `${herbName} এবং ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'or') {
      if (isSevere) {
        return `ସାବଧାନ! ${herbName} ଏବଂ ${drugName} ଏକାଠି ନେବା ବିପଦଜନକ: ${adverseEffect}। ଡାକ୍ତରଙ୍କ ପରାମର୍ଶ ବିନା ଏକାଠି ନିଅନ୍ତୁ ନାହିଁ।`;
      }
      return `${herbName} ଏବଂ ${drugName}: ${adverseEffect}।`;
    }

    if (l === 'as') {
      if (isSevere) {
        return `সাৱধান! ${herbName} আৰু ${drugName} একেলগে খোৱাটো বিপদজনক: ${adverseEffect}। চিকিৎসকৰ পৰামৰ্শ অবিহনে একেলগে নাখাব।`;
      }
      return `${herbName} আৰু ${drugName}: ${adverseEffect}।`;
    }

    if (isSevere) {
      return `Severe clinical alert! Taking ${herbName} concurrently with ${drugName} poses a high risk: ${adverseEffect}. Do not combine without doctor supervision.`;
    }
    if (isModerate) {
      return `Caution: Interaction detected between ${herbName} and ${drugName}: ${adverseEffect}. Regular monitoring is advised.`;
    }
    return `No severe interaction detected between ${herbName} and ${drugName}. Safe when used within standard dietary doses.`;
  }
}
