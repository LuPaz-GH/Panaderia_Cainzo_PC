import express, {Router} from "express";
import { agregarProducto, eliminarProducto, modificarProducto, obtenerProductos } from "../controllers/productosControllers.js";
import { requiereUsuario } from "../middlewares/auth.js";

const router = express.Router();

router.get("/", obtenerProductos)
router.post("/", requiereUsuario, agregarProducto)
router.put("/:id_producto", requiereUsuario, modificarProducto)
router.delete("/:id_producto", requiereUsuario, eliminarProducto)
export default router;
