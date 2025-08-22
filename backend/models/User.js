// ==========================
// models/User.js
// ==========================

const mongoose = require("mongoose");

// Definición del esquema para los usuarios
const userSchema = new mongoose.Schema({
  // Nombre del usuario, obligatorio
  nombre: { type: String, required: true },

  // Email del usuario, obligatorio y único
  email: { type: String, required: true, unique: true },

  // Contraseña del usuario, obligatoria
  password: { type: String, required: true },

  // Dirección opcional del usuario
  direccion: { type: String },

  // Teléfono opcional del usuario
  telefono: { type: String },

  //  Rol del usuario: comprador, vendedor o admin
  rol: {
    type: String,
    enum: ["comprador", "vendedor", "admin"], // Valores permitidos
    default: "comprador", // Por defecto es comprador
  },

  //  Estado activo o inactivo del usuario
  activo: { type: Boolean, default: true },

  //  Indica si el usuario solicitó ser vendedor
  solicitudVendedor: {
    type: Boolean,
    default: false, // true si el usuario pidió ser vendedor
  },
});

// Exporta el modelo para usarlo en otras partes de la app
module.exports = mongoose.model("User", userSchema);
