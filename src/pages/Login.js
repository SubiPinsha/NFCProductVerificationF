import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import AuthContext from "../context/AuthContext";
import "../styles/Login.css";
import Vector from "../assets/images/Vector.svg";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await loginUser(email, password);
      if (res.status === "success") {
        login(res.role);
        if (res.role === "admin") navigate("/dashboard");
        else if (res.role === "manufacturer") navigate("/products");
        else navigate("/nfc");
      } else {
        alert("Invalid credentials");
      }
    } catch (err) {
      alert("Error logging in");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome Back</h2>
        <input
          type="email"
          placeholder="you@yourmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Next</button>
        <a href="#" className="forgot-link">
          forgot password?
        </a>
      </div>
      <div className="wave-container">
        <img src={Vector} alt="wave background" />
      </div>
    </div>
  );
};

export default Login;
