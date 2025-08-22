// ==========================
// routes/authRoutes.js
// ==========================

const express = require("express");
const router = express.Router(); // Creamos un router de Express

// Importamos las funciones del controlador de autenticación
const { login, register } = require("../controllers/authController");

// ==========================
// Ruta de login
// POST /api/auth/login
// ==========================
router.post("/login", login); // Llama a la función login del controlador

// ==========================
// Ruta de registro
// POST /api/auth/register
// ==========================
router.post("/register", register); // Llama a la función register del controlador

module.exports = router; // Exportamos el router para usar en app.js
