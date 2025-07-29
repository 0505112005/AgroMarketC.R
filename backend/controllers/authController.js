const Usuario = require("../models/Usuario");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { nombre, email, password, rol, direccion, telefono } = req.body;

    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol,
      direccion,
      telefono,
      activo: true
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(500).json({ mensaje: "Error al registrar usuario" });
  }
};

const login = async (req, res) => {
  // puedes implementarlo después
};

module.exports = {
  register,
  login
};
