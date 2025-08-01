const mongoose = require("mongoose");

const pedidoSchema = new mongoose.Schema({
  productos: [
    {
      nombre: String,
      cantidad: Number,
      precio: Number,
      vendedorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario", // o como hayas llamado tu modelo de usuarios
      },
    },
  ],
  compradorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },
  compradorNombre: {
    type: String,
    required: true,
  },
  fecha: {
    type: Date,
    default: Date.now,
  },
  estado: {
    type: String,
    default: "pendiente", // otros estados pueden ser: "enviado", "completado", etc.
  },
});

module.exports = mongoose.model("Pedido", pedidoSchema);
