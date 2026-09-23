// config/initDB.js
// Crea la base de datos, las tablas y los datos de ejemplo a partir de base_datos.sql.
// OJO: borra la base "panaderiacainzo" si ya existía.
//   node config/initDB.js
import mysql from "mysql2";
import fs from "fs";
import { datosConexion } from "./conexion.js";

// base_datos.sql está en la carpeta backend (una arriba de esta)
const sqlScript = fs.readFileSync(new URL("../base_datos.sql", import.meta.url), "utf8");

// Conexión a MySQL (sin elegir base todavía)
const connection = mysql.createConnection({ ...datosConexion({ conBase: false }), multipleStatements: true });

connection.connect((err) => {
  if (err) {
    console.error(" Error al conectar con MySQL:", err);
    return;
  }
  console.log(" Conectado a MySQL");

  //  Ejecuta el script SQL completo
  connection.query(sqlScript, (err) => {
    if (err) {
      console.error(" Error al ejecutar el script SQL:", err);
    } else {
      console.log(" Base de datos y tablas creadas correctamente");
    }
    connection.end();
  });
});
