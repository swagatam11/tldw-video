import subprocess
import os
import json


def extract_audio(video_path: str, audio_path: str):
    if not audio_path.endswith(".mp3"):
        audio_path = os.path.splitext(audio_path)[0] + ".mp3"
    command = [
        "ffmpeg",
        "-i", video_path,
        "-vn",
        "-ar", "44100",
        "-ac", "2",
        "-b:a", "128k",
        "-f", "mp3",
        audio_path,
        "-y"
    ]
    subprocess.run(command, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)



def get_video_duration(path: str) -> float:
    """Return duration of video/audio file in seconds"""
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", path],
        capture_output=True,
        text=True
    )
    if result.returncode != 0:
        raise Exception("Failed to determine video duration.")

    info = json.loads(result.stdout)
    return float(info["format"]["duration"])
