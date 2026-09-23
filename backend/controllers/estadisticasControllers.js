import { pool } from "../config/db.js";

export const getEstadisticas = async (req, res) => {
    try {
        const [productos] = await pool.query(`
            SELECT p.nombre, SUM(dv.cantidad) as cantidad 
            FROM detalle_venta dv
            JOIN producto p ON dv.id_producto = p.id_producto
            GROUP BY p.id_producto ORDER BY cantidad DESC LIMIT 5
        `);

        // 2. Insumos con poco stock
        const [insumos] = await pool.query(`
            SELECT nombre_insumo as nombre, cantidad as uso 
            FROM insumo WHERE activo = 1 ORDER BY cantidad ASC LIMIT 5
        `);

        const [pagos] = await pool.query(`
            SELECT metodo_pago as nombre, COUNT(*) as cantidad 
            FROM venta 
            GROUP BY metodo_pago
        `);

        res.json({ success: true, productos, insumos, pagos });
    } catch (error) {
        console.error("Error en estadísticas:", error);
        res.status(500).json({ success: false, error: "Error al obtener datos" });
    }
};