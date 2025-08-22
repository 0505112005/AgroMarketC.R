// Importamos Outlet de react-router-dom para renderizar las rutas hijas
import { Outlet } from "react-router-dom";
// Importamos el componente Sidebar
import Sidebar from "./Sidebar";
// Importamos los estilos específicos del layout
import "../estilos/AppLayout.css";

// Componente principal que define la estructura de la app con sidebar y contenido
export default function AppLayout() {
  return (
    // Contenedor principal del layout
    <div className="layout">
      
      {/* Sección lateral del layout donde va el Sidebar */}
      <aside className="layout__sidebar">
        <Sidebar /> {/* Componente Sidebar que contiene la navegación */}
      </aside>
      
      {/* Sección principal de contenido donde se renderizan las rutas hijas */}
      <main className="layout__content">
        <Outlet /> {/* Renderiza el componente correspondiente a la ruta actual */}
      </main>
    </div>
  );
}
