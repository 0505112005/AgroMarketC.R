// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// Páginas
import Landing from "./pages/Landing";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Vender from "./pages/Vender";
import Perfil from "./pages/Perfil";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login"; 
import Carrito from "./pages/Carrito";
import MisProductos from "./pages/MisProductos";
import SolicitudVendedor from "./pages/SolicitudVendedor";
import Catalogo from "./pages/Catalogo";
import Mensajeria from "./pages/Mensajeria"; 

// Contextos
import { CarritoProvider } from "./components/CarritoContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import { NotificacionesProvider } from "./context/NotificacionesContext";

function App() {
  return (
    <FavoritosProvider>
      <CarritoProvider>
        <NotificacionesProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Navigate to="/Landing" />} />
              <Route path="/Landing" element={<Landing />} />
              <Route path="/inicio" element={<Inicio />} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/vender" element={<Vender />} />
              <Route path="/carrito" element={<Carrito />} />
              <Route path="/mis-productos" element={<MisProductos />} />
              <Route path="/solicitud-vendedor" element={<SolicitudVendedor />} />
              <Route path="/catalogo" element={<Catalogo />} />
              <Route path="/mensajeria" element={<Mensajeria />} />
              <Route path="/perfil" element={  <Perfil />  } />

            </Routes>
          </Router>
        </NotificacionesProvider>
      </CarritoProvider>
    </FavoritosProvider>
  );
}

export default App;
