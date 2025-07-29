import { useState } from "react";
import axios from "../axiosConfig";  

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
    direccion: "",
    telefono: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/register", form); // ← aquí va `form`, no `formData`
      alert(res.data.mensaje || "Registro exitoso");
    } catch (error) {
      console.error("Error:", error);
      if (error.response) {
        alert(error.response.data.mensaje || "Error del servidor");
      } else {
        alert("Error al conectar con el servidor");
      }
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Registro</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input name="nombre" placeholder="Nombre" onChange={handleChange} required />
        <input name="email" placeholder="Email" type="email" onChange={handleChange} required />
        <input name="password" placeholder="Contraseña" type="password" onChange={handleChange} required />
        <input name="direccion" placeholder="Dirección" onChange={handleChange} />
        <input name="telefono" placeholder="Teléfono" onChange={handleChange} />
        <select name="rol" onChange={handleChange}>
          <option value="cliente">Cliente</option>
          <option value="tienda">Tienda</option>
        </select>
        <button type="submit" className="bg-green-600 text-white p-2 rounded">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
