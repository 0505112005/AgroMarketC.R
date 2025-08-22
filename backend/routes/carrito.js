// ==========================
// routes/carrito.js
// ==========================

const express = require("express");
const router = express.Router();
const Carrito = require("../models/Carrito");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// Obtener carrito del usuario autenticado
// GET /api/carrito/
// ==========================
router.get("/", authMiddleware, async (req, res) => {
  try {
    // Buscamos el carrito del usuario y poblamos los productos
    let carrito = await Carrito.findOne({ usuarioId: req.user._id }).populate("productos.productoId");

    // Si no existe carrito, lo creamos vacío
    if (!carrito) carrito = await Carrito.create({ usuarioId: req.user._id, productos: [] });

    res.json(carrito); // Retornamos el carrito
  } catch (err) {
    res.status(500).json({ error: "Error obteniendo el carrito" });
  }
});

// ==========================
// Agregar producto al carrito
// POST /api/carrito/agregar
// ==========================
router.post("/agregar", authMiddleware, async (req, res) => {
  const { productoId } = req.body;
  try {
    // Buscamos el carrito del usuario
    let carrito = await Carrito.findOne({ usuarioId: req.user._id });

    // Si no existe, lo creamos
    if (!carrito) carrito = await Carrito.create({ usuarioId: req.user._id, productos: [] });

    // Revisamos si el producto ya está en el carrito
    const index = carrito.productos.findIndex(p => p.productoId.equals(productoId));
    if (index >= 0) {
      // Si existe, aumentamos la cantidad
      carrito.productos[index].cantidad += 1;
    } else {
      // Si no existe, lo agregamos con cantidad 1
      carrito.productos.push({ productoId, cantidad: 1 });
    }

    await carrito.save(); // Guardamos cambios
    res.json(carrito); // Retornamos carrito actualizado
  } catch (err) {
    res.status(500).json({ error: "Error agregando al carrito" });
  }
});

// ==========================
// Eliminar producto del carrito
// DELETE /api/carrito/eliminar/:productoId
// ==========================
router.delete("/eliminar/:productoId", authMiddleware, async (req, res) => {
  try {
    // Buscamos el carrito del usuario
    let carrito = await Carrito.findOne({ usuarioId: req.user._id });
    if (!carrito) return res.status(404).json({ error: "Carrito no encontrado" });

    // Filtramos el producto que queremos eliminar
    carrito.productos = carrito.productos.filter(p => !p.productoId.equals(req.params.productoId));

    await carrito.save(); // Guardamos cambios
    res.json(carrito); // Retornamos carrito actualizado
  } catch (err) {
    res.status(500).json({ error: "Error eliminando producto" });
  }
});

module.exports = router; // Exportamos el router
