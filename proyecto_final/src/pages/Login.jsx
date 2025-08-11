import { useState } from "react";
import { useNavigate } from "react-router-dom";

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
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        value={form.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Contraseña"
        value={form.password}
        onChange={handleChange}
        required
      />
      <button type="submit">Entrar</button>
    </form>
  );
};

export default Login;
