// src/pages/SolicitudVendedor.jsx
import React, { useState } from "react";

const SolicitudVendedor = () => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    correo: "",
    descripcion: "",
  });

  const handleChange = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aquí puedes hacer una llamada a tu API o simplemente guardar el JSON
    console.log("Solicitud enviada:", formulario);
    alert("Tu solicitud ha sido enviada. Pronto será revisada.");
  };

  return (
    <div className="container">
      <h2>Solicitud para ser Vendedor</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="nombre" placeholder="Tu nombre completo" onChange={handleChange} required />
        <input type="email" name="correo" placeholder="Correo electrónico" onChange={handleChange} required />
        <textarea name="descripcion" placeholder="¿Qué deseas vender?" onChange={handleChange} required />
        <button type="submit">Enviar Solicitud</button>
      </form>
    </div>
  );
};

export default SolicitudVendedor;
