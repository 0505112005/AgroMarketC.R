const express = require("express");
const router = express.Router();
const Favorito = require("../models/Favorito");
const authMiddleware = require("../middleware/authMiddleware");

// Obtener notificaciones (likes en MIS productos)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const favoritos = await Favorito.find()
      .populate({
        path: "productoId",
        match: { productor: req.user._id }, // solo mis productos
        select: "nombre imagen",
      })
      .populate("userId", "nombre")
      .exec();

    // Filtra los que realmente son de mis productos
    const misNotificaciones = favoritos
      .filter(f => f.productoId !== null)
      .map(f => ({
        _id: f._id,
        usuario: f.userId.nombre,
        producto: f.productoId.nombre,
        createdAt: f.createdAt,
      }));

    res.json(misNotificaciones);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error obteniendo notificaciones" });
  }
});

module.exports = router;
