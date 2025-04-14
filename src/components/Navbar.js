import React from "react";
import "../styles/Navbar.css";
import Logo from "../assets/images/Logo.png";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleSignIn = () => {
    navigate("/login"); // Adjust the route as per your app
  };

  return (
    <div className="navbar">
      <div className="logo">
        <img src={Logo} alt="Secure delivery illustration" />
        <h1 style={{ color: "white" }}>PharmaChain</h1>
      </div>

      <ul className="nav-links">
        <li className="active">Hero</li>
        <li>Footer</li>
        <li>CTA</li>
        <li>Faq</li>
        <li>Contact</li>
      </ul>

      <button className="signin-btn" onClick={handleSignIn}>
        Sign in
      </button>
    </div>
  );
}

export default Navbar;
