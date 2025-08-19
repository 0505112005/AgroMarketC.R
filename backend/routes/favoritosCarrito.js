import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css"; // Asegúrate de tener estilos

const Inicio = () => {
  const [favoritos, setFavoritos] = useState([]);
  const usuarioId = "68917ee7e9b743dfd720a229"; // Reemplaza con el ID dinámico si tienes login

  useEffect(() => {
    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favoritos-carrito/${usuarioId}`);
        if (!res.ok) throw new Error("Error al obtener favoritos");
        const data = await res.json();
        setFavoritos(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchFavoritos();
  }, [usuarioId]);

  if (favoritos.length === 0) return <p>Cargando favoritos...</p>;

  return (
    <div className="inicio-container">
      <h2>Tus Productos Favoritos</h2>
      <div className="favoritos-grid">
        {favoritos
          .filter(fav => fav.productoId) // filtramos los que no tienen productoId
          .map(fav => (
            <div className="card" key={fav._id}>
              <img
                src={fav.productoId.imagen || "https://via.placeholder.com/300x200?text=Sin+imagen"}
                alt={fav.productoId.nombre}
                className="card-img"
              />
              <div className="card-body">
                <h3>{fav.productoId.nombre}</h3>
                <p>{fav.productoId.descripcion}</p>
                <p>Precio: ₡{fav.productoId.precio}</p>
                <p>Agregado {fav.cantidadAgregados} veces</p>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Inicio;
