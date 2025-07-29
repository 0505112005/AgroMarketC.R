const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

// Ruta simple para verificar
app.get("/", (req, res) => {
  res.send("🚀 API funcionando correctamente");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Servidor corriendo en el puerto ${PORT}`));

app.use("/api/auth", require("./routes/authRoutes"));
