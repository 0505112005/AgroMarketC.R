import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [mensajeExito, setMensajeExito] = useState("");
  const navigate = useNavigate();
  const { agregarProducto } = useCarrito();

  // Obtener usuario del localStorage
  const storedUser = localStorage.getItem("usuario");
  const user = storedUser ? JSON.parse(storedUser) : null;

  // Cargar productos al montar el componente
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

  // Cargar favoritos solo si hay usuario válido
  useEffect(() => {
    if (!user?.id) {
      setFavoritos([]); // Limpia favoritos si no hay usuario
      return;
    }

    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favoritos?userId=${user.id}`);
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.warn("Respuesta de favoritos no es un arreglo:", data);
          setFavoritos([]);
          return;
        }

        setFavoritos(data);
      } catch (error) {
        console.error("Error al obtener favoritos:", error);
      }
    };

    fetchFavoritos();
  }, [user]);

  const mostrarMensajeExito = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const toggleFavorito = async (producto) => {
    if (!user?.id) {
      navigate("/Login");
      return;
    }

    // Buscar si el producto ya está en favoritos
    const favoritoExistente = favoritos.find(
      (fav) => fav.productoId._id === producto._id
    );

    try {
      if (favoritoExistente) {
        // Quitar favorito
        await fetch(`http://localhost:5000/api/favoritos/${favoritoExistente._id}`, {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id }),
        });
        setFavoritos((prev) => prev.filter((fav) => fav._id !== favoritoExistente._id));
        mostrarMensajeExito("💔 Producto removido de favoritos");
      } else {
        // Agregar favorito
        const res = await fetch("http://localhost:5000/api/favoritos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.id, productoId: producto._id }),
        });
        const nuevoFavorito = await res.json();
        setFavoritos((prev) => [...prev, nuevoFavorito]);
        mostrarMensajeExito("❤️ Producto agregado a favoritos");
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  return (
    <section className="catalogo">
      {mensajeExito && <div className="toast-exito">{mensajeExito}</div>}

      <h2 className="titulo">Catálogo de Productos</h2>
      <p className="subtitulo">
        Descubre los mejores productos agrícolas directamente de nuestros agricultores
      </p>

      <div className="productos-grid">
        {productos.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productos.map((producto) => {
            const esFavorito = favoritos.some(
              (fav) => fav.productoId._id === producto._id
            );

            return (
              <div className="card" key={producto._id}>
                <div className="card-etiqueta">{producto.certificacion || "No especificado"}</div>

                <img
                  src={
                    producto.imagen && producto.imagen.trim() !== ""
                      ? producto.imagen
                      : imagenPorDefecto
                  }
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
                  <button
                    className="ver"
                    onClick={() => {
                      // Aquí puedes agregar lógica para ver detalles
                    }}
                  >
                    Ver
                  </button>

                  <button
                    onClick={() => {
                      if (!user) {
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
                    onClick={() => toggleFavorito(producto)}
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
