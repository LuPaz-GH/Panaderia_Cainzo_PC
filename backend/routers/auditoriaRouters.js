import express from "express";
import { obtenerAuditoria, obtenerUsuariosAuditoria } from "../controllers/auditoriaControllers.js";
import { requiereDueno } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", requiereDueno, obtenerAuditoria);
router.get("/usuarios", requiereDueno, obtenerUsuariosAuditoria);

export default router;
