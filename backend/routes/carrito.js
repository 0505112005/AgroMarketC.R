// routes/carrito.js
const express = require("express");
const router = express.Router();
const Carrito = require("../models/Carrito");
const authMiddleware = require("../middleware/authMiddleware");

// Obtener carrito del usuario logeado
router.get("/", authMiddleware, async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuarioId: req.user._id }).populate("productos.productoId");
    if (!carrito) carrito = await Carrito.create({ usuarioId: req.user._id, productos: [] });
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo el carrito" });
  }
});

// Agregar producto
router.post("/agregar", authMiddleware, async (req, res) => {
  const { productoId } = req.body;
  try {
    let carrito = await Carrito.findOne({ usuarioId: req.user._id });
    if (!carrito) carrito = await Carrito.create({ usuarioId: req.user._id, productos: [] });

    const index = carrito.productos.findIndex(p => p.productoId.equals(productoId));
    if (index >= 0) {
      carrito.productos[index].cantidad += 1;
    } else {
      carrito.productos.push({ productoId, cantidad: 1 });
    }

    await carrito.save();
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: "Error agregando al carrito" });
  }
});

// Eliminar producto
router.delete("/eliminar/:productoId", authMiddleware, async (req, res) => {
  try {
    let carrito = await Carrito.findOne({ usuarioId: req.user._id });
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    carrito.productos = carrito.productos.filter(p => !p.productoId.equals(req.params.productoId));
    await carrito.save();
    res.json(carrito);
  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

module.exports = router;
