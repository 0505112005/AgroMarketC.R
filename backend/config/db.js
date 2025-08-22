const mongoose = require("mongoose"); // Importa Mongoose para manejar la conexión a MongoDB

// Función para conectar a la base de datos
const connectDB = async () => {
  try {
    //  Intenta conectar usando la URI definida en las variables de entorno
    await mongoose.connect(process.env.MONGO_URI);
    console.log("🟢 MongoDB conectado con éxito");
  } catch (error) {
    //  Si ocurre un error, lo muestra en consola
    console.error("🔴 Error al conectar con MongoDB:", error.message);
    //  Termina el proceso si no se logra la conexión
    process.exit(1);
  }
};

//  Exporta la función de conexión para usarla en el servidor
module.exports = connectDB;
