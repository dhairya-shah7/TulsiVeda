---
title: TulsiVeda BioMistral-7B Cloud Server
emoji: 🌿
colorFrom: green
colorTo: emerald
sdk: docker
pinned: false
---

# 🌿 TulsiVeda BioMistral Cloud Server

A dedicated microservice providing real-time BioMistral-7B clinical synthesis and CDSCO/AYUSH protocol generation for the TulsiVeda AI mobile app.

### Deployment Instructions:
1. Go to [Hugging Face Spaces](https://huggingface.co/new-space).
2. Set Space Name: `tulsiveda-biomistral`
3. SDK: `Docker` (or `Gradio/FastAPI`)
4. In Space Settings &rarr; **Variables & Secrets**, add:
   * `HF_TOKEN`: Your Hugging Face user access token (read permission).
5. Push `app.py`, `requirements.txt`, and `Dockerfile` to the repository.
6. The public URL will be: `https://<your-username>-tulsiveda-biomistral.hf.space`
