// src/context/FavoritosContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const FavoritosContext = createContext();

export const FavoritosProvider = ({ children }) => {
  const [favoritos, setFavoritos] = useState([]);
  const [cargando, setCargando] = useState(false);

  const obtenerToken = () => localStorage.getItem("token");

  const cargarFavoritos = useCallback(async () => {
    const token = obtenerToken();
    if (!token) {
      setFavoritos([]);
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/api/favoritos", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("No se pudieron cargar los favoritos");

      const data = await res.json();
      setFavoritos(data);
    } catch (error) {
      console.error("Error cargando favoritos:", error);
      setFavoritos([]);
    }
    setCargando(false);
  }, []);

  useEffect(() => {
    cargarFavoritos();
  }, [cargarFavoritos]);

  const toggleFavorito = async (producto) => {
    const token = obtenerToken();
    if (!token) return null;

    try {
      const res = await fetch(`http://localhost:5000/api/favoritos/${producto._id}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Error modificando favorito");
      }

      const data = await res.json();

      if (data.agregado) {
        setFavoritos((prev) => [...prev, data.producto]);
      } else {
        setFavoritos((prev) => prev.filter((f) => f._id !== data.producto._id));
      }

      return data.agregado;
    } catch (error) {
      console.error("Error modificando favorito:", error);
      return null;
    }
  };

  return (
    <FavoritosContext.Provider value={{ favoritos, cargando, toggleFavorito, cargarFavoritos }}>
      {children}
    </FavoritosContext.Provider>
  );
};

export const useFavoritos = () => useContext(FavoritosContext);
