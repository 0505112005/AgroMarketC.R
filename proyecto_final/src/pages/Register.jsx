import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../clases/login";
import "../estilos/Register.css";

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    direccion: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      console.log("Datos antes de enviar a registrarUsuario:", form);
      const result = await Login.registrarUsuario(form);
      console.log("Respuesta del servidor:", result);

      if (!result.success) {
        setError(result.error || "Error al registrar usuario");
        return;
      }

      localStorage.setItem("tienePerfil", "true");

      setForm({
        nombre: "",
        email: "",
        password: "",
        direccion: "",
        telefono: "",
      });

      alert(result.message || "Registro exitoso");
    } catch (error) {
      console.error("Error en registro:", error);
      setError(error.message || "Error de conexión al servidor");
    } finally {
      setLoading(false);
    }
  };

  const navigate = useNavigate();

  return (
    <div className="register-container">
      

      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-header">
          <h2 className="register-title">🌱 Crear Cuenta</h2>
          <p className="register-subtitle">Únete a la comunidad de AgromarketC.R</p>
        </div>

        {error && (
          <div className="error-message">
            ⚠️ {error}
          </div>
        )}

        <div className="form-grid">
          <div className="input-group">
            <label htmlFor="nombre">Nombre completo</label>
            <input
              id="nombre"
              className="register-input"
              name="nombre"
              placeholder="Tu nombre"
              onChange={handleChange}
              value={form.nombre}
              required
            />
          </div>

          <div className="input-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              className="register-input"
              name="telefono"
              placeholder="Número teléfono"
              onChange={handleChange}
              value={form.telefono}
            />
          </div>

          <div className="input-group full-width">
            <label htmlFor="email">Correo electrónico</label>
            <input
              id="email"
              className="register-input"
              name="email"
              type="email"
              placeholder="tucorreo@ejemplo.com"
              onChange={handleChange}
              value={form.email}
              required
            />
          </div>

          <div className="input-group full-width">
            <label htmlFor="direccion">Dirección</label>
            <input
              id="direccion"
              className="register-input"
              name="direccion"
              placeholder="Tu dirección completa"
              onChange={handleChange}
              value={form.direccion}
            />
          </div>

          <div className="input-group full-width">
            <label htmlFor="password">Contraseña</label>
            <input
              id="password"
              className="register-input"
              name="password"
              type="password"
              placeholder="Crea una contraseña segura"
              onChange={handleChange}
              value={form.password}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="register-button"
        >
          {loading ? "Creando cuenta..." : "Crear cuenta"}
        </button>

        <div className="login-link">
          ¿Ya tienes una cuenta?
          <a href="/login" onClick={(e) => { e.preventDefault(); navigate('/login'); }}>
            Inicia sesión
          </a>
        </div>
      </form>
    </div>
  );
};

export default Register;
