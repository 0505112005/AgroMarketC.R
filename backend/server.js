// Importamos dependencias necesarias
const express = require("express"); // Framework para el servidor
const cors = require("cors"); // Middleware para permitir solicitudes desde otros dominios
const connectDB = require("./config/db"); // Función para conectar a la base de datos MongoDB
require("dotenv").config(); // Carga variables de entorno desde .env

const app = express(); // Creamos la app de Express
const PORT = process.env.PORT || 5000; // Definimos el puerto desde .env o por defecto 5000

// Conexión a MongoDB
connectDB(); 

// Middlewares
app.use(cors()); // Permite solicitudes desde cualquier origen (CORS)
app.use(express.json()); // Permite interpretar el body de las peticiones como JSON

// Importa las rutas del proyecto
const authRoutes = require("./routes/authRoutes"); // Rutas de autenticación
const productRoutes = require("./routes/productRoutes"); // Rutas de productos
const pedidoRoutes = require("./routes/pedidoRoutes"); // Rutas de pedidos
const favoritosCarritoRoutes = require("./routes/favoritosCarrito"); // Rutas de favoritos y carrito
const carritoRoutes = require("./routes/carrito"); // Rutas específicas del carrito

// Usamos las rutas con su prefijo correspondiente
app.use("/api/auth", authRoutes); // Todas las rutas de auth tendrán /api/auth
app.use("/api/productos", productRoutes); // Todas las rutas de productos tendrán /api/productos
app.use("/api/pedidos", pedidoRoutes); // Todas las rutas de pedidos tendrán /api/pedidos
app.use("/api/favoritos-carrito", favoritosCarritoRoutes); // Todas las rutas de favoritos/carrito tendrán /api/favoritos-carrito
app.use("/api/carrito", carritoRoutes); // Todas las rutas del carrito tendrán /api/carrito

// Iniciamos el servidor en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
