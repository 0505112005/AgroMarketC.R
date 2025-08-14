const mongoose = require("mongoose");

const favoritoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto", required: true },
  createdAt: { type: Date, default: Date.now },

}, { timestamps: true });

module.exports = mongoose.model("Favorito", favoritoSchema);


