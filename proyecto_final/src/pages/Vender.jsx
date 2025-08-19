// src/pages/Vender.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import "../estilos/Vender.css";

function Vender() {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        certificacion: 'No orgánico', // valor por defecto válido
        origen: '',
        temporada: '',
        stock: 1,
    });

    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const token = localStorage.getItem("token");
        if (!token) {
            Swal.fire({
                icon: "error",
                title: "Error de autenticación",
                text: "No se encontró el token. Inicia sesión nuevamente.",
                confirmButtonColor: "#4CAF50"
            });
            return;
        }

        const nuevoProducto = {
            ...producto,
            imagen: producto.imagen.trim() || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            usuarioId: usuario.id,
            productor: usuario.nombre,
            precio: Number(producto.precio),
            stock: Number(producto.stock),
        };

        try {
            const res = await fetch("http://localhost:5000/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || "Error al guardar el producto");
            }

            Swal.fire({
                icon: "success",
                title: "¡Producto publicado!",
                text: "Tu producto ha sido agregado correctamente.",
                confirmButtonColor: "#4CAF50",
                timer: 2000,
                timerProgressBar: true
            });

            setProducto({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                certificacion: 'No orgánico',
                origen: '',
                temporada: '',
                stock: 1,
            });

            navigate("/mis-productos");

        } catch (err) {
            console.error("❌ Error al enviar producto:", err);
            Swal.fire({
                icon: "error",
                title: "Error al guardar",
                text: err.message || "Intenta nuevamente.",
                confirmButtonColor: "#4CAF50"
            });
        }
    };

    return (
        <div className="vender-container">
            <section className="formulario-agregar">
                <h2>🌿 Agregar Nuevo Producto</h2>
                <form className="formulario" onSubmit={handleSubmit}>
                    <div className="campo">
                        <label>Nombre del producto</label>
                        <input
                            type="text"
                            name="nombre"
                            placeholder="Ej. Tomates Orgánicos"
                            value={producto.nombre}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Descripción</label>
                        <textarea
                            name="descripcion"
                            placeholder="Describe el producto..."
                            rows="3"
                            value={producto.descripcion}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Precio por unidad</label>
                        <input
                            type="number"
                            name="precio"
                            placeholder="₡0.00"
                            value={producto.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Stock disponible</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder="Cantidad disponible"
                            value={producto.stock}
                            onChange={handleChange}
                            min={1}
                            required
                        />
                    </div>

                    <div className="campo">
                        <label>Imagen (URL opcional)</label>
                        <input
                            type="text"
                            name="imagen"
                            placeholder="https://..."
                            value={producto.imagen}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label>Certificación</label>
                        <select
                            name="certificacion"
                            value={producto.certificacion}
                            onChange={handleChange}
                            required
                        >
                            <option value="Orgánico">Orgánico</option>
                            <option value="No orgánico">No orgánico</option>
                            <option value="En transición">En transición</option>
                        </select>
                    </div>

                    <div className="campo">
                        <label>Origen</label>
                        <input
                            type="text"
                            name="origen"
                            placeholder="Ej. Costa Rica"
                            value={producto.origen}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="campo">
                        <label>Temporada</label>
                        <input
                            type="text"
                            name="temporada"
                            placeholder="Ej. Primavera"
                            value={producto.temporada}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="botones-formulario">
                        <button type="submit" className="publicar">Publicar producto</button>
                        <button
                            type="button"
                            className="volver-inicio"
                            onClick={() => navigate("/mis-productos")}
                        >
                            Volver
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Vender;
