// controllers/productosControllers.js
import { pool } from "../config/db.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { listarActivos, buscarActivo, eliminarLogico } from "../utils/entidades.js";

export const obtenerProductos = async (req, res) => {
    try {
        const resultado = await listarActivos("producto", req.query);
        res.json({ success: true, ...resultado });
    } catch (error) {
        console.error("Error en obtenerProductos:", error);
        res.status(500).json({ success: false, error: "Error Del Servidor" });
    }
};

export const agregarProducto = async (req, res) => {
    try {
        const { nombre, cantidad, precio_unitario, unidad_medida, cantidad_minima } = req.body;

        // Si ya existe el producto (y no está eliminado) → sumar cantidad
        const [existe] = await pool.query("SELECT id_producto FROM producto WHERE nombre = ? AND activo = 1", [nombre]);
        if (existe.length > 0) {
            const id_producto = existe[0].id_producto;
            const antes = await buscarActivo("producto", id_producto);
            const nuevaCantidad = Number(antes.cantidad) + Number(cantidad || 0);
            await pool.query("UPDATE producto SET cantidad = ? WHERE id_producto = ?", [nuevaCantidad, id_producto]);
            const despues = await buscarActivo("producto", id_producto);
            await registrarAuditoria({ tabla: "producto", id_registro: id_producto, accion: "EDITAR", usuario: req.usuario, antes, despues });
            return res.json({ success: true, message: "Cantidad sumada al producto existente", data: despues });
        }

        // Si no existe → crear nuevo
        const [result] = await pool.query(
            "INSERT INTO producto (nombre, cantidad, precio_unitario, unidad_medida, cantidad_minima) VALUES (?, ?, ?, ?, ?)",
            [nombre, cantidad || 0, precio_unitario, unidad_medida, cantidad_minima || 0]
        );
        const despues = await buscarActivo("producto", result.insertId);
        await registrarAuditoria({ tabla: "producto", id_registro: result.insertId, accion: "CREAR", usuario: req.usuario, despues });

        res.json({ success: true, message: "Producto creado correctamente", data: despues });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    }
};

export const modificarProducto = async (req, res) => {
    try {
        const { id_producto } = req.params;
        const { nombre, cantidad, precio_unitario, unidad_medida, cantidad_minima } = req.body;

        const antes = await buscarActivo("producto", id_producto);
        if (!antes) {
            return res.status(404).json({ success: false, error: "Producto no encontrado" });
        }

        await pool.query(
            "UPDATE producto SET nombre=?, cantidad=?, precio_unitario=?, unidad_medida=?, cantidad_minima=? WHERE id_producto=?",
            [nombre, cantidad, precio_unitario, unidad_medida, cantidad_minima, id_producto]
        );
        const despues = await buscarActivo("producto", id_producto);
        await registrarAuditoria({ tabla: "producto", id_registro: Number(id_producto), accion: "EDITAR", usuario: req.usuario, antes, despues });

        res.json({ success: true, message: "Producto actualizado", data: despues });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

// Borrado lógico: el producto queda en la Papelera y se puede restaurar
export const eliminarProducto = async (req, res) => {
    try {
        const { status, body } = await eliminarLogico("producto", req.params.id_producto, req.usuario);
        res.status(status).json(body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Fallo interno del servidor" });
    }
};
