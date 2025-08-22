const Pedido = require("../models/Pedido"); // Importa el modelo de pedidos

// Controlador para crear un nuevo pedido
const crearPedido = async (req, res) => {
  try {
    //  Extrae del body los datos necesarios para el pedido
    const { productos, compradorId, compradorNombre } = req.body;

    //  Crea una nueva instancia del modelo Pedido
    const nuevoPedido = new Pedido({
      productos,
      compradorId,
      compradorNombre,
    });

    //  Guarda el pedido en la base de datos
    await nuevoPedido.save();

    //  Respuesta exitosa al cliente
    res.status(201).json({ mensaje: "Pedido creado exitosamente" });
  } catch (error) {
    console.error(error);
    //  Manejo de errores: devuelve status 500 si algo falla
    res.status(500).json({ mensaje: "Error al crear el pedido" });
  }
};

// Controlador para obtener todos los pedidos de un vendedor específico
const obtenerPedidosPorVendedor = async (req, res) => {
  try {
    //  Obtiene el id del vendedor desde los parámetros de la URL
    const vendedorId = req.params.id;

    // Busca todos los pedidos que tengan productos vendidos por este vendedor
    const pedidos = await Pedido.find({
      "productos.vendedorId": vendedorId
    });

    //  Devuelve los pedidos encontrados en formato JSON
    res.json(pedidos);
  } catch (error) {
    console.error(error);
    //  Manejo de errores: devuelve status 500 si falla la consulta
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};

// 🔹 Exporta los controladores para ser usados en las rutas
module.exports = {
  crearPedido,
  obtenerPedidosPorVendedor,
};
