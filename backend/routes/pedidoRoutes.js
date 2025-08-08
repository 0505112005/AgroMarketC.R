const express = require("express");
const router = express.Router();
const Pedido = require("../models/Pedido"); // importa tu modelo pedido

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

module.exports = router;
