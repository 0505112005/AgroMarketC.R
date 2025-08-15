import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [topFavoritos, setTopFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", precioMin: "", precioMax: "" });
  const [mensajeExito, setMensajeExito] = useState("");
  const [usuario, setUsuario] = useState(null);

  const navigate = useNavigate();
  const { carrito, agregarProducto } = useCarrito();

  // Cargar usuario
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser?.id) setUsuario(storedUser);
  }, []);

  // Obtener productos
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();
        setProductos(data);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    fetchProductos();
  }, []);

  // Obtener top favoritos del usuario
  useEffect(() => {
    if (!usuario?.id) return;
    const fetchTopFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favoritos-carrito/${usuario.id}`);
        const data = await res.json();
        setTopFavoritos(data);
      } catch (err) {
        console.error("Error al cargar top favoritos:", err);
      }
    };
    fetchTopFavoritos();
  }, [usuario]);

  const mostrarMensajeExito = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const handleAgregarCarrito = (producto) => {
    if (!usuario?.id) {
      navigate("/login");
      return;
    }
    agregarProducto(producto);
    mostrarMensajeExito("✅ Producto agregado al carrito");
  };

  const productosFiltrados = productos.filter((p) => {
    const nombreMatch = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const categoriaMatch = filtros.categoria ? p.certificacion === filtros.categoria : true;
    const precioMatch =
      (!filtros.precioMin || p.precio >= Number(filtros.precioMin)) &&
      (!filtros.precioMax || p.precio <= Number(filtros.precioMax));
    return nombreMatch && categoriaMatch && precioMatch;
  });

  return (
    <section className="catalogo">
      {mensajeExito && <div className="toast-exito">{mensajeExito}</div>}

      {/* Top favoritos */}
      {topFavoritos.length > 0 && (
        <>
          <h2 className="titulo">Tus productos más agregados</h2>
          <div className="productos-grid">
            {topFavoritos.map((fav) => (
              <div className="card" key={fav.productoId._id}>
                <img
                  src={fav.productoId.imagen?.trim() ? fav.productoId.imagen : imagenPorDefecto}
                  alt={fav.productoId.nombre}
                  className="card-imagen"
                />
                <h3 className="card-nombre">{fav.productoId.nombre}</h3>
                <p className="card-precio">€{fav.productoId.precio} /kg</p>
                <p className="card-detalle">Agregado {fav.cantidadAgregados} veces</p>
                <button className="btn-agregar" onClick={() => handleAgregarCarrito(fav.productoId)}>
                  Añadir al carrito
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Catálogo completo */}
      <h2 className="titulo">Catálogo completo</h2>
      <div className="filtros">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio mínimo"
          value={filtros.precioMin}
          onChange={(e) => setFiltros({ ...filtros, precioMin: e.target.value })}
        />
        <input
          type="number"
          placeholder="Precio máximo"
          value={filtros.precioMax}
          onChange={(e) => setFiltros({ ...filtros, precioMax: e.target.value })}
        />
        <select value={filtros.categoria} onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}>
          <option value="">Todas las categorías</option>
          <option value="Orgánico">Orgánico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      <div className="productos-grid">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productosFiltrados.map((producto) => (
            <div className="card" key={producto._id}>
              <img
                src={producto.imagen?.trim() ? producto.imagen : imagenPorDefecto}
                alt={producto.nombre}
                className="card-imagen"
              />
              <h3 className="card-nombre">{producto.nombre}</h3>
              <p className="card-precio">€{producto.precio} /kg</p>
              <p className="card-detalle">{producto.descripcion || "Sin descripción"}</p>
              <button className="btn-agregar" onClick={() => handleAgregarCarrito(producto)}>
                Añadir al carrito
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Catalogo;
