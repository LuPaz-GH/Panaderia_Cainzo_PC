import { pool } from "../config/db.js";
import { firmarToken } from "../middlewares/auth.js";

export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  try {
    // Los empleados eliminados (activo = 0) ya no pueden entrar
    const [existe] = await pool.query(
      `SELECT id_usuario, nombre_usuario, apellido_usuario, email, nro_telefono, rol
       FROM usuario WHERE email = ? AND contrasena = ? AND activo = 1`,
      [email, contrasena]
    );
    if (existe.length === 0) {
      return res.status(401).json({ success: false, message: "Credenciales incorrectas" });
    }

    // Usuario encontrado: se le entrega un token para identificarlo en cada pedido
    const usuario = existe[0];
    return res.json({ success: true, data: usuario, token: firmarToken(usuario) });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Error en el servidor" });
  }
};
