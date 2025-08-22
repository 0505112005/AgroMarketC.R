import React, { useEffect, useRef, useState } from "react"; // Importamos React y hooks: useState, useEffect y useRef
import { Link } from "react-router-dom"; // Importamos Link para navegación interna
import "../estilos/Landing.css"; // Estilos principales de la landing
import "../estilos/ProductsMobile.css"; // Estilos de productos en vista móvil
import { FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa'; // Iconos de estrellas y flechas

// Datos de categorías
const categories = [
  {
    name: 'Frutas Frescas',
    products: '2,500+ productos',
    color: '#ff7043',
    backgroundImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Verduras Orgánicas',
    products: '1,800+ productos',
    color: '#66bb6a',
    backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Granos y Cereales',
    products: '900+ productos',
    color: '#fdd835',
    backgroundImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Hierbas',
    products: '600+ productos',
    color: '#26a69a',
    backgroundImage: 'https://www.lavanguardia.com/files/image_990_484/uploads/2022/02/19/621138969f642.jpeg',
  },
];

// Datos de testimonios
const reviews = [
  {
    name: 'María González',
    role: 'Chef Ejecutiva',
    text: 'La calidad de los productos es excepcional. Mis clientes notan la diferencia.',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Agricultor',
    text: 'AgroMarket me ha permitido llegar a más clientes y obtener mejores precios.',
  },
  {
    name: 'Ana Jiménez',
    role: 'Consumidora',
    text: 'Productos frescos y entrega puntual. Mi familia está muy satisfecha.',
  },
  {
    name: 'Roberto Chaves',
    role: 'Dueño de Restaurante',
    text: 'Como restaurantero, valoro la frescura y trazabilidad de cada producto que recibo.',
  },
  {
    name: 'Patricia Mora',
    role: 'Madre de Familia',
    text: 'Mis hijos ahora comen más vegetales porque saben deliciosos. ¡Productos de primera!',
  },
  {
    name: 'Luis Fernández',
    role: 'Productor Orgánico',
    text: 'La plataforma es muy fácil de usar y me ha ayudado a expandir mi negocio.',
  },
  {
    name: 'Carmen Solís',
    role: 'Nutricionista',
    text: 'Recomiendo AgroMarket a todos mis pacientes. La calidad nutricional es excepcional.',
  },
];

// Datos de productos de demostración
const productosDemo = [
  { id: 1, titulo: "Tomates Orgánicos", precio: "₡3,500", tag: "Orgánico", img: "https://walmartcr.vtexassets.com/arquivos/ids/530600-1200-900?v=638419994295830000&width=1200&height=900&aspect=true" },
  { id: 2, titulo: "Bananos Premium", precio: "₡2,800", tag: "Premium", img: "https://walmartcr.vtexassets.com/arquivos/ids/380406-1200-900?v=638103010359230000&width=1200&height=900&aspect=true" },
  { id: 3, titulo: "Café Especial", precio: "₡15,000", tag: "Orgánico", img: "https://walmartcr.vtexassets.com/arquivos/ids/508873-1200-900?v=638416210236570000&width=1200&height=900&aspect=true" },
];

export default function Landing() {
  const revealRef = useRef([]); // Referencias para elementos que aparecerán con animación
  const [currentReview, setCurrentReview] = useState(0); // Estado para el testimonio actual

  // --- efecto para animación de aparición al hacer scroll
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal-show")),
      { threshold: 0.12 } // Porcentaje de visibilidad para activar animación
    );
    revealRef.current.forEach((el) => el && io.observe(el)); // Observamos cada referencia
    return () => io.disconnect(); // Limpiamos observador al desmontar componente
  }, []);

  // --- efecto para auto-scroll de testimonios
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length); // Cambia el testimonio cada 5s
    }, 5000);
    return () => clearInterval(interval); // Limpiamos intervalo al desmontar
  }, []);

  const setRef = (el) => revealRef.current.push(el); // Función para guardar referencias

  // Funciones para navegar entre testimonios
  const nextReview = () => {
    setCurrentReview((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="navbar blur">
        <div className="brand">
          <strong> 🌿 AgroMarket</strong>
          <small>Fresh & Sustainable</small>
        </div>

        <nav className="menu">
          <a href="#agro">Historia</a>
          <a href="#categorias">Categorias</a>
          <a href="#testimonios">Testimonios</a>
        </nav>

        <div className="actions">
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link> {/* Botón a login */}
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal" ref={setRef}>
          <div className="badge">#1 Marketplace Agrícola en Costa Rica</div>
          <h1 className="title">Del Campo a tu Mesa</h1>
          <p className="subtitle">
            Conectamos productores y consumidores con tecnología de vanguardia.
            Productos frescos, trazables y sostenibles con entrega garantizada.
          </p>

          <ul className="trust reveal" ref={setRef}>
            <li>Pagos Seguros</li>
            <li>Entregas en 24-48h</li>
            <li>Soporte Local</li>
          </ul>
        </div>

        <div className="hero-right" id="productos">
          <div className="products-showcase">
            <div className="grid">
              {productosDemo.map((p, i) => (
                <article
                  key={p.id}
                  className={`product-card float-${(i % 3) + 1} reveal`}
                  ref={setRef}
                >
                  <div className="product-image">
                    <img src={p.img} alt={p.titulo} loading="lazy" /> {/* Imagen del producto */}
                    <div className="product-badge">{p.tag}</div> {/* Tag del producto */}
                  </div>
                  <div className="product-info">
                    <h4 className="product-title">{p.titulo}</h4>
                    <div className="product-price-wrapper">
                      <span className="product-price">{p.precio}</span>
                      <span className="price-unit">por unidad</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORÍAS DESTACADAS */}
      <section id="categorias" className="featured">
        <h2 className="fade-in"> Categorías Destacadas</h2>
        <p className="fade-in delay-1">
          Explora nuestra selección de productos frescos y de calidad premium
        </p>
        <div className="category-grid">
          {categories.map((cat, index) => (
            <div
              className={`category-card slide-up delay-${index}`}
              key={index}
              style={{
                backgroundImage: `linear-gradient(rgba(243, 236, 236, 0.6), rgba(255, 254, 254, 0.4)), url(${cat.backgroundImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat'
              }}
            >
              <div className="category-overlay">
                <div className="icon" style={{ color: cat.color }}>
                  {cat.icon} {/* Icono opcional de categoría */}
                </div>
                <h3>{cat.name}</h3>
                <span className="count">{cat.products}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* NUESTRA HISTORIA */}
      <section id="agro" className="story-section reveal" ref={setRef}>
        <div className="story-container">
          <div className="story-hero">
            <div className="story-badge">
              <span className="badge-text">🌱 Desde 2025</span>
            </div>
            <h2 className="story-title">Nuestra Historia</h2>
            <div className="story-subtitle">Del sueño universitario a la realidad nacional AgroMarket nació en Pérez Zeledón, Costa Rica, como el proyecto de un grupo de universitarios que soñaba con conectar directamente a los agricultores locales con las familias de todo el país. Notamos que muchos productores tenían excelentes cosechas, pero pocas oportunidades para promocionarse y vender sus productos en línea. Así creamos esta plataforma digital, sencilla y confiable. AgroMarket es más que una página web: es un puente entre el campo y tu mesa. Con cada compra apoyás a productores locales, impulsás la economía de la región y recibís alimentos cultivados con esfuerzo y dedicación.</div>

          </div>

          {/* SECCIÓN DE CARACTERÍSTICAS */}
          <div className="why-section">
            <h3 className="why-title">¿Por qué AgroMarket?</h3>
            <div className="features-grid">
              <div className="feature-card modern reveal" ref={setRef}>
                <div className="feature-icon">
                  <div className="icon-bg">🔗</div>
                </div>
                <h4>Trazabilidad Total</h4>
                <p>Desde la finca hasta tu mesa con datos verificados y tecnología blockchain.</p>
                <div className="feature-badge">Innovación 2025</div>
              </div>
              <div className="feature-card modern reveal" ref={setRef}>
                <div className="feature-icon">
                  <div className="icon-bg">🛡️</div>
                </div>
                <h4>Pagos & Logística</h4>
                <p>Checkout seguro con IA y envíos integrados en todo el país con tracking en tiempo real.</p>
                <div className="feature-badge">Seguridad Máxima</div>
              </div>
              <div className="feature-card modern reveal" ref={setRef}>
                <div className="feature-icon">
                  <div className="icon-bg">🌱</div>
                </div>
                <h4>Productores Locales</h4>
                <p>Mejores precios para ellos, mejores productos para ti. Comercio justo y sostenible.</p>
                <div className="feature-badge">Impacto Social</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section id="testimonios" className="testimonials-carousel">
        <h2 className="fade-in">💬 Lo que dicen nuestros Clientes</h2>
        <p className="fade-in delay-1">Miles de usuarios confían en nosotros cada día</p>
        
        <div className="carousel-container">
          <div className="testimonial-card active">
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color="#fbc02d" /> // Iconos de estrellas
              ))}
            </div>
            <span className="testimonial-text">"{reviews[currentReview].text}"</span>
            <h3 className="testimonial-name">{reviews[currentReview].name}</h3>
            <span className="testimonial-role">{reviews[currentReview].role}</span>
          </div>
        </div>
        
        <div className="carousel-indicators">
          {reviews.map((_, index) => (
            <button
              key={index}
              className={`indicator ${index === currentReview ? 'active' : ''}`}
              onClick={() => setCurrentReview(index)} // Cambia el testimonio al hacer click
            />
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="footer">
        🌿 © {new Date().getFullYear()} AgroMarket
      </footer>
    </div>
  );
}
