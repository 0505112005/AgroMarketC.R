const mongoose = require("mongoose");

// Definición del esquema de Pedido
const pedidoSchema = new mongoose.Schema({
  // Lista de productos incluidos en el pedido
  productos: [
    {
      nombre: String,       // Nombre del producto
      cantidad: Number,     // Cantidad pedida
      precio: Number,       // Precio unitario o total del producto
      vendedorId: {         // Referencia al usuario que vendió el producto
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",    // Modelo de usuarios (ajustar si tu modelo tiene otro nombre)
      },
    },
  ],

  // ID del comprador que realizó el pedido
  compradorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Usuario",
    required: true,
  },

  // Nombre del comprador para mostrar en el pedido
  compradorNombre: {
    type: String,
    required: true,
  },

  // Fecha de creación del pedido, por defecto la fecha actual
  fecha: {
    type: Date,
    default: Date.now,
  },

  // Estado del pedido: pendiente, enviado, completado, etc.
  estado: {
    type: String,
    default: "pendiente",
  },
});

// Exportar el modelo Pedido
module.exports = mongoose.model("Pedido", pedidoSchema);
