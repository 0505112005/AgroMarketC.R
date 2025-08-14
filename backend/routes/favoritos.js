const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const Producto = require("../models/Producto");
const Favorito = require("../models/Favorito");

// GET favoritos del usuario autenticado
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favoritos = await Favorito.find({ userId: req.user._id }).populate("productoId");
    res.json(favoritos.map(f => f.productoId)); // devolver solo los productos
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// POST toggle favorito
router.post("/:productoId", authMiddleware, async (req, res) => {
  try {
    const { productoId } = req.params;
    const producto = await Producto.findById(productoId);
    if (!producto) return res.status(404).json({ error: "Producto no encontrado" });

    // Buscar si ya existe el favorito
    const favoritoExistente = await Favorito.findOne({ userId: req.user._id, productoId });

    let agregado;
    if (favoritoExistente) {
      // Si existe, eliminar
      await Favorito.findByIdAndDelete(favoritoExistente._id);
      agregado = false;
    } else {
      // Si no existe, crear
      const nuevoFavorito = new Favorito({ userId: req.user._id, productoId });
      await nuevoFavorito.save();
      agregado = true;
    }

    res.json({ producto, agregado });
  } catch (error) {
    console.error("Error modificando favorito:", error);
    res.status(500).json({ error: "Error modificando favorito" });
  }
});

module.exports = router;
