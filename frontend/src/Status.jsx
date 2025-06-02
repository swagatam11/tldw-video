import { useEffect, useState } from "react";
import echoicLogo from "./assets/echoic_logo_2.png";
import { useParams, useNavigate } from "react-router-dom";

export default function Status() {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("processing");
  const [error, setError] = useState(null);
  const [countdown, setCountdown] = useState(null);

  // Ask for browser notification permission on mount
  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Poll backend status every second
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/status/${jobId}`);
        const data = await response.json();

        if (data.status === "done") {
          if (Notification.permission === "granted") {
            new Notification("🎉 Your video is ready!", {
              body: "Click to view the results",
            });
          }
          clearInterval(interval);
          setTimeout(() => navigate(`/result/${jobId}`), 1000);
        } else if (data.status === "error") {
          setError("An error occurred during processing.");
          clearInterval(interval);
        } else {
          setStatus(data.status || "processing");

          // Set countdown once if available
          if (data.video_duration && countdown === null) {
            const padded = Math.ceil(data.video_duration * 0.90);
            setCountdown(padded);
          }
        }
      } catch {
        setError("Unable to connect to server.");
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [jobId, navigate, countdown]);

  // Handle countdown ticking
  useEffect(() => {
    if (countdown === null) return;

    const tick = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(tick);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(tick);
  }, [countdown]);

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
        </nav>
      </header>

      <main style={{ maxWidth: "1100px", margin: "auto", padding: "2rem 1.5rem", backgroundColor: "#fdfdfd", minHeight: "80vh" }}>
        <div style={{ textAlign: "center" }}>
          <h1>Processing Your Video</h1>
          <p>Status: <strong>{status}</strong></p>

          {countdown !== null ? (
            <p>
              Estimated time remaining:{" "}
              <strong>{Math.floor(countdown / 60)}m {countdown % 60}s</strong>
            </p>
          ) : (
            <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.4" }}>
              Your video will be ready for a chat in a few minutes.<br />
              Longer or multi-speaker videos may take a little more time.
            </p>
          )}
          {countdown === 0 && (
            <p style={{ color: "#888", marginTop: "0.5rem" }}>
              ⏳ The analysis is taking a bit longer than expected. This can happen with information rich videos, or when we are facing excess demand. Thank you for your patience.
            </p>
          )}


          {error && <p style={{ color: "red" }}>{error}</p>}

          <p style={{ fontSize: "0.9em", color: "gray" }}>
            Please wait... you’ll be redirected automatically when results are ready.
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
