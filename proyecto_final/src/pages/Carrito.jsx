import { useCarrito } from "../components/CarritoContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import "../estilos/Carrito.css";

const Carrito = () => {
  const { carrito, quitarProducto, vaciarCarrito } = useCarrito();
  const navigate = useNavigate();

  const [mostrarPago, setMostrarPago] = useState(false);
  const [metodoPago, setMetodoPago] = useState("");
  const [nombrePago, setNombrePago] = useState("");
  const [sinpeNumero, setSinpeNumero] = useState("");
  const [tarjetaNumero, setTarjetaNumero] = useState("");
  const [tarjetaNombre, setTarjetaNombre] = useState("");
  const [vencimiento, setVencimiento] = useState("");
  const [cvv, setCvv] = useState("");

  const total = carrito.reduce(
    (acc, item) => acc + item.precio * item.cantidad,
    0
  );

  const user = JSON.parse(localStorage.getItem("usuario")) || {};
  
  // Abrir el formulario de pago
  const handleRealizarPedidoClick = () => {
    if (!user?.id && !user?._id) {
      alert("Debes iniciar sesión para hacer un pedido.");
      return;
    }
    setNombrePago(user.nombre || "");
    setMostrarPago(true);
  };

  // Cerrar el formulario de pago
  const handleCancelarPago = () => {
    setMostrarPago(false);
    setMetodoPago("");
    // Limpiar campos si quieres...
  };

  // Manejar el envío del formulario de pago
  const handleConfirmarPago = async (e) => {
    e.preventDefault();

    // Validaciones básicas
    if (!nombrePago.trim()) {
      alert("Por favor ingresa tu nombre");
      return;
    }
    if (!metodoPago) {
      alert("Por favor selecciona un método de pago");
      return;
    }
    if (metodoPago === "sinpe" && !sinpeNumero.trim()) {
      alert("Por favor ingresa el número SINPE");
      return;
    }
    if (metodoPago === "tarjeta") {
      if (!tarjetaNombre.trim() || !tarjetaNumero.trim() || !vencimiento || !cvv.trim()) {
        alert("Por favor completa todos los datos de la tarjeta");
        return;
      }
    }

    // Aquí puedes armar el cuerpo para enviar al backend (ejemplo simplificado)
    const compradorId = user?.id || user?._id;
    const compradorNombre = nombrePago;

    try {
      const respuesta = await fetch("http://localhost:5000/api/pedidos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          compradorId,
          compradorNombre,
          metodoPago,
          detallesPago: metodoPago === "sinpe" 
            ? { numeroSINPE: sinpeNumero }
            : { tarjetaNombre, tarjetaNumero, vencimiento, cvv },
          productos: carrito.map(item => ({
            productoId: item._id,
            cantidad: item.cantidad,
            vendedorId: item.usuarioId,
          })),
        }),
      });

      if (!respuesta.ok) throw new Error("Error al realizar el pedido");

      const data = await respuesta.json();
      alert("✅ Pedido realizado con éxito");
      vaciarCarrito();
      setMostrarPago(false);
      navigate("/Pedidos");
    } catch (error) {
      console.error(error);
      alert("Hubo un error al realizar el pedido.");
    }
  };

  if (carrito.length === 0) {
    return (
      <div className="carrito-container">
        <h2 className="carrito-titulo">Carrito de Compras</h2>
        <button className="volver-inicio" onClick={() => navigate("/inicio")}>
          Volver a Inicio
        </button>
        <div className="carrito-vacio">Tu carrito está vacío</div>
      </div>
    );
  }

  return (
    <div className="carrito-container">
      <h2 className="carrito-titulo">Carrito de Compras</h2>
      <button className="volver-inicio" onClick={() => navigate("/inicio")}>
        Volver a Inicio
      </button>

      <div className="carrito-lista">
        {carrito.map((item) => (
          <div key={item._id} className="carrito-item">
            <img
              src={item.imagen || "placeholder-image.jpg"}
              alt={item.nombre}
              className="carrito-item-imagen"
            />
            <div className="carrito-item-info">
              <h3 className="carrito-item-nombre">{item.nombre}</h3>
              <p className="carrito-item-precio">₡{item.precio}</p>
            </div>
            <div className="carrito-item-cantidad">
              <span className="cantidad-numero">{item.cantidad}</span> unidades
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
        <p className="carrito-total">Total: ₡{total.toFixed(2)}</p>
        <div className="carrito-acciones">
          <button onClick={vaciarCarrito} className="btn-vaciar">
            Vaciar carrito
          </button>
          <button
            onClick={() => navigate("/catalogo")}
            className="btn-continuar"
          >
            Continuar Comprando
          </button>
          <button onClick={handleRealizarPedidoClick} className="btn-pedido">
            Realizar Pedido
          </button>
        </div>
      </div>

      {/* Contenedor tipo modal para pago */}
      {mostrarPago && (
        <div className="vender-container">
          <section className="formulario-agregar">
            <h2>📦 Información de Pago</h2>
            <form onSubmit={handleConfirmarPago}>
              <div className="campo">
                <label>Nombre completo: </label>
                <input
                  type="text"
                  name="nombrePago"
                  value={nombrePago}
                  onChange={(e) => setNombrePago(e.target.value)}
                  required
                />
              </div>

              <div className="campo">
                <label>Método de pago: </label>
                <select
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="">Seleccione una opción</option>
                  <option value="sinpe">SINPE</option>
                  <option value="tarjeta">Tarjeta de crédito/débito</option>
                </select>
              </div>
              
              


              {/* Campos condicionales */}
              {metodoPago === "sinpe" && (
                <div className="campo">
                  <label style={{ display: "block", textAlign: "center", marginBottom: "5px" }}>
                    -Realizar el SINPE al 8499-1555-  
                  </label>
                  
                  <br /> {/* salto de línea */}             
                  <label>Ingresar número de comprobante:  </label>
                  <input
                    type="text"
                    value={sinpeNumero}
                    onChange={(e) => setSinpeNumero(e.target.value)}
                    required
                  />
                </div>
                
              )}

              {metodoPago === "tarjeta" && (
                <>
                  <div className="campo">
                    <label>Nombre del titular: </label>
                    <input
                      type="text"
                      value={tarjetaNombre}
                      onChange={(e) => setTarjetaNombre(e.target.value)}
                      required
                    />
                  </div>
                  <div className="campo">
                    <label>Número de tarjeta: </label>
                    <input
                      type="text"
                      maxLength="16"
                      value={tarjetaNumero}
                      onChange={(e) => setTarjetaNumero(e.target.value)}
                      required
                    />
                  </div>
                  <div className="campo">
                    <label>Fecha de vencimiento: </label>
                    <input
                      type="month"
                      value={vencimiento}
                      onChange={(e) => setVencimiento(e.target.value)}
                      required
                    />
                  </div>
                  <div className="campo">
                    <label>CVV:</label>
                    <input
                      type="password"
                      maxLength="3"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                    />
                  </div>
                </>
              )}

              <p className="carrito-total">Total: ₡{total.toFixed(2)}</p>
              
              <div className="botones-formulario">            
                <button type="submit" className="publicar">
                  Confirmar Pedido
                </button>            
                <button 
                  type="submit"                  
                  onClick={handleCancelarPago}>                
                  Cancelar
                </button>    
                
              </div>
              
              <div>
                
              </div>

            </form>
          </section>
        </div>
      )}
    </div>
  );
};

export default Carrito;
