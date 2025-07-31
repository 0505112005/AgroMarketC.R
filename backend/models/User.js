const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  direccion: { type: String },
  telefono: { type: String },
  rol: { type: String, default: "user" },
  activo: { type: Boolean, default: true }
});

module.exports = mongoose.model("user", userSchema);
