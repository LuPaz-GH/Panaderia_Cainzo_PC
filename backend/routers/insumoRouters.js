import express, {Router} from "express";
import { crearInsumo, eliminarInsumo, modificarInsumo, obtenerInsumo } from "../controllers/insumoControllers.js";
import { requiereUsuario } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerInsumo)
router.post("/", requiereUsuario, crearInsumo)
router.put("/:id_insumo", requiereUsuario, modificarInsumo)
router.delete("/:id_insumo", requiereUsuario, eliminarInsumo)
export default router;
