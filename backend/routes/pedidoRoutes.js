const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");
const authMiddleware = require("../middleware/authMiddleware");

// ==========================
// Obtener pedidos del comprador autenticado
// ==========================
router.get("/comprador", authMiddleware, async (req, res) => {
  try {
    const compradorId = req.user._id; // Tomamos el ID del usuario logueado
    const pedidos = await Pedido.find({ compradorId }); // Buscamos todos los pedidos de ese comprador
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos por comprador:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// ==========================
// Obtener pedidos que incluyen productos del vendedor autenticado
// ==========================
router.get("/vendedor", authMiddleware, async (req, res) => {
  try {
    const vendedorId = req.user._id; // ID del vendedor logueado

    // Buscar pedidos donde productos contengan al menos un producto con vendedorId = vendedorId
    const pedidos = await Pedido.find({ "productos.vendedorId": vendedorId });

    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos por vendedor:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// ==========================
// Crear un nuevo pedido usando comprador autenticado
// ==========================
router.post("/", authMiddleware, async (req, res) => {
  try {
    const compradorId = req.user._id; // ID del comprador logueado
    const compradorNombre = req.user.nombre; // Nombre del comprador
    const { productos } = req.body; // Productos enviados desde el frontend

    if (!productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "No hay productos para el pedido" });
    }

    // Crear el nuevo pedido
    const nuevoPedido = new Pedido({
      compradorId,
      compradorNombre,
      productos,
      fecha: new Date(),
      estado: "pendiente", // Estado inicial del pedido
    });

    await nuevoPedido.save(); // Guardamos en la base de datos

    res.status(201).json({ mensaje: "Pedido creado correctamente", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error interno al crear pedido" });
  }
});

module.exports = router;
