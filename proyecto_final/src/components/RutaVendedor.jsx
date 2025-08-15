// src/components/RutaVendedor.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import Swal from "sweetalert2";

const RutaVendedor = ({ children }) => {
  const storedUser = localStorage.getItem("usuario");
  const usuario = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  // Validación de rol
  if (!usuario || usuario.rol !== "vendedor") {
    Swal.fire({
      icon: "warning",
      title: "Acceso restringido",
      text: "Esta sección es solo para vendedores.",
      confirmButtonColor: "#4CAF50",
      confirmButtonText: "Entendido",
      timer: 2500,
      timerProgressBar: true
    });
    return <Navigate to="/inicio" replace />;
  }

  return children;
};

export default RutaVendedor;
