const express = require("express");
const router = express.Router();
const Producto = require("../models/Producto");

// Crear un nuevo producto
router.post("/", async (req, res) => {
  try {
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
