// src/pages/Vender.jsx
import React, { useState } from 'react'; // Importa React y useState para manejar estados
import { useNavigate } from 'react-router-dom'; // Hook para navegar entre rutas
import Swal from 'sweetalert2'; // Librería para mostrar alertas bonitas
import "../estilos/Vender.css"; // Importa estilos de la página

function Vender() {
    // Estado para almacenar los datos del producto que se va a crear
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        certificacion: 'No orgánico', // Valor por defecto de certificación
        origen: '',
        temporada: '',
        stock: 1, // Valor por defecto de stock
        variedad: '', // Variedad vacía por defecto, se selecciona luego
        unidadVenta: 'kg', // Unidad de venta por defecto
    });

    const navigate = useNavigate(); // Hook para redirigir a otras rutas
    const usuario = JSON.parse(localStorage.getItem("usuario")); // Obtiene datos del usuario logueado desde localStorage

    // Función para actualizar el estado 'producto' cuando el usuario escribe o selecciona algo
    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    // Función que se ejecuta al enviar el formulario
    const handleSubmit = async (e) => {
        e.preventDefault(); // Evita que se recargue la página

        const token = localStorage.getItem("token"); // Obtiene token de autenticación
        if (!token) {
            // Muestra alerta si no hay token
            Swal.fire({
                icon: "error",
                title: "Error de autenticación",
                text: "No se encontró el token. Inicia sesión nuevamente.",
                confirmButtonColor: "#4CAF50"
            });
            return;
        }

        // Prepara el objeto con los datos del nuevo producto
        const nuevoProducto = {
            ...producto,
            // Si no hay imagen, asigna una por defecto
            imagen: producto.imagen.trim() || "https://cdn-icons-png.flaticon.com/512/847/847969.png",
            usuarioId: usuario.id, // ID del usuario que publica
            productor: usuario.nombre, // Nombre del productor
            precio: Number(producto.precio), // Convierte precio a número
            stock: Number(producto.stock), // Convierte stock a número
        };

        try {
            // Envío de los datos al backend usando fetch
            const res = await fetch("http://localhost:5000/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // Token en header para autenticar
                },
                body: JSON.stringify(nuevoProducto), // Convierte objeto a JSON
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.mensaje || "Error al guardar el producto");
            }

            // Muestra alerta de éxito si se guardó correctamente
            Swal.fire({
                icon: "success",
                title: "¡Producto publicado!",
                text: "Tu producto ha sido agregado correctamente.",
                confirmButtonColor: "#4CAF50",
                timer: 2000,
                timerProgressBar: true
            });

            // Reinicia el formulario
            setProducto({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                certificacion: 'No orgánico',
                origen: '',
                temporada: '',
                stock: 1,
                variedad: '',
                unidadVenta: 'kg',
            });

            navigate("/mis-productos"); // Redirige a la página de mis productos

        } catch (err) {
            // Maneja errores de envío mostrando alerta
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
                    {/* Campo para el nombre del producto */}
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

                    {/* Campo para descripción del producto */}
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

                    {/* Campo para seleccionar la variedad */}
                    <div className="campo">
                        <label>Variedad</label>
                        <select
                            name="variedad"
                            value={producto.variedad}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona una variedad</option>
                            <option value="Fruta">Fruta</option>
                            <option value="Verdura">Verdura</option>
                            <option value="Grano">Grano</option>
                            <option value="Hierba">Hierba</option>
                        </select>
                    </div>

                    {/* Campo para precio */}
                    <div className="campo">
                        <label>Precio</label>
                        <input
                            type="number"
                            name="precio"
                            placeholder="₡0.00"
                            value={producto.precio}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Selección de unidad de venta (radio buttons) */}
                    <div className="campo">
                        <label>Unidad de venta</label>
                        <div className="radio-btn-group">
                            <label className={`radio-btn ${producto.unidadVenta === 'unidad' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="unidadVenta"
                                    value="unidad"
                                    checked={producto.unidadVenta === 'unidad'}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Por Unidad</span>
                            </label>
                            <label className={`radio-btn ${producto.unidadVenta === 'kg' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="unidadVenta"
                                    value="kg"
                                    checked={producto.unidadVenta === 'kg'}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Kg</span>
                            </label>
                            <label className={`radio-btn ${producto.unidadVenta === 'lb' ? 'selected' : ''}`}>
                                <input
                                    type="radio"
                                    name="unidadVenta"
                                    value="lb"
                                    checked={producto.unidadVenta === 'lb'}
                                    onChange={handleChange}
                                    required
                                />
                                <span>Lb</span>
                            </label>
                        </div>
                    </div>

                    {/* Campo para stock disponible */}
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

                    {/* Campo para imagen opcional */}
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

                    {/* Selección de certificación */}
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
                        </select>
                    </div>

                    {/* Campo para origen */}
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

                    {/* Campo para temporada */}
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

                    {/* Botones para publicar o volver */}
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

export default Vender; // Exporta el componente para usarlo en otras partes de la app
