// src/components/CarritoContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState(() => {
    const stored = localStorage.getItem("carrito");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("carrito", JSON.stringify(carrito));
  }, [carrito]);

  // Agregar producto (si ya existe, suma cantidad)
  const agregarProducto = (producto) => {
    setCarrito((prev) => {
      const existe = prev.find((p) => p._id === producto._id);
      if (existe) {
        return prev.map((p) =>
          p._id === producto._id
            ? { ...p, cantidad: p.cantidad + producto.cantidad }
            : p
        );
      }
      return [...prev, { ...producto, cantidad: producto.cantidad || 1 }];
    });
  };

  // Restar cantidad de un producto (o eliminar si queda 0)
  const restarProducto = (id) => {
    setCarrito((prev) =>
      prev
        .map((p) =>
          p._id === id ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  // Quitar producto completamente
  const quitarProducto = (id) => {
    setCarrito((prev) => prev.filter((p) => p._id !== id));
  };

  // Vaciar carrito
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
