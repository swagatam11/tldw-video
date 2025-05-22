import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";

const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;

export default function Result() {
  const { jobId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transcript");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const buttonStyle = {
  backgroundColor: "#1d3557",
  color: "white",
  border: "none",
  padding: "0.5rem 1.25rem",
  borderRadius: "6px",
  textDecoration: "none",
  cursor: "pointer",
  };


  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`${BACKEND_BASE_URL}/result/${jobId}`);
        const data = await response.json();

        if (data.status === "error") {
          setError(data.error || "An unknown error occurred.");
        } else if (data.transcript && data.enriched_summary) {
          setResult(data);
        } else {
          setError("Results not yet ready. Please wait.");
        }
      } catch (e) {
        console.error(e);
        setError("Failed to load results.");
      }
    };
    fetchResult();
  }, [jobId]);

  const submitQuestion = async () => {
    if (!question.trim()) return;
    const response = await fetch(`${BACKEND_BASE_URL}/ask/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    const data = await response.json();
    setAnswer(data.answer || "No answer available.");
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p style={{ color: "red", textAlign: "center" }}>{error}</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main>
        <h1 style={{ textAlign: "center" }}>Loading Results...</h1>
      </main>
    );
  }

  return (
    <>
      <header style={{ padding: "1rem", textAlign: "center" }}>
        <strong style={{ color: "#e63946" }}>Too Long, Didn’t Watch</strong>
      </header>

      <main style={{ maxWidth: "960px", margin: "auto", padding: "2rem 1rem" }}>
        <h2 style={{ textAlign: "center" }}>Your Video Has Been Transcribed</h2>

        <div style={{ display: "flex", justifyContent: "center", gap: "1rem", marginBottom: "1.5rem" }}>
          <button onClick={() => setActiveTab("transcript")}>Transcript</button>
          <button onClick={() => setActiveTab("summary")}>Enriched Summary</button>
        </div>

        <div
          style={{
            padding: "1.5rem",
            background: "#fff",
            borderRadius: "0.75rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            maxHeight: "400px",        // 👈 tweak height as needed
            overflowY: "auto",         // 👈 enables vertical scroll
            whiteSpace: "pre-wrap",    // 👈 keeps line breaks in transcript
          }}
        >
          <h3>{activeTab === "transcript" ? "Full Transcript" : "Enriched Summary with Slides"}</h3>
          <ReactMarkdown>
            {activeTab === "transcript" ? result.transcript : result.enriched_summary}
          </ReactMarkdown>

        </div>


        <section style={{ marginTop: "2rem", padding: "1rem", background: "#f9f9f9", borderRadius: "0.5rem" }}>
          <textarea
            rows="3"
            placeholder="Type your questions about this video..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ width: "100%", marginBottom: "1rem" }}
          />
          <div style={{ textAlign: "center" }}>
            <button onClick={submitQuestion} style={buttonStyle}>Ask AI</button>
          </div>

          {answer && (
            <blockquote style={{ marginTop: "1rem" }}>
              <strong>Answer:</strong> {answer}
            </blockquote>
          )}
        </section>

        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button style={buttonStyle} onClick={() => downloadFile("transcript.txt", result.transcript)}>Download Transcript</button>
          <button style={buttonStyle} onClick={() => downloadFile("summary.txt", result.enriched_summary)}>Download Enriched Summary</button>
          <button style={buttonStyle} onClick={() => downloadFile("chat.txt", answer)}>Download Chat</button>
        </div>

      </main>

      <footer style={{ textAlign: "center", padding: "1rem" }}>
        <small>© 2025 TL;Dw. All rights reserved.</small>
      </footer>
    </>
  );
}
