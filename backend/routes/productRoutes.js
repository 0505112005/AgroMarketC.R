const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");
const authMiddleware = require("../middleware/authMiddleware"); // middleware de JWT

const IMAGEN_POR_DEFECTO = "https://via.placeholder.com/300x200?text=Sin+Imagen";

// Crear un nuevo producto
router.post("/", authMiddleware, async (req, res) => {
  try {
    console.log("Nuevo producto recibido:", req.body);

    if (!req.body.imagen || req.body.imagen.trim() === "") {
      req.body.imagen = IMAGEN_POR_DEFECTO;
    }

    // Agregar el usuario logeado
    req.body.usuarioId = req.user._id;

    const nuevoProducto = new Producto(req.body);
    const guardado = await nuevoProducto.save();
    res.status(201).json(guardado);
  } catch (error) {
    console.error("Error al guardar producto:", error);
    res.status(500).json({ error: "Error al guardar el producto" });
  }
});

// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener productos" });
  }
});

// Obtener solo los productos del usuario logeado
router.get("/mis-productos", authMiddleware, async (req, res) => {
  try {
    const productos = await Producto.find({ usuarioId: req.user._id });
    res.json(productos);
  } catch (error) {
    console.error("Error al obtener productos del usuario:", error);
    res.status(500).json({ error: "Error al obtener los productos del usuario" });
  }
});

module.exports = router;
