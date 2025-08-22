// src/pages/Inicio.jsx
import React, { useEffect, useState } from "react"; // Importa React y hooks para estado y efectos
import "../estilos/Inicio.css"; // Estilos específicos de la página
import { useNavigate } from "react-router-dom"; // Hook para navegación entre rutas
import { useCarrito } from "../components/CarritoContext"; // Contexto para manejar carrito
import Swal from "sweetalert2"; // Librería para alertas bonitas

const Inicio = () => {
  // Estados locales
  const [user, setUser] = useState(null); // Usuario actual
  const [pedidos, setPedidos] = useState([]); // Pedidos del usuario
  const [favoritos, setFavoritos] = useState([]); // Productos favoritos del usuario
  const [actividadReciente, setActividadReciente] = useState([]); // Actividad reciente del usuario
  const navigate = useNavigate(); // Hook para cambiar de ruta
  const { carrito, agregarProducto } = useCarrito(); // Obtener carrito y función para agregar producto

  // 📌 Cálculo del total del carrito
  const totalCarrito = carrito.reduce(
    (acc, p) => acc + p.precio * p.cantidad, // Suma precio * cantidad de cada producto
    0
  );

  // Cargar usuario del localStorage al montar el componente
  useEffect(() => {
    const storedUser = localStorage.getItem("usuario");
    if (storedUser && storedUser !== "undefined") {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser.id ? parsedUser : null); // Solo setea si tiene id válido
    } else {
      setUser(null);
    }
  }, []);

  // Traer pedidos, favoritos y actividad reciente cuando cambia el usuario
  useEffect(() => {
    if (!user?.id) return; // Si no hay usuario, salir

    // Función para traer pedidos del usuario desde la API
    const fetchPedidos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/pedidos/comprador/${user.id}`
        );
        if (!res.ok) return setPedidos([]); // Si falla, setea arreglo vacío
        const data = await res.json();
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching pedidos:", err);
        setPedidos([]);
      }
    };

    // Función para traer los productos favoritos del usuario
    const fetchFavoritos = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/favoritos-carrito/top/${user.id}`
        );
        if (!res.ok) return setFavoritos([]);
        const data = await res.json();
        const productosFavoritos = data
          .filter((item) => item?.productoId) // Solo items válidos
          .map((item) => ({
            _id: item.productoId._id,
            nombre: item.productoId.nombre,
            precio: item.productoId.precio,
            imagen: item.productoId.imagen,
            veces: item.cantidadAgregados, // Número de veces agregado al carrito
          }));

        // Ordenar por veces agregadas y tomar top 5
        const topFavoritos = productosFavoritos
          .sort((a, b) => b.veces - a.veces)
          .slice(0, 5);
        setFavoritos(topFavoritos);
      } catch (err) {
        console.error("Error fetching favoritos:", err);
        setFavoritos([]);
      }
    };

    // Función para simular actividad reciente
    const fetchActividadReciente = () => {
      setActividadReciente([
        { id: 1, texto: "Nuevo pedido recibido", tiempo: "Hace 2 horas" },
        { id: 2, texto: "Producto agregado al catálogo", tiempo: "Hace 5 horas" },
        { id: 3, texto: "Cliente nuevo registrado", tiempo: "Hace 1 día" },
        { id: 4, texto: "Pedido entregado exitosamente", tiempo: "Hace 2 días" },
      ]);
    };

    // Ejecutar funciones de carga
    fetchPedidos();
    fetchFavoritos();
    fetchActividadReciente();
  }, [user?.id]);

  const nombreUsuario = user?.nombre || "Invitado"; // Nombre a mostrar en saludo

  // Función para agregar producto al carrito con notificación
  const handleAgregarAlCarrito = async (producto) => {
    try {
      const token = localStorage.getItem("token"); // Token para autenticar
      await agregarProducto(producto, user?.id, token); // Llama función del contexto
      Swal.fire({
        title: "¡Agregado al carrito! 🛒",
        text: `${producto.nombre} se ha añadido a tu carrito`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    } catch (error) {
      console.error("Error al agregar producto:", error);
      Swal.fire({
        title: "Error",
        text: "No se pudo agregar el producto al carrito",
        icon: "error",
        timer: 2000,
        showConfirmButton: false,
        toast: true,
        position: "top-end",
      });
    }
  };

  return (
    <div className="inicio-content">
      {/* Header principal */}
      <header className="inicio-header">
        <div className="header-info">
          <h1>🌿 Dashboard </h1>
          <p className="header-subtitle">Panel de control personal</p>
        </div>
        <button
          className="btn-catalogo"
          onClick={() => navigate("/catalogo")} // Navega al catálogo
          type="button"
        >
          📱 Ver Catálogo
        </button>
      </header>

      {/* Saludo de bienvenida */}
      <section className="saludo-section">
        <div className="saludo-content">
          <h2>¡Bienvenido de vuelta, {nombreUsuario}! 👋</h2>
          <p>
            Descubre los mejores productos agrícolas frescos y de calidad premium
          </p>
        </div>
      </section>

      {/* Estadísticas de pedidos y carrito */}
      <section className="estadisticas-section">
        <div className="estadisticas-grid">
          {/* Total pedidos realizados */}
          <div className="estadistica-card pedidos">
            <div className="card-icon">📦</div>
            <div className="card-content">
              <div className="estadistica-valor">{pedidos.length}</div>
              <div className="estadistica-label">Pedidos Realizados</div>
            </div>
          </div>

          {/* Total monetario en carrito */}
          <div className="estadistica-card gastos">
            <div className="card-icon">💸</div>
            <div className="card-content">
              <div className="estadistica-valor">
                ₡{totalCarrito.toLocaleString()}
              </div>
              <div className="estadistica-label">Total en Carrito</div>
            </div>
          </div>

          {/* Número de productos en carrito */}
          <div className="estadistica-card carrito">
            <div className="card-icon">🛒</div>
            <div className="card-content">
              <div className="estadistica-valor">{carrito.length}</div>
              <div className="estadistica-label">Productos en Carrito</div>
            </div>
          </div>
        </div>
      </section>

      {/* Secciones principales: favoritos y actividad */}
      <div className="main-dashboard">
        {/* Productos Favoritos */}
        <section className="favoritos-section">
          <div className="section-header">
            <h3 className="section-title"> Tus Productos Favoritos</h3>
            <p className="section-subtitle">
              Los productos que más has agregado al carrito
            </p>
          </div>
          <div className="favoritos-container">
            {favoritos.length === 0 ? (
              // Estado vacío: no hay favoritos
              <div className="empty-state">
                <div className="empty-icon">🛍️</div>
                <h4>Aún no tienes productos favoritos</h4>
                <p>
                  Explora nuestro catálogo y comienza a agregar productos a tu
                  carrito
                </p>
                <button
                  className="btn-explorar"
                  onClick={() => navigate("/catalogo")}
                  type="button"
                >
                  Explorar Productos
                </button>
              </div>
            ) : (
              // Mostrar grid de productos favoritos
              <div className="productos-grid">
                {favoritos.map((prod) => (
                  <div key={prod._id} className="producto-card">
                    <div className="producto-imagen-container">
                      <img
                        src={
                          prod.imagen ||
                          "https://via.placeholder.com/200x150?text=Sin+Imagen"
                        } // Imagen del producto o placeholder
                        alt={prod.nombre}
                        className="producto-imagen"
                      />
                      <div className="producto-badge">{prod.veces}x</div> {/* Veces agregado */}
                    </div>
                    <div className="producto-info">
                      <h4 className="producto-titulo">{prod.nombre}</h4>
                      <p className="producto-precio">
                        ₡{prod.precio?.toLocaleString() || "0"}
                      </p>
                      <button
                        className="btn-agregar-carrito"
                        onClick={() =>
                          handleAgregarAlCarrito({
                            _id: prod._id,
                            nombre: prod.nombre,
                            precio: prod.precio,
                            imagen: prod.imagen,
                          }) // Agregar producto al carrito
                        }
                        type="button"
                      >
                        Agregar 🛒 
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Actividad Reciente */}
        <section className="actividad-section">
          <div className="section-header">
            <h3 className="section-title"> Actividad Reciente</h3>
            <p className="section-subtitle">
              Últimos movimientos en tu cuenta
            </p>
          </div>
          <div className="actividad-container">
            {actividadReciente.length === 0 ? (
              // Estado vacío: no hay actividad
              <div className="empty-activity">
                <p>No hay actividad reciente</p>
              </div>
            ) : (
              // Mostrar lista de actividad
              <div className="actividad-lista">
                {actividadReciente.map((act) => (
                  <div key={act.id} className="actividad-item">
                    <div className="actividad-icon">📝</div>
                    <div className="actividad-content">
                      <p className="actividad-texto">{act.texto}</p>
                      <span className="actividad-tiempo">{act.tiempo}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
};

export default Inicio; // Exporta el componente Inicio
