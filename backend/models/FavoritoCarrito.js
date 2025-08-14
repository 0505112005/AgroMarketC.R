// backend/models/FavoritoCarrito.js
const mongoose = require("mongoose");

const FavoritoCarritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  cantidadAgregados: { type: Number, default: 0 },
});

FavoritoCarritoSchema.index({ usuarioId: 1, productoId: 1 }, { unique: true });

module.exports = mongoose.model("FavoritoCarrito", FavoritoCarritoSchema);
