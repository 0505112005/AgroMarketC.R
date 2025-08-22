const jwt = require("jsonwebtoken"); // Para generar tokens JWT
const Usuario = require("../models/User"); // Modelo de usuarios
const bcrypt = require("bcryptjs"); // Para hashear y comparar contraseñas

// CONTROLADOR PARA REGISTRAR USUARIOS
const register = async (req, res) => {
  try {
    //  Extrae los campos enviados desde el body
    const { nombre, email, password, direccion, telefono } = req.body;

    //  Verifica que los campos obligatorios estén completos
    if (!nombre || !email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    //  Comprueba si ya existe un usuario con el mismo email
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El correo ya está registrado" });
    }

    //  Hashea la contraseña antes de guardarla
    const hashedPassword = await bcrypt.hash(password, 10);

    //  Crea la nueva instancia de Usuario
    const nuevoUsuario = new Usuario({
      nombre,
      email,
      password: hashedPassword,
      rol: "comprador",  // Se asigna rol válido por defecto
      direccion,
      telefono,
      activo: true
    });

    //  Guarda el usuario en la base de datos
    await nuevoUsuario.save();

    //  Respuesta exitosa
    res.status(201).json({ mensaje: "Usuario creado correctamente" });
  } catch (error) {
    console.error("Error en register:", error);
    //  Manejo de error genérico
    res.status(400).json({ success: false, error: error.message });
  }
};

// CONTROLADOR PARA INICIAR SESIÓN
const login = async (req, res) => {
  try {
    let { email, password } = req.body;

    //  Verifica que los campos obligatorios estén completos
    if (!email || !password) {
      return res.status(400).json({ mensaje: "Todos los campos son obligatorios" });
    }

    //  Normaliza el email
    email = email.trim().toLowerCase();
    const usuario = await Usuario.findOne({ email });

    //  Si no existe el usuario, credenciales inválidas
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    //  Compara la contraseña con la almacenada
    const passwordValido = await bcrypt.compare(password, usuario.password);

    //  Si la contraseña no coincide, credenciales inválidas
    if (!passwordValido) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    //  Genera token JWT con id y rol del usuario
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || "secreto",
      { expiresIn: "1d" }
    );

    //  Devuelve información del usuario y token
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
    //  Error interno del servidor
    res.status(500).json({ mensaje: "Error en el servidor al iniciar sesión" });
  }
};

//  Exporta los controladores
module.exports = {
  register,
  login,
};
