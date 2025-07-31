import { useState } from "react";
import Login from "../clases/login";

const Register = () => {
  const [form, setForm] = useState({
    nombre: "",
    email: "",
    password: "",
    rol: "cliente",
    direccion: "",
    telefono: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await Login.registrarUsuario(form);
      console.log("Respuesta del servidor:", result);

      if (!result.success) {
        setError(result.error || "Error al registrar usuario");
        return;
      }

      // Guardar en localStorage que tiene perfil
      localStorage.setItem("tienePerfil", "true");

      // Limpiar formulario después de éxito
      setForm({
        nombre: "",
        email: "",
        password: "",
        rol: "cliente",
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

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl mb-4">Registro</h2>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="nombre"
          placeholder="Nombre"
          onChange={handleChange}
          value={form.nombre}
          className="p-2 border rounded"
          required
        />
        <input
          name="email"
          placeholder="Email"
          type="email"
          onChange={handleChange}
          value={form.email}
          className="p-2 border rounded"
          required
        />
        <input
          name="password"
          placeholder="Contraseña"
          type="password"
          onChange={handleChange}
          value={form.password}
          className="p-2 border rounded"
          required
        />
        <input
          name="direccion"
          placeholder="Dirección"
          onChange={handleChange}
          value={form.direccion}
          className="p-2 border rounded"
        />
        <input
          name="telefono"
          placeholder="Teléfono"
          onChange={handleChange}
          value={form.telefono}
          className="p-2 border rounded"
        />
        <button
          type="submit"
          disabled={loading}
          className={`p-2 rounded text-white ${
            loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
          }`}
        >
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
};

export default Register;
