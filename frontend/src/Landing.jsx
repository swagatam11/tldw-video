import landingImage from "./assets/Landing_image_1.svg";
import { useEffect } from "react";
import Lottie from "lottie-react";
import uploadAnim from "./assets/upload_fig.json";
import aiAnim from "./assets/processing_fig.json";
import insightsAnim from "./assets/insight_fig.json";
import echoicLogo from "./assets/echoic_logo_2.png";



function Landing() {
  

  return (
    <div data-theme="light" style={{ fontFamily: "Manrope, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
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
          <ul style={{ display: "flex", gap: "1rem", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
            <li><a href="#how">How it Works</a></li>
            <li><a href="#pricing">Products</a></li>
            <li><a href="/upload" role="button">Get Started</a></li>
          </ul>
        </nav>
      </header>

      <main>
        <section className="top-image" style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2.5rem" }}>
            <img
              src={landingImage}
              alt="Landing"
              style={{ maxWidth: "900px", width: "80%", borderRadius: "0.75rem", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" }}
            />
            <div className="cta-below-image" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <a href="/upload" role="button" style={{ backgroundColor: "#e63946", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", textDecoration: "none" }}>Try For Free <br /> No credit card, no sign up!</a>
            </div>
          </div>
        </section>

        <section id="how" style={{ padding: "3rem 1rem", backgroundColor: "#f3f4f6" }}>
          <div className="container">
            <h2 className="section-heading" style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem" }}>
              How It Works
              <span style={{ display: "block", width: "60px", height: "4px", backgroundColor: "#e63946", margin: "0.5rem auto 1rem", borderRadius: "2px" }}></span>
            </h2>
            <div className="how-steps" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "2rem", marginTop: "2rem" }}>
              <div className="how-step" style={cardStyle}>
                <Lottie animationData={uploadAnim} style={{ height: 80 }} />
                <h3><i data-lucide="upload"></i> Upload Video</h3>
                <p>Simply upload your video. For this public beta, video length is capped at 10 mins.</p> <p> We will start accepting longer videos soon! </p>
              </div>
              <div className="how-step" style={cardStyle}>
                <Lottie animationData={aiAnim} style={{ height: 80 }} />
                <h3><i data-lucide="settings"></i> AI Processing</h3>
                <p>Our AI-powered tools "see" your videos, identify information-rich scenes and extract accurate transcripts in minutes.</p>
              </div>
              <div className="how-step" style={cardStyle}>
                <Lottie animationData={insightsAnim} style={{ height: 80 }} />
                <h3><i data-lucide="book-open"></i> Get Insights</h3>
                <p>Chat with your videos!</p> <p> Ask questions with details drawn from individual frames, and download overall vision-enriched insights.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="pricing" style={{ padding: "3rem 1rem", backgroundColor: "white" }}>
          <div className="container">
            <h2 className="section-heading" style={{ textAlign: "center", fontSize: "2rem", marginBottom: "0.5rem" }}>
              Simple Pricing
              <span style={{ display: "block", width: "60px", height: "4px", backgroundColor: "#e63946", margin: "0.5rem auto 1rem", borderRadius: "2px" }}></span>
            </h2>
            <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem", textAlign: "center" }}>
              <article className="card" style={{ ...cardStyle, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3>Pro</h3>
                  {/* <p><strong>$8.99</strong><span style={{ fontSize: "0.9rem" }}> /month</span></p>
                  <emph> or </emph>
                  <p><strong>$89</strong><span style={{ fontSize: "0.9rem" }}> /year</span></p> */}
                  <div>
                    <p>✔ 120 minutes video-analysis per month</p>
                    <p>✔ Individual video duration up to 40 minutes</p>
                    <p>✔ Transcription and vision based AI analysis</p>
                    <p>✔ Chat with your videos</p>
                    <p>✔ Deep dive analysis into selected video frames</p>
                  </div>
                </div>
                <a href="#" role="button" className="lift-hover button-link">Coming soon!</a>
              </article>
              <article className="card" style={{ ...cardStyle, border: "2px solid rgb(74, 168, 226)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <h3>Ultra</h3>
                  {/* <p><strong>$28.99</strong><span style={{ fontSize: "0.9rem" }}> /month</span></p>
                  <emph> or </emph>
                  <p><strong>$289</strong><span style={{ fontSize: "0.9rem" }}> /year</span></p> */}
                  <div>
                    <p>✔ 500 minutes video-analysis per month</p>
                    <p>✔ Individual video duration up to 60 minutes</p>
                    <p>✔ Transcription and vision based AI analysis</p>
                    <p>✔ Chat with your videos</p>
                    <p>✔ Deep dive analysis into selected video frames</p>
                  </div>
                </div>
                <a href="#" role="button" className="secondary lift-hover">Coming soon!</a>
              </article>
            </div>
            <p style={{ textAlign: "center" }}>
            For additional video analysis quota or analytics tailored to your needs, contact us. <br /> 
            </p>
          </div>
        </section>
      </main>

      <footer className="container" style={{ marginTop: "2rem" }}>
        <hr />
        <div className="grid" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <img src={echoicLogo} alt="Echoic logo" style={{ height: "28px", objectFit: "contain" }} /><br />
            <small>Fast, AI-powered video analysis.</small>
          </div>
          <nav>
            <ul style={{ display: "flex", gap: "1.5rem", listStyle: "none", padding: 0, margin: 0 }}>
              <li><a href="#">Support</a></li>
              <li><a href="#">Sales</a></li>
              <li><a href="#">Documentation</a></li>
            </ul>
          </nav>
        </div>
      </footer>
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#fff",
  padding: "2rem",
  borderRadius: "1rem",
  boxShadow: "0 2px 12px rgba(0, 0, 0, 0.05)",
  transition: "transform 0.2s ease",
};

export default Landing;
