import { NavLink } from "react-router-dom";
import { useCarrito } from "./CarritoContext";
import { useState, useEffect } from "react";

const linkClass = ({ isActive }) =>
  "nav__link" + (isActive ? " nav__link--active" : "");

export default function Sidebar() {
  const { carrito } = useCarrito();
  const [user, setUser] = useState(null);
  const [unreadCount] = useState(3);

  // Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.id ? parsedUser : null);
    } else {
      setUser(null);
    }
  }, []);

  const nombreUsuario = user?.nombre || "Invitado";

  return (
    <div className="nav">
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
          src="https://www.w3schools.com/howto/img_avatar.png"
          alt="Avatar"
          className="nav__avatar"
        />
        <div className="nav__user-info">
          <p className="nav__user-name">{nombreUsuario}</p>
          <p className="nav__user-role">{user?.rol || "Invitado"}</p>
        </div>
      </div>

      <nav className="nav__menu">
        <NavLink end to="/" className={linkClass}>
          📊 Dashboard
        </NavLink>
        <NavLink to="/catalogo" className={linkClass}>
          📦 Catálogo
        </NavLink>
        <NavLink to="/carrito" className={linkClass}>
          🛒 Carrito ({carrito.length})
        </NavLink>
        <NavLink to="/vender" className={linkClass}>
          🌱 Vender
        </NavLink>
        <NavLink to="/mis-productos" className={linkClass}>
          🧺 Mis Productos
        </NavLink>
        <NavLink to="/mensajeria" className={linkClass} style={{ position: "relative" }}>
          💬 Mensajería
          {unreadCount > 0 && (
            <span className="nav__badge">{unreadCount}</span>
          )}
        </NavLink>
        <NavLink to="/perfil" className={linkClass}>
          👤 Mi Perfil
        </NavLink>
        {user?.rol === "comprador" && (
          <NavLink to="/solicitud-vendedor" className={linkClass}>
            📩 Quiero Vender
          </NavLink>
        )}
      </nav>

      
    </div>
  );
}
