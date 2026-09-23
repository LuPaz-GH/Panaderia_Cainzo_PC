// Este archivo, es una conexion constante a la BD, es decir que desde aqui, se conectan los
// controladores

import mysql from "mysql2/promise";
import { datosConexion } from "./conexion.js";

export const pool = mysql.createPool(datosConexion());
