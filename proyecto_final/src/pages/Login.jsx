import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/Login.css"; 

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginUrl = `${process.env.REACT_APP_API_URL}/auth/login`;
    console.log("URL de login:", loginUrl);

    try {
      const res = await fetch(loginUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      // Normalizamos el usuario para que siempre tenga id
      const usuarioFormateado = {
        id: data.usuario.id || data.usuario._id, // asegura el id
        nombre: data.usuario.nombre || "Usuario",
        rol: data.usuario.rol || "",
        email: data.usuario.email || "",
      };

      // Guardamos datos en localStorage
      localStorage.setItem("token", data.token || "");
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("usuario", JSON.stringify(usuarioFormateado));

      alert("Inicio de sesión exitoso");
      navigate("/inicio");

    } catch (error) {
      console.error("❌ Error al iniciar sesión:", error);
      alert(error.message || "Error de conexión");
    }
  };

  return (
    <div className="login-container">
      
      
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="login-title">🌱 Iniciar Sesión</h2>
          <p className="login-subtitle">Bienvenido a AgromarketC.R</p>
        </div>

        <div className="input-group">
          <label htmlFor="email">Correo electrónico</label>
          <input
            id="email"
            className="login-input"
            type="email"
            name="email"
            placeholder="tucorreo@ejemplo.com"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="input-group">
          <label htmlFor="password">Contraseña</label>
          <input
            id="password"
            className="login-input"
            type="password"
            name="password"
            placeholder="Tu contraseña"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit" className="login-button">
          Iniciar Sesión
        </button>

        <div className="register-link">
          ¿No tienes una cuenta?
          <a href="/register" onClick={(e) => { e.preventDefault(); navigate('/register'); }}>
            Regístrate aquí
          </a>
        </div>
      </form>
    </div>
  );
};

export default Login;
