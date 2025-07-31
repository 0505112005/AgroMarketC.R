// src/pages/Inicio.jsx
import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css";
import { useNavigate } from "react-router-dom";

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/productos");
        const data = await response.json();
        setProductos(data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div className="container">
      {/* HEADER */}
      <header className="header">
        <h1>🌿 Mercado Orgánico</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/vender")}>🛒 Vender</button>
          <button onClick={() => navigate("/Perfil")}>👤 Perfil</button>
        </div>
      </header>

      {/* LAYOUT */}
      <div className="content">
        <aside className="sidebar">
          <h3>Filtros</h3>
          <ul>
            <li>100% Orgánico</li>
            <li>75% Orgánico</li>
            <li>50% Orgánico</li>
          </ul>
        </aside>

        <main className="main">
          <h2>Productos disponibles</h2>
          {productos.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            <div className="productos-grid">
              {productos.map((producto) => (
                <div className="card" key={producto._id}>
                  <h3>{producto.nombre}</h3>
                  <p className="descripcion">{producto.descripcion}</p>
                  <p className="certificacion">
                    <strong>Certificación:</strong> {producto.certificacion}
                  </p>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <p>&copy; 2025 Mercado Orgánico</p>
      </footer>
    </div>
  );
};

export default Inicio;
