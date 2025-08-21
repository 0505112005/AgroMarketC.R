import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";
import Swal from "sweetalert2";
import "../estilos/catalogo.css";

const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

const Catalogo = () => {
  const [productos, setProductos] = useState([]);
  const [topFavoritos, setTopFavoritos] = useState([]);
  const [filtros, setFiltros] = useState({
    nombre: "",
    categoria: "",
    precioMin: "",
    precioMax: 20000,
    soloOrganicos: false
  });
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

  const handleAgregarCarrito = async (producto) => {
    if (!usuario?.id) {
      navigate("/login");
      return;
    }
    if (!producto) return;

    // Agregar al carrito
    agregarProducto(producto);

    // Datos que vamos a enviar al backend
    const datosFavorito = {
      usuarioId: usuario.id,
      productoId: producto._id,
    };
    console.log("Enviando datos al backend:", datosFavorito);

    // Actualizar contador de favoritos en la API
    try {
      const response = await fetch("http://localhost:5000/api/favoritos-carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(datosFavorito),
      });

      const resultado = await response.json();

      if (!response.ok) {
        console.error("Error agregando favorito:", resultado);
      } else {
        console.log("Favorito agregado con éxito:", resultado);

        // 👇 Recargar los favoritos del usuario para que se actualicen en la vista
        const resTop = await fetch(`http://localhost:5000/api/favoritos-carrito/top/${usuario.id}`);
        const nuevosFavoritos = await resTop.json();
        setTopFavoritos(nuevosFavoritos || []);
      }

    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
    }

    mostrarMensajeExito("Producto agregado al carrito");
  };


  // Filtrar productos
  const productosFiltrados = productos.filter((p) => {
    if (!p) return false;
    const nombreMatch = p.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase());
    const categoriaMatch = filtros.categoria ? p.certificacion === filtros.categoria : true;
    const precioMatch = p.precio <= filtros.precioMax && p.precio >= (filtros.precioMin || 0);
    const organicoMatch = filtros.soloOrganicos ? p.certificacion === "Orgánico" : true;

    return nombreMatch && categoriaMatch && precioMatch && organicoMatch;
  });

  const handleBuscar = () => {
    // La búsqueda se actualiza automáticamente por el filtrado reactivo
    console.log("Filtros aplicados:", filtros);
  };

  // Renderizado
  const renderCard = (producto) => {
    // Función para convertir certificación a clase CSS
    const getCertificacionClass = (cert) => {
      if (!cert) return '';
      return cert.toLowerCase().replace(/\s+/g, '-');
    };

    // Simular rating (puedes agregar esto a tu modelo de producto más adelante)
    const rating = (Math.random() * 2 + 3).toFixed(1); // Rating entre 3.0 y 5.0

    return (
      <div className="card" key={producto._id}>
        <img
          src={producto.imagen?.trim() ? producto.imagen : imagenPorDefecto}
          alt={producto.nombre || "Producto"}
          className="card-img"
        />
        <div className="card-tags">
          <span className={`tag ${getCertificacionClass(producto.certificacion)}`}>
            {producto.certificacion}
          </span>
          <span className="stock">Stock: {producto.stock}</span>
        </div>
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-description">
          {producto.descripcion?.length > 60
            ? `${producto.descripcion.substring(0, 60)}...`
            : producto.descripcion || "Sin descripción"}
        </p>
        <div className="card-location">
          📍 {producto.origen || "Origen no especificado"} 
        </div>
        <div className="card-footer">
          <div className="price-rating">
            <span className="price">₡{producto.precio} <small>por {producto.unidadVenta}</small></span>
            
            <span className="rating">⭐ {rating} {producto.variedad} </span>
          </div>
          <div className="seller">
            <span>{producto.productor || "Productor"}</span>
            <span className="delivery"> Entrega 24h</span>
          </div>
          <div className="card-buttons">
            <button
              className="btn-ver-mas"
              onClick={() => setProductoModal(producto)}
            >
              Ver más
            </button>
            <button
              className="add-btn"
              onClick={() => handleAgregarCarrito(producto)}
            >
              Agregar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="catalogo">
      <div className="catalogo-content">
        {/* Top favoritos */}
       

        {/* Catálogo completo */}
        <h2 className="titulo">🌿 Catálogo completo</h2>

        <div className="productos-grid">
          {productosFiltrados.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            productosFiltrados.map(renderCard)
          )}
        </div>
      </div>

      {/* Buscador flotante */}
      <div className="catalogo-container">
        <h2>Busqueda de Productos</h2>
        <p>Descubre productos frescos y de calidad premium.</p>

        <input
          type="text"
          placeholder="🔍 Buscar productos por nombre..."
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          className="search-input"
        />

        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <option value="">Todas las Categorías</option>
          <option value="Orgánico">Orgánico</option>
          <option value="No orgánico">No orgánico</option>
        </select>

        <div className="range-container">
          <label htmlFor="precioRange">Precio máximo:</label>
          <input
            id="precioRange"
            type="range"
            min="0"
            max="20000"
            value={filtros.precioMax}
            onChange={(e) => setFiltros({ ...filtros, precioMax: Number(e.target.value) })}
            className="range-slider"
          />
          <span className="price-display">₡{filtros.precioMax}</span>
        </div>

        <label className="checkbox-container">
          <input
            type="checkbox"
            checked={filtros.soloOrganicos}
            onChange={(e) => setFiltros({ ...filtros, soloOrganicos: e.target.checked })}
          />
          Solo productos orgánicos
        </label>

        <button onClick={handleBuscar}>Buscar</button>
      </div>

      {/* Modal animado */}
      {/* Modal de producto profesional */}
      {productoModal && (
        <div className="modal-backdrop fade-in" onClick={() => setProductoModal(null)}>
          <div className="modal-profesional" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductoModal(null)}>
              ✕
            </button>

            <div className="modal-header">
              <img
                src={productoModal.imagen?.trim() ? productoModal.imagen : imagenPorDefecto}
                alt={productoModal.nombre || "Producto"}
                className="modal-imagen-pro"
              />
              <div className="modal-info-header">
                <h2 className="modal-titulo">{productoModal.nombre}</h2>
                <div className="modal-precio-rating">
                  <span className="modal-precio">₡{productoModal.precio}</span>
                  <span className="modal-unidad">por {productoModal.unidadVenta}</span>
                  <span className="modal-rating">⭐ {(Math.random() * 2 + 3).toFixed(1)}</span>
                </div>
                <div className="modal-tags">
                  <span className={`modal-tag ${productoModal.certificacion?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {productoModal.certificacion}
                  </span>
                  <span className="modal-stock">Stock: {productoModal.stock}</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>📝 Descripción</h3>
                <p>{productoModal.descripcion || "Sin descripción disponible"}</p>
              </div>

              <div className="modal-grid">
                <div className="modal-section">
                  <h3>👨‍🌾 Productor</h3>
                  <p>{productoModal.productor}</p>
                </div>

                <div className="modal-section">
                  <h3>📍 Origen</h3>
                  <p>{productoModal.origen}</p>
                </div>

                <div className="modal-section">
                  <h3>🗓️ Temporada</h3>
                  <p>{productoModal.temporada}</p>
                </div>

                <div className="modal-section">
                  <h3>📦 Cantidad por unidad</h3>
                  <p>{productoModal.cantidadPorUnidad}</p>
                </div>
              </div>

              <div className="modal-section">
                <h3>📅 Información adicional</h3>
                <p><strong>Fecha de creación:</strong> {new Date(productoModal.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="modal-btn-agregar"
                onClick={() => {
                  handleAgregarCarrito(productoModal);
                  setProductoModal(null);
                }}
              >
                🛒 Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}

    </section>
  );
};

export default Catalogo;
