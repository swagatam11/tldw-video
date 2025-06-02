import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import echoicLogo from "./assets/echoic_logo_2.png";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";



const BACKEND_BASE_URL = import.meta.env.VITE_BACKEND_URL;
//–– Helper to convert any “[ ... ]” blocks into “$$ ... $$” so KaTeX catches them.  
//   If your backend already emits `$$ ... $$` or `\[ ... \]`, you can skip or simplify this.
function normalizeMathBlocks(markdownText) {
  if (!markdownText) return "";

  return markdownText
    .replace(/\\\$\$/g, "$$")
    .replace(/\[\s*([\s\S]*?)\s*\]/g, (_match, inner) => {
      const cleaned = inner
        .split("\n")
        .map((line) => line.replace(/\\\s*$/, ""))
        .join("\n")
        .trim();

      const collapsed = cleaned.replace(/\n{2,}/g, "\n");

      return `$$\n${collapsed}\n$$`;
    });
}

function escapeLiteralDollars(text) {
  // Escape any $ that is NOT part of an inline/display math expression
  // This escapes all $ that are not between word boundaries (e.g., $9 billion → \$9 billion)
  // WARNING: this will escape actual math $ too!
  return text.replace(/\$/g, '\\$');
}

export default function Result() {
  const { jobId } = useParams();
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("transcript");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [useSlide, setUseSlide] = useState(false);
  const [slideTimestamp, setSlideTimestamp] = useState(null);
  const [slideImage, setSlideImage] = useState(null);
  const [qaCache, setQaCache] = useState({});
  const [timeHint, setTimeHint] = useState("");
  const [timeHintError, setTimeHintError] = useState(false);
  const [chatHistory, setChatHistory] = useState([]);


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

  const parseTimeHint = (input) => {
    const parts = input.split(":").map((x) => parseInt(x.trim(), 10));
    if (parts.length === 1) return parts[0] || 0;
    if (parts.length === 2) return (parts[0] * 60 + parts[1]) || 0;
    return 0;
  };

  const submitQuestion = async () => {
    if (!question.trim()) return;

    const hintSeconds = parseTimeHint(timeHint);
    if (useSlide && !hintSeconds) {
      setTimeHintError(true);
      return;
    }
    setTimeHintError(false);

    const cacheKey = `${question}::${hintSeconds}`;
    if (qaCache[cacheKey]) {
      const cached = qaCache[cacheKey];
      setAnswer(cached.answer);
      setSlideTimestamp(cached.slideTimestamp || null);
      setSlideImage(cached.slideImage || null);
      return;
    }

    const response = await fetch(`${BACKEND_BASE_URL}/ask/${jobId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        use_slide: useSlide,
        time_hint: hintSeconds,
      }),
    });

    const data = await response.json();
    const responseAnswer = data.answer || "No answer available.";
    const responseTimestamp = data.slide_timestamp || null;
    const responseImage = data.slide_image_url || null;

    setAnswer(responseAnswer);
    setSlideTimestamp(responseTimestamp);
    setSlideImage(responseImage);
    setChatHistory((prev) => [
      ...prev,
      { question, answer: responseAnswer }
    ]);

    setQaCache((prev) => ({
      ...prev,
      [cacheKey]: {
        answer: responseAnswer,
        slideTimestamp: responseTimestamp,
        slideImage: responseImage,
      },
    }));
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
            maxHeight: "400px",
            overflowY: "auto",
            whiteSpace: "pre-wrap",
          }}
        >
          <h3>{activeTab === "transcript" ? "Full Transcript" : "Enriched Summary with Slides"}</h3>
          {activeTab === "transcript" ? (
            <ReactMarkdown
              remarkPlugins={[remarkMath]}
              rehypePlugins={[rehypeKatex]}
            >
              {result && result.transcript && (
                normalizeMathBlocks(
                  Array.isArray(result.transcript)
                    ? result.transcript
                        .filter((seg) => seg && seg.text) // safeguard for null/undefined segments
                        .map((seg) => escapeLiteralDollars(seg.text.trim()))
                        .join("\n\n")
                    : escapeLiteralDollars(String(result.transcript))
                )
              )}

            </ReactMarkdown>
          ) : (
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
              >
                {result.enriched_summary}
              </ReactMarkdown>
          )}
         </div>

        <section style={{ marginTop: "2rem", padding: "1rem", background: "#f9f9f9", borderRadius: "0.5rem" }}>
          <textarea
            rows="3"
            placeholder="Type your questions about this video..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.ctrlKey) {
                e.preventDefault();
                submitQuestion();
              }
            }}
            style={{ width: "100%", marginBottom: "1rem" }}
          />


          {useSlide && (
            <>
              <input
                type="text"
                placeholder="Approx time (e.g. 0:30 or 90)"
                value={timeHint}
                onChange={(e) => setTimeHint(e.target.value)}
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  marginBottom: "0.25rem",
                  border: "1px solid #ccc",
                  borderRadius: "4px",
                }}
              />
              {timeHintError && (
                <p style={{ color: "#b00020", marginTop: "0.25rem", fontSize: "0.9rem" }}>
                  Please enter the approximate time (e.g. 0:42) to help locate the relevant slide.
                </p>
              )}
            </>
          )}

          <div style={{ textAlign: "center" }}>
            <label style={{ marginRight: "1rem" }}>
              <input
                type="checkbox"
                checked={useSlide}
                onChange={() => setUseSlide(!useSlide)}
                style={{ marginRight: "0.5rem" }}
              />
              Data Deep Dive
            </label>
            <button onClick={submitQuestion} style={buttonStyle}>Ask AI</button>
          </div>

          {answer && (
            <blockquote style={{ marginTop: "1rem" }}>
              <strong>Answer:</strong>
              <ReactMarkdown
                children={answer}
                remarkPlugins={[remarkMath]}
                rehypePlugins={[rehypeKatex]}
                components={{
                  p: ({ node, ...props }) => <p style={{ margin: "0.5rem 0" }} {...props} />,
                  li: ({ node, ...props }) => <li style={{ marginBottom: "0.25rem" }} {...props} />,
                }}
              />

              {slideTimestamp !== null && (
                <p style={{ fontSize: "0.85rem", color: "#555", marginTop: "0.25rem" }}>
                  <em>Slide shown near: {slideTimestamp} sec</em>
                </p>
              )}
              {slideImage && (
                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                  <img
                    src={slideImage}
                    alt="Slide preview"
                    style={{
                      maxWidth: "100%",
                      borderRadius: "6px",
                      border: "1px solid #ccc"
                    }}
                  />
                </div>
              )}
            </blockquote>
          )}
        </section>

        <div style={{ textAlign: "center", marginTop: "2rem", display: "flex", justifyContent: "center", gap: "1rem", flexWrap: "wrap" }}>
          <button style={buttonStyle} onClick={() => downloadFile("transcript.txt", result.transcript)}>Download Transcript</button>
          <button style={buttonStyle} onClick={() => downloadFile("summary.txt", result.enriched_summary)}>Download Enriched Summary</button>
          <button
            style={buttonStyle}
            onClick={() => {
              const content = chatHistory.map(
                (pair, idx) => `Q${idx + 1}: ${pair.question}\nA${idx + 1}: ${pair.answer}\n`
              ).join("\n---\n");
              downloadFile("chat.txt", content);
            }}
          >
            Download Chat
          </button>

        </div>
        <div style={{ marginTop: "2rem", paddingTop: "1rem", borderTop: "1px solid #ccc" }}>
          <p style={{ fontSize: "0.95rem", color: "#555", lineHeight: "1.4" }}>
            Spare a minute to help us improve?<br />
            <a
              href="https://forms.gle/j9EDhLVWeWqDYheW8"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#007bff", textDecoration: "underline", fontWeight: "500" }}
            >
              Click here to give feedback →
            </a>
          </p>
        </div>


      </main>

      <footer style={{ textAlign: "center", padding: "1rem" }}>
        <small>© 2025 echoic. All rights reserved.</small>
      </footer>
    </>
  );
}
