import React, { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../estilos/Landing.css";

const productosDemo = [
  { id: 1, titulo: "Tomates Orgánicos", precio: "₡3,500", tag: "Orgánico", img: "/images/tomates.jpg" },
  { id: 2, titulo: "Bananos Premium",  precio: "₡2,800", tag: "Premium",  img: "/images/bananos.jpg" },
  { id: 3, titulo: "Café Especial",    precio: "₡15,000", tag: "Orgánico", img: "/images/cafe.jpg" },
  { id: 4, titulo: "Aguacates Hass",   precio: "₡4,200",  tag: "Orgánico", img: "/images/aguacate.jpg" },
];

export default function Landing() {
  const navigate = useNavigate();
  const revealRef = useRef([]);

  // --- usuario desde localStorage (con try/catch)
  let user = null;
  try {
    const raw = localStorage.getItem("usuario");
    user = raw ? JSON.parse(raw) : null;
  } catch {
    user = null;
  }
  const nombreUsuario = user?.nombre ?? "Invitado";
  const rolUsuario    = user?.rol ?? "invitado";

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
          <img src="/logo.svg" alt="AgroMarket" />
          <div>
            <strong>AgroMarket</strong>
            <small>Fresh & Sustainable</small>
          </div>
        </div>

        <nav className="menu">
          <a href="#caracteristicas">Características</a>
          <a href="#productos">Productos</a>
          <a href="#testimonios">Testimonios</a>
        </nav>

        <div className="actions">
          <Link to="/explorar" className="btn btn-light">Explorar</Link>
          <Link to="/login" className="btn btn-primary">Iniciar Sesión</Link>
        </div>
      </header>

      

      {/* HERO */}
      <section className="hero">
        <div className="hero-left reveal" ref={setRef}>
          <div className="badge shimmer">#1 Marketplace Agrícola en Costa Rica</div>
          <h1 className="title">
            Del <span>Campo</span> a tu <span>Mesa</span>
          </h1>
          <p className="subtitle">
            Conectamos productores y consumidores con tecnología de vanguardia.
            Productos frescos, trazables y sostenibles con entrega garantizada.
          </p>
          <div className="cta">
            <Link to="/explorar" className="btn btn-primary btn-lg">Explorar Productos →</Link>
            <button type="button" className="btn btn-light btn-lg">▶ Ver Demo</button>
          </div>

          <ul className="trust reveal" ref={setRef}>
            <li>Pagos Seguros</li>
            <li>Entregas en 24‑48h</li>
            <li>Soporte Local</li>
          </ul>
        </div>

        <div className="hero-right" id="productos">
          <div className="grid">
            {productosDemo.map((p, i) => (
              <article
                key={p.id}
                className={`card float-${(i % 3) + 1} reveal`}
                ref={setRef}
              >
                <div className="imgWrap">
                  <img src={p.img} alt={p.titulo} loading="lazy" />
                  <span className="chip">{p.tag}</span>
                </div>
                <div className="cardBody">
                  <h4>{p.titulo}</h4>
                  <strong className="price">{p.precio}</strong>
                </div>
              </article>
            ))}
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

      {/* TESTIMONIOS (placeholder) */}
      <section id="testimonios" className="section reveal" ref={setRef}>
        <h3>Lo que dicen nuestros clientes</h3>
        <div className="testis">
          <blockquote>“La calidad es otra cosa. Llegó fresco y rápido.” <span>— Karla M.</span></blockquote>
          <blockquote>“Por fin sé de dónde viene lo que compro.” <span>— Diego R.</span></blockquote>
        </div>
      </section>

      <footer className="footer">
        © {new Date().getFullYear()} AgroMarket · Hecho con 🌱
      </footer>
    </div>
  );
}
