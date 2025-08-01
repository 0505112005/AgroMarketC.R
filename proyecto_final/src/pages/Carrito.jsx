import { useCarrito } from "../components/CarritoContext";
import { useNavigate } from "react-router-dom";

const Carrito = () => {
  const { carrito, quitarProducto, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const handleCheckout = async () => {
  const user = JSON.parse(localStorage.getItem("usuario")); // ✅ aquí usas "usuario", no "user"
  const compradorId = user?.id || user?._id;
  const compradorNombre = user?.nombre;

  console.log("Usuario:", user);
  console.log("ID del comprador:", compradorId);

  if (!compradorId || !compradorNombre) {
    alert("Debes iniciar sesión para hacer un pedido.");
    return;
  }

  try {
    const respuesta = await fetch("http://localhost:5000/api/pedidos", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        compradorId,
        compradorNombre, // ✅ AHORA sí lo enviamos
        productos: carrito.map((item) => ({
          productoId: item._id,
          cantidad: item.cantidad,
          vendedorId: item.usuarioId,
        })),
      }),
    });

    if (!respuesta.ok) {
      throw new Error("Error al realizar el pedido");
    }

    const data = await respuesta.json();
    console.log("✅ Pedido creado:", data);
    alert("Pedido realizado con éxito");
    vaciarCarrito();
    navigate("/Pedidos");
  } catch (error) {
    console.error("❌ Error:", error);
    alert("Hubo un error al realizar el pedido.");
  }
};

  if (carrito.length === 0) {
    return (
      <div className="p-4">
        <h2 className="text-2xl mb-4">Tu carrito está vacío</h2>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-2xl mb-4 font-bold">Carrito de Compras</h2>

      <ul className="mb-4">
        {carrito.map((item) => (
          <li
            key={item._id}
            className="flex justify-between items-center border-b py-2"
          >
            <div>
              <p className="font-semibold">{item.nombre}</p>
              <p>
                {item.cantidad} x €{item.precio} = €
                {(item.precio * item.cantidad).toFixed(2)}
              </p>
            </div>
            <button
              onClick={() => quitarProducto(item._id)}
              className="text-red-600 hover:underline"
            >
              Quitar
            </button>
          </li>
        ))}
      </ul>

      <p className="text-lg font-semibold mb-4">
        Total: €{total.toFixed(2)}
      </p>

      <div className="flex gap-4">
        <button
          onClick={vaciarCarrito}
          className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
        >
          Vaciar carrito
        </button>
        <button
          onClick={handleCheckout}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Realizar Pedido
        </button>
      </div>
    </div>
  );
};

export default Carrito;
