const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },

  // 🔐 ROL claro y controlado
  rol: {
    type: String,
    enum: ["comprador", "vendedor", "admin"],
    default: "comprador",
  },

  // 🔒 Estado activo/inactivo
  activo: { type: Boolean, default: true },

  // 🆕 Campo opcional para solicitudes
  solicitudVendedor: {
    type: Boolean,
    default: false, // true si el usuario pidió ser vendedor
  },
});

module.exports = mongoose.model("User", userSchema);
