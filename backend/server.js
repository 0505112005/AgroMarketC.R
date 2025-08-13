const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

connectDB(); // conexión a MongoDB
app.use(cors());
app.use(express.json()); // permite leer JSON en el body

// Importa las rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const pedidoRoutes = require("./routes/pedidoRoutes");
const favoritosRoutes = require("./routes/favoritos");

// Nuevas rutas para likes y notificaciones
const likesRoutes = require("./routes/likes");
const notificacionesRoutes = require("./routes/notificaciones");

// Usa las rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/favoritos", favoritosRoutes);

// Agrega las rutas nuevas para likes y notificaciones
app.use("/api/likes", likesRoutes);
app.use("/api/notificaciones", notificacionesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
