import { useEffect, useState } from "react"; // Importamos hooks de React
import { useNavigate } from "react-router-dom"; // Importamos hook para navegación
import Swal from "sweetalert2"; // Importamos SweetAlert2 para alertas
import "../estilos/Perfil.css"; // Estilos del perfil

const Perfil = () => {
  const [usuario, setUsuario] = useState(null); // Estado para guardar datos del usuario
  const navigate = useNavigate(); // Hook para redireccionar páginas

  useEffect(() => {
    const storedUser = localStorage.getItem("usuario"); // Obtenemos usuario desde localStorage

    if (storedUser) {
      const userData = JSON.parse(storedUser); // Convertimos el string a objeto
      setUsuario(userData); // Guardamos usuario en el estado
      localStorage.setItem("nombre", userData.nombre); // Guardamos nombre en localStorage
    }
  }, []); // Se ejecuta solo al montar el componente

  const handleLogout = () => {
    // Mostramos alerta de confirmación al cerrar sesión
    Swal.fire({
      title: "¿Cerrar sesión?",
      text: "Tu sesión se cerrará y volverás a la página principal.",
      icon: "warning",
      showCancelButton: true, // Mostrar botón de cancelar
      confirmButtonText: "Sí, cerrar",
      cancelButtonText: "Cancelar",
      confirmButtonColor: "#2e7d32", // Verde
      cancelButtonColor: "#d33", // Rojo
    }).then((result) => {
      if (result.isConfirmed) { // Si el usuario confirma
        localStorage.removeItem("token"); // Eliminamos token
        localStorage.removeItem("isAuthenticated"); // Eliminamos bandera de autenticación
        localStorage.removeItem("usuario"); // Eliminamos datos del usuario
        localStorage.removeItem("nombre"); // Eliminamos nombre

        // Mostramos alerta de éxito
        Swal.fire({
          icon: "success",
          title: "Sesión cerrada",
          text: "Has cerrado sesión correctamente.",
          confirmButtonColor: "#2e7d32",
        }).then(() => {
          navigate("/Landing"); // Redirigimos a la página principal
        });
      }
    });
  };

  return (
    <div className="perfil-container">
      <div className="perfil-card">
        {usuario ? (
          <>
            {/* Avatar del usuario */}
            <div className="perfil-avatar">
              <img
                src={usuario.avatar || `https://ui-avatars.com/api/?name=${usuario?.nombre || "Usuario"}&background=2e7d32&color=fff&size=128`}
                alt="Avatar"
              />
            </div>
            <h2>{usuario.nombre}</h2> {/* Nombre del usuario */}
            <p className="perfil-rol">🌿{usuario.rol}</p> {/* Rol del usuario */}
            <p><strong>Email:</strong> {usuario.email}</p> {/* Email */}
          </>
        ) : (
          <p>No has iniciado sesión.</p> // Mensaje si no hay usuario
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginTop: "1.5rem" }}>
          {usuario && (
            // Botón para cerrar sesión
            <button className="perfil-logout" onClick={handleLogout}>
              Cerrar sesión
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Perfil; // Exportamos componente