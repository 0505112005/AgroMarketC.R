import React, { useEffect, useState } from "react";

function Mensajeria() {
  const [pedidos, setPedidos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);

  // Suponiendo que el token JWT lo guardas en localStorage al iniciar sesión
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;

    // Fetch pedidos donde soy vendedor
    fetch("/api/pedidos/vendedor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setPedidos(data))
      .catch(console.error);

    // Fetch favoritos donde soy vendedor
    fetch("/api/favoritos/vendedor", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(res => res.json())
      .then(data => setFavoritos(data))
      .catch(console.error);
  }, [token]);

  return (
    <div style={{ display: "flex", gap: "2rem" }}>
      {/* Notificaciones */}
      <div style={{ flex: 1, borderRight: "1px solid #ccc", paddingRight: "1rem" }}>
        <h2>Notificaciones</h2>

        <h3>Pedidos</h3>
        <ul>
          {pedidos.length === 0 && <li>No tienes pedidos</li>}
          {pedidos.map(pedido => (
            <li key={pedido._id}>
              Pedido de <strong>{pedido.compradorNombre}</strong> - Estado: {pedido.estado}
              <ul>
                {pedido.productos.map((prod, i) => (
                  <li key={i}>
                    {prod.nombre} - Cantidad: {prod.cantidad}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>

        <h3>Favoritos</h3>
        <ul>
          {favoritos.length === 0 && <li>No tienes favoritos</li>}
          {favoritos.map(fav => (
            <li key={fav._id}>
              Producto: <strong>{fav.productoId?.nombre}</strong> 
              {/* Puedes mostrar más datos si quieres */}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat: Puedes dejarlo vacío por ahora o agregar el futuro chat */}
      <div style={{ flex: 1 }}>
        <h2>Chat</h2>
        <p>Funcionalidad de chat pendiente de implementar...</p>
      </div>
    </div>
  );
}

export default Mensajeria;
