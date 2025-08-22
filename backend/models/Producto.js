const mongoose = require("mongoose");

// Definición del esquema de Producto
const productoSchema = new mongoose.Schema(
  {
    // Nombre del producto, obligatorio, elimina espacios al inicio y fin
    nombre: { type: String, required: true, trim: true },

    // Descripción opcional del producto, limpia espacios extra
    descripcion: { type: String, trim: true },

    // Precio del producto, obligatorio, valor mínimo 0
    precio: { type: Number, required: true, min: 0 },

    // 👇 Certificación del producto, "Orgánico" o "No orgánico"
    certificacion: {
      type: String,
      enum: ["Orgánico", "No orgánico"], // solo permite estos valores
      default: "No orgánico",
    },

    // URL de imagen del producto, si no hay se asigna una por defecto
    imagen: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Sin+imagen",
      trim: true,
    },

    // ID del usuario que creó el producto, obligatorio
    usuarioId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Usuario",
      required: true,
    },

    // Nombre del productor o agricultor
    productor: { type: String, trim: true },

    // Estado activo/inactivo del producto
    activo: { type: Boolean, default: true },

    // 🔹 Campos adicionales
    origen: { type: String, trim: true },         // Provincia o región de origen
    temporada: { type: String, trim: true },      // Temporada del producto, ej. "Verano"
    
    // Unidad de venta, puede ser unidad, kg o lb
    unidadVenta: { 
      type: String,
      enum: ["unidad", "kg", "lb"],
      default: "kg",
    },
    
    // Stock disponible del producto, valor mínimo 0
    stock: { type: Number, default: 0, min: 0 },

    // Tipo de producto según categoría
    variedad: {
      type: String,
      enum: ["Fruta", "Verdura", "Grano", "Hierba"],
      default: "Fruta", 
    },       
  },
  { timestamps: true } // Agrega createdAt y updatedAt automáticamente
);

// (Opcional) Índices para búsquedas más rápidas por texto
// productoSchema.index({ nombre: "text", descripcion: "text", productor: "text" });

// Exportar el modelo Producto
module.exports = mongoose.model("Producto", productoSchema);
