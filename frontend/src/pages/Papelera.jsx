// pages/Papelera.jsx
// Lo que se eliminó (borrado lógico). Cada empleado ve y restaura lo suyo; el Dueño, todo.
import React, { useCallback, useEffect, useRef, useState } from "react";
import Paginacion from "../component/Paginacion";
import papeleraService from "../services/papeleraService";
import { esDueno } from "../services/api";
import { confirmar, avisar, notificar } from "../component/avisos/Avisos";
import "./Auditoria.css";

const TIPOS = [
  { tipo: "producto", etiqueta: "Productos", icono: "🥖" },
  { tipo: "insumo", etiqueta: "Insumos", icono: "🌾" },
  { tipo: "cliente", etiqueta: "Clientes", icono: "👥" },
  { tipo: "usuario", etiqueta: "Empleados", icono: "👤" },
];

export const formatearFecha = (valor) =>
  valor
    ? new Date(valor).toLocaleString("es-AR", { dateStyle: "short", timeStyle: "short" })
    : "";

function Papelera() {
  const dueno = esDueno();
  const [tipo, setTipo] = useState("producto");
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(10);
  const [busqueda, setBusqueda] = useState("");
  const [texto, setTexto] = useState("");
  const [items, setItems] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [restaurando, setRestaurando] = useState(null);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    const result = await papeleraService.listar(tipo, { pagina, limite, buscar: busqueda });
    if (result.success) {
      setItems(result.data);
      setPaginacion(result.paginacion);
      if (pagina > result.paginacion.totalPaginas) setPagina(result.paginacion.totalPaginas);
    } else {
      setError(result.error);
    }
    setCargando(false);
  }, [tipo, pagina, limite, busqueda]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Buscar 300 ms después de la última tecla
  const temporizador = useRef();
  const onBuscar = (valor) => {
    setTexto(valor);
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setBusqueda(valor.trim());
      setPagina(1);
    }, 300);
  };
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const cambiarTipo = (nuevo) => {
    setTipo(nuevo);
    setPagina(1);
    setTexto("");
    setBusqueda("");
  };

  const tipoActual = TIPOS.find((t) => t.tipo === tipo);

  const handleRestaurar = async (item) => {
    const ok = await confirmar({
      tipo: "restaurar",
      titulo: "¿Restaurar este registro?",
      destacado: item.nombre,
      mensaje: `Va a volver a aparecer en ${tipoActual.etiqueta}.`,
      textoAceptar: "Sí, restaurar",
      textoCancelar: "Cancelar",
    });
    if (!ok) return;

    setRestaurando(item.id);
    const result = await papeleraService.restaurar(tipo, item.id);
    setRestaurando(null);
    if (result.success) {
      notificar({ tipo: "restaurar", titulo: result.message || "Restaurado", mensaje: item.nombre });
      cargar();
    } else {
      avisar({ tipo: "error", titulo: "No se pudo restaurar", mensaje: result.error });
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">🗑️ PAPELERA</h2>
        </div>

        <div className="aud-panel">
          <div className="aud-aviso">
            <span aria-hidden="true">ℹ️</span>
            {dueno
              ? "Como administrador ves todo lo que se eliminó y podés restaurar cualquier cosa."
              : "Acá ves lo que eliminaste vos. Si borraste algo por error, restauralo con un clic."}
          </div>

          <div className="aud-tabs" role="tablist">
            {TIPOS.map((t) => (
              <button
                key={t.tipo}
                role="tab"
                aria-selected={t.tipo === tipo}
                className={`aud-tab ${t.tipo === tipo ? "activa" : ""}`}
                onClick={() => cambiarTipo(t.tipo)}
              >
                <span aria-hidden="true">{t.icono}</span> {t.etiqueta}
              </button>
            ))}
          </div>

          <div className="aud-buscar">
            <span aria-hidden="true">🔍</span>
            <input
              type="text"
              placeholder={`Buscar en ${tipoActual.etiqueta.toLowerCase()} eliminados...`}
              value={texto}
              onChange={(e) => onBuscar(e.target.value)}
            />
          </div>

          {error && <div className="aud-error">{error}</div>}

          <div className="aud-tabla-wrap">
            <table className="aud-tabla">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Eliminado por</th>
                  <th>Fecha</th>
                  <th style={{ textAlign: "right" }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {cargando && items.length === 0 ? (
                  <tr><td colSpan={4} className="aud-vacio">Cargando...</td></tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="aud-vacio">
                      {busqueda ? "No hay resultados para esa búsqueda." : "No hay nada eliminado acá 🎉"}
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {item.nombre}
                        <span className="aud-sub">#{item.id}</span>
                      </td>
                      <td>{item.eliminado_por_nombre || "—"}</td>
                      <td>{formatearFecha(item.eliminado_en)}</td>
                      <td style={{ textAlign: "right" }}>
                        <button
                          className="aud-btn-restaurar"
                          onClick={() => handleRestaurar(item)}
                          disabled={restaurando === item.id}
                        >
                          {restaurando === item.id ? "Restaurando..." : "↩ Restaurar"}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <Paginacion
            paginacion={paginacion}
            onCambiarPagina={setPagina}
            onCambiarLimite={(n) => {
              setLimite(n);
              setPagina(1);
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default Papelera;
