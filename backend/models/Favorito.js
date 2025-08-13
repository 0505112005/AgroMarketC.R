// routes/favoritos.js
const express = require("express");
const router = express.Router();
const Favorito = require("../models/Favorito");
const authMiddleware = require("../middleware/authMiddleware");

// GET favoritos del usuario autenticado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const favoritos = await Favorito.find({ userId }).populate("productoId");
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// POST agregar favorito
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productoId } = req.body;
    if (!productoId) return res.status(400).json({ error: "Falta productoId" });

    const existe = await Favorito.findOne({ userId, productoId });
    if (existe) return res.status(400).json({ error: "Favorito ya existe" });

    const nuevoFavorito = new Favorito({ userId, productoId });
    await nuevoFavorito.save();

    const favoritoConProducto = await nuevoFavorito.populate("productoId");
    res.status(201).json(favoritoConProducto);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// DELETE eliminar favorito
router.delete("/:productoId", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const productoId = req.params.productoId;

    const eliminado = await Favorito.findOneAndDelete({ userId, productoId });
    if (!eliminado) return res.status(404).json({ error: "Favorito no encontrado" });

    res.json({ message: "Favorito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

module.exports = router;
