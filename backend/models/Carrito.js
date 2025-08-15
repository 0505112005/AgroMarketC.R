// models/Carrito.js
const mongoose = require("mongoose");

const CarritoSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "Usuario", required: true },
  productos: [
    {
      productoId: { type: mongoose.Schema.Types.ObjectId, ref: "Producto" },
      cantidad: { type: Number, default: 1 },
    },
  ],
});

module.exports = mongoose.model("Carrito", CarritoSchema);
