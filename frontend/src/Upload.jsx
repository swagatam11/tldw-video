import { useState } from "react";
const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Upload() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState("");
  const [prompt, setPrompt] = useState("");
  const [jobId, setJobId] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUploadFile = async () => {
    setError(null);
    if (!file) {
      setError("Please select a video file.");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${BACKEND_BASE_URL}/upload?prompt=${encodeURIComponent(prompt)}`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (response.ok) {
        setJobId(data.job_id);
        setError(null);
      } else {
        setError(data.error || "Upload failed.");
      }
    } catch {
      setError("Error uploading file.");
    } finally {
      setLoading(false);
    }
  };

  const handleUploadUrl = async () => {
    setError(null);
    if (!url.trim()) {
      setError("Please paste a valid URL.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("${BACKEND_BASE_URL}/upload-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, prompt }),
      });

      const data = await response.json();
      if (response.ok) {
        setJobId(data.job_id);
        setError(null);
      } else {
        setError(data.error || "URL upload failed.");
      }
    } catch {
      setError("Error uploading from URL.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="hero-section">
      <div className="hero-content">
        <h1 style={{ marginBottom: "0.3rem" }}>
          TLD<em>W</em>
        </h1>
        <h2>Too Long, Didn't watch</h2>
        <p className="subtitle" style={{ marginTop: "5.5rem" }}>
          You can upload a file or share a link to your video.
        </p>

        <input
          type="text"
          placeholder="Optional: What is this video about?"
          value={prompt}
          onChange={(e) => {
            setPrompt(e.target.value);
            setError(null);
          }}
          style={{
            width: "100%",
            maxWidth: "600px",
            margin: "1.5rem auto 2rem",
            display: "block",
          }}
        />
      </div>

      {!jobId && (
        <div
          className="upload-columns"
          style={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-start",
            gap: "2rem",
            maxWidth: "900px",
            margin: "6rem auto",
            flexDirection: window.innerWidth < 600 ? "column" : "row",
          }}
        >
          {/* File Upload Section */}
          <div style={{ minWidth: "260px", textAlign: "center" }}>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => {
                setFile(e.target.files[0]);
                setError(null);
              }}
              style={{ marginBottom: "1rem" }}
            />
            <button onClick={handleUploadFile}>Upload File</button>
          </div>

          {/* URL Upload Section */}
          <div style={{ minWidth: "260px", textAlign: "center" }}>
            <input
              type="text"
              placeholder="Paste YouTube, Vimeo, TED link..."
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError(null);
              }}
              style={{ marginBottom: "1rem", width: "100%" }}
            />
            <button onClick={handleUploadUrl}>Submit URL</button>
          </div>
        </div>
      )}

      {jobId && (
        <div className="success-message" style={{ textAlign: "center", marginTop: "2rem" }}>
          ✅ Upload successful!
          <br />
          <a href={`/status/${jobId}`}>
            <button style={{ marginTop: "1rem" }}>Proceed</button>
          </a>
        </div>
      )}

      {loading && (
        <p style={{ color: "#00ffaa", fontWeight: "bold", textAlign: "center", marginTop: "2rem" }}>
          Uploading… please wait
        </p>
      )}
      {error && (
        <p style={{ color: "red", marginTop: "1rem", textAlign: "center" }}>{error}</p>
      )}
    </main>
  );
}
