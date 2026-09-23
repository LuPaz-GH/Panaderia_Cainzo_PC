// backend/controllers/empleadocontrollers.js
import { pool } from "../config/db.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { listarActivos, buscarActivo, eliminarLogico } from "../utils/entidades.js";

export const obtenerEmpelados = async (req, res) => {
  try {
    const resultado = await listarActivos("usuario", req.query);
    res.json({ success: true, ...resultado });
  } catch (error) {
    console.error("Error al obtener empleados:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};

export const agregarEmpleado = async (req, res) => {
  try {
    const { nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol } = req.body;

    if ( !nombre_usuario || !apellido_usuario || !contrasena || !email || !nro_telefono || !rol ) {
      return res.status(400).json({
      success: false, error: "Faltan datos" });
    }

    const [result] = await pool.query(
      "INSERT INTO usuario (nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol ) VALUES (?, ?, ?, ?, ?, ?)",
      [nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol]
    );
    const despues = await buscarActivo("usuario", result.insertId);
    await registrarAuditoria({ tabla: "usuario", id_registro: result.insertId, accion: "CREAR", usuario: req.usuario, despues });

    res.json({ success: true, data: despues });
  } catch (error) {
    console.error("Error al agregar empleado:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};

export const actualizarEmpleado = async (req, res) => {
  try {
    const { id_usuario } = req.params;
    const { nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol } = req.body;

    const antes = await buscarActivo("usuario", id_usuario);
    if (!antes) {
      return res.status(404).json({ success: false, error: "Empleado no encontrado" });
    }

    // Si la contraseña viene vacía, se deja la que ya tenía
    if (contrasena) {
      await pool.query(
        "UPDATE usuario SET nombre_usuario = ?, apellido_usuario = ?, contrasena = ?, email = ?, nro_telefono = ?, rol = ? WHERE id_usuario = ?",
        [nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol, id_usuario]
      );
    } else {
      await pool.query(
        "UPDATE usuario SET nombre_usuario = ?, apellido_usuario = ?, email = ?, nro_telefono = ?, rol = ? WHERE id_usuario = ?",
        [nombre_usuario, apellido_usuario, email, nro_telefono, rol, id_usuario]
      );
    }
    const despues = await buscarActivo("usuario", id_usuario);
    await registrarAuditoria({
      tabla: "usuario",
      id_registro: Number(id_usuario),
      accion: "EDITAR",
      usuario: req.usuario,
      antes,
      // La contraseña no se guarda en el historial, solo que se cambió
      despues: contrasena ? { ...despues, contrasena_cambiada: "sí" } : despues,
    });

    res.json({ success: true, message: "Empleado actualizado correctamente", data: despues });
  } catch (error) {
    console.error("Error al actualizar empleado:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};

// Borrado lógico: el empleado ya no puede iniciar sesión y queda en la Papelera
export const eliminarEmpleado = async (req, res) => {
  try {
    if (Number(req.params.id_usuario) === req.usuario.id_usuario) {
      return res.status(400).json({ success: false, error: "No podés eliminar tu propio usuario" });
    }
    const { status, body } = await eliminarLogico("usuario", req.params.id_usuario, req.usuario);
    res.status(status).json(body);
  } catch (error) {
    console.error("Error al eliminar empleado:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};
