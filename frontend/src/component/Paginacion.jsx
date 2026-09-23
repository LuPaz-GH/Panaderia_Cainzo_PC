// component/Paginacion.jsx
import React from "react";
import "./Paginacion.css";

// Devuelve [1, "…", 4, 5, 6, "…", 12] para no mostrar cien botones
const numerosVisibles = (actual, total) => {
  const paginas = new Set([1, total, actual - 1, actual, actual + 1]);
  const lista = [...paginas].filter((n) => n >= 1 && n <= total).sort((a, b) => a - b);
  const conPuntos = [];
  lista.forEach((n, i) => {
    if (i > 0 && n - lista[i - 1] > 1) conPuntos.push("…");
    conPuntos.push(n);
  });
  return conPuntos;
};

function Paginacion({ paginacion, onCambiarPagina, onCambiarLimite, opcionesLimite = [10, 20, 50] }) {
  if (!paginacion) return null;
  const { pagina, limite, total, totalPaginas } = paginacion;
  const desde = total === 0 ? 0 : (pagina - 1) * limite + 1;
  const hasta = Math.min(pagina * limite, total);

  return (
    <nav className="paginacion" aria-label="Paginación">
      <span className="paginacion-info">
        Mostrando <strong>{desde}–{hasta}</strong> de <strong>{total}</strong>
      </span>

      <div className="paginacion-botones">
        <button
          className="paginacion-btn"
          onClick={() => onCambiarPagina(pagina - 1)}
          disabled={pagina <= 1}
          aria-label="Página anterior"
        >
          ‹
        </button>
        {numerosVisibles(pagina, totalPaginas).map((n, i) =>
          n === "…" ? (
            <span key={`p${i}`} className="paginacion-puntos">…</span>
          ) : (
            <button
              key={n}
              className={`paginacion-btn ${n === pagina ? "activa" : ""}`}
              onClick={() => onCambiarPagina(n)}
              aria-current={n === pagina ? "page" : undefined}
            >
              {n}
            </button>
          )
        )}
        <button
          className="paginacion-btn"
          onClick={() => onCambiarPagina(pagina + 1)}
          disabled={pagina >= totalPaginas}
          aria-label="Página siguiente"
        >
          ›
        </button>
      </div>

      {onCambiarLimite && (
        <label className="paginacion-limite">
          Ver
          <select value={limite} onChange={(e) => onCambiarLimite(Number(e.target.value))}>
            {opcionesLimite.map((n) => (
              <option key={n} value={n}>{n}</option>
            ))}
          </select>
          por página
        </label>
      )}
    </nav>
  );
}

export default Paginacion;
