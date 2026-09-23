// Este archivo, es una conexion constante a la BD, es decir que desde aqui, se conectan los
// controladores

import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config(); // Permite leer varaiables de entorno, (.env)
//Esto es solo para poder cambiar
export const pool = mysql.createPool({
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT || 3306),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "panaderiacainzo",
});
