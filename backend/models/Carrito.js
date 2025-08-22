// models/Carrito.js
const mongoose = require("mongoose");

// Esquema para el carrito de un usuario
const CarritoSchema = new mongoose.Schema({
  usuarioId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Usuario",       // Referencia al usuario propietario del carrito
    required: true 
  },
  productos: [             // Lista de productos dentro del carrito
    {
      productoId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Producto"   // Referencia al modelo de producto
      },
      cantidad: { 
        type: Number, 
        default: 1        // Cantidad de ese producto en el carrito
      },
    },
  ],
});

// Exporta el modelo
module.exports = mongoose.model("Carrito", CarritoSchema);
