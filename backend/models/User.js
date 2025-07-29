const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: String,
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["cliente", "tienda", "admin"] },
  direccion: String,
  telefono: String,
  activo: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
