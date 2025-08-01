const Pedido = require("../models/Pedido");

const crearPedido = async (req, res) => {
  try {
    const { productos, compradorId, compradorNombre } = req.body;

    const nuevoPedido = new Pedido({
      productos,
      compradorId,
      compradorNombre,
    });

    await nuevoPedido.save();
    res.status(201).json({ mensaje: "Pedido creado exitosamente" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al crear el pedido" });
  }
};

const obtenerPedidosPorVendedor = async (req, res) => {
  try {
    const vendedorId = req.params.id;

    const pedidos = await Pedido.find({
      "productos.vendedorId": vendedorId
    });

    res.json(pedidos);
  } catch (error) {
    console.error(error);
    res.status(500).json({ mensaje: "Error al obtener pedidos" });
  }
};


module.exports = {
  crearPedido,
  obtenerPedidosPorVendedor,
};
