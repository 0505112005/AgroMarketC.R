// backend/models/FavoritoCarrito.js
const mongoose = require("mongoose");

// Esquema para relacionar productos favoritos o agregados al carrito por un usuario
const FavoritoCarritoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",          // Referencia al modelo de usuario
    required: true 
  },
  productoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Producto",      // Referencia al modelo de producto
    required: true 
  },
  cantidadAgregados: { 
    type: Number, 
    default: 0           // Número de veces que el usuario agregó el producto
  },
});

// Índice único para evitar duplicados de usuario-producto
FavoritoCarritoSchema.index({ usuarioId: 1, productoId: 1 }, { unique: true });

// Exporta el modelo
module.exports = mongoose.model("FavoritoCarrito", FavoritoCarritoSchema);
