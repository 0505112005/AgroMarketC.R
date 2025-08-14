import React, { useEffect, useState } from "react";
import { useCarrito } from "../components/CarritoContext";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", precioMin: "", precioMax: "" });
  const [mensajeExito, setMensajeExito] = useState("");
  const [favoritos, setFavoritos] = useState([]);
  const [usuario, setUsuario] = useState(null);

  const { agregarProducto } = useCarrito();

  // Cargar usuario desde localStorage
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

  // Cargar favoritos del usuario
  const cargarFavoritos = async () => {
    if (!usuario?.id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/favoritos-carrito/${usuario.id}`);
      const data = await res.json();
      setFavoritos(data);
    } catch (err) {
      console.error("Error cargando favoritos:", err);
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, [usuario]);

  const mostrarMensajeExito = (texto) => {
    setMensajeExito(texto);
    setTimeout(() => setMensajeExito(""), 3000);
  };

  const handleAgregarCarrito = async (producto) => {
    if (!usuario?.id) {
      alert("Debe iniciar sesión para agregar productos");
      return;
    }

    agregarProducto(producto);
    mostrarMensajeExito("✅ Producto agregado al carrito");

    try {
      const res = await fetch("http://localhost:5000/api/favoritos-carrito/agregar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ usuarioId: usuario.id, productoId: producto._id }),
      });

      if (res.ok) cargarFavoritos();
      else console.error(await res.json());
    } catch (err) {
      console.error(err);
    }
  };

  // Productos filtrados
  const productosFiltrados = productos.filter((p) => {
    const nombreMatch = p.nombre.toLowerCase().includes(filtros.nombre.toLowerCase());
    const categoriaMatch = filtros.categoria ? p.certificacion === filtros.categoria : true;
    const precioMatch =
      (!filtros.precioMin || p.precio >= Number(filtros.precioMin)) &&
      (!filtros.precioMax || p.precio <= Number(filtros.precioMax));
    return nombreMatch && categoriaMatch && precioMatch;
  });

  // Top 5 más vendidos según cantidadAgregados
  const topVendidos = [...favoritos]
    .sort((a, b) => b.cantidadAgregados - a.cantidadAgregados)
    .slice(0, 5);

  if (!usuario) return <p>Cargando catálogo...</p>;

  return (
    <section className="catalogo">
      {mensajeExito && <div className="toast-exito">{mensajeExito}</div>}

      {/* Top 5 productos más vendidos */}
      <h2 className="titulo">Productos más vendidos</h2>
      {topVendidos.length === 0 ? (
        <p>No hay productos vendidos aún</p>
      ) : (
        <div className="productos-grid favoritos-carrusel">
          {topVendidos.map((fav) => (
            <div className="card" key={fav._id}>
              <img
                src={fav.productoId.imagen?.trim() ? fav.productoId.imagen : imagenPorDefecto}
                alt={fav.productoId.nombre}
                className="card-imagen"
              />
              <h3 className="card-nombre">{fav.productoId.nombre}</h3>
              <p className="card-precio">€{fav.productoId.precio} /kg</p>
              <button onClick={() => handleAgregarCarrito(fav.productoId)}>Añadir al carrito</button>
            </div>
          ))}
        </div>
      )}

      {/* Filtros */}
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
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          <option value="Orgánico">Orgánico</option>
          <option value="Híbrido">Híbrido</option>
        </select>
      </div>

      {/* Catálogo completo */}
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
              <button onClick={() => handleAgregarCarrito(producto)}>Añadir al carrito</button>
            </div>
          ))
        )}
      </div>
    </section>
  );
};

export default Catalogo;
