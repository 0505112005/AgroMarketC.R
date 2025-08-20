// src/components/CarritoContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();
export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  // Guardar carrito en localStorage cada vez que cambia
  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  const agregarProducto = async (producto, usuarioId, token) => {
    // Actualizar carrito local
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        return prev.map((p) =>
          p._id === producto._id
            ? { ...p, cantidad: p.cantidad + 1 } 
            : p
        );
      }
      return [...prev, { ...producto, cantidad: 1 }]; 
    });

    // Enviar al backend
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

  const restarProducto = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const quitarProducto = (id) =>
    setCarrito((prev) => prev.filter((p) => p._id !== id));

  const vaciarCarrito = () => setCarrito([]);

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
