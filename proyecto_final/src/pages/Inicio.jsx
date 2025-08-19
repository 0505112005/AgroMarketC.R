// src/pages/Inicio.jsx
import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";

const Inicio = () => {
  const [user, setUser] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
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

  // Traer pedidos, favoritos y actividad reciente del usuario
  useEffect(() => {
    if (!user?.id) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/comprador/${user.id}`);
        if (!res.ok) return setPedidos([]);
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        setPedidos([]);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favoritos-carrito/top/${user.id}`);
        if (!res.ok) return setFavoritos([]);
        const data = await res.json();

        const productosFavoritos = data
          .filter(item => item?.productoId)
          .map(item => ({
            _id: item.productoId._id,
            nombre: item.productoId.nombre,
            precio: item.productoId.precio,
            imagen: item.productoId.imagen,
            veces: item.cantidadAgregados
          }));

        // Ordenar por veces agregadas y tomar top 5
        const topFavoritos = productosFavoritos.sort((a, b) => b.veces - a.veces).slice(0, 5);
        setFavoritos(topFavoritos);
      } catch (err) {
        console.error("Error fetching favoritos:", err);
        setFavoritos([]);
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
    fetchFavoritos();
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

      <section className="main-secciones">
        {/* Productos Favoritos */}
        <div className="favoritos cuadro">
          <h3 className="titulo-seccion">🌿 Tus productos más agregados</h3>
          <div className="productos-grid favoritos-grid">
            {favoritos.length === 0 ? (
              <p className="no-productos">Todavía no tienes productos favoritos.</p>
            ) : (
              favoritos.map((prod) => (
                <div key={prod._id} className="card pequeña">
                  <img
                    src={prod.imagen || "https://via.placeholder.com/100?text=Sin+Imagen"}
                    alt={prod.nombre}
                    className="card-imagen"
                  />
                  <h4>{prod.nombre}</h4>
                  <p className="precio">₡{prod.precio?.toLocaleString() || "0"}</p>
                  <p className="veces">Añadido {prod.veces} veces</p>
                  <button
                    className="ver"
                    onClick={() => navigate(`/producto/${prod._id}`)}
                    type="button"
                  >
                    Ver Producto
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actividad Reciente */}
        <div className="actividad-reciente cuadro">
          <h3 className="titulo-seccion">📋 Actividad Reciente</h3>
          <ul>
            {actividadReciente.length === 0 ? (
              <li>No hay actividad reciente.</li>
            ) : (
              actividadReciente.map((act) => (
                <li key={act.id}>
                  <strong>{act.texto}</strong>
                  <br />
                  <small className="tiempo">{act.tiempo}</small>
                </li>
              ))
            )}
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Inicio;
