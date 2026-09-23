// utils/auditoria.js
// Guarda en la tabla "auditoria" quién hizo cada cambio y cómo estaba antes y después.
import { pool } from "../config/db.js";

// Campos que nunca se guardan en el historial
const CAMPOS_OCULTOS = ["contrasena", "activo", "eliminado_en", "eliminado_por"];

const limpiar = (fila) => {
  if (!fila) return null;
  const copia = { ...fila };
  CAMPOS_OCULTOS.forEach((campo) => delete copia[campo]);
  return JSON.stringify(copia);
};

export const registrarAuditoria = async ({ tabla, id_registro, accion, usuario, antes = null, despues = null }) => {
  try {
    await pool.query(
      `INSERT INTO auditoria (tabla, id_registro, accion, id_usuario, usuario_nombre, datos_antes, datos_despues)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        tabla,
        id_registro,
        accion,
        usuario?.id_usuario ?? null,
        usuario ? `${usuario.nombre_usuario} ${usuario.apellido_usuario}` : null,
        limpiar(antes),
        limpiar(despues),
      ]
    );
  } catch (error) {
    // Si falla el historial no se cancela la operación, pero queda en la consola
    console.error("No se pudo registrar la auditoría:", error);
  }
};
