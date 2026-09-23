import express from "express";
import { obtenerCliente, crearCliente, modificarCliente, eliminarCliente } from "../controllers/clienteControllers.js";
import { requiereUsuario } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerCliente);
router.post("/", requiereUsuario, crearCliente);
router.put("/:id_cliente", requiereUsuario, modificarCliente);
router.delete("/:id_cliente", requiereUsuario, eliminarCliente);

export default router;
