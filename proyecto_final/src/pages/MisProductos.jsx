// src/pages/MisProductos.jsx
import React, { useEffect, useState } from "react";

function MisProductos() {
  const [misProductos, setMisProductos] = useState([]);
  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    const obtenerMisProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const productos = await res.json();

        const filtrados = productos.filter(
          (prod) => prod.usuarioId === usuario.id
        );

        setMisProductos(filtrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    if (usuario) {
      obtenerMisProductos();
    }
  }, [usuario]);

  return (
    <div className="mis-productos-container">
      <h2>🧺 Mis Productos Publicados</h2>
      {misProductos.length === 0 ? (
        <p>No has publicado productos aún.</p>
      ) : (
        <ul>
          {misProductos.map((producto) => (
            <li key={producto._id}>
              <h3>{producto.nombre}</h3>
              <p>{producto.descripcion}</p>
              <p>₡{producto.precio}</p>
              <p>Certificación: {producto.certificacion}</p>
              <img
                src={producto.imagen}
                alt={producto.nombre}
                style={{ width: "150px" }}
              />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MisProductos;
