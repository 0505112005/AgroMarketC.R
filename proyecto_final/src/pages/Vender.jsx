import React, { useState } from 'react';

function Vender() {
    const [producto, setProducto] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        imagen: '',
        certificacion: '100% orgánico y 0% químico' // valor por defecto
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
        <div style={{ padding: '1rem' }}>
            <h1>Publicar nuevo producto</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre del producto"
                    value={producto.nombre}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="descripcion"
                    placeholder="Descripción"
                    value={producto.descripcion}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="precio"
                    placeholder="Precio (₡)"
                    value={producto.precio}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="imagen"
                    placeholder="URL de imagen"
                    value={producto.imagen}
                    onChange={handleChange}
                />
                <select name="certificacion" value={producto.certificacion} onChange={handleChange} required>
                    <option value="">Selecciona certificación</option>
                    <option value="100%">100% orgánico - 0% químico</option>
                    <option value="75%">75% orgánico - 25% químico</option>
                    <option value="50%">50% orgánico - 50% químico</option>
                </select>

                <button type="submit">Publicar producto</button>
            </form>
        </div>
    );
}

export default Vender;
