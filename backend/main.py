from fastapi import FastAPI, File, UploadFile, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from uuid import uuid4
from audio_utils import extract_audio
from transcription import transcribe_audio, summarize_text, answer_question
from url_utils import download_audio_from_url
from audio_utils import get_video_duration
import os
import traceback

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
    "http://localhost:5173",
    "https://tldw-video.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)
jobs = {}

@app.post("/upload")
async def upload_video(request: Request, file: UploadFile = File(...), background_tasks: BackgroundTasks = None):
    job_id = str(uuid4())
    file_path = os.path.join(UPLOAD_DIR, f"{job_id}_{file.filename}")
    
    with open(file_path, "wb") as f:
        f.write(await file.read())

    jobs[job_id] = {"status": "processing", "filename": file.filename}
    prompt_text = request.query_params.get("prompt", "")
    background_tasks.add_task(dummy_process_video, job_id, file_path, prompt_text)

    return {"job_id": job_id}

@app.post("/upload-url")
async def upload_video_by_url(request: Request, background_tasks: BackgroundTasks = None):
    try:
        body = await request.json()
        print("Payload received by backend:", body)  # Debug log
        url = body.get("url")
        if not url:
            print("URL missing in request payload")
            return JSONResponse(status_code=400, content={"error": "Missing 'url' in request."})

        job_id = str(uuid4())
        jobs[job_id] = {"status": "processing", "filename": "remote-url"}

        audio_path = download_audio_from_url(url, job_id)
        print(f"Audio path after download: {audio_path}")  # Debug log

        # Queue processing
        prompt_text = body.get("prompt", "")
        background_tasks.add_task(dummy_process_video, job_id, audio_path, prompt_text)

        return {"job_id": job_id}

    except Exception as e:
        print("Exception during /upload-url:", traceback.format_exc())  # Detailed log
        return JSONResponse(status_code=400, content={"error": str(e)})


@app.post("/ask/{job_id}")
async def ask_question(job_id: str, request: Request):
    job = jobs.get(job_id)
    if not job or "transcript" not in job:
        return {"error": "Transcript not available for this job."}

    body = await request.json()
    question = body.get("question", "")

    if not question:
        return {"error": "No question provided."}

    try:
        answer = answer_question(job["transcript"], question)
        return {"answer": answer}
    except Exception as e:
        return {"error": str(e)}

@app.get("/status/{job_id}")
def get_status(job_id: str):
    job = jobs.get(job_id)
    if not job:
        return {"status": "not_found"}
    return {"status": job.get("status", "processing")}

@app.get("/result/{job_id}")
def get_result(job_id: str):
    job = jobs.get(job_id)
    if job and "transcript" in job:
        return {"transcript": job["transcript"], "summary": job["summary"]}
    return {"error": "Results not available yet"}

def dummy_process_video(job_id: str, path: str, prompt: str = None):
    try:
        base, _ = os.path.splitext(path)
        audio_path = f"{base}.mp3" if not path.endswith(".mp3") else path

        if not path.endswith(".mp3"):
            extract_audio(path, audio_path)
            jobs[job_id]["status"] = "audio_extracted"
        else:
            jobs[job_id]["status"] = "audio_downloaded"

        transcript_text = transcribe_audio(audio_path, prompt)
        jobs[job_id]["status"] = "transcribed"
        jobs[job_id]["transcript"] = transcript_text

        summary_text = summarize_text(transcript_text)
        jobs[job_id]["summary"] = summary_text
        jobs[job_id]["status"] = "done"

    except Exception as e:
        print("ERROR during processing:", traceback.format_exc()) # Log the error for debugging
        jobs[job_id]["status"] = "error"
        jobs[job_id]["error"] = str(e)

