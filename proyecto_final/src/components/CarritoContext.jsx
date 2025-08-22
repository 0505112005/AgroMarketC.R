// src/components/CarritoContext.jsx

// Importamos React y hooks necesarios
import React, { createContext, useContext, useState, useEffect } from "react";

// Creamos el contexto de carrito
const CarritoContext = createContext();

// Hook personalizado para usar el carrito más fácilmente
export const useCarrito = () => useContext(CarritoContext);

// Provider que envuelve la app y maneja el estado del carrito
export const CarritoProvider = ({ children }) => {
  // Estado del carrito inicializado desde localStorage si existe
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar el carrito en localStorage cada vez que cambie
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Función para agregar un producto al carrito
  const agregarProducto = async (producto, usuarioId, token) => {
    // Actualiza el carrito localmente
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id); // Verifica si ya está
      if (existe) {
        // Si existe, aumenta la cantidad
        return prev.map((p) =>
          p._id === producto._id
            ? { ...p, cantidad: p.cantidad + 1 } 
            : p
        );
      }
      // Si no existe, lo agrega con cantidad 1
      return [...prev, { ...producto, cantidad: 1 }]; 
    });

    // Enviar al backend para sincronizar favoritos/carrito del usuario
    try {
      const response = await fetch(
        "http://localhost:5000/api/favoritos-carrito/agregar",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            usuarioId,
            productoId: producto._id,
          }),
        }
      );

      // Manejo de errores de backend
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error agregando favorito:", errorData.error);
      } else {
        const favorito = await response.json();
        console.log("Favorito agregado correctamente:", favorito);
      }
    } catch (error) {
      console.error("Error al actualizar favoritos:", error);
    }
  };

  // Función para restar cantidad de un producto en el carrito
  const restarProducto = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0) // Elimina productos con cantidad 0
    );
  };

  // Función para quitar un producto completamente
  const quitarProducto = (id) =>
    setCarrito((prev) => prev.filter((p) => p._id !== id));

  // Función para vaciar todo el carrito
  const vaciarCarrito = () => setCarrito([]);

  // Proveer todas las funciones y estado del carrito a los hijos
  return (
    <CarritoContext.Provider
      value={{
        carrito,
        agregarProducto,
        restarProducto,
        quitarProducto,
        vaciarCarrito,
      }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
