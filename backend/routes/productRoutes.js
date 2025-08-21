const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const authMiddleware = require("../middleware/authMiddleware"); // middleware de JWT

const IMAGEN_POR_DEFECTO = "https://via.placeholder.com/300x200?text=Sin+Imagen";

// ==========================
// Crear un nuevo producto
// ==========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Nuevo producto recibido:", req.body);

    if (!req.body.imagen || req.body.imagen.trim() === "") {
      req.body.imagen = IMAGEN_POR_DEFECTO;
    }

    // Agregar el usuario logeado
    req.body.usuarioId = req.user._id;

    const nuevoProducto = new Producto({
      nombre: req.body.nombre,
      descripcion: req.body.descripcion,
      precio: req.body.precio,
      certificacion: req.body.certificacion,
      origen: req.body.origen,
      temporada: req.body.temporada,
      stock: req.body.stock,
      imagen: req.body.imagen,
      usuarioId: req.user._id,
      productor: req.body.productor,
      variedad: req.body.variedad,
      unidadVenta: req.body.unidadVenta,
    });
    

    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

// ==========================
// Obtener todos los productos
// ==========================
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// ==========================
// Obtener solo los productos del usuario logeado
// ==========================
router.get("/mis-productos", authMiddleware, async (req, res) => {
  try {
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
  const { id } = req.params;
  const datos = req.body;

  try {
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (producto.usuarioId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: "No tienes permiso para editar este producto" });
    }

    // Actualizar campos
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

    const actualizado = await producto.save();
    res.json(actualizado);
  } catch (error) {
    console.error("Error al actualizar producto:", error);
    res.status(500).json({ mensaje: "Error al actualizar producto" });
  }
});

// ==========================
// Eliminar un producto
// ==========================
router.delete("/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;

  try {
    const producto = await Producto.findById(id);
    if (!producto) return res.status(404).json({ mensaje: "Producto no encontrado" });

    if (producto.usuarioId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ mensaje: "No tienes permiso para eliminar este producto" });
    }

    await Producto.findByIdAndDelete(id);
    res.json({ mensaje: "Producto eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar producto:", error);
    res.status(500).json({ mensaje: "Error al eliminar producto" });
  }
});

module.exports = router;
