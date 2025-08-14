// src/context/NotificacionesContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

const NotificacionesContext = createContext();

export const NotificacionesProvider = ({ children }) => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [cargando, setCargando] = useState(false);

  const obtenerToken = () => localStorage.getItem("token");

  const cargarNotificaciones = useCallback(async () => {
    const token = obtenerToken();
    if (!token) {
      setNotificaciones([]);
      return;
    }

    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/api/notificaciones", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Error ${res.status}: ${text}`);
      }

      const data = await res.json();
      setNotificaciones(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error cargando notificaciones:", error);
      setNotificaciones([]);
    }
    setCargando(false);
  }, []);

  // Polling cada 5 segundos
  useEffect(() => {
    cargarNotificaciones();
    const interval = setInterval(cargarNotificaciones, 5000);
    return () => clearInterval(interval);
  }, [cargarNotificaciones]);

  return (
    <NotificacionesContext.Provider value={{ notificaciones, cargando, cargarNotificaciones }}>
      {children}
    </NotificacionesContext.Provider>
  );
};

export const useNotificaciones = () => useContext(NotificacionesContext);
