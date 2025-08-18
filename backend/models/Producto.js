const mongoose = require("mongoose");

const productoSchema = new mongoose.Schema(
  {
    nombre: { type: String, required: true, trim: true },
    descripcion: { type: String, trim: true },
    precio: { type: Number, required: true, min: 0 },

    // 👇 Incluye "Híbrido" para que coincida con tu filtro del catálogo
    certificacion: {
      type: String,
      enum: ["Orgánico", "Híbrido", "No orgánico", "En transición"],
      default: "No orgánico",
    },

    imagen: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Sin+imagen",
      trim: true,
    },

    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    productor: { type: String, trim: true },      // nombre del agricultor
    activo: { type: Boolean, default: true },

    // 🔹 Campos adicionales para el detalle
    origen: { type: String, trim: true },         // provincia/ región
    temporada: { type: String, trim: true },      // p.ej. "Verano", "Agosto-Octubre"
    unidadVenta: {
      type: String,
      enum: ["kg", "unidad", "manojo", "litro", "docena"],
      default: "kg",
    },
    cantidadPorUnidad: { type: Number, default: 1 }, // p.ej. 1 kg, 1 unidad
    stock: { type: Number, default: 0, min: 0 },  // inventario disponible
    fechaCosecha: { type: Date },
    fechaVencimiento: { type: Date },             // opcional si aplica
    variedad: { type: String, trim: true },       // p.ej. "Fuji", "Criolla"
    condicionesAlmacenamiento: { type: String, trim: true }, // p.ej. "Refrigerar"
    notas: { type: String, trim: true },          // info libre adicional
  },
  { timestamps: true }
);

// (Opcional) Índices útiles para búsqueda
// productoSchema.index({ nombre: "text", descripcion: "text", productor: "text" });

module.exports = mongoose.model("Producto", productoSchema);
