// backend/routes/favoritosCarrito.js
const express = require("express");
const router = express.Router();
const FavoritoCarrito = require("../models/FavoritoCarrito");

// Obtener los 5 favoritos de un usuario
router.get("/:usuarioId", async (req, res) => {
  try {
    const favoritos = await FavoritoCarrito.find({ usuarioId: req.params.usuarioId })
      .sort({ cantidadAgregados: -1 })
      .limit(5)
      .populate("productoId");
    res.json(favoritos);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Incrementar contador al agregar al carrito
router.post("/agregar", async (req, res) => {
  const { usuarioId, productoId } = req.body;
  if (!usuarioId || !productoId) return res.status(400).json({ error: "Faltan datos" });

  try {
    const favorito = await FavoritoCarrito.findOneAndUpdate(
      { usuarioId, productoId },
      { $inc: { cantidadAgregados: 1 } },
      { new: true, upsert: true } // crea si no existe
    );
    res.json(favorito);
  } catch (err) {
    res.status(500).json({ error: "Error al actualizar favorito" });
  }
});

module.exports = router;
