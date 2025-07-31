// src/components/RutaProtegida.jsx
import { Navigate } from "react-router-dom";

const RutaProtegida = ({ children }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const tienePerfil = localStorage.getItem("tienePerfil") === "true";

  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  if (!tienePerfil) {
    return <Navigate to="/register" />;
  }

  return children;
};

export default RutaProtegida;
