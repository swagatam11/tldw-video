# TLDW Video App

A full-stack video summarizer and Q&A tool. Upload a video file or paste a YouTube URL to get a transcript, summary, and ask questions — all powered by OpenAI.

## Structure

- `frontend/`: Vite + React app
- `backend/`: FastAPI backend
- `/uploads`: temporary video/audio storage

## Deployment

Deployed on [Railway](https://railway.app) as a mono-repo.

## Local Setup

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
pip install -r requirements.txt
uvicorn main:app --reload
