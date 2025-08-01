import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Register from "./pages/Register";
import Inicio from "./pages/Inicio";
import Vender from "./pages/Vender";
import Perfil from "./pages/Perfil";
import RutaProtegida from "./components/RutaProtegida";
import Login from "./pages/Login"; // Asegúrate de que el path sea correcto
import Carrito from "./pages/Carrito";
import MisProductos from "./pages/MisProductos";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/inicio" />} />
        <Route path="/inicio" element={<Inicio />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/vender" element={<Vender />} />
        <Route path="/carrito" element={<Carrito/>} />
        <Route path="/mis-productos" element={<MisProductos />} />


        <Route
          path="/perfil"
          element={
            <RutaProtegida>
              <Perfil />
            </RutaProtegida>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
