// backend/controllers/insumoControllers.js
import { pool } from "../config/db.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { listarActivos, buscarActivo, eliminarLogico } from "../utils/entidades.js";

export const obtenerInsumo = async (req, res) => {
  try {
    const resultado = await listarActivos("insumo", req.query);
    res.json({ success: true, ...resultado });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error del servidor al obtener insumos" });
  }
};

export const crearInsumo = async (req, res) => {
  try {
    const { nombre_insumo, proveedor, cantidad, cantidad_minima } = req.body;

    // Verificar si el insumo ya existe (y no está eliminado) para sumar la cantidad
    const [existe] = await pool.query(
      "SELECT id_insumo FROM insumo WHERE nombre_insumo = ? AND activo = 1",
      [nombre_insumo]
    );

    if (existe.length > 0) {
      const id_insumo = existe[0].id_insumo;
      const antes = await buscarActivo("insumo", id_insumo);
      const nuevoTotal = Number(antes.cantidad) + Number(cantidad || 0);

      await pool.query("UPDATE insumo SET cantidad = ? WHERE id_insumo = ?", [nuevoTotal, id_insumo]);
      const despues = await buscarActivo("insumo", id_insumo);
      await registrarAuditoria({ tabla: "insumo", id_registro: id_insumo, accion: "EDITAR", usuario: req.usuario, antes, despues });

      return res.json({
        success: true,
        message: "Cantidad de insumo existente actualizada",
        data: despues,
      });
    }

    // Crear nuevo insumo
    const [result] = await pool.query(
      "INSERT INTO insumo (nombre_insumo, proveedor, cantidad, cantidad_minima) VALUES (?, ?, ?, ?)",
      [nombre_insumo, proveedor, cantidad || 0, cantidad_minima || 0]
    );
    const despues = await buscarActivo("insumo", result.insertId);
    await registrarAuditoria({ tabla: "insumo", id_registro: result.insertId, accion: "CREAR", usuario: req.usuario, despues });

    res.status(201).json({ success: true, data: despues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error del servidor al crear insumo" });
  }
};

export const modificarInsumo = async (req, res) => {
  try {
    const { id_insumo } = req.params;
    const { nombre_insumo, proveedor, cantidad, cantidad_minima } = req.body;

    const antes = await buscarActivo("insumo", id_insumo);
    if (!antes) {
      return res.status(404).json({ success: false, message: "Insumo no encontrado" });
    }

    await pool.query(
      "UPDATE insumo SET nombre_insumo = ?, proveedor = ?, cantidad = ?, cantidad_minima = ? WHERE id_insumo = ?",
      [nombre_insumo, proveedor, cantidad, cantidad_minima, id_insumo]
    );

    // Devolver el insumo actualizado
    const despues = await buscarActivo("insumo", id_insumo);
    await registrarAuditoria({ tabla: "insumo", id_registro: Number(id_insumo), accion: "EDITAR", usuario: req.usuario, antes, despues });

    res.json({ success: true, data: despues });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error del servidor al modificar insumo" });
  }
};

// Borrado lógico: el insumo queda en la Papelera y se puede restaurar
export const eliminarInsumo = async (req, res) => {
  try {
    const { status, body } = await eliminarLogico("insumo", req.params.id_insumo, req.usuario);
    res.status(status).json(body);
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: "Error del servidor al eliminar insumo" });
  }
};
