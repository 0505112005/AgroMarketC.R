import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../estilos/MisProductos.css";

const MisProductos = () => {
  const [misProductos, setMisProductos] = useState([]);
  const [editandoId, setEditandoId] = useState(null);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();

  const usuario = JSON.parse(localStorage.getItem("usuario"));

  useEffect(() => {
    // 🔐 Protege la ruta para que solo el vendedor logeado pueda entrar
    if (!usuario || usuario.rol !== "vendedor") {
      alert("Acceso denegado. Solo los vendedores pueden ver esta página.");
      navigate("/inicio");
      return;
    }

    // Función para obtener productos del usuario vendedor
    const fetchMisProductos = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/productos");
        const productos = await res.json();
        const filtrados = productos.filter(
          (prod) => prod.usuarioId === usuario._id
        );
        setMisProductos(filtrados);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchMisProductos();
  }, [usuario, navigate]);

  const handleEliminar = async (id) => {
    if (window.confirm("¿Estás seguro de eliminar este producto?")) {
      try {
        const res = await fetch(`http://localhost:5000/api/productos/${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setMisProductos(misProductos.filter((p) => p._id !== id));
        }
      } catch (error) {
        console.error("Error al eliminar:", error);
      }
    }
  };

  const handleEditar = (producto) => {
    setEditandoId(producto._id);
    setFormData({ ...producto });
  };

  const handleGuardar = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/productos/${editandoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const actualizado = await res.json();
        setMisProductos((prev) =>
          prev.map((p) => (p._id === editandoId ? actualizado : p))
        );
        setEditandoId(null);
      }
    } catch (error) {
      console.error("Error al actualizar:", error);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="mis-productos-container">
      <div className="mis-productos-header">
        <h2 className="mis-productos-titulo">🧺 Mis Productos Publicados</h2>
        <button className="btn-publicar" onClick={() => navigate('/vender')}>
            Nuevo Producto
        </button>
      </div>
      <button className="volver-inicio" onClick={() => navigate('/inicio')}>
        Volver a Inicio
      </button>
      
      {misProductos.length === 0 ? (
        <div className="mis-productos-vacio">
          No has publicado productos aún.
        </div>
      ) : (
        <div className="productos-lista">
          {misProductos.map((producto) => (
            <div key={producto._id} className="producto-item">
              {editandoId === producto._id ? (
                <form className="formulario-edicion" onSubmit={(e) => e.preventDefault()}>
                  <div className="campo-edicion">
                    <label>Nombre</label>
                    <input
                      type="text"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Nombre del producto"
                    />
                  </div>
                  
                  <div className="campo-edicion">
                    <label>Descripción</label>
                    <textarea
                      name="descripcion"
                      value={formData.descripcion}
                      onChange={handleChange}
                      placeholder="Descripción del producto"
                      rows="3"
                    />
                  </div>
                  
                  <div className="campo-edicion">
                    <label>Precio</label>
                    <input
                      type="number"
                      name="precio"
                      value={formData.precio}
                      onChange={handleChange}
                      placeholder="Precio"
                      min="0"
                    />
                  </div>
                  
                  <div className="campo-edicion">
                    <label>Stock</label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="Stock disponible"
                      min="0"
                    />
                  </div>
                  
                  <div className="botones-edicion">
                    <button className="btn-guardar" onClick={handleGuardar}>
                      💾 Guardar
                    </button>
                    <button className="btn-cancelar" onClick={() => setEditandoId(null)}>
                      Cancelar
                    </button>
                  </div>
                </form>
              ) : (
                <>
                  <img
                    src={producto.imagen || 'placeholder-image.jpg'}
                    alt={producto.nombre}
                    className="producto-imagen"
                  />
                  <h3 className="producto-nombre">{producto.nombre}</h3>
                  <p className="producto-descripcion">{producto.descripcion}</p>
                  <p className="producto-precio">₡{producto.precio}</p>
                  <p className="producto-stock">Stock: {producto.stock} unidades</p>
                  
                  <div className="producto-acciones">
                    <button className="btn-editar" onClick={() => handleEditar(producto)}>
                      ✏️ Editar
                    </button>
                    <button className="btn-eliminar" onClick={() => handleEliminar(producto._id)}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MisProductos;
