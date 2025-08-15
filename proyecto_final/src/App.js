// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";

// Layout con sidebar fijo
import AppLayout from "./components/AppLayout";
import RutaVendedor from "./components/RutaVendedor"; // ⬅ Nuevo protector

// Páginas
import Landing from "./pages/Landing";
import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import Vender from "./pages/Vender";
import Perfil from "./pages/Perfil";
import Carrito from "./pages/Carrito";
import MisProductos from "./pages/MisProductos";
import Mensajeria from "./pages/Mensajeria";
import SolicitudVendedor from "./pages/SolicitudVendedor";
import Register from "./pages/Register";
import Login from "./pages/Login";

export default function App() {
  return (
    <Routes>
      {/* Página principal (sin sidebar) */}
      <Route index element={<Landing />} />

      {/* Rutas CON sidebar persistente */}
      <Route element={<AppLayout />}>
        <Route path="inicio" element={<Inicio />} />
        <Route path="catalogo" element={<Catalogo />} />
        
        {/* Ruta protegida para vendedores */}
        <Route 
          path="vender" 
          element={
            <RutaVendedor>
              <Vender />
            </RutaVendedor>
          } 
        />

        <Route path="perfil" element={<Perfil />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="mis-productos" element={<MisProductos />} />
        <Route path="mensajeria" element={<Mensajeria />} />
        <Route path="solicitud-vendedor" element={<SolicitudVendedor />} />
      </Route>

      {/* Rutas SIN sidebar (públicas) */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Helpers / redirecciones */}
      <Route path="/Landing" element={<Navigate to="/" replace />} />

      {/* 404 */}
      <Route path="*" element={<div style={{ padding: 24 }}>404 — No encontrado</div>} />
    </Routes>
  );
}
