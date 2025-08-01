import { createContext, useState, useContext } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);

  const agregarProducto = (producto) => {
    const existe = carrito.find((item) => item._id === producto._id);
    if (existe) {
      setCarrito(
        carrito.map((item) =>
          item._id === producto._id ? { ...item, cantidad: item.cantidad + 1 } : item
        )
      );
    } else {
      setCarrito([...carrito, { ...producto, cantidad: 1 }]);
    }
  };

  const quitarProducto = (id) => {
    setCarrito(carrito.filter((item) => item._id !== id));
  };

  const vaciarCarrito = () => {
    setCarrito([]);
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, quitarProducto, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
