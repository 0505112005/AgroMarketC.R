const express = require("express");
const router = express.Router();
const Favorito = require("../models/Favorito");
const Producto = require("../models/Producto");
const authMiddleware = require("../middleware/authMiddleware");

// Obtener favoritos del usuario autenticado (comprador)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const favoritos = await Favorito.find({ userId }).populate("productoId");
    res.json(favoritos);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// Obtener favoritos de productos del vendedor autenticado
router.get("/vendedor", authMiddleware, async (req, res) => {
  try {
    const vendedorId = req.user._id;

    // Buscar favoritos cuyos productos pertenecen al vendedor autenticado
    const favoritos = await Favorito.find()
      .populate({
        path: "productoId",
        match: { usuarioId: vendedorId },
      })
      .populate("userId");

    // Filtrar solo los favoritos que tengan productoId válido (no null)
    const favoritosFiltrados = favoritos.filter(fav => fav.productoId !== null);

    res.json(favoritosFiltrados);
  } catch (error) {
    res.status(500).json({ error: "Error al obtener favoritos del vendedor" });
  }
});

// Agregar favorito (usuario autenticado)
router.post("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productoId } = req.body;
    if (!productoId) return res.status(400).json({ error: "Falta productoId" });

    // Verificar si ya existe
    const existe = await Favorito.findOne({ userId, productoId });
    if (existe) return res.status(400).json({ error: "Favorito ya existe" });

    const nuevoFavorito = new Favorito({ userId, productoId });
    await nuevoFavorito.save();

    res.status(201).json(nuevoFavorito);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar favorito" });
  }
});

// Eliminar favorito (usuario autenticado)
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
