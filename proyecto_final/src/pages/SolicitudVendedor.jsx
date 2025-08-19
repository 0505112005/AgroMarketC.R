// src/pages/SolicitudVendedor.jsx
import React, { useState } from "react";
import Swal from 'sweetalert2';
import "../estilos/SolicitudVendedor.css";

const SolicitudVendedor = () => {
  const [formulario, setFormulario] = useState({
    nombre: "",
    apellidos: "",
    correo: "",
    telefono: "",
    tipoProducto: "",
    experiencia: "",
    descripcion: "",
    terminos: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormulario({
      ...formulario,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formulario.terminos) {
      Swal.fire({
        icon: 'warning',
        title: '¡Atención!',
        text: 'Debes aceptar los términos y condiciones para continuar',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#2e7d32',
        customClass: {
          popup: 'swal-popup-agro',
          title: 'swal-title-agro',
          confirmButton: 'swal-button-agro'
        }
      });
      return;
    }
    
    console.log("Solicitud enviada:", formulario);
    
    // Mostrar SweetAlert de éxito
    Swal.fire({
      icon: 'success',
      title: '¡Solicitud Enviada!',
      html: `
        <div style="text-align: left; color: #2c3e50; line-height: 1.6;">
          <p><strong>¡Gracias por tu interés en AgroMarket!</strong></p>
          <p>📧 Hemos recibido tu solicitud correctamente</p>
          <p>⏰ Nuestro equipo la revisará en las próximas <strong>24-48 horas</strong></p>
          <p>📱 Te contactaremos a tu teléfono: <strong>${formulario.telefono}</strong></p>
          <p>✅ Si cumples con todos los requisitos, recibirás acceso inmediato a tu panel de vendedor</p>
        </div>
      `,
      confirmButtonText: '¡Perfecto!',
      confirmButtonColor: '#2e7d32',
      width: 600,
      customClass: {
        popup: 'swal-popup-agro',
        title: 'swal-title-agro',
        htmlContainer: 'swal-html-agro',
        confirmButton: 'swal-button-agro'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Resetear el formulario
        setFormulario({
          nombre: "",
          apellidos: "",
          correo: "",
          telefono: "",
          tipoProducto: "",
          experiencia: "",
          descripcion: "",
          terminos: false,
        });
      }
    });
  };

  const beneficios = [
    {
      icon: "💰",
      titulo: "Comisiones Competitivas",
      descripcion: "Obtén hasta un 85% de tus ventas con las tarifas más bajas del mercado."
    },
    {
      icon: "📱",
      titulo: "Plataforma Digital Avanzada",
      descripcion: "Herramientas de gestión, analytics en tiempo real y app móvil incluida."
    },
    {
      icon: "🚚",
      titulo: "Logística Integrada",
      descripcion: "Sistema de envíos automatizado con múltiples transportistas aliados."
    },
    {
      icon: "📈",
      titulo: "Marketing Digital",
      descripcion: "Promoción gratuita en redes sociales y posicionamiento SEO optimizado."
    },
    {
      icon: "🛡️",
      titulo: "Protección de Pagos",
      descripcion: "Garantía total en transacciones y seguros de responsabilidad civil."
    },
    {
      icon: "👥",
      titulo: "Soporte 24/7",
      descripcion: "Equipo de atención especializado disponible todos los días del año."
    }
  ];

  const requisitos = [
    "Ser mayor de 18 años y tener documentación vigente",
    "Experiencia mínima de 6 meses en agricultura o comercio",
    "Productos certificados y con trazabilidad completa",
    "Cumplir normativas sanitarias y de calidad 2025",
    "Capacidad de suministro constante y confiable",
    "Compromiso con prácticas agrícolas sostenibles",
    "Disponibilidad para capacitaciones digitales mensuales"
  ];

  return (
    <div className="solicitud-vendedor">
      <div className="solicitud-container">
        {/* Header */}
        <div className="solicitud-header">
          <h1>Únete a AgroMarket</h1>
          <p>Conecta con miles de compradores y haz crecer tu negocio agrícola en 2025</p>
        </div>

        {/* Estadísticas */}
        <div className="stats-section">
          <div className="stat-card">
            <div className="stat-number">15,000+</div>
            <div className="stat-label">Vendedores Activos</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">2.5M</div>
            <div className="stat-label">Transacciones/Mes</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">98%</div>
            <div className="stat-label">Satisfacción Cliente</div>
          </div>
        </div>

        {/* Grid principal */}
        <div className="solicitud-grid">
          {/* Beneficios */}
          <div className="beneficios-section">
            <h2>Beneficios Exclusivos 2025</h2>
            <ul className="beneficios-lista">
              {beneficios.map((beneficio, index) => (
                <li key={index} className="beneficio-item">
                  <span className="beneficio-icon">{beneficio.icon}</span>
                  <div className="beneficio-content">
                    <h3>{beneficio.titulo}</h3>
                    <p>{beneficio.descripcion}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Requisitos */}
          <div className="requisitos-section">
            <h2>Requisitos 2025</h2>
            <ul className="requisitos-lista">
              {requisitos.map((requisito, index) => (
                <li key={index} className="requisito-item">
                  <span className="requisito-check">✓</span>
                  <span className="requisito-text">{requisito}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Formulario */}
        <div className="formulario-section">
          <div className="formulario-header">
            <h2>Solicita tu Acceso</h2>
            <p>Completa el formulario y nuestro equipo te contactará en máximo 48 horas</p>
          </div>

          <form onSubmit={handleSubmit} className="solicitud-form">
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="nombre">Nombres *</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className="form-input"
                  placeholder="Ingresa tus nombres"
                  value={formulario.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="apellidos">Apellidos *</label>
                <input
                  type="text"
                  id="apellidos"
                  name="apellidos"
                  className="form-input"
                  placeholder="Ingresa tus apellidos"
                  value={formulario.apellidos}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="correo">Correo Electrónico *</label>
                <input
                  type="email"
                  id="correo"
                  name="correo"
                  className="form-input"
                  placeholder="ejemplo@correo.com"
                  value={formulario.correo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="telefono">Teléfono/WhatsApp *</label>
                <input
                  type="tel"
                  id="telefono"
                  name="telefono"
                  className="form-input"
                  placeholder="+57 300 123 4567"
                  value={formulario.telefono}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="tipoProducto">Tipo de Productos *</label>
                <select
                  id="tipoProducto"
                  name="tipoProducto"
                  className="form-select"
                  value={formulario.tipoProducto}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona una categoría</option>
                  <option value="frutas">Frutas Frescas</option>
                  <option value="verduras">Verduras y Hortalizas</option>
                  <option value="granos">Granos y Cereales</option>
                  <option value="lacteos">Productos Lácteos</option>
                  <option value="carnes">Carnes y Aves</option>
                  <option value="procesados">Alimentos Procesados</option>
                  <option value="otros">Otros Productos</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="experiencia">Años de Experiencia *</label>
                <select
                  id="experiencia"
                  name="experiencia"
                  className="form-select"
                  value={formulario.experiencia}
                  onChange={handleChange}
                  required
                >
                  <option value="">Selecciona tu experiencia</option>
                  <option value="0-1">Menos de 1 año</option>
                  <option value="1-3">1-3 años</option>
                  <option value="3-5">3-5 años</option>
                  <option value="5-10">5-10 años</option>
                  <option value="10+">Más de 10 años</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="descripcion">Describe tu negocio y productos *</label>
              <textarea
                id="descripcion"
                name="descripcion"
                className="form-textarea"
                placeholder="Cuéntanos sobre tu experiencia, tipos de cultivos, capacidad de producción, certificaciones que posees, etc."
                value={formulario.descripcion}
                onChange={handleChange}
                required
              />
            </div>


            <button type="submit" className="submit-button">
              Enviar Solicitud
            </button>
          </form>

          <div className="info-adicional">
            <h3>🚀 Proceso de Aprobación Rápido</h3>
            <p>
              Una vez recibida tu solicitud, nuestro equipo de especialistas la revisará en un máximo de 48 horas. 
              Si cumples con todos los requisitos, recibirás acceso inmediato a tu panel de vendedor y podrás comenzar 
              a vender el mismo día.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SolicitudVendedor;
