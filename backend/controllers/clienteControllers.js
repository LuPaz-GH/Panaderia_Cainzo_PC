import { pool } from "../config/db.js";
import { fixDate } from "../utils/fixDate.js";
import { registrarAuditoria } from "../utils/auditoria.js";
import { listarActivos, buscarActivo, eliminarLogico } from "../utils/entidades.js";

export const obtenerCliente = async (req, res) => {
    try {
        const resultado = await listarActivos("cliente", req.query);
        res.json({ success: true, ...resultado });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
}

export const crearCliente = async (req, res) => {
    try {
        let {nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra} = req.body
        if(!nombre || !apellido || !telefono || !email || !direccion || !fecha_registro || !cantidad_compra || !ultima_compra) {
            return res.status(400).json({
        success: false, error: "Faltan datos" });
        }
        fecha_registro = fixDate(fecha_registro);
        ultima_compra = fixDate(ultima_compra);
        const [rows] = await pool.query("INSERT INTO cliente (nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra ]
        )
        const despues = await buscarActivo("cliente", rows.insertId);
        await registrarAuditoria({ tabla: "cliente", id_registro: rows.insertId, accion: "CREAR", usuario: req.usuario, despues });

        res.json({success: true, data: despues})
    }catch(error) {
        console.error(error);
        res.status(500).json({success: false, error: "ESTE ERROR del servidor"})
    }
}

export const modificarCliente = async (req, res) => {
    try{
        const {id_cliente} = req.params;
        const {nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra} = req.body

        const antes = await buscarActivo("cliente", id_cliente);
        if (!antes) {
            return res.status(404).json({ success: false, message: "cliente no encontrado" });
        }

        await pool.query("UPDATE cliente SET nombre= ?, apellido= ?, telefono= ?, email= ?, direccion= ?, fecha_registro= ?, cantidad_compra= ?, ultima_compra= ? WHERE id_cliente= ?",
            [nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra, id_cliente]
        )
        const despues = await buscarActivo("cliente", id_cliente);
        await registrarAuditoria({ tabla: "cliente", id_registro: Number(id_cliente), accion: "EDITAR", usuario: req.usuario, antes, despues });

    res.json({success: true, data: despues})
    }catch (error) {
        console.error(error);
        res.status(500).json({success: false, error: "Error del servidor"})
    }
}

// Borrado lógico: el cliente queda en la Papelera y se puede restaurar
export const eliminarCliente = async (req, res) => {
    try {
        const { status, body } = await eliminarLogico("cliente", req.params.id_cliente, req.usuario);
        res.status(status).json(body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Error del Servidor" });
    }
}
