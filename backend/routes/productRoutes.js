const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// Crear un nuevo producto
const IMAGEN_POR_DEFECTO = "https://via.placeholder.com/300x200?text=Sin+Imagen";

router.post("/", async (req, res) => {
  try {
    console.log("Nuevo producto recibido:", req.body);

    // Si no hay imagen o es una cadena vacía, asignar una por defecto
    if (!req.body.imagen || req.body.imagen.trim() === "") {
      req.body.imagen = IMAGEN_POR_DEFECTO;
    }

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


// Obtener todos los productos
router.get("/", async (req, res) => {
  try {
    const productos = await Producto.find();
    res.status(200).json(productos);
  } catch (error) {
    console.error("Error al obtener productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

module.exports = router;
