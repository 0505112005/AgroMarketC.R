const jwt = require("jsonwebtoken");
const Usuario = require("../models/User");
const bcrypt = require("bcryptjs");

const register = async (req, res) => {
  try {
    const { nombre, email, password, direccion, telefono } = req.body;

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
      rol: "comprador",  // Asignamos rol válido para evitar errores
      direccion,
      telefono,
      activo: true
    });

    await nuevoUsuario.save();

    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error en register:", error);
    res.status(400).json({ success: false, error: error.message });
  }
};


// LOGIN
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    email = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ email });

    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);

    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    res.json({
      mensaje: "Inicio de sesión exitoso",
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
};

module.exports = {
  register,
  login,
};
