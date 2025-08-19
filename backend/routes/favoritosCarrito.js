const express = require("express");
const router = express.Router();
const FavoritoCarrito = require("../models/FavoritoCarrito");

// POST /api/favoritos-carrito/agregar
router.post("/agregar", async (req, res) => {
  try {
    const { usuarioId, productoId } = req.body;

    if (!usuarioId || !productoId) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    let favorito = await FavoritoCarrito.findOne({ usuarioId, productoId });

    if (favorito) {
      favorito.cantidadAgregados += 1;
      await favorito.save();
    } else {
      favorito = new FavoritoCarrito({
        usuarioId,
        productoId,
        cantidadAgregados: 1,
      });
      await favorito.save();
    }

    res.json(favorito);
  } catch (error) {
    console.error("Error agregando favorito:", error);
    res.status(500).json({ error: "No se pudo agregar a favoritos" });
  }
});

// GET /api/favoritos-carrito/top/:usuarioId
router.get("/top/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const top5 = await FavoritoCarrito.find({ usuarioId })
      .sort({ cantidadAgregados: -1 })
      .limit(5)
      .populate("productoId");
    res.json(top5);
  } catch (error) {
    console.error("Error al obtener top 5 favoritos:", error);
    res.status(500).json({ error: "No se pudo obtener el top 5" });
  }
});

// GET /api/favoritos-carrito/all/:usuarioId
router.get("/all/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const favoritos = await FavoritoCarrito.find({ usuarioId }).populate("productoId");
    res.json(favoritos || []);
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// 🚀 Nueva ruta para compatibilidad con frontend
// GET /api/favoritos-carrito/:usuarioId
router.get("/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const favoritos = await FavoritoCarrito.find({ usuarioId }).populate("productoId");
    res.json(favoritos || []);
  } catch (error) {
    console.error("Error al obtener favoritos (ruta simple):", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

module.exports = router;
