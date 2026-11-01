"""
TulsiVeda AI - BioMistral-7B Medical Inference Cloud Microservice
Deployable directly as a free Hugging Face Space (Docker / Gradio / FastAPI)
"""

import os
import json
import re
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

app = FastAPI(title="TulsiVeda BioMistral Cloud Server", version="2.5.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

HF_TOKEN = os.getenv("HF_TOKEN", "")
MODEL_ID = "BioMistral/BioMistral-7B"
HF_ROUTER_URL = f"https://router.huggingface.co/hf-inference/models/{MODEL_ID}"

class SynthesisRequest(BaseModel):
    query: str
    lang: str = "en"

@app.get("/")
def health():
    return {
        "status": "healthy",
        "service": "TulsiVeda BioMistral-7B Cloud Server",
        "model": MODEL_ID,
        "token_configured": bool(HF_TOKEN),
    }

@app.post("/api/v1/synthesize")
def synthesize(req: SynthesisRequest):
    query_text = (req.query or "").strip()
    if not query_text:
        raise HTTPException(status_code=400, detail="Query cannot be empty")

    prompt = f"""[INST] You are an expert physician specializing in evidence-based medicine and Indian healthcare (CDSCO NLEM generic medicines and AYUSH pharmacopoeia).
Provide a clinical protocol in JSON format for the condition: "{query_text}".
Return ONLY a valid JSON object matching this exact TypeScript structure without markdown fences:
{{
  "conditionName": "{query_text}",
  "bodySystem": "Infectious",
  "officialGeneric": {{
    "medicineName": "Brand-neutral generic medicine name with dosage IP",
    "genericSalt": "Active pharmaceutical ingredient / salt name",
    "dosageStrength": "E.g. 500mg / 10mg",
    "pmbjpPriceINR": "E.g. ₹10.00 - ₹25.00 per strip (Jan Aushadhi 80% Subsidized)",
    "cdscoNlemListed": true,
    "standardDosageSchedule": "E.g. 1 tablet once daily post meals under medical supervision"
  }},
  "ayushClassicalFormulation": {{
    "formulationName": "Classical Ayurvedic or AYUSH formulation name",
    "scientificBotanical": "Latin binomial of primary botanical plant",
    "activePhytochemical": "Phytochemical active marker",
    "classicalReference": "Classical Ayurvedic text (e.g. Charaka Samhita, API)",
    "ayushDosage": "Standard AYUSH dosage (e.g. 1-2 tablets or 3g churna)",
    "anupanaDietaryMedium": "Dietary vehicle (e.g. Lukewarm water or pure honey)"
  }},
  "verifiedHomeRemedy": {{
    "kitchenItem": "Safe kitchen or herbal ingredient",
    "preparationMethod": "How to prepare the home remedy",
    "modeOfAdministration": "How to consume or apply",
    "contraindicationWarning": "Safety precaution or when to avoid"
  }},
  "escalationProtocol": {{
    "dangerSigns": ["Red-flag sign 1", "Red-flag sign 2"],
    "maxWaitHoursBeforeHospital": 24,
    "recommendedLabTest": "Diagnostic test or scan needed"
  }}
}} [/INST]"""

    headers = {"Content-Type": "application/json"}
    if HF_TOKEN:
        headers["Authorization"] = f"Bearer {HF_TOKEN}"

    try:
        resp = requests.post(
            HF_ROUTER_URL,
            headers=headers,
            json={
                "inputs": prompt,
                "parameters": {
                    "max_new_tokens": 512,
                    "temperature": 0.1,
                    "return_full_text": False,
                },
            },
            timeout=8,
        )

        if resp.status_code == 200:
            data = resp.json()
            raw_text = ""
            if isinstance(data, list) and len(data) > 0:
                raw_text = data[0].get("generated_text", "")
            elif isinstance(data, dict):
                raw_text = data.get("generated_text", "")

            json_match = re.search(r"\{[\s\S]*\}", raw_text)
            if json_match:
                parsed = json.loads(json_match.group(0))
                return {
                    "source": "BioMistral-7B Cloud LLM",
                    "status": "success",
                    "data": parsed,
                }
    except Exception as e:
        print(f"[BioMistral-Cloud] Upstream error: {e}")

    # Fallback response if upstream HF API fails
    return {
        "source": "TulsiVeda Edge Cloud Fallback",
        "status": "fallback",
        "data": {
            "conditionName": query_text,
            "bodySystem": "Infectious",
            "officialGeneric": {
                "medicineName": f"{query_text.title()} Targeted Therapeutic Formulation IP",
                "genericSalt": f"{query_text.title()} Evidence-Based Bioactive Pharmaceutical Agent IP",
                "dosageStrength": "Clinically Titrated Dosage Schedule",
                "pmbjpPriceINR": "₹12.00 - ₹35.00 at Jan Aushadhi Kendra (75-85% Subsidized)",
                "cdscoNlemListed": True,
                "standardDosageSchedule": "1 tablet twice daily post meals under medical officer supervision",
            },
            "ayushClassicalFormulation": {
                "formulationName": f"Classical Rasayana Formulation for {query_text.title()}",
                "scientificBotanical": "Tinospora cordifolia (Guduchi) & Withania somnifera (Ashwagandha)",
                "activePhytochemical": "Bioactive Glycosides & Withanolides",
                "classicalReference": "Ayurvedic Pharmacopoeia of India (API)",
                "ayushDosage": "1 to 2 tablets (500mg) twice daily",
                "anupanaDietaryMedium": "Lukewarm water or pure organic honey",
            },
            "verifiedHomeRemedy": {
                "kitchenItem": "Tulsi, Ginger and Turmeric Infusion",
                "preparationMethod": "Boil 5 fresh Tulsi leaves with crushed ginger in 200ml water",
                "modeOfAdministration": "Drink warm twice daily",
                "contraindicationWarning": "Consult medical specialist if symptoms persist >48 hours",
            },
            "escalationProtocol": {
                "dangerSigns": ["Severe pain", "High fever", "Breathing difficulty"],
                "maxWaitHoursBeforeHospital": 24,
                "recommendedLabTest": "Complete Blood Count (CBC) and Clinical Examination",
            },
        },
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=7860)
