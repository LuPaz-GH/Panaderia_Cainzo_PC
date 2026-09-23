// controllers/auditoriaControllers.js
// Historial de cambios: quién creó, editó, eliminó o restauró cada registro. Solo para el Dueño.
import { pool } from "../config/db.js";
import { ENTIDADES, leerPaginacion, armarPaginacion } from "../utils/entidades.js";

const ACCIONES = ["CREAR", "EDITAR", "ELIMINAR", "RESTAURAR"];

export const obtenerAuditoria = async (req, res) => {
  try {
    const { tabla, accion, id_usuario, desde, hasta } = req.query;
    const condiciones = [];
    const params = [];

    if (tabla && ENTIDADES[tabla]) {
      condiciones.push("tabla = ?");
      params.push(tabla);
    }
    if (accion && ACCIONES.includes(accion)) {
      condiciones.push("accion = ?");
      params.push(accion);
    }
    if (id_usuario) {
      condiciones.push("id_usuario = ?");
      params.push(id_usuario);
    }
    if (desde) {
      condiciones.push("fecha >= ?");
      params.push(`${desde} 00:00:00`);
    }
    if (hasta) {
      condiciones.push("fecha <= ?");
      params.push(`${hasta} 23:59:59`);
    }
    const where = condiciones.length ? `WHERE ${condiciones.join(" AND ")}` : "";
    const pag = leerPaginacion({ pagina: 1, limite: 15, ...req.query });

    const [[{ total }]] = await pool.query(`SELECT COUNT(*) AS total FROM auditoria ${where}`, params);
    const [rows] = await pool.query(
      `SELECT id_auditoria, tabla, id_registro, accion, id_usuario, usuario_nombre,
              datos_antes, datos_despues, fecha
       FROM auditoria ${where}
       ORDER BY fecha DESC, id_auditoria DESC
       LIMIT ? OFFSET ?`,
      [...params, pag.limite, pag.offset]
    );

    res.json({ success: true, data: rows, paginacion: armarPaginacion(pag, total) });
  } catch (error) {
    console.error("Error al obtener la auditoría:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};

// Lista de usuarios que aparecen en el historial (para el filtro "¿Quién?")
export const obtenerUsuariosAuditoria = async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT DISTINCT id_usuario, usuario_nombre
       FROM auditoria WHERE id_usuario IS NOT NULL
       ORDER BY usuario_nombre`
    );
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error al obtener usuarios de la auditoría:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};
