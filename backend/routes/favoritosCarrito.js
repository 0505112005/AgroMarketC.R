const express = require("express");
const router = express.Router();
const FavoritoCarrito = require("../models/FavoritoCarrito");

// ==========================
// Agregar producto a favoritos o carrito
// POST /api/favoritos-carrito/agregar
// ==========================
router.post("/agregar", async (req, res) => {
  try {
    const { usuarioId, productoId } = req.body; // Recibimos ID del usuario y del producto

    if (!usuarioId || !productoId) {
      // Validación de datos obligatorios
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }

    // Buscamos si ya existe el producto en favoritos de ese usuario
    let favorito = await FavoritoCarrito.findOne({ usuarioId, productoId });

    if (favorito) {
      // Si existe, incrementamos la cantidad de veces agregado
      favorito.cantidadAgregados += 1;
      await favorito.save();
    } else {
      // Si no existe, creamos un nuevo registro
      favorito = new FavoritoCarrito({
        usuarioId,
        productoId,
        cantidadAgregados: 1,
      });
      await favorito.save();
    }

    res.json(favorito); // Retornamos el favorito actualizado o creado
  } catch (error) {
    console.error("Error agregando favorito:", error);
    res.status(500).json({ error: "No se pudo agregar a favoritos" });
  }
});

// ==========================
// Obtener top 5 favoritos de un usuario
// GET /api/favoritos-carrito/top/:usuarioId
// ==========================
router.get("/top/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params; // Tomamos ID del usuario de los parámetros
    const top5 = await FavoritoCarrito.find({ usuarioId })
      .sort({ cantidadAgregados: -1 }) // Ordenamos por cantidad agregados descendente
      .limit(5) // Solo los 5 primeros
      .populate("productoId"); // Populamos la referencia del producto
    res.json(top5);
  } catch (error) {
    console.error("Error al obtener top 5 favoritos:", error);
    res.status(500).json({ error: "No se pudo obtener el top 5" });
  }
});

// ==========================
// Obtener todos los favoritos de un usuario
// GET /api/favoritos-carrito/all/:usuarioId
// ==========================
router.get("/all/:usuarioId", async (req, res) => {
  try {
    const { usuarioId } = req.params;
    const favoritos = await FavoritoCarrito.find({ usuarioId }).populate("productoId");
    res.json(favoritos || []); // Retornamos array vacío si no hay favoritos
  } catch (error) {
    console.error("Error al obtener favoritos:", error);
    res.status(500).json({ error: "Error al obtener favoritos" });
  }
});

// ==========================
// Ruta adicional para compatibilidad con frontend
// GET /api/favoritos-carrito/:usuarioId
// ==========================
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

module.exports = router; // Exportamos el router
