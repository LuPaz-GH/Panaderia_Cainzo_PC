// pages/Historial.jsx
// Historial de cambios (auditoría): quién creó, editó, eliminó o restauró cada cosa. Solo Dueño.
import React, { Fragment, useCallback, useEffect, useState } from "react";
import Paginacion from "../component/Paginacion";
import { auditoriaService } from "../services/papeleraService";
import { esDueno } from "../services/api";
import { formatearFecha } from "./Papelera";
import "./Auditoria.css";

const SECCIONES = {
  producto: "Productos",
  insumo: "Insumos",
  cliente: "Clientes",
  usuario: "Empleados",
};

const ACCIONES = {
  CREAR: "Creó",
  EDITAR: "Editó",
  ELIMINAR: "Eliminó",
  RESTAURAR: "Restauró",
};

// Nombres lindos para los campos
const CAMPOS = {
  nombre: "Nombre",
  nombre_insumo: "Nombre",
  nombre_usuario: "Nombre",
  apellido: "Apellido",
  apellido_usuario: "Apellido",
  cantidad: "Cantidad",
  cantidad_minima: "Cantidad mínima",
  precio_unitario: "Precio",
  unidad_medida: "Unidad",
  proveedor: "Proveedor",
  telefono: "Teléfono",
  nro_telefono: "Teléfono",
  email: "Email",
  direccion: "Dirección",
  fecha_registro: "Fecha de registro",
  cantidad_compra: "Cantidad de compras",
  ultima_compra: "Última compra",
  rol: "Rol",
  contrasena_cambiada: "Contraseña cambiada",
};
const CAMPOS_ID = ["id_producto", "id_insumo", "id_cliente", "id_usuario"];

const leerJSON = (valor) => {
  if (!valor) return null;
  if (typeof valor === "object") return valor;
  try {
    return JSON.parse(valor);
  } catch {
    return null;
  }
};

const mostrarValor = (valor) => {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (typeof valor === "string" && /^\d{4}-\d{2}-\d{2}T/.test(valor)) return valor.slice(0, 10);
  return String(valor);
};

const nombreDelRegistro = (datos) => {
  if (!datos) return "";
  if (datos.nombre_insumo) return datos.nombre_insumo;
  if (datos.nombre_usuario) return `${datos.nombre_usuario} ${datos.apellido_usuario || ""}`.trim();
  if (datos.apellido) return `${datos.nombre} ${datos.apellido}`;
  return datos.nombre || "";
};

function DetalleCambios({ registro }) {
  const antes = leerJSON(registro.datos_antes) || {};
  const despues = leerJSON(registro.datos_despues) || {};

  if (registro.accion === "EDITAR") {
    const campos = [...new Set([...Object.keys(antes), ...Object.keys(despues)])].filter(
      (c) => !CAMPOS_ID.includes(c) && mostrarValor(antes[c]) !== mostrarValor(despues[c])
    );
    if (campos.length === 0) return <em>Se guardó sin cambios.</em>;
    return (
      <div className="aud-cambios">
        <span className="cab">Campo</span>
        <span className="cab">Antes</span>
        <span className="cab">Después</span>
        {campos.map((c) => (
          <Fragment key={c}>
            <span className="campo">{CAMPOS[c] || c}</span>
            <span className="antes">{mostrarValor(antes[c])}</span>
            <span className="despues">{mostrarValor(despues[c])}</span>
          </Fragment>
        ))}
      </div>
    );
  }

  // Crear / restaurar muestran cómo quedó; eliminar muestra cómo estaba
  const datos = registro.accion === "ELIMINAR" ? antes : despues;
  const campos = Object.keys(datos).filter((c) => !CAMPOS_ID.includes(c));
  return (
    <div className="aud-cambios simple">
      {campos.map((c) => (
        <Fragment key={c}>
          <span className="campo">{CAMPOS[c] || c}</span>
          <span>{mostrarValor(datos[c])}</span>
        </Fragment>
      ))}
    </div>
  );
}

const FILTROS_VACIOS = { tabla: "", accion: "", id_usuario: "", desde: "", hasta: "" };

function Historial() {
  const dueno = esDueno();
  const [filtros, setFiltros] = useState(FILTROS_VACIOS);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimite] = useState(15);
  const [registros, setRegistros] = useState([]);
  const [paginacion, setPaginacion] = useState(null);
  const [usuarios, setUsuarios] = useState([]);
  const [abierto, setAbierto] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);

  const cargar = useCallback(async () => {
    if (!dueno) return;
    setCargando(true);
    setError(null);
    const result = await auditoriaService.listar({ ...filtros, pagina, limite });
    if (result.success) {
      setRegistros(result.data);
      setPaginacion(result.paginacion);
    } else {
      setError(result.error);
    }
    setCargando(false);
  }, [dueno, filtros, pagina, limite]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  useEffect(() => {
    if (!dueno) return;
    auditoriaService.usuarios().then((r) => r.success && setUsuarios(r.data));
  }, [dueno]);

  const cambiarFiltro = (e) => {
    setFiltros({ ...filtros, [e.target.name]: e.target.value });
    setPagina(1);
    setAbierto(null);
  };

  if (!dueno) {
    return (
      <div className="p-5" style={{ minHeight: "100vh" }}>
        <div className="container-fluid">
          <div className="aud-panel">
            <div className="aud-vacio">🔒 Solo el administrador (Dueño) puede ver el historial de cambios.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">📜 HISTORIAL</h2>
        </div>

        <div className="aud-panel">
          <div className="aud-filtros">
            <label>
              Sección
              <select name="tabla" value={filtros.tabla} onChange={cambiarFiltro}>
                <option value="">Todas</option>
                {Object.entries(SECCIONES).map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </label>
            <label>
              Acción
              <select name="accion" value={filtros.accion} onChange={cambiarFiltro}>
                <option value="">Todas</option>
                {Object.entries(ACCIONES).map(([valor, texto]) => (
                  <option key={valor} value={valor}>{texto}</option>
                ))}
              </select>
            </label>
            <label>
              ¿Quién?
              <select name="id_usuario" value={filtros.id_usuario} onChange={cambiarFiltro}>
                <option value="">Todos</option>
                {usuarios.map((u) => (
                  <option key={u.id_usuario} value={u.id_usuario}>{u.usuario_nombre}</option>
                ))}
              </select>
            </label>
            <label>
              Desde
              <input type="date" name="desde" value={filtros.desde} onChange={cambiarFiltro} />
            </label>
            <label>
              Hasta
              <input type="date" name="hasta" value={filtros.hasta} onChange={cambiarFiltro} />
            </label>
            <button
              className="aud-btn"
              onClick={() => {
                setFiltros(FILTROS_VACIOS);
                setPagina(1);
              }}
            >
              Limpiar filtros
            </button>
          </div>

          {error && <div className="aud-error">{error}</div>}

          <div className="aud-tabla-wrap">
            <table className="aud-tabla">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>¿Quién?</th>
                  <th>Acción</th>
                  <th>Sección</th>
                  <th>Registro</th>
                  <th style={{ textAlign: "right" }}>Detalle</th>
                </tr>
              </thead>
              <tbody>
                {cargando && registros.length === 0 ? (
                  <tr><td colSpan={6} className="aud-vacio">Cargando...</td></tr>
                ) : registros.length === 0 ? (
                  <tr><td colSpan={6} className="aud-vacio">No hay movimientos con esos filtros.</td></tr>
                ) : (
                  registros.map((r) => {
                    const datos = leerJSON(r.datos_despues) || leerJSON(r.datos_antes);
                    const estaAbierto = abierto === r.id_auditoria;
                    return (
                      <Fragment key={r.id_auditoria}>
                        <tr>
                          <td>{formatearFecha(r.fecha)}</td>
                          <td>{r.usuario_nombre || "—"}</td>
                          <td><span className={`aud-badge ${r.accion}`}>{ACCIONES[r.accion]}</span></td>
                          <td>{SECCIONES[r.tabla] || r.tabla}</td>
                          <td>
                            {nombreDelRegistro(datos)}
                            <span className="aud-sub">#{r.id_registro}</span>
                          </td>
                          <td style={{ textAlign: "right" }}>
                            <button
                              className="aud-btn"
                              onClick={() => setAbierto(estaAbierto ? null : r.id_auditoria)}
                              aria-expanded={estaAbierto}
                            >
                              {estaAbierto ? "Ocultar" : "Ver cambios"}
                            </button>
                          </td>
                        </tr>
                        {estaAbierto && (
                          <tr className="aud-detalle">
                            <td colSpan={6}>
                              <DetalleCambios registro={r} />
                            </td>
                          </tr>
                        )}
                      </Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <Paginacion
            paginacion={paginacion}
            onCambiarPagina={(n) => {
              setPagina(n);
              setAbierto(null);
            }}
            onCambiarLimite={(n) => {
              setLimite(n);
              setPagina(1);
            }}
            opcionesLimite={[15, 30, 50]}
          />
        </div>
      </div>
    </div>
  );
}

export default Historial;
