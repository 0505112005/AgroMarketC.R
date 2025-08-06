import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Inicio = () => {
  const [productos, setProductos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;
  const nombreUsuario = user ? user.nombre : "Invitado";
  const rolUsuario = user ? user.rol : "invitado";

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

  const mostrarMensajeExito = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  return (
    <div className="container">
      {mensajeExito && <div className="toast-exito">{mensajeExito}</div>}

      {/* HEADER */}
      <header className="header">
        <h1>🌿 Agro Market</h1>
        <div className="header-buttons">
          {rolUsuario !== "comprador" && (
            <button
              onClick={() => {
                const isAuthenticated = localStorage.getItem("isAuthenticated");
                navigate(isAuthenticated ? "/Vender" : "/Login");
              }}
            >
              🛒 Vender
            </button>
          )}
        </div>
      </header>

      <div className="content">
        {/* SIDEBAR */}
        <aside className="sidebar">
          <div className="logo">
            <h2>🌿</h2>
          </div>

          <nav className="nav-menu">
            <ul>
              <li><button>📊 Dashboard</button></li>
              <li><button>📦 Catálogo</button></li>
              <li><button onClick={() => navigate("/carrito")}>🛒 Carrito</button></li>
              <li><button onClick={() => navigate("/mis-productos")}>🧺 Mis Productos</button></li>
              {rolUsuario === "comprador" && (
                <li>
                  <button onClick={() => navigate("/solicitud-vendedor")}>
                    📩 Quiero Vender
                  </button>
                </li>
              )}
            </ul>
          </nav>

          <div className="usuario">
            <img src="https://www.w3schools.com/howto/img_avatar.png" alt="Avatar" className="avatar" />
            <div className="info-usuario">
              <p className="nombre">{nombreUsuario}</p>
              <div className="header-buttons">
                <button onClick={() => navigate("/Perfil")}>👤 Perfil</button>
              </div>
            </div>
          </div>
        </aside>

        {/* MAIN */}
        <main className="main">
          <section className="catalogo">
            <h2 className="titulo">Catálogo de Productos</h2>
            <p className="subtitulo">
              Descubre los mejores productos agrícolas directamente de nuestros agricultores
            </p>

            <div className="filtros">
              <input type="text" placeholder="Buscar productos..." className="buscador" />
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
              <span className="resultados">{productos.length} productos encontrados</span>
            </div>

            <div className="productos-grid">
              {productos.length === 0 ? (
                <p>No hay productos disponibles</p>
              ) : (
                productos.map((producto) => (
                  <div className="card" key={producto._id}>
                    <div className="card-etiqueta">{producto.certificacion || "No especificado"}</div>

                    <img
                      src={producto.imagen && producto.imagen.trim() !== "" ? producto.imagen : imagenPorDefecto}
                      alt={producto.nombre}
                      className="card-imagen"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = imagenPorDefecto;
                      }}
                    />


                    <h3 className="card-nombre">{producto.nombre}</h3>
                    <p className="card-ubicacion">{producto.ubicacion || "Ubicación no especificada"}</p>
                    <p className="card-precio">€{producto.precio} /kg</p>
                    <p className="card-stock">Stock: {producto.stock || "N/A"} kg</p>
                    <p className="card-productor">Por: {producto.productor || "Anónimo"}</p>

                    <div className="card-botones">
                      <button className="ver">Ver</button>
                      <button
                        onClick={() => {
                          const isAuthenticated = localStorage.getItem("isAuthenticated");
                          if (!isAuthenticated) {
                            navigate("/Login");
                            return;
                          }
                          agregarProducto(producto);
                          mostrarMensajeExito("✅ Producto agregado al carrito");
                        }}
                      >
                        Añadir al carrito
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Mercado Orgánico</p>
      </footer>
    </div>
  );
};

export default Inicio;
