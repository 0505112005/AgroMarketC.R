const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ mensaje: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🔑 Usa decoded.id, no decoded.usuarioId
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario || !usuario.activo) 
      return res.status(401).json({ mensaje: "Usuario no encontrado" });

    req.user = usuario;
    next();
  } catch (error) {
    console.error("Error authMiddleware:", error);
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

module.exports = authMiddleware;
