import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";
import { useFavoritos } from "../context/FavoritosContext";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const { favoritos, toggleFavorito, cargando } = useFavoritos();
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

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

  const handleToggleFavorito = async (producto) => {
    const esAhoraFavorito = await toggleFavorito(producto);
    if (esAhoraFavorito === null) return;

    mostrarMensajeExito(
      esAhoraFavorito
        ? "❤️ Producto agregado a favoritos"
        : "💔 Producto removido de favoritos"
    );
  };

  return (
    <section className="catalogo">
      {mensajeExito && <div className="toast-exito">{mensajeExito}</div>}

      <h2 className="titulo">Catálogo de Productos</h2>
      <p className="subtitulo">
        Descubre los mejores productos agrícolas directamente de nuestros agricultores
      </p>

      {cargando && <p>Cargando favoritos...</p>}

      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productos.map((producto) => {
            const esFavorito = favoritos.some(
              (fav) => fav.productoId?._id === producto._id
            );

            return (
              <div className="card" key={producto._id}>
                <div className="card-etiqueta">{producto.certificacion || "No especificado"}</div>

                <img
                  src={producto.imagen?.trim() ? producto.imagen : imagenPorDefecto}
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

                <div className="card-botones" style={{ display: "flex", gap: "0.5rem" }}>
                  <button className="ver">Ver</button>

                  <button
                    onClick={() => {
                      if (!localStorage.getItem("usuario")) {
                        navigate("/Login");
                        return;
                      }
                      agregarProducto(producto);
                      mostrarMensajeExito("✅ Producto agregado al carrito");
                    }}
                  >
                    Añadir al carrito
                  </button>

                  <button
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.5rem",
                      cursor: "pointer",
                      color: esFavorito ? "red" : "gray",
                    }}
                    title={esFavorito ? "Quitar de favoritos" : "Agregar a favoritos"}
                    onClick={() => handleToggleFavorito(producto)}
                  >
                    {esFavorito ? "❤️" : "🤍"}
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};

export default Catalogo;
