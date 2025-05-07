# backend/transcription.py
from openai import OpenAI
import os
from dotenv import load_dotenv

load_dotenv()
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

def transcribe_audio(audio_path: str, prompt: str = None) -> str:
    with open(audio_path, "rb") as audio_file:
        transcript = client.audio.transcriptions.create(
            model="whisper-1",
            file=audio_file,
            prompt=prompt or ""
        )
        return transcript.text

def summarize_text(text: str) -> str:
    prompt = (
        "Briefly summarize the following transcript. Provid 1 line which is an overall summary, followed by3 to 5 bullet points, "
        ". Please focusing on the most important ideas:\n\n"
        f"{text}"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.3,
        max_tokens=300
    )

    return response.choices[0].message.content.strip()

def answer_question(transcript: str, question: str) -> str:
    prompt = (
        f"You are an intelligent and knowledgable assistant answering questions about a lecture video. "
        f"You must use only the transcript below to answer user's questions briefly. If the answer to the user's question is not present in the transcript, provide a brief answer buildig on the transcript and your own knowledge, but only after stating verbatim: Your video does not answer this question directly. From what I can see: .\n\n"
        f"Transcript:\n{transcript}\n\n"
        f"Question: {question}\n"
        f"Answer:"
    )

    response = client.chat.completions.create(
        model="gpt-4",
        messages=[{"role": "user", "content": prompt}],
        temperature=0.1,
        max_tokens=100
    )

    return response.choices[0].message.content.strip()
