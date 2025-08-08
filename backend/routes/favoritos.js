const express = require("express");
const router = express.Router();
const Favorito = require("../models/Favorito");

// Obtener favoritos de un usuario
router.get("/", async (req, res) => {
  const userId = req.query.userId;
  if (!userId) return res.status(400).json({ error: "Falta userId" });

  try {
    const favoritos = await Favorito.find({ userId }).populate("productoId");
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Agregar favorito
router.post("/", async (req, res) => {
  const { userId, productoId } = req.body;
  if (!userId || !productoId) {
    return res.status(400).json({ error: "Faltan datos userId o productoId" });
  }

  try {
    // Verificar si ya existe
    const existe = await Favorito.findOne({ userId, productoId });
    if (existe) return res.status(400).json({ error: "Favorito ya existe" });

    const nuevoFavorito = new Favorito({ userId, productoId });
    await nuevoFavorito.save();
A
    res.status(201).json(nuevoFavorito);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// Eliminar favorito
router.delete("/:productoId", async (req, res) => {
  const userId = req.body.userId;
  const productoId = req.params.productoId;

  if (!userId) return res.status(400).json({ error: "Falta userId" });

  try {
    const eliminado = await Favorito.findOneAndDelete({ userId, productoId });
    if (!eliminado) return res.status(404).json({ error: "Favorito no encontrado" });

    res.json({ message: "Favorito eliminado" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar favorito" });
  }
});

module.exports = router;
