import express, {Router} from "express";
import { agregarEmpleado, obtenerEmpelados, actualizarEmpleado, eliminarEmpleado } from "../controllers/empleadosControllers.js";
import { requiereUsuario } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerEmpelados);

router.post("/", requiereUsuario, agregarEmpleado);

router.put("/:id_usuario", requiereUsuario, actualizarEmpleado);

router.delete("/:id_usuario", requiereUsuario, eliminarEmpleado);

export default router;
