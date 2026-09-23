// Menupincipal.jsx
import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import "./MenuPrincipal.css";
import { cerrarSesion, esDueno, obtenerSesion } from "../services/api";

function MenuPrincipal() {
  const navigate = useNavigate();
  const usuario = obtenerSesion();
  const dueno = esDueno();

  const handleNavigate = (path) => {
    navigate(path);
  };
  const handleCerrarSesion = () => {
    cerrarSesion();
    navigate("/login");
  };

  // "tipo": destacada = tarjeta grande, ancha = ocupa dos columnas, normal = una columna.
  // "tono": color de fondo del ícono.
  const menuItems = [
    {
      id: 7,
      title: "Ventas",
      icon: "💰",
      description: "Registrar y consultar ventas",
      path: "/ventas",
      tipo: "destacada",
    },
    {
      id: 2,
      title: "Productos",
      icon: "🥖",
      description: "Agregar y editar productos",
      path: "/gestion-productos",
      tono: "#fbe3c8",
    },
    {
      id: 3,
      title: "Insumos",
      icon: "🌾",
      description: "Control de materias primas",
      path: "/actualizar-insumos",
      tono: "#eef0d2",
    },
    {
      id: 6,
      title: "Clientes",
      icon: "👥",
      description: "Administrar base de clientes",
      path: "/clientes",
      tono: "#f7dcd6",
    },
    {
      id: 5,
      title: "Tablas",
      icon: "📊",
      description: "Ver reportes y estadísticas",
      path: "/tablas",
      tono: "#dde8f0",
    },
    {
      id: 1,
      title: "Empleados",
      icon: "👤",
      description: "Administrar usuarios del sistema",
      path: "/gestion-empleado",
      tipo: "ancha",
      tono: "#ece0f2",
    },
    {
      id: 8,
      title: "Papelera",
      icon: "🗑️",
      description: dueno ? "Restaurar lo que se eliminó" : "Restaurar lo que eliminaste",
      path: "/papelera",
      tipo: dueno ? "" : "ancha",
      tono: "#e3e7e4",
    },
    // El historial de cambios solo lo ve el administrador (Dueño)
    ...(dueno
      ? [
          {
            id: 9,
            title: "Historial",
            icon: "📜",
            description: "Quién creó, editó o eliminó",
            path: "/historial",
            tono: "#f3e6d0",
          },
        ]
      : []),
    // "Recuperar cuenta" fue quitado por el grupo (ver historial de git)
  ];

  return (
    <div className="menu-page">
      <div className="menu-contenedor">
        <header className="menu-header">
          <div className="menu-marca">
            <div className="menu-logo" aria-hidden="true">🥐</div>
            <div>
              <h1 className="menu-saludo">¡Bienvenido a Cainzo System!</h1>
              <p className="menu-sub">
                {usuario ? `Hola, ${usuario.nombre_usuario} · ` : ""}¿Qué vamos a hacer hoy?
              </p>
            </div>
          </div>
          <button className="menu-salir" onClick={handleCerrarSesion}>
            <span aria-hidden="true">🚪</span> Cerrar sesión
          </button>
        </header>

        <div className="menu-grid">
          {menuItems.map((item, i) => (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.path)}
              className={`menu-card ${item.tipo ?? ""}`}
              style={{ "--tono": item.tono, animationDelay: `${0.08 + i * 0.06}s` }}
            >
              <div className="menu-icono" aria-hidden="true">{item.icon}</div>

              <div className="menu-texto">
                {item.tipo === "destacada" && (
                  <span className="menu-etiqueta">Lo más usado</span>
                )}
                <h3>{item.title}</h3>
                <p>{item.description}</p>
                {item.tipo === "destacada" && (
                  <span className="menu-accion">
                    Ir a ventas <span aria-hidden="true">→</span>
                  </span>
                )}
              </div>

              {item.tipo !== "destacada" && (
                <span className="menu-flecha" aria-hidden="true">→</span>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MenuPrincipal;
