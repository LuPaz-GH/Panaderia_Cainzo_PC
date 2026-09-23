// utils/entidades.js
// Configuración y funciones comunes para las tablas con paginado, borrado lógico y restauración.
import { pool } from "../config/db.js";
import { registrarAuditoria } from "./auditoria.js";
import { esDueno } from "../middlewares/auth.js";

export const ENTIDADES = {
  producto: {
    tabla: "producto",
    id: "id_producto",
    etiqueta: "Producto",
    nombre: "t.nombre",
    columnas: "id_producto, nombre, cantidad, precio_unitario, unidad_medida, cantidad_minima",
    busqueda: ["nombre", "unidad_medida"],
  },
  insumo: {
    tabla: "insumo",
    id: "id_insumo",
    etiqueta: "Insumo",
    nombre: "t.nombre_insumo",
    columnas: "id_insumo, nombre_insumo, proveedor, cantidad, cantidad_minima",
    busqueda: ["nombre_insumo", "proveedor"],
  },
  cliente: {
    tabla: "cliente",
    id: "id_cliente",
    etiqueta: "Cliente",
    nombre: "CONCAT(t.nombre, ' ', t.apellido)",
    columnas: "id_cliente, nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra",
    busqueda: ["nombre", "apellido", "email", "telefono"],
  },
  usuario: {
    tabla: "usuario",
    id: "id_usuario",
    etiqueta: "Empleado",
    nombre: "CONCAT(t.nombre_usuario, ' ', t.apellido_usuario)",
    // La contraseña nunca se envía al frontend
    columnas: "id_usuario, nombre_usuario, apellido_usuario, email, nro_telefono, rol",
    busqueda: ["nombre_usuario", "apellido_usuario", "email", "rol"],
  },
};

// Lee ?pagina=&limite= de la URL. Si no viene "pagina", devuelve null (= traer todo).
export const leerPaginacion = (query) => {
  if (query.pagina === undefined) return null;
  const pagina = Math.max(1, parseInt(query.pagina) || 1);
  const limite = Math.min(100, Math.max(1, parseInt(query.limite) || 10));
  return { pagina, limite, offset: (pagina - 1) * limite };
};

export const armarPaginacion = ({ pagina, limite }, total) => ({
  pagina,
  limite,
  total,
  totalPaginas: Math.max(1, Math.ceil(total / limite)),
});

// Lista solo los registros activos, con búsqueda (?buscar=) y paginado opcional.
export const listarActivos = async (entidad, query) => {
  const { tabla, id, columnas, busqueda } = ENTIDADES[entidad];
  const condiciones = ["activo = 1"];
  const params = [];

  const texto = (query.buscar || "").trim();
  if (texto) {
    condiciones.push(`(${busqueda.map((campo) => `${campo} LIKE ?`).join(" OR ")})`);
    busqueda.forEach(() => params.push(`%${texto}%`));
  }
  const where = condiciones.join(" AND ");

  const pag = leerPaginacion(query);
  if (!pag) {
    const [rows] = await pool.query(`SELECT ${columnas} FROM ${tabla} WHERE ${where} ORDER BY ${id}`, params);
    return { data: rows };
  }

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla} WHERE ${where}`, params);
  const [rows] = await pool.query(
    `SELECT ${columnas} FROM ${tabla} WHERE ${where} ORDER BY ${id} LIMIT ? OFFSET ?`,
    [...params, pag.limite, pag.offset]
  );
  return { data: rows, paginacion: armarPaginacion(pag, total) };
};

export const buscarActivo = async (entidad, idRegistro) => {
  const { tabla, id, columnas } = ENTIDADES[entidad];
  const [rows] = await pool.query(`SELECT ${columnas} FROM ${tabla} WHERE ${id} = ? AND activo = 1`, [idRegistro]);
  return rows[0] || null;
};

// Borrado lógico: el registro queda guardado, pero marcado como eliminado.
export const eliminarLogico = async (entidad, idRegistro, usuario) => {
  const { tabla, id, etiqueta } = ENTIDADES[entidad];
  const antes = await buscarActivo(entidad, idRegistro);
  if (!antes) return { status: 404, body: { success: false, error: `${etiqueta} no encontrado` } };

  await pool.query(
    `UPDATE ${tabla} SET activo = 0, eliminado_en = NOW(), eliminado_por = ? WHERE ${id} = ?`,
    [usuario.id_usuario, idRegistro]
  );
  await registrarAuditoria({ tabla, id_registro: idRegistro, accion: "ELIMINAR", usuario, antes });

  return {
    status: 200,
    body: { success: true, message: `${etiqueta} eliminado. Se puede restaurar desde la Papelera.`, data: antes },
  };
};

// Papelera: el Dueño ve todo lo eliminado; cada empleado ve solo lo que eliminó él.
export const listarEliminados = async (entidad, query, usuario) => {
  const { tabla, id, nombre } = ENTIDADES[entidad];
  const condiciones = ["t.activo = 0"];
  const params = [];

  if (!esDueno(usuario)) {
    condiciones.push("t.eliminado_por = ?");
    params.push(usuario.id_usuario);
  }
  const texto = (query.buscar || "").trim();
  if (texto) {
    condiciones.push(`${nombre} LIKE ?`);
    params.push(`%${texto}%`);
  }
  const where = condiciones.join(" AND ");
  const pag = leerPaginacion({ pagina: 1, limite: 10, ...query });

  const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM ${tabla} t WHERE ${where}`, params);
  const [rows] = await pool.query(
    `SELECT t.${id} AS id, ${nombre} AS nombre,
            t.eliminado_en, t.eliminado_por,
            CONCAT(u.nombre_usuario, ' ', u.apellido_usuario) AS eliminado_por_nombre
     FROM ${tabla} t
     LEFT JOIN usuario u ON u.id_usuario = t.eliminado_por
     WHERE ${where}
     ORDER BY t.eliminado_en DESC
     LIMIT ? OFFSET ?`,
    [...params, pag.limite, pag.offset]
  );
  return { data: rows, paginacion: armarPaginacion(pag, total) };
};

// Restaurar: el Dueño puede restaurar cualquier cosa; un empleado solo lo que eliminó él.
export const restaurar = async (entidad, idRegistro, usuario) => {
  const { tabla, id, etiqueta, columnas } = ENTIDADES[entidad];
  const [rows] = await pool.query(
    `SELECT ${columnas}, eliminado_por FROM ${tabla} WHERE ${id} = ? AND activo = 0`,
    [idRegistro]
  );
  const registro = rows[0];
  if (!registro) return { status: 404, body: { success: false, error: `${etiqueta} no encontrado en la papelera` } };

  if (!esDueno(usuario) && registro.eliminado_por !== usuario.id_usuario) {
    return {
      status: 403,
      body: { success: false, error: "Solo podés restaurar lo que eliminaste vos. Pedíselo al administrador." },
    };
  }

  await pool.query(
    `UPDATE ${tabla} SET activo = 1, eliminado_en = NULL, eliminado_por = NULL WHERE ${id} = ?`,
    [idRegistro]
  );
  const despues = await buscarActivo(entidad, idRegistro);
  await registrarAuditoria({ tabla, id_registro: idRegistro, accion: "RESTAURAR", usuario, despues });

  return { status: 200, body: { success: true, message: `${etiqueta} restaurado`, data: despues } };
};
