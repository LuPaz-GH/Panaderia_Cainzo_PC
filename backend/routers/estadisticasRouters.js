import express from "express";
const router = express.Router();
import { getEstadisticas } from "../controllers/estadisticasControllers.js";

router.get("/dashboard", getEstadisticas);

export default router;