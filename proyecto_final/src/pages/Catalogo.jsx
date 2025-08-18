import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";
import Swal from "sweetalert2";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [topFavoritos, setTopFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({ nombre: "", categoria: "", precioMin: "", precioMax: "" });
  const [usuario, setUsuario] = useState(null);
  const [productoModal, setProductoModal] = useState(null);

  const navigate = useNavigate();
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
        setProductos(data || []);
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
        setTopFavoritos(data || []);
      } catch (err) {
        console.error("Error al cargar top favoritos:", err);
      }
    };
    fetchTopFavoritos();
  }, [usuario]);

  // SweetAlert2 para carrito
  const mostrarMensajeExito = (texto) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: texto,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  const handleAgregarCarrito = (producto) => {
    if (!usuario?.id) {
      navigate("/login");
      return;
    }
    if (!producto) return;
    agregarProducto(producto);
    mostrarMensajeExito("Producto agregado al carrito");
  };

  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    if (!p) return false;
    const nombreMatch = p.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase());
    const categoriaMatch = filtros.categoria ? p.certificacion === filtros.categoria : true;
    const precioMatch =
      (!filtros.precioMin || p.precio >= Number(filtros.precioMin)) &&
      (!filtros.precioMax || p.precio <= Number(filtros.precioMax));
    return nombreMatch && categoriaMatch && precioMatch;
  });

  // Renderizado
  const renderCard = (producto) => (
    <div className="card" key={producto._id}>
      <img
        src={producto.imagen?.trim() ? producto.imagen : imagenPorDefecto}
        alt={producto.nombre || "Producto"}
        className="card-imagen"
      />
      <h3 className="card-nombre">{producto.nombre}</h3>
      <p className="card-precio">€{producto.precio} /kg</p>
      <p className="card-certificacion">{producto.certificacion}</p>
      <div className="card-botones">
        <button className="btn-vermas" onClick={() => setProductoModal(producto)}>
          Ver más
        </button>
        <button className="btn-agregar" onClick={() => handleAgregarCarrito(producto)}>
          Añadir al carrito
        </button>
      </div>
    </div>
  );

  return (
    <section className="catalogo">

      {/* Top favoritos */}
      {topFavoritos.length > 0 && (
        <>
          <h2 className="titulo">Tus productos más agregados</h2>
          <div className="productos-grid">
            {topFavoritos.map((fav) => {
              if (!fav?.productoId) return null;
              return renderCard(fav.productoId);
            })}
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
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <option value="">Todas las categorías</option>
          <option value="Orgánico">Orgánico</option>
          <option value="No orgánico">No orgánico</option>
          <option value="En transición">En transición</option>
        </select>
      </div>

      <div className="productos-grid">
        {productosFiltrados.length === 0 ? (
          <p>No hay productos disponibles</p>
        ) : (
          productosFiltrados.map(renderCard)
        )}
      </div>

      {/* Modal animado */}
      {/* Modal de producto */}
      {productoModal && (
        <div className="modal-backdrop fade-in" onClick={() => setProductoModal(null)}>
          <div className="modal-contenido" onClick={(e) => e.stopPropagation()}>
            <img
              src={productoModal.imagen?.trim() ? productoModal.imagen : imagenPorDefecto}
              alt={productoModal.nombre || "Producto"}
              className="modal-imagen"
            />
            <h2>{productoModal.nombre}</h2>
            <p><strong>Descripción:</strong> {productoModal.descripcion || "Sin descripción"}</p>
            <p><strong>Precio:</strong> €{productoModal.precio} / {productoModal.unidadVenta}</p>
            <p><strong>Certificación:</strong> {productoModal.certificacion}</p>
            <p><strong>Productor:</strong> {productoModal.productor}</p>
            <p><strong>Origen:</strong> {productoModal.origen}</p>
            <p><strong>Temporada:</strong> {productoModal.temporada}</p>
            <p><strong>Cantidad por unidad:</strong> {productoModal.cantidadPorUnidad}</p>
            <p><strong>Stock disponible:</strong> {productoModal.stock}</p>
            <p><strong>Creado:</strong> {new Date(productoModal.createdAt).toLocaleDateString()}</p>
            <button className="btn-cerrar" onClick={() => setProductoModal(null)}>
              Cerrar
            </button>
          </div>
        </div>
      )}

    </section>
  );
};

export default Catalogo;
