// src/components/UseFavoritosCarrito.js

// Importamos hooks de React
import { useState, useEffect } from "react";

// Creamos un custom hook llamado useFavoritosCarrito
// Este hook maneja la lógica de obtener los productos favoritos de un usuario
export const useFavoritosCarrito = (usuarioId) => {
  // Estado para almacenar los productos favoritos
  const [favoritos, setFavoritos] = useState([]);
  
  // Estado para indicar si los datos están cargando
  const [cargando, setCargando] = useState(true);

  // Función para cargar los favoritos desde el backend
  const cargarFavoritos = async () => {
    // Si no hay usuarioId, no hace nada
    if (!usuarioId) return;
    
    // Indicamos que estamos cargando
    setCargando(true);
    
    try {
      // Hacemos fetch al endpoint de favoritos de este usuario
      const res = await fetch(`http://localhost:5000/api/favoritos-carrito/${usuarioId}`);
      
      // Convertimos la respuesta a JSON
      const data = await res.json();
      
      // Guardamos solo el objeto producto de cada favorito
      setFavoritos(data.map((f) => f.productoId));
    } catch (err) {
      // Si ocurre un error, lo mostramos por consola y dejamos la lista vacía
      console.error("Error cargando favoritos", err);
      setFavoritos([]);
    }

    // Indicamos que terminó la carga
    setCargando(false);
  };

  // useEffect para cargar los favoritos cuando el usuarioId cambie
  useEffect(() => {
    cargarFavoritos();
  }, [usuarioId]);

  // Retornamos los favoritos, estado de carga y la función para recargar favoritos
  return { favoritos, cargando, cargarFavoritos };
};
