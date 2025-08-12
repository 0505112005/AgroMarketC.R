import { useCarrito } from "../components/CarritoContext";
import { useNavigate } from "react-router-dom";
import "../estilos/Carrito.css";

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
        compradorNombre, 
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
      <div className="carrito-container">
        <h2 className="carrito-titulo">Carrito de Compras</h2>
        <button className="volver-inicio" onClick={() => navigate('/inicio')}>
          Volver a Inicio
        </button>
        <div className="carrito-vacio">
          Tu carrito está vacío
        </div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo">Carrito de Compras</h2>
      <button className="volver-inicio" onClick={() => navigate('/inicio')}>
        Volver a Inicio
      </button>

      <div className="carrito-lista">
        {carrito.map((item) => (
          <div key={item._id} className="carrito-item">
            <img 
              src={item.imagen || 'placeholder-image.jpg'} 
              alt={item.nombre} 
              className="carrito-item-imagen"
            />
            <div className="carrito-item-info">
              <h3 className="carrito-item-nombre">{item.nombre}</h3>
              <p className="carrito-item-precio">€{item.precio}</p>
            </div>
            <div className="carrito-item-cantidad">
              <span className="cantidad-numero">
                {item.cantidad}
              </span>
              <span>unidades</span>
            </div>
            <button
              onClick={() => quitarProducto(item._id)}
              className="carrito-item-quitar"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="carrito-resumen">
        <p className="carrito-total">
          Total: €{total.toFixed(2)}
        </p>
        <div className="carrito-acciones">
          <button onClick={vaciarCarrito} className="btn-vaciar">
            Vaciar carrito
          </button>
          <button onClick={handleCheckout} className="btn-pedido">
            Realizar Pedido
          </button>
        </div>
      </div>
    </div>
  );
};

export default Carrito;
