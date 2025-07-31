import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("isAuthenticated");
    const storedUser = localStorage.getItem("usuario");

    if (!isAuthenticated || !storedUser) {
      navigate("/login"); // Redirige si no está logueado
    } else {
      setUsuario(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("usuario");
    alert("Sesión cerrada");
    navigate("/login");
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Mi Perfil</h2>
      <p><strong>Nombre:</strong> {usuario.nombre}</p>
      <p><strong>Email:</strong> {usuario.email}</p>
      <p><strong>Rol:</strong> {usuario.rol}</p>

      <button onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default Perfil;
