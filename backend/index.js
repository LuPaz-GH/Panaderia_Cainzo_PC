import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import productoRouter from "./routers/productoRouters.js"
import empleadoRouter from "./routers/empleadoRouters.js"
import ventaRouters from "./routers/ventaRouters.js"
import insumoRouters from "./routers/insumoRouters.js"
import clienteRouters from "./routers/clienteRouters.js"
import loginRouter from "./routers/loginRouter.js"
import papeleraRouters from "./routers/papeleraRouters.js";
import auditoriaRouters from "./routers/auditoriaRouters.js";
import { identificarUsuario } from "./middlewares/auth.js";
import "./config/db.js";
import estadisticasRouters from "./routers/estadisticasRouters.js";

dotenv.config();
const app = express();

// Páginas que pueden usar este backend: la de tu compu y la publicada (FRONTEND_URL, ej. Netlify)
const origenesPermitidos = [
  "http://localhost:5173",
  ...(process.env.FRONTEND_URL || "").split(",").map((u) => u.trim()).filter(Boolean),
];

app.use(cors({
  origin: origenesPermitidos,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "Accept"]
}));
app.use(express.json());

// Para comprobar que el servidor está prendido (lo usa Render)
app.get("/", (req, res) => {
  res.json({ success: true, message: "Backend de Panificadora Cainzo funcionando" });
});

// Lee el token de sesión (si viene) para saber qué usuario hace cada pedido
app.use(identificarUsuario);

app.use("/cliente", clienteRouters);
app.use("/insumo", insumoRouters);
app.use("/producto", productoRouter);
app.use("/usuario", empleadoRouter);
app.use("/venta", ventaRouters);
app.use("/login", loginRouter);
app.use("/papelera", papeleraRouters);
app.use("/auditoria", auditoriaRouters);
app.use("/api/estadisticas", estadisticasRouters);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Backend corriendo en http://localhost:${PORT}`);
});
