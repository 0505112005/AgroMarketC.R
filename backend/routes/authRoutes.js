const express = require("express");
const router = express.Router();

// tus rutas aquí
router.post("/login", loginController);
router.post("/register", registerController);

module.exports = router;
