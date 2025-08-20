import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../estilos/MisProductos.css";

const MisProductos = () => {
  const [misProductos, setMisProductos] = useState([]);
  const [productoEditando, setProductoEditando] = useState(null);
  const [datosEdicion, setDatosEdicion] = useState({
    nombre: '',
    descripcion: '',
    precio: 0,
    stock: 0,
    imagen: '',
    certificacion: '',
    origen: '',
    temporada: '',
    cantidadPorUnidad: '',
    unidadVenta: 'kg'
  });
  const navigate = useNavigate();
  const usuario = JSON.parse(localStorage.getItem("usuario"));
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!usuario || usuario.rol !== "vendedor") {
      Swal.fire({
        icon: "error",
        title: "Acceso denegado",
        text: "Solo los vendedores pueden ver esta página.",
        confirmButtonColor: "#4CAF50"
      });
      navigate("/inicio");
      return;
    }

    const fetchMisProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos", {
          headers: { Authorization: `Bearer ${token}` }
        });
        const productos = await res.json();
        const filtrados = productos.filter(
          (prod) => prod.usuarioId === usuario.id
        );
        setMisProductos(filtrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchMisProductos();
  }, [usuario, navigate, token]);

  const handleEliminar = async (id) => {
    const confirm = await Swal.fire({
      title: "¿Eliminar producto?",
      text: "Esta acción no se puede deshacer",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#4CAF50",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    });

    if (confirm.isConfirmed) {
      try {
        const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          setMisProductos(misProductos.filter((p) => p._id !== id));
          Swal.fire({
            icon: "success",
            title: "Producto eliminado",
            timer: 1500,
            showConfirmButton: false
          });
        } else {
          const err = await res.json();
          Swal.fire({ icon: "error", title: "Error", text: err.mensaje || "No se pudo eliminar el producto", confirmButtonColor: "#4CAF50" });
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
        Swal.fire({
          icon: "error",
          title: "Error al eliminar",
          text: "Intenta nuevamente",
          confirmButtonColor: "#4CAF50"
        });
      }
    }
  };

  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setDatosEdicion({
      nombre: producto.nombre || '',
      descripcion: producto.descripcion || '',
      precio: producto.precio || 0,
      stock: producto.stock || 0,
      imagen: producto.imagen || '',
      certificacion: producto.certificacion || '',
      origen: producto.origen || '',
      temporada: producto.temporada || '',
      cantidadPorUnidad: producto.cantidadPorUnidad || '',
      unidadVenta: producto.unidadVenta || 'kg'
    });
  };

  const handleGuardarEdicion = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${productoEditando._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(datosEdicion)
      });

      if (res.ok) {
        const actualizado = await res.json();
        setMisProductos(prev =>
          prev.map(p => (p._id === productoEditando._id ? actualizado : p))
        );
        setProductoEditando(null);
        Swal.fire({
          icon: "success",
          title: "Producto actualizado",
          timer: 1500,
          showConfirmButton: false
        });
      } else {
        const err = await res.json();
        Swal.fire({ 
          icon: "error", 
          title: "Error", 
          text: err.mensaje || "No se pudo actualizar el producto", 
          confirmButtonColor: "#4CAF50" 
        });
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
      Swal.fire({
        icon: "error",
        title: "Error al actualizar",
        text: "Intenta nuevamente",
        confirmButtonColor: "#4CAF50"
      });
    }
  };

  return (
    <div className="mis-productos-container">
      <div className="mis-productos-header">
        <h2 className="mis-productos-titulo">🌿 Mis Productos Publicados</h2>
        <button className="btn-newproduct" onClick={() => navigate("/vender")}>
           Nuevo Producto
        </button>
      </div>

      {misProductos.length === 0 ? (
        <div className="mis-productos-vacio">
          No has publicado productos aún.
        </div>
      ) : (
        
        <div className="productos-lista">
          {misProductos.map((producto) => (
            <div key={producto._id} className="producto-item">
              <img
                src={producto.imagen || "placeholder-image.jpg"}
                alt={producto.nombre}
                className="producto-imagen"
              />
              
              <div className="card-tags">
                {producto.certificacion && (
                  <span className={`tag ${producto.certificacion?.toLowerCase().replace(/\s+/g, '-')}`}>
                    {producto.certificacion}
                  </span>
                )}
                <span className="stock">Stock: {producto.stock || 0}</span>
              </div>
              
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <p className="producto-descripcion">
                {producto.descripcion?.length > 60
                  ? `${producto.descripcion.substring(0, 60)}...`
                  : producto.descripcion || "Sin descripción"}
              </p>
              
              {producto.origen && (
                <div className="card-location">
                  📍 {producto.origen}
                </div>
              )}
              
              <div className="card-footer">
                <div className="price-rating">
                  <span className="price">₡{producto.precio} <small>por {producto.unidadVenta || 'kg'}</small></span>
                  {producto.temporada && (
                    <span className="temporada">🗓️ {producto.temporada}</span>
                  )}
                </div>
                
                {producto.cantidadPorUnidad && (
                  <div className="cantidad-unidad">
                    📦 {producto.cantidadPorUnidad}
                  </div>
                )}
                
                <div className="producto-acciones">
                  <button
                    className="btn-editar"
                    onClick={() => handleEditar(producto)}
                  >
                    ✏️ Editar
                  </button>
                  <button
                    className="btn-eliminar"
                    onClick={() => handleEliminar(producto._id)}
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de edición profesional */}
      {productoEditando && (
        <div className="modal-backdrop fade-in" onClick={() => setProductoEditando(null)}>
          <div className="modal-profesional" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn" onClick={() => setProductoEditando(null)}>
              ✕
            </button>

            <div className="modal-header">
              <img
                src={datosEdicion.imagen || "https://via.placeholder.com/200x200?text=Producto"}
                alt={datosEdicion.nombre}
                className="modal-imagen-pro"
              />
              <div className="modal-info-header">
                <input
                  type="text"
                  value={datosEdicion.nombre}
                  onChange={(e) => setDatosEdicion({...datosEdicion, nombre: e.target.value})}
                  className="modal-titulo-input"
                  placeholder="Nombre del producto"
                />
                <div className="modal-precio-rating">
                  <div className="precio-input-container">
                    <span>₡</span>
                    <input
                      type="number"
                      value={datosEdicion.precio}
                      onChange={(e) => setDatosEdicion({...datosEdicion, precio: Number(e.target.value)})}
                      className="modal-precio-input"
                      placeholder="Precio"
                    />
                  </div>
                  <select
                    value={datosEdicion.unidadVenta}
                    onChange={(e) => setDatosEdicion({...datosEdicion, unidadVenta: e.target.value})}
                    className="modal-unidad-select"
                  >
                    <option value="kg">por kg</option>
                    <option value="unidad">por unidad</option>
                    <option value="libra">por libra</option>
                  </select>
                </div>
                <div className="modal-tags">
                  <select
                    value={datosEdicion.certificacion}
                    onChange={(e) => setDatosEdicion({...datosEdicion, certificacion: e.target.value})}
                    className="modal-certificacion-select"
                  >
                    <option value="">Certificación</option>
                    <option value="Orgánico">Orgánico</option>
                    <option value="No orgánico">No orgánico</option>
                    <option value="En transición">En transición</option>
                  </select>
                  <div className="stock-input-container">
                    <span>Stock:</span>
                    <input
                      type="number"
                      value={datosEdicion.stock}
                      onChange={(e) => setDatosEdicion({...datosEdicion, stock: Number(e.target.value)})}
                      className="modal-stock-input"
                      placeholder="0"
                    />
                    <span>unidades</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>📝 Descripción</h3>
                <textarea
                  value={datosEdicion.descripcion}
                  onChange={(e) => setDatosEdicion({...datosEdicion, descripcion: e.target.value})}
                  className="modal-descripcion-textarea"
                  placeholder="Descripción del producto"
                  rows="4"
                />
              </div>

              <div className="modal-grid">
                <div className="modal-section">
                  <h3>🖼️ Imagen URL</h3>
                  <input
                    type="url"
                    value={datosEdicion.imagen}
                    onChange={(e) => setDatosEdicion({...datosEdicion, imagen: e.target.value})}
                    className="modal-input"
                    placeholder="URL de la imagen"
                  />
                </div>

                <div className="modal-section">
                  <h3>📍 Origen</h3>
                  <input
                    type="text"
                    value={datosEdicion.origen}
                    onChange={(e) => setDatosEdicion({...datosEdicion, origen: e.target.value})}
                    className="modal-input"
                    placeholder="Lugar de origen"
                  />
                </div>

                <div className="modal-section">
                  <h3>🗓️ Temporada</h3>
                  <input
                    type="text"
                    value={datosEdicion.temporada}
                    onChange={(e) => setDatosEdicion({...datosEdicion, temporada: e.target.value})}
                    className="modal-input"
                    placeholder="Temporada del producto"
                  />
                </div>

                <div className="modal-section">
                  <h3>📦 Cantidad por unidad</h3>
                  <input
                    type="text"
                    value={datosEdicion.cantidadPorUnidad}
                    onChange={(e) => setDatosEdicion({...datosEdicion, cantidadPorUnidad: e.target.value})}
                    className="modal-input"
                    placeholder="Ej: 500g, 1kg, 12 unidades"
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <div className="modal-footer-buttons">
                <button
                  className="modal-btn-cancelar"
                  onClick={() => setProductoEditando(null)}
                >
                  Cancelar
                </button>
                <button
                  className="modal-btn-guardar"
                  onClick={handleGuardarEdicion}
                >
                  💾 Guardar cambios
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MisProductos;
