// middleware/authMiddleware.js
const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");

const authMiddleware = async (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) return res.status(401).json({ mensaje: "No autorizado" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuario = await Usuario.findById(decoded.id);
    if (!usuario) return res.status(401).json({ mensaje: "Usuario no encontrado" });

    req.user = usuario; // adjunta usuario al request
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

module.exports = authMiddleware;
