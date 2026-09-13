// ==============================================================================
// TulsiVeda AI — Neo4j Knowledge Graph Reference Ontology
// Defines multi-hop botanical, constituent, pathway, drug, and adverse effect graphs
// ==============================================================================

// Create Unique Constraints
CREATE CONSTRAINT plant_species_name IF NOT EXISTS FOR (p:PlantSpecies) REQUIRE p.scientific_name IS UNIQUE;
CREATE CONSTRAINT constituent_name IF NOT EXISTS FOR (c:Constituent) REQUIRE c.name IS UNIQUE;
CREATE CONSTRAINT pathway_name IF NOT EXISTS FOR (pw:Pathway) REQUIRE pw.name IS UNIQUE;
CREATE CONSTRAINT drug_name IF NOT EXISTS FOR (d:DrugIngredient) REQUIRE d.generic_name IS UNIQUE;
CREATE CONSTRAINT adverse_effect_name IF NOT EXISTS FOR (ae:AdverseEffect) REQUIRE ae.name IS UNIQUE;
CREATE CONSTRAINT evidence_id IF NOT EXISTS FOR (e:EvidenceSource) REQUIRE e.pmid_or_id IS UNIQUE;

// 1. Plant Species Nodes
MERGE (p1:PlantSpecies {scientific_name: 'Curcuma longa', vernacular_name: 'Haldi / Turmeric', family: 'Zingiberaceae', region: 'South Asia'});
MERGE (p2:PlantSpecies {scientific_name: 'Curcuma aromatica', vernacular_name: 'Wild Turmeric', family: 'Zingiberaceae', region: 'India'});
MERGE (p3:PlantSpecies {scientific_name: 'Curcuma zedoaria', vernacular_name: 'White Turmeric / Kachur', family: 'Zingiberaceae', region: 'India'});
MERGE (p4:PlantSpecies {scientific_name: 'Ginkgo biloba', vernacular_name: 'Maidenhair Tree', family: 'Ginkgoaceae', region: 'Global / East Asia'});
MERGE (p5:PlantSpecies {scientific_name: 'Ocimum sanctum', vernacular_name: 'Tulsi / Holy Basil', family: 'Lamiaceae', region: 'India'});
MERGE (p6:PlantSpecies {scientific_name: 'Withania somnifera', vernacular_name: 'Ashwagandha / Indian Ginseng', family: 'Solanaceae', region: 'India'});
MERGE (p7:PlantSpecies {scientific_name: 'Zingiber officinale', vernacular_name: 'Aadhu / Ginger', family: 'Zingiberaceae', region: 'India'});

// 2. Active Chemical Constituents
MERGE (c1:Constituent {name: 'Curcumin', molecular_formula: 'C21H20O6', class: 'Polyphenol / Curcuminoid'});
MERGE (c2:Constituent {name: 'Curcuminoid Fractions', molecular_formula: 'Complex mixture', class: 'Phenolic'});
MERGE (c3:Constituent {name: 'Ginkgolides & Bilobalide', molecular_formula: 'Terpene trilactones', class: 'Terpenoid'});
MERGE (c4:Constituent {name: 'Eugenol', molecular_formula: 'C10H12O2', class: 'Phenylpropanoid'});
MERGE (c5:Constituent {name: 'Withanolides', molecular_formula: 'Steroidal lactones', class: 'Steroidal'});
MERGE (c6:Constituent {name: 'Gingerols & Shogaols', molecular_formula: 'Phenolic ketone', class: 'Phenolic'});

// 3. Biological & Pharmacological Pathways
MERGE (pw1:Pathway {name: 'Platelet Aggregation / Thromboxane A2 Inhibition', mechanism: 'Inhibition of TXA2 synthase and downstream cyclooxygenase signaling'});
MERGE (pw2:Pathway {name: 'CYP2C9 Hepatic Enzyme Metabolism', mechanism: 'Competitive inhibition or altered clearance of narrow-therapeutic-index drugs'});
MERGE (pw3:Pathway {name: 'GABA-A Neuroreceptor Modulation', mechanism: 'Enhancement of gamma-aminobutyric acid neurotransmission leading to central nervous system depression'});
MERGE (pw4:Pathway {name: 'AMPK / Hepatic Gluconeogenesis Suppression', mechanism: 'Additive reduction in blood glucose via insulin sensitization'});

// 4. Drug Ingredients (Generic)
MERGE (d1:DrugIngredient {generic_name: 'Aspirin', atc_code: 'B01AC06', therapeutic_class: 'Antiplatelet / NSAID'});
MERGE (d2:DrugIngredient {generic_name: 'Warfarin', atc_code: 'B01AA03', therapeutic_class: 'Oral Vitamin K Antagonist'});
MERGE (d3:DrugIngredient {generic_name: 'Clopidogrel', atc_code: 'B01AC04', therapeutic_class: 'P2Y12 Platelet Inhibitor'});
MERGE (d4:DrugIngredient {generic_name: 'Metformin', atc_code: 'A10BA02', therapeutic_class: 'Biguanide Antidiabetic'});
MERGE (d5:DrugIngredient {generic_name: 'Alprazolam', atc_code: 'N05BA12', therapeutic_class: 'Benzodiazepine Anxiolytic'});
MERGE (d6:DrugIngredient {generic_name: 'Paracetamol', atc_code: 'N02BE01', therapeutic_class: 'Analgesic / Antipyretic'});

// 5. Adverse Clinical Effects
MERGE (ae1:AdverseEffect {name: 'Potential Additive Bleeding Risk', severity: 'Moderate-High', organ_system: 'Hematologic / Vascular', alert_code: 'AE_BLEEDING_ADDITIVE'});
MERGE (ae2:AdverseEffect {name: 'Elevated International Normalized Ratio (INR) / Hemorrhage', severity: 'Severe', organ_system: 'Coagulation', alert_code: 'AE_INR_ELEVATION'});
MERGE (ae3:AdverseEffect {name: 'Excessive Sedation / CNS Depression', severity: 'Moderate', organ_system: 'Central Nervous System', alert_code: 'AE_CNS_DEPRESSION'});
MERGE (ae4:AdverseEffect {name: 'Additive Hypoglycemia Risk', severity: 'Moderate', organ_system: 'Endocrine', alert_code: 'AE_HYPOGLYCEMIA'});

// 6. Evidence Sources
MERGE (e1:EvidenceSource {pmid_or_id: 'PMID: 21453289', source_type: 'PubMed / In-Vitro & Clinical', publication: 'J Clin Psychopharmacol & Hematology', evidence_strength: 'Mechanistic', title: 'Curcumin inhibits platelet aggregation via TXA2 synthase inhibition'});
MERGE (e2:EvidenceSource {pmid_or_id: 'PMC6073145', source_type: 'PMC / Systematic Review', publication: 'Frontiers in Pharmacology', evidence_strength: 'Established', title: 'Ginkgo biloba extract interactions with antiplatelet and anticoagulant agents'});
MERGE (e3:EvidenceSource {pmid_or_id: 'PMID: 17560567', source_type: 'PubMed / Pharmacology', publication: 'Biochem Pharmacol', evidence_strength: 'Moderate', title: 'Synergistic inhibition of cyclooxygenase by plant polyphenols and low-dose aspirin'});

// 7. Establish Relationships
// Plant -> Constituent
MERGE (p1)-[:CONTAINS {prevalence: '3-5% in rhizome'}]->(c1);
MERGE (p1)-[:CONTAINS]->(c2);
MERGE (p4)-[:CONTAINS {prevalence: 'Standardized 6% terpene lactones'}]->(c3);
MERGE (p5)-[:CONTAINS {prevalence: 'Essential oil fraction'}]->(c4);
MERGE (p6)-[:CONTAINS {prevalence: 'Root extract'}]->(c5);
MERGE (p7)-[:CONTAINS]->(c6);

// Constituent -> Pathway
MERGE (c1)-[:MODULATES {effect: 'Inhibits platelet aggregation and TXA2'}]->(pw1);
MERGE (c3)-[:MODULATES {effect: 'Platelet-activating factor (PAF) receptor antagonism'}]->(pw1);
MERGE (c3)-[:MODULATES {effect: 'Inhibits CYP2C9'}]->(pw2);
MERGE (c4)-[:MODULATES {effect: 'Inhibits thromboxane synthase'}]->(pw1);
MERGE (c5)-[:MODULATES {effect: 'GABAA receptor agonist activity'}]->(pw3);

// Drug -> Pathway
MERGE (d1)-[:ACTS_ON {effect: 'Irreversibly inhibits COX-1 to block TXA2'}]->(pw1);
MERGE (d2)-[:ACTS_ON {effect: 'Metabolized primarily via CYP2C9'}]->(pw2);
MERGE (d3)-[:ACTS_ON {effect: 'Inhibits ADP-induced platelet aggregation'}]->(pw1);
MERGE (d5)-[:ACTS_ON {effect: 'Positive allosteric modulator of GABAA'}]->(pw3);

// Pathway -> Adverse Effect
MERGE (pw1)-[:TRIGGERS_RISK]->(ae1);
MERGE (pw2)-[:TRIGGERS_RISK]->(ae2);
MERGE (pw3)-[:TRIGGERS_RISK]->(ae3);

// Direct Drug -> Adverse Effect links
MERGE (d1)-[:CAUSES]->(ae1);
MERGE (d2)-[:CAUSES]->(ae2);
MERGE (d5)-[:CAUSES]->(ae3);

// Constituent -> Evidence Source
MERGE (c1)-[:SUPPORTED_BY]->(e1);
MERGE (c1)-[:SUPPORTED_BY]->(e2);
MERGE (c3)-[:SUPPORTED_BY]->(e2);
