import React from "react";
import Navbar from "../components/Navbar";
import "../styles/LandingPage.css";
import HeroIllustration from "../assets/images/Illustration.png";
import Coding from "../assets/images/coding-a-website.png";

function LandingPage() {
  return (
    <div className="landing-page">
      <div className="sections">
        {/* Hero Section */}
        <div className="section section-1">
          <Navbar />
          <div className="hero-container">
            <div className="hero-text">
              <h1 style={{ color: "white" }}>
                Secure your <span className="highlight">supply chain</span> with
                <br />
                blockchain-powered product
                <br />
                tracking and verification
              </h1>
              <p>Secure, track, and verify products in real time</p>
              <button className="get-started-btn">Get Started</button>
            </div>
            <div className="hero-graphic">
              <img src={HeroIllustration} alt="Analytics" />
            </div>
          </div>
        </div>

        <div className="section section-2">
          <div className="features-container">
            <div className="features-left">
              <h2 style={{ color: "#1f6b8ca0" }}>
                Smart Features for Secure Delivery{" "}
              </h2>
              <h3
                style={{
                  marginTop: "10px",
                  marginRight: "40px",
                  opacity: "0.5",
                }}
              >
                Our Supply Chain Security Verification System is a
                blockchain-powered platform designed to prevent counterfeiting
                and ensure transparency across the supply chain.{" "}
              </h3>
              <img src={Coding} alt="Secure delivery illustration" />
            </div>
            <div className="features-right">
              <div className="feature-card card-1">
                <h3 style={{ color: "white" }}>Iot Analytics</h3>
                <span className="arrow">↗</span>
              </div>
              <div className="feature-card card-2">
                <h3 style={{ color: "white" }}>Security</h3>
                <span className="arrow">↗</span>
              </div>
              <div className="feature-card card-3">
                <h3 style={{ color: "white" }}>Distributor Friendly</h3>
                <span className="arrow">↗</span>
              </div>
              <div className="feature-card card-4">
                <h3 style={{ color: "white" }}>Smart contracts</h3>
                <span className="arrow">↗</span>
              </div>
            </div>
          </div>
        </div>

        <div
          className="section section-3"
          style={{
            backgroundColor: "#0f5a71",
            color: "#fff",
            textAlign: "center",
            padding: "60px 20px",
          }}
        >
          <h2 style={{ color: "white", fontSize: "28px", fontWeight: "700" }}>
            Empowering{" "}
            <span style={{ color: "grey" }}>secure and transparent</span> supply
            chains
            <br />
            through blockchain verification.
          </h2>
          <p style={{ marginTop: "20px", fontSize: "16px", color: "#888" }}>
            Join us in building a transparent and secure supply chain for the
            future
          </p>
          <button
            style={{
              marginTop: "30px",
              backgroundColor: "rgba(241, 241, 241, 0.89)",
              border: "none",
              color: "#000",
              fontSize: "16px",
              padding: "12px 30px",
              borderRadius: "6px",
              boxShadow: "4px 4px 10px rgba(231, 238, 242, 0.3)",
              cursor: "pointer",
            }}
          >
            Join us !
          </button>
          <p
            style={{
              marginTop: "20px",
              fontSize: "14px",
              color: "#ccc",
              maxWidth: "600px",
              margin: "20px auto",
            }}
          >
            Be a part of the future of supply chain integrity — where every
            product’s journey is authenticated, transparent, and tamper-proof
            with the power of blockchain.
          </p>
        </div>

        <div
          className="section section-4"
          style={{
            backgroundColor: "#0f5a71",

            color: "#ffffff",
            padding: "40px 20px",
          }}
        >
          <div
            style={{ borderBottom: "1px solid #444", marginBottom: "20px" }}
          ></div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3 style={{ color: "#fff", fontWeight: "600", fontSize: "20px" }}>
              PharmaChain
            </h3>
            <p
              style={{
                textAlign: "center",
                fontSize: "14px",
                maxWidth: "400px",
                margin: "10px 0",
              }}
            >
              Your tasks, your way. Get things done without the stress!
              <br />
              Need help? Contact us at{" "}
              <span style={{ color: "white" }}>pharmachain01@gmail.com</span>
            </p>

            <div style={{ display: "flex", gap: "20px", marginTop: "15px" }}>
              <span>📍 Anna Salai, Chennai</span>
              <span>📞 9445034039</span>
              <span>🔗 LinkedIn / GitHub</span>
            </div>

            <div
              style={{
                marginTop: "30px",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                gap: "15px",
                fontSize: "12px",
                opacity: "0.6",
              }}
            >
              <span>ABOUT US</span>
              <span>CONTACT US</span>
              <span>HELP</span>
              <span>PRIVACY POLICY</span>
              <span>DISCLAIMER</span>
            </div>

            <p style={{ marginTop: "10px", fontSize: "12px", opacity: "0.5" }}>
              © 2025 Kephiun Personal Intel Management.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
