const express = require("express");
const router = express.Router();
const {
  crearPedido,
  obtenerPedidosPorVendedor,
} = require("../controllers/pedidoController");

router.post("/", crearPedido);
router.get("/vendedor/:id", obtenerPedidosPorVendedor);

module.exports = router;
