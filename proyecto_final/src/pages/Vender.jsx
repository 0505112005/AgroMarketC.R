import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../estilos/Vender.css";

function Vender() {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        certificacion: '100%',
    });

    const navigate = useNavigate();
    const usuario = JSON.parse(localStorage.getItem("usuario"));

    useEffect(() => {
        const isAuthenticated = localStorage.getItem("isAuthenticated");

        // Solo dejar pasar si está autenticado y es VENDEDOR
        if (!isAuthenticated || !usuario || usuario.rol !== "vendedor") {
            alert("Acceso denegado. Solo los vendedores pueden publicar productos.");
            navigate("/login");
        }
    }, [navigate, usuario]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Construir producto completo para enviar
        const nuevoProducto = {
            ...producto,
            imagen: producto.imagen.trim() || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            usuarioId: usuario.id,
            productor: usuario.nombre,
        };

        console.log("📦 Enviando producto:", nuevoProducto);

        try {
            const res = await fetch("http://localhost:5000/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(nuevoProducto),
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || "Error al guardar el producto");
            }

            alert("✅ Producto publicado correctamente");

            // Limpiar el formulario
            setProducto({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                certificacion: '100%',
            });

        } catch (err) {
            console.error("❌ Error al enviar producto:", err);
            alert("❌ Error al guardar el producto. Intenta nuevamente.");
        }
    };

    return (
        <div className="vender-container">
            <section className="formulario-agregar">
                <h2>📦 Agregar Nuevo Producto</h2>
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
                        <label>Certificación:</label>
                        <select
                            name="certificacion"
                            value={producto.certificacion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Seleccione una opción</option>
                            <option value="Orgánico">Orgánico</option>
                            <option value="No orgánico">No orgánico</option>
                            <option value="En transición">En transición</option>
                        </select>

                    </div>

                    <div className="botones-formulario">
                        <button type="submit" className="publicar">Publicar producto</button>
                        <button type="button" className="volver-inicio" onClick={() => navigate("/")}>
                            Volver a inicio
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Vender;
