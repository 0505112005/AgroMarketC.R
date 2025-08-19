import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUsuario(userData);
      localStorage.setItem("nombre", userData.nombre);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombre");
    alert("Sesión cerrada");
    navigate("/Landing");
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {usuario ? (
          <>
            <div className="perfil-avatar">
              <img
                src={usuario.avatar || "/avatar-default.png"}
                alt="Avatar"
              />
            </div>
            <h2>{usuario.nombre}</h2>
            <p className="perfil-rol">🌿{usuario.rol}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
          </>
        ) : (
          <p>No has iniciado sesión.</p>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
          {usuario && (
            <button className="perfil-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
         
        </div>
      </div>
    </div>
  );
};

export default Perfil;
