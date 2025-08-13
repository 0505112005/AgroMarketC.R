// routes/notificaciones.js
const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const Producto = require("../models/Producto");
const Pedido = require("../models/Pedido");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, async (req, res) => {
  try {
    const vendedorId = req.user._id;

    // 1. Productos del vendedor
    const productos = await Producto.find({ usuarioId: vendedorId }).select("_id nombre");
    const productosIds = productos.map(p => p._id);

    // 2. Likes sobre esos productos
    const likes = await Like.find({ productoId: { $in: productosIds } })
      .populate("userId", "nombre")
      .populate("productoId", "nombre")
      .sort({ createdAt: -1 })
      .limit(20);

    // 3. Pedidos que incluyen productos del vendedor
    const pedidos = await Pedido.find({ "productos.vendedorId": vendedorId })
      .sort({ fecha: -1 })
      .limit(20);

    // 4. Formatear notificaciones likes
    const notificacionesLikes = likes.map(like => ({
      tipo: "like",
      texto: `${like.userId.nombre} le dio like a tu producto ${like.productoId.nombre}`,
      fecha: like.createdAt,
      productoId: like.productoId._id,
      userId: like.userId._id,
      likeId: like._id,
    }));

    // 5. Formatear notificaciones pedidos
    const notificacionesPedidos = pedidos.map(pedido => ({
      tipo: "pedido",
      texto: `Nuevo pedido de ${pedido.compradorNombre} para tus productos.`,
      fecha: pedido.fecha,
      pedidoId: pedido._id,
    }));

    // 6. Combinar y ordenar
    const notificaciones = [...notificacionesLikes, ...notificacionesPedidos]
      .sort((a, b) => b.fecha - a.fecha);

    res.json(notificaciones);

  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor." });
  }
});

module.exports = router;
