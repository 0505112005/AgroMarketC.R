// Importamos dependencias necesarias
const express = require("express"); // Framework para crear rutas
const router = express.Router(); // Creamos un router de Express
const Producto = require("../models/Producto"); // Modelo de MongoDB para productos
const authMiddleware = require("../middleware/authMiddleware"); // Middleware para proteger rutas con JWT

// URL de imagen por defecto si el usuario no envía ninguna
const IMAGEN_POR_DEFECTO = "https://via.placeholder.com/300x200?text=Sin+Imagen";

// ==========================
// Crear un nuevo producto
// ==========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Nuevo producto recibido:", req.body);

    // Si no envían imagen, se asigna la imagen por defecto
    if (!req.body.imagen || req.body.imagen.trim() === "") {
      req.body.imagen = IMAGEN_POR_DEFECTO;
    }

    // Agregar el usuario logeado al producto
    req.body.usuarioId = req.user._id;

    // Crear instancia del producto con los datos recibidos
    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      certificacion: req.body.certificacion,
      origen: req.body.origen,
      temporada: req.body.temporada,
      stock: req.body.stock,
      imagen: req.body.imagen,
      usuarioId: req.user._id, // Asignamos ID del usuario logeado
      productor: req.body.productor,
      variedad: req.body.variedad,
      unidadVenta: req.body.unidadVenta,
    });

    // Guardamos el producto en la base de datos
    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado); // Respondemos con el producto guardado
  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).json({ error: "Error al guardar el producto" }); // Error interno
  }
});

// ==========================
// Obtener todos los productos
// ==========================
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find(); // Traemos todos los productos
    res.json(productos); // Respondemos con la lista
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" }); // Error interno
  }
});

// ==========================
// Obtener solo los productos del usuario logeado
// ==========================
router.get("/mis-productos", authMiddleware, async (req, res) => {
  try {
    // Filtramos productos por ID del usuario logeado
    const productos = await Producto.find({ usuarioId: req.user._id });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos del usuario:", error);
    res.status(500).json({ error: "Error al obtener los productos del usuario" });
  }
});

// ==========================
// Actualizar un producto
// ==========================
router.put("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params; // ID del producto a actualizar
  const datos = req.body; // Nuevos datos enviados en la petición

  try {
    const producto = await Producto.findById(id); // Buscamos el producto por ID
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    // Validamos que el usuario logeado sea dueño del producto
    if (producto.usuarioId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: "No tienes permiso para editar este producto" });
    }

    // Actualizamos solo los campos enviados, conservando los demás
    producto.nombre = datos.nombre || producto.nombre;
    producto.descripcion = datos.descripcion || producto.descripcion;
    producto.precio = datos.precio !== undefined ? datos.precio : producto.precio;
    producto.stock = datos.stock !== undefined ? datos.stock : producto.stock;
    producto.imagen = datos.imagen || producto.imagen;
    producto.certificacion = datos.certificacion || producto.certificacion;
    producto.origen = datos.origen || producto.origen;
    producto.temporada = datos.temporada || producto.temporada;
    producto.productor = datos.productor || producto.productor;
    producto.variedad = datos.variedad || producto.variedad;
    producto.unidadVenta = datos.unidadVenta || producto.unidadVenta;

    const actualizado = await producto.save(); // Guardamos cambios en la DB
    res.json(actualizado); // Respondemos con el producto actualizado
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

// ==========================
// Eliminar un producto
// ==========================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params; // ID del producto a eliminar

  try {
    const producto = await Producto.findById(id); // Buscamos el producto
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    // Validamos que el usuario logeado sea dueño del producto
    if (producto.usuarioId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar este producto" });
    }

    await Producto.findByIdAndDelete(id); // Eliminamos el producto
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

// Exportamos el router para usarlo en app.js
module.exports = router;
