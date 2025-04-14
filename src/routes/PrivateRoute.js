import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

const PrivateRoute = ({ allowedRoles, children }) => {
  const { role } = useContext(AuthContext);

  return allowedRoles.includes(role) ? children : <Navigate to="/nfc" />;
};

export default PrivateRoute;
