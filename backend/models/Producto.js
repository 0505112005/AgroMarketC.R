const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  descripcion: { type: String },
  precio: { type: Number, required: true },
  certificacion: {
    type: String,
    enum: ["Orgánico", "No orgánico", "En transición"],
    default: "No orgánico",
  },
  imagen: {
    type: String,
    default: "https://via.placeholder.com/300x200?text=Sin+imagen",
  },
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  productor: { type: String },
  activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Producto", productoSchema);
