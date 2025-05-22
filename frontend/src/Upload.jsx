import { useEffect, useState } from "react";
import axios from "axios";

function Upload() {
  const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    window.lucide?.createIcons();
  }, []);

  const submitUrl = async () => {
    if (!videoUrl.trim()) return;
    setIsUploading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload-url`, {
        url: videoUrl,
      });
      if (res.data.job_id) {
        window.location.href = `/status/${res.data.job_id}`;
      } else {
        alert("Upload failed — no job ID received.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload URL.");
    } finally {
      setIsUploading(false);
    }
  };

  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.job_id) {
        window.location.href = `/status/${res.data.job_id}`;
      } else {
        alert("Upload failed — no job ID received.");
      }
    } catch (err) {
      console.error("File upload error", err);
      alert("Failed to upload file.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <header style={headerStyle}>
        <nav>
          <ul>
            <li>
              <strong style={{ color: "#e63946" }}>Too Long, Didn’t Watch</strong>
            </li>
          </ul>
          <ul style={navRight}>
            <li><a href="#features">Features</a></li>
            <li><a href="#pricing">Pricing</a></li>
            <li><a href="/" role="button">Get Started</a></li>
          </ul>
        </nav>
      </header>

      <main style={{ maxWidth: "1100px", margin: "auto", padding: "2rem 1.5rem" }}>
        <h2 style={headingStyle}>
          Upload Your Video
          <span style={underline}></span>
        </h2>
        <p style={{ textAlign: "center", color: "#555" }}>
          Share a video file or URL to get started
        </p>

        <div style={{ margin: "2rem 0" }}>
          <textarea
            rows="3"
            placeholder="Optional: What is this video about?"
            style={textareaStyle}
          ></textarea>
        </div>

        <div style={uploadGrid}>
          <div style={cardStyle}>
            <i data-lucide="upload" style={iconStyle}></i>
            <strong style={{ color: "#e63946", margin: "0.5rem 0" }}>Choose a file</strong>
            <p style={{ color: "#777" }}>Supports MP4, WebM, MOV up to 2GB</p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setSelectedFile(e.target.files[0])}
              style={fileInputStyle}
            />
            <a
              href="#"
              role="button"
              style={buttonStyle}
              onClick={uploadFile}
              disabled={isUploading}
            >
              {isUploading ? "Uploading..." : "Upload File"}
            </a>
          </div>

          <div style={cardStyle}>
            <i data-lucide="link" style={iconStyle}></i>
            <strong style={{ color: "#e63946", margin: "0.5rem 0" }}>Paste a URL</strong>
            <p style={{ color: "#777" }}>Supports YouTube, Vimeo, TED and more</p>
            <input
              type="url"
              placeholder="Paste or type URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
              style={urlInputStyle}
            />
            <a
              href="#"
              role="button"
              className="secondary"
              onClick={submitUrl}
              disabled={isUploading}
            >
              {isUploading ? "Submitting..." : "Submit URL"}
            </a>
          </div>
        </div>

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
          Need help? Check our <a href="#">guide</a> or{" "}
          <a href="#" style={{ color: "#e63946" }}>contact support</a>
        </p>
      </main>

      <footer style={{ maxWidth: "1140px", margin: "auto", padding: "2rem 1.5rem" }}>
        <hr />
        <div style={footerGrid}>
          <div>
            <strong>Too Long, Didn’t Watch</strong><br />
            <small>Fast, AI-powered video summaries.</small>
          </div>
          <nav>
            <ul style={footerLinks}>
              <li><a href="#">Support</a></li>
              <li><a href="#">Sales</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </>
  );
}

// === Styles ===
const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  width: "100%",
  backgroundColor: "white",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  padding: "1rem 1.5rem",
};

const navRight = { display: "flex", gap: "1.5rem" };

const headingStyle = {
  textAlign: "center",
  fontSize: "2rem",
  marginBottom: "0.5rem",
};

const underline = {
  display: "block",
  width: "60px",
  height: "4px",
  backgroundColor: "#e63946",
  margin: "0.5rem auto 1rem",
  borderRadius: "2px",
};

const textareaStyle = {
  width: "100%",
  borderRadius: "0.5rem",
  padding: "1rem",
  border: "1px solid #ccc",
};

const uploadGrid = {
  display: "grid",
  gap: "2rem",
  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
  marginTop: "2rem",
};

const cardStyle = {
  border: "2px dashed #ccc",
  borderRadius: "12px",
  backgroundColor: "white",
  padding: "2rem",
  textAlign: "center",
  width: "500px",
};

const iconStyle = {
  width: "32px",
  height: "32px",
  color: "#888",
  marginBottom: "1rem",
};

const buttonStyle = {
  backgroundColor: "#1d3557",
  color: "white",
  border: "none",
  padding: "0.5rem 1.25rem",
  borderRadius: "6px",
  textDecoration: "none",
  display: "inline-block",
  marginTop: "1rem",
};

const fileInputStyle = {
  margin: "1rem 0",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px dashed #ccc",
  width: "100%",
};

const urlInputStyle = {
  width: "100%",
  margin: "1rem 0",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
};

const footerGrid = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  flexWrap: "wrap",
};

const footerLinks = {
  display: "flex",
  gap: "1.5rem",
  listStyle: "none",
  margin: 0,
  padding: 0,
};

export default Upload;
