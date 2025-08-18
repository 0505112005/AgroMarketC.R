import React, { useState } from "react";
import { useCarrito } from "../components/CarritoContext";
import "../estilos/Carrito.css";
import Swal from "sweetalert2";

// Función de validación
const validarTarjeta = ({ numero, nombre, expiracion, cvv }) => {
  const num = numero.replace(/\s+/g, '');
  if (!/^\d{16}$/.test(num)) return "Número de tarjeta inválido";

  if (!nombre.trim()) return "Nombre no puede estar vacío";

  if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiracion)) 
    return "Fecha de expiración inválida";

  const [mes, anio] = expiracion.split("/").map(Number);
  const fechaActual = new Date();
  const añoActual = Number(fechaActual.getFullYear().toString().slice(-2));
  const mesActual = fechaActual.getMonth() + 1;
  if (anio < añoActual || (anio === añoActual && mes < mesActual))
    return "Tarjeta expirada";

  if (!/^\d{3}$/.test(cvv)) return "CVV inválido";

  return true;
};

const Carrito = () => {
  const { carrito, quitarProducto, restarProducto, vaciarCarrito } = useCarrito();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");

  const formatNumeroTarjeta = (num) => num.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiracion = (exp) => {
    let val = exp.replace(/\D/g, "");
    if (val.length >= 3) val = val.slice(0,4);
    if (val.length > 2) val = val.slice(0,2) + "/" + val.slice(2);
    return val;
  };

  const handleNumeroChange = (e) => setNumeroTarjeta(formatNumeroTarjeta(e.target.value));
  const handleExpiracionChange = (e) => setExpiracion(formatExpiracion(e.target.value));

  const total = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);

  const handlePago = () => {
    const resultado = validarTarjeta({ numero: numeroTarjeta, nombre, expiracion, cvv });
    if (resultado !== true) {
      Swal.fire({
        icon: "error",
        title: "Error en el pago",
        text: resultado
      });
      return;
    }

    // Pago simulado
    Swal.fire({
      icon: "success",
      title: "¡Pago realizado!",
      text: `Se ha procesado tu pago de CRC ${total}`
    });

    vaciarCarrito();
    setShowModal(false);
    setNombre(""); setNumeroTarjeta(""); setExpiracion(""); setCvv("");
  };

  return (
    <div className="carrito-container">
      <h2>Tu Carrito</h2>
      {carrito.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <ul className="lista-carrito">
            {carrito.map((prod) => (
              <li key={prod._id} className="producto-carrito">
                <img src={prod.imagen || "https://via.placeholder.com/100"} alt={prod.nombre} />
                <div>
                  <h4>{prod.nombre}</h4>
                  <p>CRC {prod.precio} x {prod.cantidad}</p>
                  <div className="botones-cantidad">
                    <button onClick={() => restarProducto(prod._id)}>-</button>
                    <button onClick={() => quitarProducto(prod._id)}>X</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
          <h3>Total: CRC {total}</h3>
          <button className="btn-pagar" onClick={() => setShowModal(true)}>Realizar Pedido</button>
        </>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-contenido grande" onClick={(e) => e.stopPropagation()}>
            <h2>Pago</h2>

            <div className={`tarjeta-realista ${cvv ? "girar" : ""}`}>
              <div className="tarjeta-frente">
                <div className="chip"></div>
                <div className="tarjeta-numero">{numeroTarjeta || "#### #### #### ####"}</div>
                <div className="tarjeta-info">
                  <span className="tarjeta-nombre">{nombre.toUpperCase() || "NOMBRE EN TARJETA"}</span>
                  <span className="tarjeta-expiracion">{expiracion || "MM/AA"}</span>
                </div>
              </div>
              <div className="tarjeta-atras">
                <div className="banda-magnetica"></div>
                <div className="cvv-back">{cvv || "CVV"}</div>
              </div>
            </div>

            <form className="form-pago" onSubmit={(e) => { e.preventDefault(); handlePago(); }}>
              <input
                type="text"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                placeholder="Nombre en tarjeta"
                required
              />
              <input
                type="text"
                value={numeroTarjeta}
                onChange={handleNumeroChange}
                placeholder="Número de tarjeta"
                maxLength={19}
                required
              />
              <input
                type="text"
                value={expiracion}
                onChange={handleExpiracionChange}
                placeholder="MM/AA"
                maxLength={5}
                required
              />
              <input
                type="text"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="CVV"
                maxLength={3}
                required
              />
              <button type="submit" className="btn-confirmar">Pagar</button>
            </form>
            <button className="btn-cerrar" onClick={() => setShowModal(false)}>X</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Carrito;
