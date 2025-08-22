// Importamos dependencias necesarias
const express = require("express"); // Framework para crear el servidor
const dotenv = require("dotenv"); // Para cargar variables de entorno desde .env
const cors = require("cors"); // Middleware para permitir solicitudes desde otros dominios
const connectDB = require("./config/db"); // Función para conectar a la base de datos MongoDB

// Cargamos las variables de entorno
dotenv.config();

// Importamos las rutas de autenticación
const authRoutes = require("./routes/authRoutes");

// Creamos la app de Express
const app = express();

// Conectamos a la base de datos
connectDB();

// Middlewares
app.use(cors()); // Permite solicitudes desde cualquier origen (CORS)
app.use(express.json()); // Permite interpretar el body de las peticiones como JSON

// Ruta de prueba para verificar que la API funciona
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});

// Usamos las rutas de autenticación bajo el prefijo /api/auth
app.use("/api/auth", authRoutes);

// Definimos el puerto desde .env o por defecto 5000
const PORT = process.env.PORT || 5000;

// Iniciamos el servidor
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

// Exportamos la app para poder usarla en tests u otros módulos
module.exports = app;
