const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();


const authRoutes = require("./routes/authRoutes");
const app = express();


connectDB();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("API funcionando correctamente");
});
app.use("/api/auth", authRoutes);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en el puerto ${PORT}`));

module.exports = app; // Exporta la aplicación para pruebas o uso en otros archivos