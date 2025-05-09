import os
import subprocess
import uuid
import json
from urllib.parse import urlparse
from tempfile import gettempdir

WHITELISTED_DOMAINS = {
    "youtube.com", "youtu.be", "vimeo.com", "ted.com", "soundcloud.com"
}

MAX_DURATION_SECONDS = 600  # 10 minutes
MAX_FILE_SIZE_MB = 25


def is_domain_allowed(url: str) -> bool:
    try:
        hostname = urlparse(url).hostname or ""
        return any(domain in hostname for domain in WHITELISTED_DOMAINS)
    except Exception:
        return False


def get_video_metadata(url: str) -> dict:
    try:
        result = subprocess.run(
            ["yt-dlp", "--dump-json", "--no-playlist", url],
            capture_output=True,
            text=True,
            check=True  # Raises CalledProcessError automatically
        )
        return json.loads(result.stdout)

    except subprocess.CalledProcessError as e:
        print("yt-dlp metadata error:", e.stderr.strip())  # ✅ Logs actual reason
        raise ValueError(
            "This video may be restricted (e.g., age-restricted, private, or blocked in your region). "
            "Please try another link."
        )



def download_audio_from_url(url: str, job_id: str) -> str:
    # Check domain whitelist
    if not is_domain_allowed(url):
        raise Exception("URL domain not allowed.")

    # Get and check duration
    metadata = get_video_metadata(url)
    duration = metadata.get("duration", 0)
    if duration > MAX_DURATION_SECONDS:
        raise Exception("Video too long (must be 10 minutes or less).")

    # Set output path
    output_dir = os.path.join(gettempdir(), "tldw")
    os.makedirs(output_dir, exist_ok=True)
    audio_path = os.path.join(output_dir, f"{job_id}.mp3")

    # Download audio
    command = [
        "yt-dlp",
        "--quiet",
        "--no-playlist",
        "--extract-audio",
        "--audio-format", "mp3",
        "--audio-quality", "5",
        "--download-sections", "*00:00-00:10:00",
        "--output", audio_path,
        url
    ]

    result = subprocess.run(command, capture_output=True, text=True)
    if result.returncode != 0:
        print("yt-dlp stderr:", result.stderr.strip())  # ✅ LOG the actual reason
    raise Exception("Audio download failed.")


    # Check size
    size_mb = os.path.getsize(audio_path) / (1024 * 1024)
    if size_mb > MAX_FILE_SIZE_MB:
        os.remove(audio_path)
        raise Exception(f"Audio file too large: {size_mb:.2f}MB (limit is 25MB)")

    return audio_path
