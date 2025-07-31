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
    console.log("URL de login:", `${process.env.REACT_APP_API_URL}/login`);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.mensaje || "Error al iniciar sesión");
      }

      // ✅ Guarda el token y los datos del usuario en localStorage
      localStorage.setItem("token", data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("usuario", JSON.stringify(data.usuario));

      alert("Inicio de sesión exitoso");
      navigate("/"); // Redirige a inicio u otra página
    } catch (error) {
      console.error("Error:", error);
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
