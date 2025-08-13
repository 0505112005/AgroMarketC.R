import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token"); // o usuario.id según tu auth

  // Usamos useCallback para que useEffect no dé warning
  const cargarFavoritos = useCallback(async () => {
    if (!token) {
      setFavoritos([]);
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No autorizado o error en la API");
      const data = await res.json();
      setFavoritos(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setFavoritos([]);
    }
    setCargando(false);
  }, [token]);

  const toggleFavorito = async (producto) => {
    if (!token) {
      alert("Debe iniciar sesión para gestionar favoritos.");
      return false;
    }

    const favoritoExistente = favoritos.find(
      (fav) => fav.productoId?._id === producto._id
    );

    try {
      if (favoritoExistente) {
        await fetch(`http://localhost:5000/api/favoritos/${favoritoExistente.productoId._id}`, {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        await fetch("http://localhost:5000/api/favoritos", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ productoId: producto._id }),
        });
      }
      await cargarFavoritos();
      return true;
    } catch (error) {
      console.error("Error actualizando favoritos:", error);
      return false;
    }
  };

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]); // ahora no da warning

  return (
    <FavoritosContext.Provider value={{ favoritos, cargando, toggleFavorito }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
