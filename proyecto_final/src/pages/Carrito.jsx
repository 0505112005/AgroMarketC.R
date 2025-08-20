import React, { useState } from "react";
import { useCarrito } from "../components/CarritoContext";
import "../estilos/Carrito.css";
import Swal from "sweetalert2";
import { jsPDF } from "jspdf";




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
  const { carrito, agregarProducto, restarProducto, vaciarCarrito } = useCarrito();
  const [showModal, setShowModal] = useState(false);
  const [nombre, setNombre] = useState("");
  const [numeroTarjeta, setNumeroTarjeta] = useState("");
  const [expiracion, setExpiracion] = useState("");
  const [cvv, setCvv] = useState("");

  // Función para incrementar cantidad de un producto en el carrito
  const incrementarCantidad = (producto) => {
    agregarProducto(producto);
  };

  // Función para eliminar un producto completamente del carrito
  const eliminarProducto = (producto) => {
    Swal.fire({
      title: '¿Eliminar producto?',
      text: `¿Estás seguro de que quieres eliminar "${producto.nombre}" del carrito?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí usamos restarProducto múltiples veces para eliminar completamente
        for (let i = 0; i < producto.cantidad; i++) {
          restarProducto(producto._id);
        }
        Swal.fire({
          title: '¡Eliminado!',
          text: 'El producto ha sido eliminado del carrito',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  const formatNumeroTarjeta = (num) => num.replace(/\D/g, "").replace(/(.{4})/g, "$1 ").trim();
  const formatExpiracion = (exp) => {
    let val = exp.replace(/\D/g, "");
    if (val.length >= 3) val = val.slice(0, 4);
    if (val.length > 2) val = val.slice(0, 2) + "/" + val.slice(2);
    return val;
  };

  const handleNumeroChange = (e) => setNumeroTarjeta(formatNumeroTarjeta(e.target.value));
  const handleExpiracionChange = (e) => setExpiracion(formatExpiracion(e.target.value));

  const subtotal = carrito.reduce((acc, p) => acc + p.precio * p.cantidad, 0);
  const shipping = 3500;
  const freeShippingThreshold = 50000;
  const qualifiesForFreeShipping = subtotal >= freeShippingThreshold;
  const total = subtotal + (qualifiesForFreeShipping ? 0 : shipping);


  const handlePago = () => {
    // Validación de la tarjeta
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
    }).then(() => {
      // Generar factura en PDF con mejor estilo y detalle
      const doc = new jsPDF();
      // Encabezado con logo y nombre
      doc.setFillColor(46, 204, 113); // Verde
      doc.rect(0, 0, 210, 30, 'F');
      doc.setFontSize(18);
      doc.setTextColor(255,255,255);
      doc.text("AgroMarket C.R", 15, 20);
      // Logo (opcional, si tienes una url base64)
      // doc.addImage(logoBase64, 'PNG', 170, 5, 25, 20);


  // Título factura y nombre del comprador
  doc.setFontSize(16);
  doc.setTextColor(44, 62, 80);
  doc.text("Factura de Compra", 105, 40, { align: "center" });
  doc.setFontSize(12);
  doc.setTextColor(44, 62, 80);
  doc.text(`A nombre de: ${nombre || "(Sin nombre)"}`, 105, 48, { align: "center" });

      // Tabla de productos
      let startY = 50;
      doc.setFontSize(12);
      doc.setFillColor(39, 174, 96); // Verde más oscuro
      doc.setTextColor(255,255,255);
      doc.rect(15, startY, 180, 10, 'F');
      doc.text("Producto", 20, startY + 7);
      doc.text("Cantidad", 80, startY + 7);
      doc.text("Precio Unitario", 110, startY + 7);
      doc.text("Total", 170, startY + 7);

      doc.setTextColor(44, 62, 80);
      let y = startY + 15;
      carrito.forEach((prod, i) => {
        doc.setFontSize(11);
        doc.text(`${prod.nombre}`, 20, y);
        doc.text(`${prod.cantidad}`, 85, y, { align: "right" });
        doc.text(`${prod.precio?.toLocaleString()}`, 130, y, { align: "right" });
        doc.text(`${(prod.precio * prod.cantidad)?.toLocaleString()}`, 190, y, { align: "right" });
        y += 8;
      });

      // Línea separadora
      doc.setDrawColor(39, 174, 96);
      doc.line(15, y, 195, y);
      y += 5;

      // Resumen de totales
      doc.setFontSize(12);
      doc.text(`Subtotal:`, 130, y);
      doc.text(`${subtotal.toLocaleString()}`, 190, y, { align: "right" });
      y += 7;
      doc.text(`Envío:`, 130, y);
      doc.text(`${qualifiesForFreeShipping ? 'Gratis' : `${shipping.toLocaleString()}`}`, 190, y, { align: "right" });
      y += 7;
      doc.setFontSize(13);
      doc.setTextColor(39, 174, 96);
      doc.text(`Total:`, 130, y);
      doc.text(`${total.toLocaleString()}`, 190, y, { align: "right" });
      doc.setTextColor(44, 62, 80);
      y += 15;

      // Nota de envío gratis
      if (qualifiesForFreeShipping) {
        doc.setFontSize(11);
        doc.setTextColor(39, 174, 96);
        doc.text(`¡Envío gratis por compras superiores a ₡${freeShippingThreshold.toLocaleString()}!`, 20, y);
        doc.setTextColor(44, 62, 80);
        y += 7;
      }

      // Pie de página
      doc.setFontSize(10);
      doc.setTextColor(127, 140, 141);
      doc.text("Gracias por tu compra en AgroMarket C.R. ¡Esperamos verte pronto!", 105, 285, { align: "center" });
      doc.text("Contacto: info@agromarketcr.com", 105, 292, { align: "center" });

      // Abrir factura en nueva ventana para visualización
      doc.output("dataurlnewwindow");

      // Limpiar carrito y modal
      vaciarCarrito();
      setShowModal(false);
      setNombre(""); setNumeroTarjeta(""); setExpiracion(""); setCvv("");
    });
  };


  return (
    <div className="carrito-container">
      <h2>🌿 Tu Carrito</h2>
      {carrito.length === 0 ? (
        <p>No tienes productos en el carrito.</p>
      ) : (
        <>
          <div className="lista-carrito">
            {carrito.map((prod) => (
              <div key={prod._id} className="producto-carrito">
                <div className="producto-imagen-container">
                  <img
                    src={prod.imagen || "https://via.placeholder.com/120x120?text=Producto"}
                    alt={prod.nombre}
                    className="producto-imagen-carrito"
                  />
                  <button
                    className="btn-eliminar-producto"
                    onClick={() => eliminarProducto(prod)}
                    title="Eliminar producto del carrito"
                  >
                    🗑️
                  </button>
                </div>

                <div className="producto-info">
                  <h4 className="producto-nombre-carrito">{prod.nombre}</h4>
                  <p className="producto-descripcion-carrito">
                    {prod.descripcion ?
                      (prod.descripcion.length > 80 ?
                        `${prod.descripcion.substring(0, 80)}...` :
                        prod.descripcion
                      ) :
                      "Producto fresco y de calidad"
                    }
                  </p>
                  <div className="producto-detalles">
                    {prod.origen && <span className="producto-origen">📍 {prod.origen}</span>}
                    {prod.certificacion && (
                      <span className={`producto-certificacion ${prod.certificacion?.toLowerCase().replace(/\s+/g, '-')}`}>
                        {prod.certificacion}
                      </span>
                    )}
                  </div>
                </div>

                <div className="producto-controles">
                  <div className="precio-container">
                    <span className="precio-unitario">₡{prod.precio?.toLocaleString()}</span>
                    <span className="unidad-venta">por {prod.unidadVenta || 'kg'}</span>
                  </div>

                  <div className="cantidad-controles">
                    <span className="cantidad-label">Cantidad:</span>
                    <div className="botones-cantidad">
                      <button
                        className="btn-cantidad btn-restar"
                        onClick={() => restarProducto(prod._id)}
                        disabled={prod.cantidad <= 1}
                      >
                        −
                      </button>
                      <span className="cantidad-display">{prod.cantidad}</span>
                      <button
                        className="btn-cantidad btn-sumar"
                        onClick={() => incrementarCantidad(prod)}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="precio-total">
                    <span className="precio-total-label">Total:</span>
                    <span className="precio-total-valor">₡{(prod.precio * prod.cantidad)?.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="order-summary">
            <h2>Resumen del Pedido</h2>
            <div className="summary-row">
              <span>Subtotal ({carrito.reduce((acc, p) => acc + p.cantidad, 0)} producto{carrito.reduce((acc, p) => acc + p.cantidad, 0) !== 1 ? 's' : ''}):</span>
              <span>₡{subtotal.toLocaleString()}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>{qualifiesForFreeShipping ? 'Gratis' : `₡${shipping.toLocaleString()}`}</span>
            </div>
            <p className="free-shipping-note">
              Envío gratis en compras superiores a ₡{freeShippingThreshold.toLocaleString()}
            </p>
            <div className="summary-total">
              <span>Total:</span>
              <span>₡{qualifiesForFreeShipping ? subtotal.toLocaleString() : total.toLocaleString()}</span>
            </div>
            <div className="summary-buttons">
              <button className="pay-btn" onClick={() => setShowModal(true)}>Proceder al Pago</button>
              <button className="continue-btn" onClick={() => window.location.href = '/catalogo'}>Continuar Comprando</button>
            </div>
          </div>

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
