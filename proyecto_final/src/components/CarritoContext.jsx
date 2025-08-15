import { createContext, useState, useContext, useEffect } from "react";

const CarritoContext = createContext();

export const useCarrito = () => useContext(CarritoContext);

export const CarritoProvider = ({ children }) => {
  const [carrito, setCarrito] = useState([]);
  const [usuario, setUsuario] = useState(null);

  // Cargar usuario y carrito al iniciar
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("usuario"));
    if (storedUser?.id) {
      setUsuario(storedUser);
      fetchCarrito(storedUser.id);
    }
  }, []);

  const fetchCarrito = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/carrito", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      // Mapear productos con la información completa
      const carritoMapeado = data.productos.map((p) => ({
        ...p.productoId,
        cantidad: p.cantidad,
      }));
      setCarrito(carritoMapeado);
    } catch (err) {
      console.error("Error cargando carrito:", err);
    }
  };

  const agregarProducto = async (producto) => {
    if (!usuario) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/carrito/agregar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productoId: producto._id }),
      });
      const data = await res.json();
      // Mapear de nuevo con info completa
      const carritoMapeado = data.productos.map((p) => ({
        ...p.productoId,
        cantidad: p.cantidad,
      }));
      setCarrito(carritoMapeado);
    } catch (err) {
      console.error("Error agregando producto al carrito:", err);
    }
  };

  const quitarProducto = async (id) => {
    if (!usuario) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:5000/api/carrito/eliminar/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      const carritoMapeado = data.productos.map((p) => ({
        ...p.productoId,
        cantidad: p.cantidad,
      }));
      setCarrito(carritoMapeado);
    } catch (err) {
      console.error("Error eliminando producto del carrito:", err);
    }
  };

  const vaciarCarrito = async () => {
    if (!usuario) return;
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:5000/api/carrito/vaciar", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setCarrito([]);
    } catch (err) {
      console.error("Error vaciando carrito:", err);
    }
  };

  return (
    <CarritoContext.Provider
      value={{ carrito, agregarProducto, quitarProducto, vaciarCarrito }}
    >
      {children}
    </CarritoContext.Provider>
  );
};
