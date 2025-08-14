const mongoose = require("mongoose");

const notificacionSchema = new mongoose.Schema({
  usuarioId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // a quién va dirigida la notificación
  mensaje: { type: String, required: true },
  leida: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model("Notificacion", notificacionSchema);
