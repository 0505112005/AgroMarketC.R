// src/components/RutaVendedor.jsx

// Importamos React y componentes necesarios
import React from "react";
import { Navigate } from "react-router-dom"; // Para redireccionar si no cumple condiciones
import Swal from "sweetalert2"; // Para mostrar alertas bonitas

// Componente RutaVendedor: protege rutas solo para usuarios con rol "vendedor"
const RutaVendedor = ({ children }) => {
  // Obtenemos el usuario almacenado en localStorage
  const storedUser = localStorage.getItem("usuario");
  // Si existe y no es "undefined", parseamos el JSON; si no, ponemos null
  const usuario = storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null;

  // Validación del rol del usuario
  if (!usuario || usuario.rol !== "vendedor") {
    // Si el usuario no es vendedor o no está logueado, mostramos alerta
    Swal.fire({
      icon: "warning", // Icono de advertencia
      title: "Acceso restringido", // Título de la alerta
      text: "Esta sección es solo para vendedores.", // Mensaje
      confirmButtonColor: "#4CAF50", // Color del botón de confirmación
      confirmButtonText: "Entendido", // Texto del botón
      timer: 2500, // Duración automática de la alerta (2.5 segundos)
      timerProgressBar: true // Barra de progreso durante el tiempo
    });

    // Redireccionamos al inicio
    return <Navigate to="/inicio" replace />;
  }

  // Si el usuario es vendedor, renderizamos los elementos hijos de la ruta
  return children;
};

// Exportamos el componente para poder usarlo en las rutas protegidas
export default RutaVendedor;
