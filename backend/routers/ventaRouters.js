import express from "express";
import { 
    obtenerVentas,
    crearVenta,
    actualizarVenta,
    eliminarVenta,
    registrarVentaCompleta
} from "../controllers/ventasControllers.js";

const router = express.Router();

router.get("/", obtenerVentas);
router.post("/", crearVenta);
router.put("/:id", actualizarVenta);
router.delete("/:id", eliminarVenta);
router.post("/registrar", registrarVentaCompleta);

export default router;
