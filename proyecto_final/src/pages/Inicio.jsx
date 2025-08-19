// src/pages/Inicio.jsx
import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";

const Inicio = () => {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [topFavoritos, setTopFavoritos] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);

  const navigate = useNavigate();
  const { carrito } = useCarrito();

  // Cargar usuario del localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.id ? parsedUser : null);
    } else {
      setUser(null);
    }
  }, []);

  // Fetch de datos cuando hay usuario
  useEffect(() => {
    if (!user?.id) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/comprador/${user.id}`);
        if (!res.ok) return setPedidos([]);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch {
        setPedidos([]);
      }
    };

    const fetchProductosDestacados = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/productos/destacados`);
        if (!res.ok) return setProductosDestacados([]);
        const data = await res.json();
        setProductosDestacados(Array.isArray(data) ? data : []);
      } catch {
        setProductosDestacados([]);
      }
    };

    const fetchActividadReciente = () => {
      setActividadReciente([
        { id: 1, texto: "Nuevo pedido recibido", tiempo: "Hace 2 horas" },
        { id: 2, texto: "Producto agregado al catálogo", tiempo: "Hace 5 horas" },
        { id: 3, texto: "Cliente nuevo registrado", tiempo: "Hace 1 día" },
        { id: 4, texto: "Pedido entregado exitosamente", tiempo: "Hace 2 días" },
      ]);
    };

    fetchPedidos();
    fetchProductosDestacados();
    fetchActividadReciente();
  }, [user?.id]);

  const nombreUsuario = user?.nombre || "Invitado";
  const totalGastado = pedidos.reduce((acc, pedido) => acc + (pedido.total || 0), 0);

  return (
    <div className="inicio-content">
      <header className="inicio-header">
        <h1>🌿 Dashboard - AgroMarket</h1>
        <button
          className="btn-catalogo"
          onClick={() => navigate("/catalogo")}
          type="button"
        >
          Ver Catálogo Completo
        </button>
      </header>

      <section className="saludo">
        <h2>¡Bienvenido, {nombreUsuario}!</h2>
        <p>Descubre los mejores productos agrícolas frescos y de calidad</p>
      </section>

      <section className="estadisticas">
        <div className="estadistica-card">
          <div className="estadistica-valor">{pedidos.length}</div>
          <div className="estadistica-label">Pedidos Realizados</div>
          <div className="estadistica-icon" aria-label="Pedidos">📦</div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-valor">₡{totalGastado.toLocaleString()}</div>
          <div className="estadistica-label">Total Gastado</div>
          <div className="estadistica-icon" aria-label="Total Gastado">💰</div>
        </div>
        <div className="estadistica-card">
          <div className="estadistica-valor">{carrito.length}</div>
          <div className="estadistica-label">En Carrito</div>
          <div className="estadistica-icon" aria-label="Carrito">🛒</div>
        </div>
      </section>

      <section className="bottom-secciones">
        <div className="productos-destacados cuadro">
          
          <h3>Productos Destacados</h3>
          <div className="productos-grid">
            {topFavoritos.length > 0 && (
          <>
            <h2 className="titulo">🌿 Tus productos más agregados</h2>
            <div className="productos-grid">
              {topFavoritos.map((fav) => {
                if (!fav?.productoId) return null;
               
              })}
            </div>
          </>
        )}
            {productosDestacados.length === 0 && (
              <p className="no-productos">No hay productos destacados disponibles.</p>
            )}
            {productosDestacados.map((prod) => (
              <div key={prod._id} className="card">
                <img
                  src={prod.imagen || "https://via.placeholder.com/150?text=Sin+Imagen"}
                  alt={prod.nombre}
                  className="card-imagen"
                />
                <h4>{prod.nombre}</h4>
                <p className="descripcion">{prod.descripcion || "Sin descripción"}</p>
                <p className="precio">₡{prod.precio?.toLocaleString() || "0"}</p>
                <p className="vendedor">Por {prod.vendedor || "Vendedor Desconocido"}</p>
                <button
                  className="ver"
                  onClick={() => navigate(`/producto/${prod._id}`)}
                  type="button"
                >
                  Ver Producto
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="actividad-reciente cuadro">
          <h3>Actividad Reciente</h3>
          <ul>
            {actividadReciente.length === 0 && (
              <li>No hay actividad reciente para mostrar.</li>
            )}
            {actividadReciente.map((act) => (
              <li key={act.id}>
                <strong>{act.texto}</strong>
                <br />
                <small className="tiempo">{act.tiempo}</small>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
