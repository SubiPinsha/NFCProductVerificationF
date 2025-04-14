import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [role, setRole] = useState(localStorage.getItem("role") || null);

  const login = (role) => {
    localStorage.setItem("role", role);
    setRole(role);
  };

  const logout = () => {
    localStorage.removeItem("role");
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
