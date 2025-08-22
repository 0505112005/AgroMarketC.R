// Importamos NavLink para la navegación y hooks de React
import { NavLink } from "react-router-dom";
import { useCarrito } from "./CarritoContext";
import { useState, useEffect } from "react";

// Función para asignar clases activas a los enlaces del sidebar
const linkClass = ({ isActive }) =>
  "nav__link" + (isActive ? " nav__link--active" : "");

// Componente principal Sidebar
export default function Sidebar() {
  // Obtenemos el carrito desde el contexto
  const { carrito } = useCarrito();

  // Estado para guardar información del usuario
  const [user, setUser] = useState(null);

  // Estado simulado para mensajes no leídos (puede ser dinámico después)
  const [unreadCount] = useState(3);

  // useEffect para cargar la información del usuario desde localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && storedUser !== "undefined") {
      // Parseamos el JSON del usuario y verificamos que tenga un id válido
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.id ? parsedUser : null);
    } else {
      // Si no hay usuario, dejamos el estado en null
      setUser(null);
    }
  }, []);

  // Nombre que se muestra en el sidebar, por defecto "Invitado"
  const nombreUsuario = user?.nombre || "Invitado";

  return (
    <div className="nav">
      {/* Logo y nombre del panel */}
      <div className="nav__brand">
        <div className="logo">🌿</div>
        <div>
          <strong>AgroMarket</strong>
          <div className="nav__sub">Panel</div>
        </div>
      </div>

      {/* Información del usuario */}
      <div className="nav__user">
        <img
          src="https://www.w3schools.com/howto/img_avatar.png" // Avatar por defecto
          alt="Avatar"
          className="nav__avatar"
        />
        <div className="nav__user-info">
          <p className="nav__user-name">{nombreUsuario}</p> {/* Nombre del usuario */}
          <p className="nav__user-role">{user?.rol || "Invitado"}</p> {/* Rol del usuario */}
        </div>
      </div>

      {/* Menú de navegación */}
      <nav className="nav__menu">
        {/* Enlace a Dashboard */}
        <NavLink end to="/inicio" className={linkClass}>
          📊 Dashboard
        </NavLink>

        {/* Enlace a Catálogo */}
        <NavLink to="/catalogo" className={linkClass}>
          📦 Catálogo
        </NavLink>

        {/* Enlace al Carrito, mostrando cantidad de productos */}
        <NavLink to="/carrito" className={linkClass}>
          🛒 Carrito ({carrito.length})
        </NavLink>
        
        {/* Enlace a Mis Productos */}
        <NavLink to="/mis-productos" className={linkClass}>
          🧺 Mis Productos
        </NavLink>
        
        {/* Enlace condicional solo para usuarios con rol "comprador" */}
        {user?.rol === "comprador" && (
          <NavLink to="/solicitud-vendedor" className={linkClass}>
            📩 Quiero Vender
          </NavLink>
        )}

        {/* Enlace al perfil del usuario */}
        <NavLink to="/perfil" className={linkClass}>
          👤 Mi Perfil
        </NavLink>
      </nav>
    </div>
  );
}
