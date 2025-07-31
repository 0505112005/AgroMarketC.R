import React, { useState } from 'react';
import "../estilos/Vender.css";

function Vender() {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        certificacion: '100% orgánico y 0% químico'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProducto({ ...producto, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const res = await fetch("http://localhost:5000/api/productos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(producto)
            });

            if (!res.ok) throw new Error("Error al guardar el producto");

            alert("Producto guardado exitosamente");
            setProducto({
                nombre: '',
                descripcion: '',
                precio: '',
                imagen: '',
                certificacion: '100% orgánico y 0% químico'
            });
        } catch (err) {
            console.error(err);
            alert("Error al enviar el producto");
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
                        <label>Certificación</label>
                        <select
                            name="certificacion"
                            value={producto.certificacion}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecciona certificación</option>
                            <option value="100%">100% orgánico - 0% químico</option>
                            <option value="75%">75% orgánico - 25% químico</option>
                            <option value="50%">50% orgánico - 50% químico</option>
                        </select>
                    </div>
                    <div className="botones-formulario">
                        <button type="submit" className="publicar"> Publicar producto</button>
                        <button
                            type="button"
                            className="volver-inicio"
                            onClick={() => window.location.href = "/"}
                        >
                            Volver a inicio
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}

export default Vender;
