// component/avisos/Avisos.jsx
// Reemplazo lindo de alert() y confirm() del navegador.
//
//   const ok = await confirmar({ tipo: "peligro", titulo: "¿Eliminar?", destacado: "Cañoncito" });
//   await avisar({ tipo: "error", titulo: "No se pudo guardar", mensaje: "..." });
//   notificar({ tipo: "exito", titulo: "Producto creado", accion: { texto: "Deshacer", onClick } });
import React, { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import "./Avisos.css";

// ---------- Íconos ----------
const trazos = {
  peligro: (
    <>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12" />
      <path d="M9 7V4h6v3" />
    </>
  ),
  restaurar: (
    <>
      <path d="M4 10a8 8 0 1 1 2.3 5.7" />
      <path d="M4 4v6h6" />
    </>
  ),
  exito: <path d="M5 12.5l4.5 4.5L19 7.5" />,
  error: (
    <>
      <path d="M12 8v5" />
      <path d="M12 16.5v.5" />
      <path d="M10.3 3.9L2.6 17.5A2 2 0 0 0 4.3 20.5h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 7.5v.5" />
    </>
  ),
  editar: (
    <>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </>
  ),
};

const Icono = ({ tipo }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {trazos[tipo] || trazos.info}
  </svg>
);

// ---------- Tarjeta de confirmación / aviso ----------
function Dialogo({ tipo, titulo, mensaje, destacado, nota, textoAceptar, textoCancelar, soloAceptar, onCerrar }) {
  const [saliendo, setSaliendo] = useState(false);
  const aceptarRef = useRef(null);
  const cerrado = useRef(false);

  const cerrar = (valor) => {
    if (cerrado.current) return;
    cerrado.current = true;
    setSaliendo(true);
    setTimeout(() => onCerrar(valor), 170);
  };

  useEffect(() => {
    aceptarRef.current?.focus();
    const onKey = (e) => {
      if (e.key === "Escape") cerrar(soloAceptar ? true : false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      className={`av-fondo ${saliendo ? "saliendo" : ""}`}
      onMouseDown={(e) => e.target === e.currentTarget && cerrar(soloAceptar ? true : false)}
    >
      <div className={`av-card ${tipo}`} role="alertdialog" aria-modal="true" aria-labelledby="av-titulo" aria-describedby="av-mensaje">
        <div className="av-icono">
          <Icono tipo={tipo} />
        </div>
        <h2 id="av-titulo" className="av-titulo">{titulo}</h2>
        {destacado && <div className="av-destacado">{destacado}</div>}
        {mensaje && <p id="av-mensaje" className="av-mensaje">{mensaje}</p>}
        {nota && (
          <p className="av-nota">
            <Icono tipo="info" />
            {nota}
          </p>
        )}
        <div className="av-botones">
          {!soloAceptar && (
            <button type="button" className="av-btn secundario" onClick={() => cerrar(false)}>
              {textoCancelar}
            </button>
          )}
          <button type="button" ref={aceptarRef} className="av-btn principal" onClick={() => cerrar(true)}>
            {textoAceptar}
          </button>
        </div>
      </div>
    </div>
  );
}

const mostrarDialogo = (props) =>
  new Promise((resolve) => {
    const focoAnterior = document.activeElement;
    const contenedor = document.createElement("div");
    document.body.appendChild(contenedor);
    const root = createRoot(contenedor);
    const onCerrar = (valor) => {
      root.unmount();
      contenedor.remove();
      focoAnterior?.focus?.();
      resolve(valor);
    };
    root.render(<Dialogo {...props} onCerrar={onCerrar} />);
  });

// Devuelve true si la persona acepta, false si cancela
export const confirmar = (opciones) =>
  mostrarDialogo({ tipo: "peligro", textoAceptar: "Aceptar", textoCancelar: "Cancelar", ...opciones });

// Aviso con un solo botón (errores, información)
export const avisar = (opciones) =>
  mostrarDialogo({ tipo: "info", textoAceptar: "Entendido", soloAceptar: true, ...opciones });

// ---------- Notificaciones (esquina superior derecha) ----------
let notificaciones = [];
let siguienteId = 0;
const oyentes = new Set();
const emitir = () => oyentes.forEach((f) => f());
const suscribir = (f) => {
  oyentes.add(f);
  return () => oyentes.delete(f);
};
const leer = () => notificaciones;

const quitar = (id) => {
  notificaciones = notificaciones.map((n) => (n.id === id ? { ...n, saliendo: true } : n));
  emitir();
  setTimeout(() => {
    notificaciones = notificaciones.filter((n) => n.id !== id);
    emitir();
  }, 220);
};

function Notificaciones() {
  const lista = useSyncExternalStore(suscribir, leer);
  return (
    <div className="av-toasts" role="status" aria-live="polite">
      {lista.map((n) => (
        <div key={n.id} className={`av-toast ${n.tipo} ${n.saliendo ? "saliendo" : ""}`}>
          <div className="av-toast-icono">
            <Icono tipo={n.tipo} />
          </div>
          <div className="av-toast-texto">
            <strong>{n.titulo}</strong>
            {n.mensaje && <span>{n.mensaje}</span>}
          </div>
          {n.accion && (
            <button
              type="button"
              className="av-toast-accion"
              onClick={() => {
                quitar(n.id);
                n.accion.onClick();
              }}
            >
              {n.accion.texto}
            </button>
          )}
          <button type="button" className="av-toast-cerrar" onClick={() => quitar(n.id)} aria-label="Cerrar">
            ×
          </button>
          <div className="av-toast-barra" style={{ animationDuration: `${n.duracion}ms` }} />
        </div>
      ))}
    </div>
  );
}

let contenedorMontado = false;
const montarNotificaciones = () => {
  if (contenedorMontado) return;
  contenedorMontado = true;
  const div = document.createElement("div");
  document.body.appendChild(div);
  createRoot(div).render(<Notificaciones />);
};

export const notificar = ({ tipo = "exito", titulo, mensaje, accion, duracion } = {}) => {
  montarNotificaciones();
  const id = ++siguienteId;
  const tiempo = duracion ?? (accion ? 6000 : 3500);
  notificaciones = [...notificaciones, { id, tipo, titulo, mensaje, accion, duracion: tiempo }];
  emitir();
  setTimeout(() => quitar(id), tiempo);
};
