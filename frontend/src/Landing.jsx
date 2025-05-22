import landingImage from "./assets/Landing_image_1.png";
import { useEffect } from "react";

function Landing() {
  

  return (
    <div data-theme="light" style={{ fontFamily: "Manrope, sans-serif" }}>
      <header style={{ position: "sticky", top: 0, zIndex: 1000, background: "white", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <nav>
          <ul>
            <li><strong style={{ color: "#e63946" }}>Too Long, Didn’t Watch</strong></li>
          </ul>
          <ul style={{ display: "flex", gap: "1rem", alignItems: "center", listStyle: "none", margin: 0, padding: 0 }}>
            <li><a href="#how">How it Works</a></li>
            <li><a href="#pricing">Pricing</a></li>
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
              style={{ maxWidth: "600px", width: "100%", borderRadius: "0.75rem", boxShadow: "0 4px 16px rgba(0, 0, 0, 0.15)" }}
            />
            <div className="cta-below-image" style={{ textAlign: "center", marginBottom: "2rem" }}>
              <a href="/upload" role="button" style={{ backgroundColor: "#e63946", color: "white", padding: "0.75rem 1.5rem", borderRadius: "8px", textDecoration: "none" }}>Try For Free</a>
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
                <h3><i data-lucide="upload"></i> Upload Video</h3>
                <p>Simply upload your video or paste a URL from YouTube, Vimeo, or other popular platforms</p>
              </div>
              <div className="how-step" style={cardStyle}>
                <h3><i data-lucide="settings"></i> AI Processing</h3>
                <p>Our AI-powered tools understand your videos and unlock key insights</p>
              </div>
              <div className="how-step" style={cardStyle}>
                <h3><i data-lucide="book-open"></i> Get Insights</h3>
                <p>Ask follow-up questions tailored to YOUR needs</p>
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
            <p style={{ textAlign: "center" }}>
              Try for free for up to 3 videos and then choose any of our plans below.
            </p>
            <div className="pricing-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", marginTop: "2rem", textAlign: "center" }}>
              <article className="card popular" style={{ ...cardStyle, border: "2px solid #457b9d" }}>
                <h3>Pro</h3>
                <p><strong>$6.99</strong><span style={{ fontSize: "0.9rem" }}> /month</span></p>
                <p><em>Billed monthly</em></p>
                <div>
                  <p>✔ 5 videos per month</p>
                  <p>✔ Video durations up to 20 minutes</p>
                  <p>✔ Video analyzer for everday needs</p>
                </div>
                <a href="/upload" role="button">Start Pro Trial</a>
              </article>
              <article className="card" style={cardStyle}>
                <h3>Ultra</h3>
                <p><strong>$14.99</strong><span style={{ fontSize: "0.9rem" }}> /month</span></p>
                <p><em>Billed monthly</em></p>
                <div>
                  <p>✔ 15 videos per month</p>
                  <p>✔ Videos up to 45 minutes</p>
                  <p>✔ Heavy-duty analysis pipeline for critical tasks</p>
                </div>
                <a href="#" role="button" className="secondary">Contact Sales</a>
              </article>
            </div>
          </div>
        </section>
      </main>

      <footer className="container" style={{ marginTop: "2rem" }}>
        <hr />
        <div className="grid" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <strong>Too Long, Didn’t Watch</strong><br />
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
