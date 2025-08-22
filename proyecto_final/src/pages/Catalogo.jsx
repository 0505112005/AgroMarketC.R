import React, { useEffect, useState } from "react"; // Importa React y hooks para manejar estado y efectos
import { useNavigate } from "react-router-dom"; // Hook para navegación programática
import { useCarrito } from "../components/CarritoContext"; // Contexto del carrito de compras
import Swal from "sweetalert2"; // Librería para mostrar alertas bonitas
import "../estilos/catalogo.css"; // Estilos CSS para el catálogo

// URL de imagen por defecto si el producto no tiene imagen
const imagenPorDefecto = "https://via.placeholder.com/300x200?text=Sin+imagen";

// Tipos de productos para filtrado
const tipos = [
  { label: 'Todos', value: '' },
  { label: 'Frutas', value: 'Fruta' },
  { label: 'Verduras', value: 'Verdura' },
  { label: 'Granos', value: 'Grano' },
  { label: 'Hierbas', value: 'Hierba' },
];

const Catalogo = () => {
  // Estados principales del componente
  const [productos, setProductos] = useState([]); // Lista completa de productos
  const [topFavoritos, setTopFavoritos] = useState([]); // Lista de productos más agregados
  const [filtros, setFiltros] = useState({
    nombre: "",        // Filtro por nombre
    categoria: "",     // Filtro por certificación/categoría
    tipo: "",          // Filtro por tipo de producto
    ubicacion: "",     // Filtro por ubicación
    precioMin: "",     // Precio mínimo
    precioMax: 20000,  // Precio máximo
    soloOrganicos: false, // Filtro solo productos orgánicos
  });
  const [usuario, setUsuario] = useState(null); // Usuario logueado
  const [productoModal, setProductoModal] = useState(null); // Producto que se muestra en modal

  const navigate = useNavigate(); // Hook para redireccionar páginas
  const { agregarProducto } = useCarrito(); // Función para agregar producto al carrito desde el contexto

  // Cargar usuario desde localStorage al montar el componente
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser?.id) setUsuario(storedUser);
  }, []);

  // Obtener productos desde la API
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const data = await res.json();

        // Agregar rating aleatorio a cada producto
        const productosConRating = (data || []).map((p) => ({
          ...p,
          rating: (Math.random() * 2 + 3).toFixed(1), // Rating entre 3.0 y 5.0
        }));

        // Guardar productos en el estado
        setProductos(productosConRating);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    };
    fetchProductos();
  }, []);

  // Función para mostrar mensaje de éxito al agregar al carrito
  const mostrarMensajeExito = (texto) => {
    Swal.fire({
      icon: 'success',
      title: '¡Éxito!',
      text: texto,
      timer: 2000,
      showConfirmButton: false,
    });
  };

  // Función que maneja agregar producto al carrito y actualizar favoritos
  const handleAgregarCarrito = async (producto) => {
    if (!usuario?.id) { // Si no hay usuario, redirige a login
      navigate("/login");
      return;
    }
    if (!producto) return;

    // Agregar producto al carrito usando el contexto
    agregarProducto(producto);

    // Preparar datos para enviar al backend y actualizar favoritos
    const datosFavorito = {
      usuarioId: usuario.id,
      productoId: producto._id,
    };
    console.log("Enviando datos al backend:", datosFavorito);

    try {
      // Llamada a la API para agregar producto a favoritos
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

        // Refrescar lista de top favoritos del usuario
        const resTop = await fetch(`http://localhost:5000/api/favoritos-carrito/top/${usuario.id}`);
        const nuevosFavoritos = await resTop.json();
        setTopFavoritos(nuevosFavoritos || []);
      }

    } catch (err) {
      console.error("Error al actualizar favoritos:", err);
    }

    // Mostrar alerta de éxito
    mostrarMensajeExito("Producto agregado al carrito");
  };

  // Filtrar productos según los filtros seleccionados
  const productosFiltrados = productos.filter((p) => {
    if (!p) return false;
    const nombreMatch = p.nombre?.toLowerCase().includes(filtros.nombre.toLowerCase());
    const categoriaMatch = filtros.categoria ? p.certificacion === filtros.categoria : true;
    const tipoMatch = filtros.tipo ? p.variedad === filtros.tipo : true;
    const ubicacionMatch = filtros.ubicacion ? p.origen?.toLowerCase().includes(filtros.ubicacion.toLowerCase()) : true;
    const precioMatch = p.precio <= filtros.precioMax && p.precio >= (filtros.precioMin || 0);
    const organicoMatch = filtros.soloOrganicos ? p.certificacion === "Orgánico" : true;

    return nombreMatch && categoriaMatch && tipoMatch && ubicacionMatch && precioMatch && organicoMatch;
  });

  // Función de búsqueda (solo imprime filtros aplicados)
  const handleBuscar = () => {
    console.log("Filtros aplicados:", filtros);
  };

  // Renderiza cada tarjeta de producto
  const renderCard = (producto) => {
    // Función para convertir certificación a clase CSS
    const getCertificacionClass = (cert) => {
      if (!cert) return '';
      return cert.toLowerCase().replace(/\s+/g, '-');
    };

    // Rating simulado
    const rating = (Math.random() * 2 + 3).toFixed(1); 

    return (
      <div className="card" key={producto._id}>
        {/* Imagen del producto */}
        <img
          src={producto.imagen?.trim() ? producto.imagen : imagenPorDefecto}
          alt={producto.nombre || "Producto"}
          className="card-img"
        />

        {/* Tags de certificación y stock */}
        <div className="card-tags">
          <span className={`tag ${getCertificacionClass(producto.certificacion)}`}>
            {producto.certificacion}
          </span>
          <span className="stock">Stock: {producto.stock}</span>
        </div>

        {/* Nombre y descripción */}
        <h3 className="card-title">{producto.nombre}</h3>
        <p className="card-description">
          {producto.descripcion?.length > 60
            ? `${producto.descripcion.substring(0, 60)}...`
            : producto.descripcion || "Sin descripción"}
        </p>

        {/* Ubicación del producto */}
        <div className="card-location">
          📍 {producto.origen || "Origen no especificado"}
        </div>

        {/* Pie de la tarjeta: precio, rating, productor y botones */}
        <div className="card-footer">
          <div className="price-rating">
            <span className="price">₡{producto.precio} <small>por {producto.unidadVenta}</small></span>
            <span className="rating">⭐ {producto.rating} {producto.variedad} </span>
          </div>
          <div className="seller">
            <span>👨‍🌾 {producto.productor || "Productor"}</span>
            <span className="delivery"> Entrega 24h</span>
          </div>
          <div className="card-buttons">
            {/* Abrir modal con información completa */}
            <button
              className="btn-ver-mas"
              onClick={() => setProductoModal(producto)}
            >
              Ver más
            </button>
            {/* Agregar al carrito */}
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
        {/* Título del catálogo */}
        <h2 className="titulo">🌿 Catálogo completo</h2>
        {/* Buscador por nombre */}
        <input
          type="text"
          placeholder="🔍 Buscar productos por nombre..."
          value={filtros.nombre}
          onChange={(e) => setFiltros({ ...filtros, nombre: e.target.value })}
          className="search-input"
        />

        {/* Mostrar productos filtrados */}
        <div className="productos-grid">
          {productosFiltrados.length === 0 ? (
            <p>No hay productos disponibles</p>
          ) : (
            productosFiltrados.map(renderCard)
          )}
        </div>
      </div>

      {/* Filtros flotantes */}
      <div className="catalogo-container">
        <h2>Busqueda de Productos</h2>
        <p>Descubre productos frescos y de calidad premium.</p>

        {/* Filtro por certificación */}
        <select
          value={filtros.categoria}
          onChange={(e) => setFiltros({ ...filtros, categoria: e.target.value })}
        >
          <option value="">Todas las Categorías</option>
          <option value="Orgánico">Orgánico</option>
          <option value="No orgánico">No orgánico</option>
        </select>

        {/* Filtro por tipo */}
        <div className="filtro-tipo">
          <ul className="tipo-lista">
            {tipos.map((tipo) => (
              <li
                key={tipo.value}
                className={filtros.tipo === tipo.value ? 'activo' : ''}
                onClick={() => setFiltros({ ...filtros, tipo: tipo.value })}
              >
                {tipo.label}
              </li>
            ))}
          </ul>
        </div>

        {/* Filtro por rango de precio */}
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

        {/* Filtro por ubicación */}
        <label className="checkbox-container">
          <input
            type="text"
            placeholder=" Filtrar por ubicación "
            value={filtros.ubicacion}
            onChange={(e) => setFiltros({ ...filtros, ubicacion: e.target.value })}
            className="ubicacion-input"
          />
        </label>
      </div>

      {/* Modal de producto */}
      {productoModal && (
        <div className="modal-backdrop fade-in" onClick={() => setProductoModal(null)}>
          <div className="modal-profesional" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductoModal(null)}>
              ✕
            </button>

            {/* Header del modal */}
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
                  <span className="modal-rating">⭐ {productoModal.rating}</span>
                </div>
                <div className="modal-tags">
                  <span className={`modal-tag ${productoModal.certificacion?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {productoModal.certificacion}
                  </span>
                  <span className="modal-stock">Stock: {productoModal.stock}</span>
                </div>
              </div>
            </div>

            {/* Body del modal */}
            <div className="modal-body">
              <div className="modal-section">
                <h3> Descripción</h3>
                <p>{productoModal.descripcion || "Sin descripción disponible"}</p>
              </div>

              <div className="modal-grid">
                <div className="modal-section">
                  <h3> Productor</h3>
                  <p>{productoModal.productor || "No especificado"}</p>
                </div>

                <div className="modal-section">
                  <h3> Origen</h3>
                  <p>{productoModal.origen || "No especificado"}</p>
                </div>

                <div className="modal-section">
                  <h3> Temporada</h3>
                  <p>{productoModal.temporada || "No especificada"}</p>
                </div>

                <div className="modal-section">
                  <h3> Variedad</h3>
                  <p>{productoModal.variedad || "No especificada"}</p>
                </div>

                <div className="modal-section">
                  <h3> Unidad de Venta</h3>
                  <p>{productoModal.unidadVenta || "No especificada"}</p>
                </div>
              </div>

              <div className="modal-section">
                <h3> Información adicional</h3>
                <p><strong>Fecha de creación:</strong> {new Date(productoModal.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Footer del modal con botón de agregar al carrito */}
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

export default Catalogo; // Exporta el componente
