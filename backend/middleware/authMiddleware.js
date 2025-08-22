const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");

// Middleware de autenticación para rutas protegidas
const authMiddleware = async (req, res, next) => {
  //  Obtiene el token del header Authorization (formato: "Bearer <token>")
  const token = req.header("Authorization")?.replace("Bearer ", "");

  //  Si no hay token, devuelve error 401 (No autorizado)
  if (!token) return res.status(401).json({ mensaje: "No autorizado" });

  try {
    //  Verifica y decodifica el token usando la clave secreta
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    //  Busca el usuario en la DB usando decoded.id
    const usuario = await Usuario.findById(decoded.id);

    //  Si no existe el usuario o está inactivo, devuelve error 401
    if (!usuario || !usuario.activo) 
      return res.status(401).json({ mensaje: "Usuario no encontrado" });

    //  Asigna el usuario al objeto req para usarlo en rutas siguientes
    req.user = usuario;

    //  Pasa al siguiente middleware o controlador
    next();
  } catch (error) {
    console.error("Error authMiddleware:", error);
    //  Si el token es inválido, devuelve error 401
    return res.status(401).json({ mensaje: "Token inválido" });
  }
};

// Exporta el middleware para usarlo en rutas
module.exports = authMiddleware;
