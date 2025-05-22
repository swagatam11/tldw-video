import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function Status() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [progress, setProgress] = useState(10);
  const [error, setError] = useState(null);

  const getProgressForStatus = (status) => {
    switch (status) {
      case "processing": return 10;
      case "audio_extracted": return 30;
      case "transcribed": return 65;
      case "done": return 100;
      default: return 5;
    }
  };

  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/status/${jobId}`);
        const data = await response.json();

        if (data.status === "done") {
          setProgress(100);
          clearInterval(interval);
          setTimeout(() => navigate(`/result/${jobId}`), 1000);
        } else if (data.status === "error") {
          setError("An error occurred during processing.");
          clearInterval(interval);
        } else {
          setStatus(data.status || "processing");
          setProgress(getProgressForStatus(data.status));
        }
      } catch {
        setError("Unable to connect to server.");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, navigate]);

  return (
    <>
      <header style={headerStyle}>
        <nav>
          <ul>
            <li>
              <strong style={{ color: "#e63946" }}>Too Long, Didn’t Watch</strong>
            </li>
          </ul>
        </nav>
      </header>

      <main className="hero-section">
        <div className="hero-content">
          <h2 style={{ marginBottom: "0.5rem" }}>
            TLDW: <em>Too long, didn’t watch</em>
          </h2>
          <h1>Processing Your Video</h1>
          <p>Status: <strong>{status}</strong></p>
          <progress value={progress} max="100" style={{ width: "100%", marginBottom: "1rem" }}></progress>

          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ fontSize: "0.9em", color: "gray" }}>
            Please wait... you’ll be redirected automatically when it’s ready.
          </p>
        </div>
      </main>
    </>
  );
}

const headerStyle = {
  position: "sticky",
  top: 0,
  zIndex: 1000,
  backgroundColor: "white",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
  padding: "1rem 1.5rem",
  maxWidth: "1140px",
  margin: "auto",
};
