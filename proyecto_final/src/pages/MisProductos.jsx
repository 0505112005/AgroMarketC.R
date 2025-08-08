import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
      <h2>🧺 Mis Productos Publicados</h2>
      {misProductos.length === 0 ? (
        <p>No has publicado productos aún.</p>
      ) : (
        <ul>
          {misProductos.map((producto) => (
            <li key={producto._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              {editandoId === producto._id ? (
                <>
                  <input
                    type="text"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    placeholder="Nombre"
                  />
                  <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    placeholder="Descripción"
                  />
                  <input
                    type="number"
                    name="precio"
                    value={formData.precio}
                    onChange={handleChange}
                    placeholder="Precio"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Stock"
                  />
                  <button onClick={handleGuardar}>💾 Guardar</button>
                  <button onClick={() => setEditandoId(null)}>❌ Cancelar</button>
                </>
              ) : (
                <>
                  <h3>{producto.nombre}</h3>
                  <p>{producto.descripcion}</p>
                  <p>₡{producto.precio}</p>
                  <p>Stock: {producto.stock}</p>
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    style={{ width: "150px" }}
                  />
                  <br />
                  <button onClick={() => handleEditar(producto)}>✏️ Editar</button>
                  <button onClick={() => handleEliminar(producto._id)}>🗑️ Eliminar</button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MisProductos;
