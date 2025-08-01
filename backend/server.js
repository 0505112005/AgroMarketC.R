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

// Usa las rutas
app.use("/api/auth", authRoutes);
app.use("/api/productos", productRoutes); 
app.use("/api/pedidos", pedidoRoutes);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
