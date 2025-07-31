// backend/models/Producto.js
const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  imagen: { type: String },
  certificacion: { type: String, enum: ["100%", "75%", "50%"], required: true },
}, { timestamps: true });

module.exports = mongoose.model("Producto", productoSchema);
