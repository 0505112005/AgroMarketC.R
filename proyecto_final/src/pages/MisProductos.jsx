import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../estilos/MisProductos.css";

const MisProductos = () => {
  const [misProductos, setMisProductos] = useState([]);
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
    Swal.fire({
      title: 'Editar producto',
      html:
        `<input id="swal-nombre" class="swal2-input" placeholder="Nombre" value="${producto.nombre}">` +
        `<textarea id="swal-descripcion" class="swal2-textarea" placeholder="Descripción">${producto.descripcion}</textarea>` +
        `<input id="swal-precio" type="number" class="swal2-input" placeholder="Precio" value="${producto.precio}">` +
        `<input id="swal-stock" type="number" class="swal2-input" placeholder="Stock" value="${producto.stock || 0}">`,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "💾 Guardar",
      cancelButtonText: "Cancelar",
      preConfirm: () => {
        return {
          nombre: document.getElementById('swal-nombre').value,
          descripcion: document.getElementById('swal-descripcion').value,
          precio: Number(document.getElementById('swal-precio').value),
          stock: Number(document.getElementById('swal-stock').value),
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`http://localhost:5000/api/productos/${producto._id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify(result.value)
          });

          if (res.ok) {
            const actualizado = await res.json();
            setMisProductos(prev =>
              prev.map(p => (p._id === producto._id ? actualizado : p))
            );
            Swal.fire({
              icon: "success",
              title: "Producto actualizado",
              timer: 1500,
              showConfirmButton: false
            });
          } else {
            const err = await res.json();
            Swal.fire({ icon: "error", title: "Error", text: err.mensaje || "No se pudo actualizar el producto", confirmButtonColor: "#4CAF50" });
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
      }
    });
  };

  return (
    <div className="mis-productos-container">
      <div className="mis-productos-header">
        <h2 className="mis-productos-titulo">🌿 Mis Productos Publicados</h2>
        <button className="btn-publicar" onClick={() => navigate("/vender")}>
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
              <h3 className="producto-nombre">{producto.nombre}</h3>
              <p className="producto-descripcion">{producto.descripcion}</p>
              <p className="producto-precio">₡{producto.precio}</p>
              <p className="producto-stock">Stock: {producto.stock || 0} unidades</p>
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
          ))}
        </div>
      )}
    </div>
  );
};

export default MisProductos;
