import React, { useState } from "react"; // Importamos React y el hook useState
import { useNavigate } from "react-router-dom"; // Hook para navegar entre rutas
import "../estilos/Login.css"; // Importamos los estilos del componente
const backendUrl = process.env.REACT_APP_BACKEND_URL;


export default function Login() {
  // Estado para el correo electrónico ingresado
  const [email, setEmail] = useState("");
  // Estado para la contraseña ingresada
  const [password, setPassword] = useState("");
  // Estado para manejar mensajes de error
  const [error, setError] = useState("");

  // Hook para redireccionar a otras rutas
  const navigate = useNavigate();

  // Función que maneja el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Evitamos que el formulario recargue la página
    setError(""); // Limpiamos errores previos

    try {
      // Hacemos la petición POST al backend para login


      const res = await fetch(`${backendUrl}/api/auth/login`, {
        method: "POST", // Método POST para enviar datos
        headers: { "Content-Type": "application/json" }, // Indicamos que enviamos JSON
        body: JSON.stringify({ email, password }), // Convertimos el objeto a JSON
      });


      const data = await res.json(); // Obtenemos la respuesta como JSON
      console.log("Respuesta login:", data); // Imprimimos la respuesta para depuración

      // Si la respuesta no es correcta, mostramos el error
      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Si login fue exitoso, guardamos token y datos del usuario en localStorage
      localStorage.setItem("token", data.token); // Token para autenticación
      localStorage.setItem("usuario", JSON.stringify(data.usuario)); // Datos del usuario

      // Redirigimos al usuario a la página de inicio
      navigate("/inicio", { replace: true });

    } catch (err) {
      // Capturamos errores de conexión con el servidor
      console.error("Error de conexión:", err);
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🌿 Iniciar Sesión</h2>

        {/* Input de correo electrónico */}
        <label>
          Correo Electrónico
          <input
            type="email"
            value={email} // Valor controlado por estado
            onChange={(e) => setEmail(e.target.value)} // Actualiza estado
            placeholder="tu@email.com"
            required
          />
        </label>

        {/* Input de contraseña */}
        <label>
          Contraseña
          <input
            type="password"
            value={password} // Valor controlado por estado
            onChange={(e) => setPassword(e.target.value)} // Actualiza estado
            placeholder="Ingresa tu contraseña"
            required
          />
        </label>

        {/* Mostrar mensaje de error si existe */}
        {error && <div className="error">{error}</div>}

        {/* Botón de envío */}
        <button type="submit" className="btn-login">
          Ingresar
        </button>

        {/* Enlace para registro */}
        <div className="register-link">
          ¿No tienes cuenta?
          <a href="/register">Regístrate aquí</a>
        </div>
      </form>
    </div>
  );
}
