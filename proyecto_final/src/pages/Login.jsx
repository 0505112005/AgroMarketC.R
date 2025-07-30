import { useState } from "react";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      localStorage.setItem("token", data.token);
      alert("Inicio de sesión exitoso");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message || "Error de conexión");
    }
  };


};

export default Login;
