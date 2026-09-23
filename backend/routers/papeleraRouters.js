import express from "express";
import { obtenerPapelera, restaurarRegistro } from "../controllers/papeleraControllers.js";
import { requiereUsuario } from "../middlewares/auth.js";

const router = express.Router();

router.get("/:tipo", requiereUsuario, obtenerPapelera);
router.post("/:tipo/:id/restaurar", requiereUsuario, restaurarRegistro);

export default router;
