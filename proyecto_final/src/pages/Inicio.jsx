import React, { useEffect, useState } from "react";
import "../estilos/Inicio.css";
import { useNavigate } from "react-router-dom";
import { useCarrito } from "../components/CarritoContext";

const Inicio = () => {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [pedidos, setPedidos] = useState([]);
  const [favoritos, setFavoritos] = useState([]);
  const [productosDestacados, setProductosDestacados] = useState([]);
  const [actividadReciente, setActividadReciente] = useState([]);
  const navigate = useNavigate();
  const { carrito = [] } = useCarrito();

  // Cargar usuario del localStorage sólo una vez
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");

    try {
      if (storedUser && storedUser !== "undefined") {
        setUser(JSON.parse(storedUser));
      } else {
        setUser(null); // No hay usuario válido
      }
    } catch (error) {
      console.error("Error al parsear usuario desde localStorage:", error);
      setUser(null);
    }

    setLoadingUser(false);
  }, []);

  // Redirigir a login solo si ya terminó de cargar y no hay usuario
  useEffect(() => {
    if (!loadingUser && !user) {
      navigate("/login");
    }
  }, [loadingUser, user, navigate]);

  // Fetch datos cuando hay usuario
  useEffect(() => {
    if (!user?.id) return;

    const fetchPedidos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/pedidos/comprador/${user.id}`);
        if (!res.ok) {
          setPedidos([]);
          return;
        }
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch {
        setPedidos([]);
      }
    };

    const fetchFavoritos = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/favoritos?userId=${user.id}`);
        if (!res.ok) {
          setFavoritos([]);
          return;
        }
        const data = await res.json();
        setFavoritos(Array.isArray(data) ? data : []);
      } catch {
        setFavoritos([]);
      }
    };

    const fetchProductosDestacados = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/productos/destacados`);
        if (!res.ok) {
          setProductosDestacados([]);
          return;
        }
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
    fetchFavoritos();
    fetchProductosDestacados();
    fetchActividadReciente();
  }, [user?.id]);

  if (loadingUser) {
    // Mientras carga el usuario, muestra un simple mensaje o spinner
    return <div>Cargando usuario...</div>;
  }

  const nombreUsuario = user?.nombre || "Invitado";
  const totalGastado = pedidos.reduce((acc, pedido) => acc + (pedido.total || 0), 0);

  return (
    <div className="container">
      {/* resto de tu JSX igual */}
      <header className="header">
        <h1>🌿 Agro Market</h1>
        <button
          className="btn-catalogo"
          onClick={() => navigate("/catalogo")}
          type="button"
        >
          Ver Catálogo
        </button>
      </header>

      <div className="content">
        <aside className="sidebar">
          <div className="logo">
            <h2>🌿 AgroMarket</h2>
          </div>

          <div className="usuario">
            <img
              src="https://www.w3schools.com/howto/img_avatar.png"
              alt="Avatar"
              className="avatar"
            />
            <div>
              <p className="nombre">{nombreUsuario}</p>
              <p className="rol">{user?.rol || ""}</p>
              <button
                className="btn-perfil"
                onClick={() => navigate("/perfil")}
                type="button"
              >
                👤 Perfil
              </button>
            </div>
          </div>

          <nav className="nav-menu">
            <ul>
              <li>
                <button onClick={() => navigate("/inicio")} type="button">
                  📊 Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/catalogo")} type="button">
                  📦 Catálogo
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/carrito")} type="button">
                  🛒 Carrito ({carrito.length})
                </button>
              </li>
              <li>
                <button onClick={() => navigate("/mis-productos")} type="button">
                  🧺 Mis Productos
                </button>
              </li>
              {user?.rol === "comprador" && (
                <li>
                  <button
                    onClick={() => navigate("/solicitud-vendedor")}
                    type="button"
                  >
                    📩 Quiero Vender
                  </button>
                </li>
              )}
            </ul>
          </nav>
        </aside>

        <main className="main">
          <section className="saludo">
            <h2>Bienvenido, {nombreUsuario}!</h2>
            <p>Descubre los mejores productos agrícolas</p>
          </section>

          <section className="estadisticas">
            <div className="estadistica-card">
              <div className="estadistica-valor">{pedidos.length}</div>
              <div className="estadistica-label">Pedidos Realizados</div>
              <div className="estadistica-icon" aria-label="Pedidos">
                📦
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-valor">
                ₡{totalGastado.toLocaleString()}
              </div>
              <div className="estadistica-label">Total Gastado</div>
              <div className="estadistica-icon" aria-label="Total Gastado">
                💰
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-valor">{carrito.length}</div>
              <div className="estadistica-label">En Carrito</div>
              <div className="estadistica-icon" aria-label="Carrito">
                🛒
              </div>
            </div>
            <div className="estadistica-card">
              <div className="estadistica-valor">{favoritos.length}</div>
              <div className="estadistica-label">Favoritos</div>
              <div className="estadistica-icon" aria-label="Favoritos">
                ❤️
              </div>
            </div>
          </section>

          <section className="bottom-secciones">
            <div className="productos-destacados cuadro">
              <h3>Productos Destacados</h3>
              <div className="productos-grid">
                {productosDestacados.length === 0 && (
                  <p>No hay productos destacados.</p>
                )}
                {productosDestacados.map((prod) => (
                  <div key={prod._id} className="card">
                    <img
                      src={prod.imagen || "https://via.placeholder.com/150"}
                      alt={prod.nombre}
                      className="card-imagen"
                    />
                    <h4>{prod.nombre}</h4>
                    <p className="descripcion">{prod.descripcion || ""}</p>
                    <p className="precio">₡{prod.precio?.toLocaleString() || "-"}</p>
                    <p className="vendedor">
                      Por {prod.vendedor || "Desconocido"}
                    </p>
                    <button
                      className="ver"
                      onClick={() => navigate(`/producto/${prod._id}`)}
                      type="button"
                    >
                      Ver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="actividad-reciente cuadro">
              <h3>Actividad Reciente</h3>
              <ul>
                {actividadReciente.length === 0 && (
                  <li>No hay actividad reciente.</li>
                )}
                {actividadReciente.map((act) => (
                  <li key={act.id}>
                    <strong>{act.texto}</strong>
                    <br />
                    <small>{act.tiempo}</small>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </main>
      </div>

      <footer className="footer">
        <p>&copy; 2025 Mercado Orgánico</p>
      </footer>
    </div>
  );
};

export default Inicio;
