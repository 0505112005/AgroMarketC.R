// src/components/RutaProtegida.jsx

// Importamos Navigate para redireccionar desde react-router-dom
import { Navigate } from "react-router-dom";

// Componente RutaProtegida: protege rutas para usuarios autenticados y con perfil
const RutaProtegida = ({ children }) => {
  // Verifica si el usuario está autenticado leyendo localStorage
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  // Verifica si el usuario tiene perfil creado
  const tienePerfil = localStorage.getItem("tienePerfil") === "true";

  // Si no está autenticado, redirige al Login
  if (!isAuthenticated) {
    return <Navigate to="/Login" />;
  }

  // Si no tiene perfil, redirige a la página de registro/perfil
  if (!tienePerfil) {
    return <Navigate to="/register" />;
  }

  // Si cumple ambas condiciones, renderiza los elementos hijos de la ruta
  return children;
};

// Exportamos el componente para usarlo en rutas protegidas
export default RutaProtegida;
