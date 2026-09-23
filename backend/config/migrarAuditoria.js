// config/migrarAuditoria.js
// Agrega el borrado lógico y la tabla de auditoría a una base que ya existe,
// SIN borrar los datos. Se puede ejecutar varias veces sin problema:
//   node config/migrarAuditoria.js
import { pool } from "./db.js";

const TABLAS_CON_BORRADO_LOGICO = ["producto", "insumo", "cliente", "usuario"];

const COLUMNAS = [
  ["activo", "TINYINT(1) NOT NULL DEFAULT 1"],
  ["eliminado_en", "DATETIME NULL"],
  ["eliminado_por", "INT NULL"],
];

const columnaExiste = async (tabla, columna) => {
  const [rows] = await pool.query(
    `SELECT COUNT(*) AS n FROM INFORMATION_SCHEMA.COLUMNS
     WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = ? AND COLUMN_NAME = ?`,
    [tabla, columna]
  );
  return rows[0].n > 0;
};

const migrar = async () => {
  for (const tabla of TABLAS_CON_BORRADO_LOGICO) {
    for (const [columna, definicion] of COLUMNAS) {
      if (await columnaExiste(tabla, columna)) continue;
      await pool.query(`ALTER TABLE ${tabla} ADD COLUMN ${columna} ${definicion}`);
      console.log(` + ${tabla}.${columna}`);
    }
  }

  await pool.query(`
    CREATE TABLE IF NOT EXISTS auditoria (
      id_auditoria INT AUTO_INCREMENT PRIMARY KEY,
      tabla VARCHAR(30) NOT NULL,
      id_registro INT NOT NULL,
      accion ENUM('CREAR','EDITAR','ELIMINAR','RESTAURAR') NOT NULL,
      id_usuario INT NULL,
      usuario_nombre VARCHAR(120) NULL,
      datos_antes JSON NULL,
      datos_despues JSON NULL,
      fecha DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_auditoria_registro (tabla, id_registro),
      INDEX idx_auditoria_fecha (fecha)
    ) ENGINE=InnoDB
  `);

  // Rol "Empleado" (además de Dueño y Encargado)
  await pool.query("ALTER TABLE usuario MODIFY rol ENUM('Dueño', 'Encargado', 'Empleado') NOT NULL");

  console.log(" Migración terminada: borrado lógico, auditoría y rol Empleado listos");
};

migrar()
  .catch((error) => {
    console.error(" Error en la migración:", error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
