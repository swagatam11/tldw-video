import { useEffect, useState } from "react";
import echoicLogo from "./assets/echoic_logo_2.png";
import axios from "axios";

function Upload() {
  //const [videoUrl, setVideoUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingFile, setUploadingFile] = useState(false);
  //const [uploadingUrl, setUploadingUrl] = useState(false);
  //const [speakerType, setSpeakerType] = useState("single");
  //const [showTooltip, setShowTooltip] = useState(false);


 // useEffect(() => {
  //  window.lucide?.createIcons();
 // }, [showTooltip]);

  // const submitUrl = async () => {
  //   if (!videoUrl.trim()) return;
  //   setUploadingUrl(true);
  //   try {
  //     const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload-url`, {
  //       url: videoUrl,
  //       prompt: "",
  //       speaker_type: "single",
  //     },
  //     { timeout: 120000, 
  //     headers: { "Content-Type": "application/json" } },
  //     );

    if (res.data.job_id) {
      setTimeout(() => {
        window.location.href = `/status/${res.data.job_id}`;
      }, 10);
    } else {
      alert("Upload failed — no job ID received.");
    }
  } catch (err) {
    console.error(err);
    alert("Failed to upload URL.");
  }
};


  const uploadFile = async () => {
  if (!selectedFile) {
    alert("Please select a file.");
    return;
  }
  setUploadingFile(true);
  try {
    const formData = new FormData();
    formData.append("file", selectedFile);
    formData.append("speaker_type", "single"); // 👈 new line

    const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 120000
    });

    if (res.data.job_id) {
      setTimeout(() => {
        window.location.href = `/status/${res.data.job_id}`;
      }, 10);
    } else {
      alert("Upload failed — no job ID received.");
    }
  } catch (err) {
    console.error("File upload error", err);
    alert("Failed to upload file.");
  }
};


  return (
    <>
      <header style={headerStyle}>
        <nav>
          <ul>
            <li>
              <a href="/">
                <img
                  src={echoicLogo}
                  alt="Echoic logo"
                  style={{ height: "66px", objectFit: "contain" }}
                />
              </a>
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
          Share a video file to get started
        </p>


        {!(uploadingFile || uploadingUrl) ? (
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
                className="lift-hover button-link"
                style={buttonStyle}
                onClick={uploadFile}
                disabled={uploadingFile}
              >
                {uploadingFile ? "Uploading..." : "Upload File"}
              </a>
            </div>
          </div>
        ) : (
          <div style={{ marginTop: "3rem", textAlign: "center" }}>
            <p style={{ fontSize: "1.25rem", color: "#333", marginBottom: "1rem" }}>
              Processing your video. Please wait...
            </p>
            <svg
              width="40"
              height="40"
              viewBox="0 0 38 38"
              xmlns="http://www.w3.org/2000/svg"
              stroke="#1d3557"
            >
              <g fill="none" fillRule="evenodd">
                <g transform="translate(1 1)" strokeWidth="2">
                  <circle strokeOpacity=".3" cx="18" cy="18" r="18" />
                  <path d="M36 18c0-9.94-8.06-18-18-18">
                    <animateTransform
                      attributeName="transform"
                      type="rotate"
                      from="0 18 18"
                      to="360 18 18"
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              </g>
            </svg>
          </div>
        )}


        

        

        <p style={{ textAlign: "center", marginTop: "2rem", fontSize: "0.9rem", color: "#666" }}>
          Need help? Check our <a href="#">guide</a> or{" "}
          <a href="#" style={{ color: "#e63946" }}>contact support</a>
        </p>

      </main>

      <footer style={{ maxWidth: "1140px", margin: "auto", padding: "2rem 1.5rem" }}>
        <hr />
        <div style={footerGrid}>
          <div>
            <img src={echoicLogo} alt="Echoic logo" style={{ height: "28px", objectFit: "contain" }} /><br />
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
  alignItems: "start",
};

const cardStyle = {
  border: "2px dashed #ccc",
  borderRadius: "12px",
  backgroundColor: "white",
  padding: "2rem",
  textAlign: "center",
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  height: "100%",
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
  margin: "1rem 0 2rem",
  marginBottom: "1.5rem",
  padding: "0.35rem",
  borderRadius: "8px",
  border: "1px dashed #ccc",
  width: "100%",
};

const urlInputStyle = {
  width: "100%",
  margin: "1rem 0 2rem",
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
