import { pool } from "../config/db.js";

export const obtenerVentas = async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                v.id_venta,
                v.fecha_venta,
                v.total,
                v.metodo_pago,

                c.id_cliente,
                c.nombre AS cliente_nombre,
                c.apellido AS cliente_apellido,
                c.telefono AS cliente_telefono,

                u.id_usuario,
                u.nombre_usuario AS usuario_nombre,
                u.apellido_usuario AS usuario_apellido,
                u.rol AS usuario_rol

            FROM venta v
            INNER JOIN cliente c ON v.id_cliente = c.id_cliente
            INNER JOIN usuario u ON v.id_usuario = u.id_usuario
        `);

        res.json({ success: true, data: rows });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
}


export const crearVenta = async (req, res) => {
    try {
        const { id_cliente, id_usuario, fecha_venta, total, metodo_pago } = req.body;

        const [result] = await pool.query(
            "INSERT INTO venta (id_cliente, id_usuario, fecha_venta, total, metodo_pago) VALUES (?, ?, ?, ?, ?)",
            [id_cliente, id_usuario, fecha_venta, total, metodo_pago]
        );

        res.json({ success: true, message: "Venta creada", id_venta: result.insertId });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al crear la venta" });
    }
}

export const actualizarVenta = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_cliente, id_usuario, fecha_venta, total, metodo_pago } = req.body;

        await pool.query(
            `UPDATE venta SET 
                id_cliente = ?, 
                id_usuario = ?, 
                fecha_venta = ?, 
                total = ?, 
                metodo_pago = ?
            WHERE id_venta = ?`,
            [id_cliente, id_usuario, fecha_venta, total, metodo_pago, id]
        );

        res.json({ success: true, message: "Venta actualizada" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar venta" });
    }
}


export const eliminarVenta = async (req, res) => {
    try {
        const { id } = req.params;

        await pool.query("DELETE FROM venta WHERE id_venta = ?", [id]);

        res.json({ success: true, message: "Venta eliminada" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al eliminar la venta" });
    }
};


// Función para exportar y usar en el router
export const registrarVentaCompleta = async (req, res) => {
    // Obtenemos una conexión del pool para manejar la transacción
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction(); // INICIO DE LA TRANSACCIÓN

        const { id_cliente, total, metodo_pago, detalle } = req.body;
        // La venta queda a nombre de quien inició sesión (si no hay sesión, se usa el que venga en el pedido)
        const id_usuario = req.usuario?.id_usuario ?? req.body.id_usuario;
        
        // 1. Insertar la Venta principal (La fecha se inserta automáticamente con CURRENT_TIMESTAMP)
        const [ventaResult] = await connection.query(
            "INSERT INTO venta (id_cliente, id_usuario, total, metodo_pago) VALUES (?, ?, ?, ?)",
            [id_cliente, id_usuario, total, metodo_pago]
        );
        const id_venta = ventaResult.insertId;

        // 2. Iterar y registrar cada Detalle de Venta y descontar Stock
        for (const item of detalle) {
            
            // A. Descontar Stock del Producto
            const [stockResult] = await connection.query(
                "UPDATE producto SET cantidad = cantidad - ? WHERE id_producto = ? AND cantidad >= ?",
                [item.cantidad, item.id_producto, item.cantidad]
            );

            if (stockResult.affectedRows === 0) {
                // Si stock es insuficiente o el producto no existe/cantidad < requerida, revertir
                await connection.rollback();
                connection.release();
                return res.status(400).json({ success: false, error: `Stock insuficiente o producto no encontrado para ID ${item.id_producto}` });
            }

            // B. Insertar Detalle de Venta
            await connection.query(
                "INSERT INTO detalle_venta (id_venta, id_producto, cantidad, precio_unitario) VALUES (?, ?, ?, ?)",
                [id_venta, item.id_producto, item.cantidad, item.precio_unitario]
            );
        }

        await connection.commit(); // CONFIRMAR TRANSACCIÓN
        connection.release();

        res.json({ success: true, message: "Venta y stock actualizados correctamente", id_venta });

    } catch (error) {
        await connection.rollback(); // DESHACER TRANSACCIÓN EN CASO DE ERROR
        connection.release();
        console.error("Error en la transacción de venta:", error);
        res.status(500).json({ success: false, error: "Error interno al procesar la venta" });
    }
};