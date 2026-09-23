// config/conexion.js
// Datos para conectarse a MySQL, leídos del .env (en tu compu) o de las
// variables de entorno del servidor (en Render).
import dotenv from "dotenv";

dotenv.config();

// Las bases en la nube (Aiven) piden conexión segura (SSL).
// DB_SSL=true la activa; DB_CA_CERT es el certificado que da Aiven ("CA certificate").
const ssl = () => {
  if (process.env.DB_SSL !== "true") return undefined;
  const ca = process.env.DB_CA_CERT?.replace(/\\n/g, "\n");
  return ca ? { ca, rejectUnauthorized: true } : { rejectUnauthorized: false };
};

export const datosConexion = ({ conBase = true } = {}) => ({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  ...(conBase ? { database: process.env.DB_NAME || "panaderiacainzo" } : {}),
  ssl: ssl(),
});
