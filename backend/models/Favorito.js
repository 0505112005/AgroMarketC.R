// models/Favorito.js
const mongoose = require("mongoose");

const favoritoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
}, { timestamps: true });

module.exports = mongoose.model("Favorito", favoritoSchema);
