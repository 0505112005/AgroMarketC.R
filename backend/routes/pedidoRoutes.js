const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido");

// GET /api/pedidos/comprador/:id - Obtener pedidos de un comprador
router.get("/comprador/:id", async (req, res) => {
  const compradorId = req.params.id;

  try {
    const pedidos = await Pedido.find({ compradorId });
    res.json(pedidos);
  } catch (error) {
    console.error("Error al obtener pedidos por comprador:", error);
    res.status(500).json({ error: "Error al obtener pedidos" });
  }
});

// POST /api/pedidos - Crear un nuevo pedido
router.post("/", async (req, res) => {
  try {
    const { compradorId, compradorNombre, productos } = req.body;

    if (!compradorId || !compradorNombre || !productos || productos.length === 0) {
      return res.status(400).json({ mensaje: "Datos incompletos para crear pedido" });
    }

    const nuevoPedido = new Pedido({
      compradorId,
      compradorNombre,
      productos,
      fecha: new Date(),
      estado: "pendiente",
    });

    await nuevoPedido.save();

    res.status(201).json({ mensaje: "Pedido creado correctamente", pedido: nuevoPedido });
  } catch (error) {
    console.error("Error al crear pedido:", error);
    res.status(500).json({ mensaje: "Error interno al crear pedido" });
  }
});

module.exports = router;
