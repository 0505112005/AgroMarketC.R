import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log("Respuesta login:", data); // <-- para verificar token

      if (!res.ok) {
        setError(data.message || "Error al iniciar sesión");
        return;
      }

      // Guardar usuario y token en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      // Redirigir a Inicio
      navigate("/inicio", { replace: true });

    } catch (err) {
      console.error("Error de conexión:", err);
      setError("Error de conexión al servidor");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>🌿 Iniciar Sesión</h2>
        
        <label>
          Correo Electrónico
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            required
          />
        </label>

        <label>
          Contraseña
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresa tu contraseña"
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" className="btn-login">
          Ingresar
        </button>

        <div className="register-link">
          ¿No tienes cuenta?
          <a href="/register">Regístrate aquí</a>
        </div>
      </form>
    </div>
  );
}
