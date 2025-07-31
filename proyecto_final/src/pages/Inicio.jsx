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
        <h1>🌿 Agro Market</h1>
        <div className="header-buttons">
          <button onClick={() => navigate("/vender")}>🛒 Vender</button>
          
        </div>
      </header>

      {/* LAYOUT */}
      <div className="content">
        <aside className="sidebar">
          <div className="logo">
            <h2>🌿</h2>
          </div>

          <nav className="nav-menu">
            <ul>
              <li>
                <button>📊 Dashboard</button>
              </li>
              <li>
                <button>📦 Catálogo</button>
              </li>
              <li>
                <button>🛒 Carrito</button>
              </li>
              <li>
                <button>📃 Pedidos</button>
              </li>
            </ul>
          </nav>

          <div className="usuario">
            <img
              src="ruta-del-avatar.jpg"
              alt="Avatar"
              className="avatar"
            />
            <div className="info-usuario">
              <p className="nombre">Rodolfo</p>
              <p className="rol">Comprador</p>
              <div className="header-buttons">
                <button onClick={() => navigate("/Perfil")}>👤 Perfil</button>
                
              </div>
          
            </div>
          </div>
        </aside>

        <main className="main">
          <section className="catalogo">
            <h2 className="titulo">Catálogo de Productos</h2>
            <p className="subtitulo">
              Descubre los mejores productos agrícolas directamente de nuestros agricultores
            </p>

            <div className="filtros">
              <input
                type="text"
                placeholder="Buscar productos..."
                className="buscador"
              />
              <select className="dropdown">
                <option>Todas las categorías</option>
                <option>Frutas</option>
                <option>Verduras</option>
                <option>Café</option>
                <option>Otros</option>
              </select>
              <select className="dropdown">
                <option>Nombre A-Z</option>
                <option>Nombre Z-A</option>
                <option>Precio más bajo</option>
                <option>Precio más alto</option>
              </select>
              <span className="resultados">
                {productos.length} productos encontrados
              </span>
            </div>

            <div className="productos-grid">
              {productos.length === 0 ? (
                <p>No hay productos disponibles</p>
              ) : (
                productos.map((producto) => (
                  <div className="card" key={producto._id}>
                    <div className="card-etiqueta">Orgánico</div>
                    <img
                      src={producto.imagen}
                      alt={producto.nombre}
                      className="card-imagen"
                    />
                    <h3 className="card-nombre">{producto.nombre}</h3>
                    <p className="card-ubicacion">{producto.ubicacion}</p>
                    <p className="card-precio">€{producto.precio} /kg</p>
                    <p className="card-stock">Stock: {producto.stock} kg</p>
                    <p className="card-productor">Por: {producto.productor}</p>
                    <div className="card-botones">
                      <button className="ver">Ver</button>
                      <button className="agregar">Agregar</button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
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
