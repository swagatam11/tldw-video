import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Result() {
  const { jobId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transcript");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  useEffect(() => {
    const fetchResult = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/result/${jobId}`);
        const data = await response.json();

        if (data.transcript && data.summary) {
          setResult(data);
        } else {
          setError("Results not available.");
        }
      } catch {
        setError("Failed to load results.");
      }
    };

    fetchResult();
  }, [jobId]);

  const submitQuestion = async () => {
    if (!question.trim()) return;

    const response = await fetch(`http://127.0.0.1:8000/ask/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();
    setAnswer(data.answer || "No answer available.");
  };

  if (error) {
    return (
      <main>
        <h1>Error</h1>
        <p style={{ color: "red" }}>{error}</p>
      </main>
    );
  }

  if (!result) {
    return (
      <main>
        <h1>Loading Results...</h1>
      </main>
    );
  }

  return (
    <main style={{ textAlign: "center" }}>
      <h1>Transcript & Summary</h1>

      <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
        <nav>
          <ul style={{ display: "flex", justifyContent: "center", gap: "1rem", listStyle: "none", padding: 0, margin: 0 }}>
            <li>
              <a
                role="button"
                href="#"
                onClick={() => setActiveTab("transcript")}
                aria-current={activeTab === "transcript" ? "page" : undefined}
              >
                Full Transcript
              </a>
            </li>
            <li>
              <a
                role="button"
                href="#"
                onClick={() => setActiveTab("summary")}
                aria-current={activeTab === "summary" ? "page" : undefined}
              >
                Summary
              </a>
            </li>
          </ul>
        </nav>
      </div>

      <article>
        {activeTab === "transcript" ? (
          <pre>{result.transcript}</pre>
        ) : (
          <pre>{result.summary}</pre>
        )}
      </article>

      <div className="download-buttons" style={{ display: "flex", justifyContent: "center", gap: "1rem", margin: "2rem 0" }}>
        <button onClick={() => downloadFile("transcript.txt", result.transcript)}>
          Download Transcript
        </button>
        <button onClick={() => downloadFile("summary.txt", result.summary)}>
          Download Summary
        </button>
      </div>

      <hr />

      <section style={{ marginTop: "2rem", textAlign: "center" }}>
        <h2>Ask a question about this video</h2>
        <div className="question-box" style={{ display: "flex", justifyContent: "center", gap: "0.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Type your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button onClick={submitQuestion}>Submit</button>
        </div>

        {answer && (
          <blockquote style={{ marginTop: "1rem" }}>
            <strong>Answer:</strong><br />
            {answer}
          </blockquote>
        )}
      </section>
    </main>
  );
}

function downloadFile(filename, content) {
  const blob = new Blob([content], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
