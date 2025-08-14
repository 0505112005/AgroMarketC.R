// src/components/UseFavoritosCarrito.js
import { useState, useEffect } from "react";

export const useFavoritosCarrito = (usuarioId) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(true);

  const cargarFavoritos = async () => {
    if (!usuarioId) return;
    setCargando(true);
    try {
      const res = await fetch(`http://localhost:5000/api/favoritos-carrito/${usuarioId}`);
      const data = await res.json();
      setFavoritos(data.map((f) => f.productoId));
    } catch (err) {
      console.error("Error cargando favoritos", err);
      setFavoritos([]);
    }
    setCargando(false);
  };

  useEffect(() => {
    cargarFavoritos();
  }, [usuarioId]);

  return { favoritos, cargando, cargarFavoritos };
};
