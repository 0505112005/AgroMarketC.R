import React from "react";
import { useNotificaciones } from "../context/NotificacionesContext";

const Mensajeria = () => {
  const { notificaciones, cargando } = useNotificaciones();

  if (cargando) return <p>Cargando...</p>;

  return (
    <div className="mensajeria-container">
      {notificaciones.slice(0,5).map((n) => (
        <div key={n._id} className="notificacion">
          <p><strong>{n.usuario}</strong> le dio like a tu producto <strong>{n.producto}</strong></p>
          <span>{new Date(n.createdAt).toLocaleString()}</span>
        </div>
      ))}
      {notificaciones.length > 5 && <button onClick={() => alert("Mostrar todas las notificaciones")}>Ver todas</button>}
    </div>
  );
};

export default Mensajeria;
