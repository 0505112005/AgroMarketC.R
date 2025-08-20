import React, { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "../estilos/Landing.css";
import "../estilos/ProductsMobile.css";
import { FaStar } from 'react-icons/fa';
import { FaAppleAlt, FaCarrot, FaSeedling, FaLeaf } from 'react-icons/fa';
const categories = [
  {
    name: 'Frutas Frescas',
    products: '2,500+ productos',
    icon: <FaAppleAlt />,
    color: '#ff7043',
    backgroundImage: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Verduras Orgánicas',
    products: '1,800+ productos',
    icon: <FaCarrot />,
    color: '#66bb6a',
    backgroundImage: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Granos y Cereales',
    products: '900+ productos',
    icon: <FaSeedling />,
    color: '#fdd835',
    backgroundImage: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&h=300&fit=crop&crop=center',
  },
  {
    name: 'Hierbas Aromáticas',
    products: '600+ productos',
    icon: <FaLeaf />,
    color: '#26a69a',
    backgroundImage: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&h=300&fit=crop&crop=center',
  },
];

const reviews = [
  {
    name: 'María González',
    role: 'Chef Ejecutiva',
    text: 'La calidad de los productos es excepcional. Mis clientes notan la diferencia.',
  },
  {
    name: 'Carlos Rodríguez',
    role: 'Agricultor',
    text: 'Agro Market me ha permitido llegar a más clientes y obtener mejores precios.',
  },
  {
    name: 'Ana Jiménez',
    role: 'Consumidora',
    text: 'Productos frescos y entrega puntual. Mi familia está muy satisfecha.',
  },
];

const productosDemo = [
  { id: 1, titulo: "Tomates Orgánicos", precio: "₡3,500", tag: "Orgánico", img: "https://walmartcr.vtexassets.com/arquivos/ids/530600-1200-900?v=638419994295830000&width=1200&height=900&aspect=true" },
  { id: 2, titulo: "Bananos Premium",  precio: "₡2,800", tag: "Premium",  img: "https://walmartcr.vtexassets.com/arquivos/ids/380406-1200-900?v=638103010359230000&width=1200&height=900&aspect=true" },
  { id: 3, titulo: "Café Especial",    precio: "₡15,000", tag: "Orgánico", img: "https://walmartcr.vtexassets.com/arquivos/ids/508873-1200-900?v=638416210236570000&width=1200&height=900&aspect=true" },
  { id: 4, titulo: "Aguacates Hass",   precio: "₡4,200",  tag: "Orgánico", img: "https://walmartcr.vtexassets.com/arquivos/ids/530468-1200-900?v=638419993606200000&width=1200&height=900&aspect=true" },
];

export default function Landing() {
  const revealRef = useRef([]);

  // --- scroll reveal
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && e.target.classList.add("reveal-show")),
      { threshold: 0.12 }
    );
    revealRef.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const setRef = (el) => revealRef.current.push(el);

  return (
    <div className="landing">
      {/* NAVBAR */}
      <header className="navbar blur">
        <div className="brand">
          <strong> 🌿 AgroMarket</strong>
          <small>Fresh & Sustainable</small>
        </div>

        <nav className="menu">
          <a href="#caracteristicas">Características</a>
          <a href="#productos">Productos</a>
          <a href="#testimonios">Testimonios</a>
        </nav>

        <div className="actions">
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </header>

      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal" ref={setRef}>
          <div className="badge shimmer">#1 Marketplace Agrícola en Costa Rica</div>
          <h1 className="title">
            Del Campo a tu Mesa
          </h1>
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
                    <img src={p.img} alt={p.titulo} loading="lazy" />
                    <div className="product-badge">{p.tag}</div>
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
      
      {/* CARACTERÍSTICAS */}
      <section id="caracteristicas" className="section reveal" ref={setRef}>
        <h3>¿Por qué AgroMarket?</h3>
        <div className="featureGrid">
          <div className="feature">
            <div className="icon">🔗</div>
            <h4>Trazabilidad total</h4>
            <p>Desde la finca hasta tu mesa con datos verificados.</p>
          </div>
          <div className="feature">
            <div className="icon">🛡️</div>
            <h4>Pagos y logística</h4>
            <p>Checkout seguro y envíos integrados en todo el país.</p>
          </div>
          <div className="feature">
            <div className="icon">🌱</div>
            <h4>Productores locales</h4>
            <p>Mejores precios para ellos, mejores productos para ti.</p>
          </div>
        </div>
      </section>

      <section className="featured">
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
                {cat.icon}
              </div>
              <h3>{cat.name}</h3>
              <span className="count">{cat.products}</span>
            </div>
          </div>
        ))}
      </div>
    </section>

      

      {/* TESTIMONIOS (placeholder) */}
      <section className="testimonials">
      <h2 className="fade-in">💬 Lo que dicen nuestros Clientes</h2>
      <p className="fade-in delay-1">Miles de usuarios confían en nosotros cada día</p>
      <div className="cards">
        {reviews.map((review, index) => (
          <div className={`card slide-up delay-${index}`} key={index}>
            <div className="stars">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} color="#fbc02d" />
              ))}
            </div>
            <p className="text">"{review.text}"</p>
            <h3>{review.name}</h3>
            <span className="role">{review.role}</span>
          </div>
        ))}
      </div>
    </section>

      <footer className="footer">
       🌿 © {new Date().getFullYear()} AgroMarket 
      </footer>
    </div>
  );
}
