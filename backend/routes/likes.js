// routes/likes.js
const express = require("express");
const router = express.Router();
const Like = require("../models/Like");
const authMiddleware = require("../middleware/authMiddleware");

// Dar like a un producto
router.post("/:productoId/like", authMiddleware, async (req, res) => {
  try {
    const userId = req.user._id;
    const { productoId } = req.params;

    const likeExistente = await Like.findOne({ userId, productoId });
    if (likeExistente)
      return res.status(400).json({ mensaje: "Ya diste like a este producto." });

    const nuevoLike = new Like({ userId, productoId });
    await nuevoLike.save();

    res.json({ mensaje: "Like agregado correctamente." });
  } catch (error) {
    res.status(500).json({ mensaje: "Error del servidor." });
  }
});

module.exports = router;
