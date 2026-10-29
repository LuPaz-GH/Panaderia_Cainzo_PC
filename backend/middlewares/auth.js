// middlewares/auth.js
// Identifica qué usuario hace cada pedido, a partir del token que se entrega al iniciar sesión.
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const SECRETO = process.env.JWT_SECRET || "cambiar-este-secreto";

export const firmarToken = (usuario) =>
  jwt.sign({ id_usuario: usuario.id_usuario }, SECRETO, { expiresIn: "8h" });

// Usuario de demostración: no existe en la base y solo puede mirar (no crea, edita ni borra nada)
export const USUARIO_INVITADO = {
  id_usuario: null,
  nombre_usuario: "Invitado",
  apellido_usuario: "Demo",
  email: null,
  nro_telefono: null,
  rol: "Invitado",
};

export const firmarTokenInvitado = () =>
  jwt.sign({ invitado: true }, SECRETO, { expiresIn: "2h" });

export const esInvitado = (usuario) => usuario?.rol === "Invitado";

// Si el pedido trae un token válido, deja los datos del usuario en req.usuario.
// Si no trae token, sigue igual (las rutas que lo necesitan usan requiereUsuario).
export const identificarUsuario = async (req, res, next) => {
  const encabezado = req.headers.authorization || "";
  const token = encabezado.startsWith("Bearer ") ? encabezado.slice(7) : null;
  if (!token) return next();

  try {
    const { id_usuario, invitado } = jwt.verify(token, SECRETO);
    if (invitado) {
      req.usuario = USUARIO_INVITADO;
      return next();
    }
    const [rows] = await pool.query(
      "SELECT id_usuario, nombre_usuario, apellido_usuario, email, rol FROM usuario WHERE id_usuario = ? AND activo = 1",
      [id_usuario]
    );
    if (rows.length > 0) req.usuario = rows[0];
  } catch {
    // Token vencido o inválido: se trata como si no hubiera iniciado sesión
  }
  next();
};

export const requiereUsuario = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ success: false, error: "Tu sesión venció. Volvé a iniciar sesión." });
  }
  next();
};

export const esDueno = (usuario) => usuario?.rol === "Dueño";

export const requiereDueno = (req, res, next) => {
  if (!req.usuario) {
    return res.status(401).json({ success: false, error: "Tu sesión venció. Volvé a iniciar sesión." });
  }
  // El invitado puede ver lo mismo que el Dueño, pero solo mirar
  if (!esDueno(req.usuario) && !(esInvitado(req.usuario) && req.method === "GET")) {
    return res.status(403).json({ success: false, error: "Solo el administrador (Dueño) puede hacer esto" });
  }
  next();
};

// El invitado solo puede consultar: cualquier pedido que cambie datos se rechaza
export const soloLecturaInvitado = (req, res, next) => {
  if (esInvitado(req.usuario) && req.method !== "GET") {
    return res.status(403).json({
      success: false,
      error: "Estás en modo demo (invitado): podés recorrer todo, pero no guardar cambios.",
    });
  }
  next();
};
