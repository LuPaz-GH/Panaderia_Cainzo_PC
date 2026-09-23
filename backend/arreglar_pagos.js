import mysql from "mysql2";

// Configuración de la base de datos
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", 
  database: "panaderiacainzo",
});

// El comando mágico para arreglar la columna
const sql = "ALTER TABLE venta MODIFY COLUMN metodo_pago VARCHAR(50) NOT NULL DEFAULT 'Efectivo'";

console.log("🔧 Intentando arreglar la base de datos...");

connection.query(sql, (err, result) => {
  if (err) {
    console.error("❌ Error:", err.message);
  } else {
    console.log("✅ ¡ÉXITO! Ahora la base de datos acepta cualquier método de pago.");
  }
  connection.end();
}); 