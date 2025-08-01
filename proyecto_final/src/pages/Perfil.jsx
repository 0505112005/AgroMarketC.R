import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Perfil.css";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("usuario");

    if (!isAuthenticated || !storedUser) {
      navigate("/login"); // Redirige si no está logueado
    } else {
      const userData = JSON.parse(storedUser);
      setUsuario(userData);
      localStorage.setItem("nombre", userData.nombre); // ✅ Guardar nombre para mostrar en Inicio
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    localStorage.removeItem("nombre"); // ✅ Limpia el nombre también
    alert("Sesión cerrada");
    navigate("/login");
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        <div className="perfil-avatar">
          <img
            src={usuario.avatar || "/avatar-default.png"}
            alt="Avatar"
          />
        </div>
        <h2>{usuario.nombre}</h2>
        <p className="perfil-rol">{usuario.rol}</p>
        <p><strong>Email:</strong> {usuario.email}</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
          <button className="perfil-logout" onClick={handleLogout}>
            Cerrar sesión
          </button>
          <button
            className="perfil-logout"
            onClick={() => navigate("/")}
          >
            Volver a inicio
          </button>
        </div>
      </div>
    </div>
  );
};

export default Perfil;
