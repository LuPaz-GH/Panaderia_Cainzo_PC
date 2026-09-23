-- ======================================================
-- CREACIÓN DE BASE DE DATOS
-- ======================================================
DROP DATABASE IF EXISTS panaderiacainzo;
CREATE DATABASE panaderiacainzo;
USE panaderiacainzo;

-- ======================================================
-- TABLA USUARIO
-- ======================================================
CREATE TABLE usuario (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre_usuario VARCHAR(50) NOT NULL,
    apellido_usuario VARCHAR(50) NOT NULL,
    contrasena VARCHAR(255) NOT NULL,
    email VARCHAR(100),
    nro_telefono VARCHAR(20),
    rol ENUM('Dueño', 'Encargado', 'Empleado') NOT NULL
) ENGINE=InnoDB;

-- ======================================================
-- TABLA PRODUCTO
-- ======================================================
CREATE TABLE producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cantidad DECIMAL(10,2) DEFAULT 0,
    precio_unitario DECIMAL(10,2) NOT NULL,
    unidad_medida VARCHAR(20) DEFAULT 'unidad',
    cantidad_minima DECIMAL(10,2) DEFAULT 0
) ENGINE=InnoDB;

-- ======================================================
-- TABLA INSUMO
-- ======================================================
CREATE TABLE insumo (
    id_insumo INT AUTO_INCREMENT PRIMARY KEY,
    nombre_insumo VARCHAR(100) NOT NULL,
    proveedor VARCHAR(100),
    cantidad DECIMAL(10,2) DEFAULT 0,
    cantidad_minima DECIMAL(10,2) DEFAULT 0
) ENGINE=InnoDB;

-- ======================================================
-- TABLA CLIENTE
-- ======================================================
CREATE TABLE cliente (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) NOT NULL,
    apellido VARCHAR(50) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(150),
    fecha_registro DATE DEFAULT (CURDATE()),
    cantidad_compra DECIMAL(10,2) DEFAULT 0,
    ultima_compra DATE
) ENGINE=InnoDB;

-- ======================================================
-- TABLA VENTA
-- ======================================================
CREATE TABLE venta (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_usuario INT,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL,
    metodo_pago ENUM('Efectivo','Transferencia') DEFAULT 'Efectivo',
    FOREIGN KEY (id_cliente) REFERENCES cliente(id_cliente),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ======================================================
-- TABLA DETALLE_VENTA
-- ======================================================
CREATE TABLE detalle_venta (
    id_detalle INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT,
    id_producto INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_venta) REFERENCES venta(id_venta),
    FOREIGN KEY (id_producto) REFERENCES producto(id_producto)
) ENGINE=InnoDB;

-- ======================================================
-- TABLA COMPRA_INSUMO
-- ======================================================
CREATE TABLE compra_insumo (
    id_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT,
    fecha_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
    proveedor VARCHAR(100),
    total DECIMAL(10,2),
    FOREIGN KEY (id_usuario) REFERENCES usuario(id_usuario)
) ENGINE=InnoDB;

-- ======================================================
-- TABLA DETALLE_COMPRA_INSUMO
-- ======================================================
CREATE TABLE detalle_compra_insumo (
    id_detalle_compra INT AUTO_INCREMENT PRIMARY KEY,
    id_compra INT,
    id_insumo INT,
    cantidad DECIMAL(10,2) NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    fecha_vencimiento DATE,
    precio_compra DECIMAL(10,2),
    subtotal DECIMAL(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
    FOREIGN KEY (id_compra) REFERENCES compra_insumo(id_compra),
    FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo)
) ENGINE=InnoDB;

-- ======================================================
-- REESTRUCTURACIÓN DE PROVEEDORES
-- ======================================================
DROP TABLE IF EXISTS proveedor;

CREATE TABLE proveedor (
    id_proveedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    telefono VARCHAR(20),
    email VARCHAR(100),
    direccion VARCHAR(150),
    cuit VARCHAR(20),
    fecha_registro DATE DEFAULT (CURDATE())
) ENGINE=InnoDB;

-- Relación Proveedor – Insumos
CREATE TABLE proveedor_insumo (
    id_proveedor_insumo INT AUTO_INCREMENT PRIMARY KEY,
    id_proveedor INT,
    id_insumo INT,
    precio_compra DECIMAL(10,2),
    fecha_vencimiento DATE,
    FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor),
    FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo)
) ENGINE=InnoDB;




-- Enlaces hacia proveedor
ALTER TABLE compra_insumo
    ADD COLUMN id_proveedor INT,
    ADD FOREIGN KEY (id_proveedor) REFERENCES proveedor(id_proveedor);

-- Cascada para detalle de compras
ALTER TABLE detalle_compra_insumo
    ADD CONSTRAINT fk_dci_compra
        FOREIGN KEY (id_compra) REFERENCES compra_insumo(id_compra)
        ON DELETE CASCADE ON UPDATE CASCADE,
    ADD CONSTRAINT fk_dci_insumo
        FOREIGN KEY (id_insumo) REFERENCES insumo(id_insumo)
        ON DELETE CASCADE ON UPDATE CASCADE;

-- ======================================================
-- INSERTS: INSUMOS
-- ======================================================
INSERT INTO insumo (nombre_insumo, cantidad_minima) VALUES
('Azúcar', 1.00), ('Sal', 1.00), ('Huevos', 0.50), ('Salvado', 0.50),
('Esencia de vainilla', 1.00), ('Esencia de manteca', 1.00),
('Colorante caramelo', 1.00), ('Colorante amarillo', 1.00),
('Pastelgras', 2.00), ('Grasa común', 2.00), ('Margarina Súper', 2.00),
('Margarina Reficent', 1.00), ('Dulce de leche', 1.00), ('Jalea Dulcor', 1.00),
('Membrillo duro', 1.00), ('Mermelada de membrillo', 1.00),
('Chocolate Alpino negro', 2.00), ('Chocolate Cohela blanco', 1.00),
('Chocolate Cohelo negro', 1.00), ('Fondant', 2.00),
('Crocante de maní', 1.00), ('Crocante de chocolate', 1.00),
('Anís', 1.00), ('Azúcar impalpable', 1.00),
('Premezcla Chipá', 1.00), ('Premezcla pan integral c/semillas', 1.00),
('Premezcla pan integral c/cereales', 1.00), ('Fruta abrillantada', 2.00),
('Pasas de uva', 2.00), ('Polvo para hornear', 1.00),
('Amoníaco', 1.00), ('Antimoho', 1.00), ('Coco rallado', 1.00),
('Crema chantilly', 1.00), ('Cerezas', 0.50), ('Pulpalist', 0.50);

UPDATE insumo SET cantidad = 5.00 WHERE id_insumo = 3;

UPDATE insumo
SET cantidad = 10.00
WHERE id_insumo IN (1,2,3,4,9,10,11,12,13,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31,32,33,35);

UPDATE insumo
SET cantidad = 12.00
WHERE id_insumo IN (5,6,7,8,14,34,36);

-- ======================================================
-- INSERTS: PRODUCTO
-- ======================================================
INSERT INTO producto (nombre, precio_unitario, unidad_medida) VALUES
('Cañoncito',1400,'C/u'),('Palmeras',2000,'C/u'),('P/Pastaflora',1600,'C/u'),
('Alfajor',2000,'C/u'),('Tarta de coco',2000,'C/u'),('Tarta de Manzana',1500,'C/u'),
('Miloja Redonda',2000,'C/u'),('Cuadrado C/membrillo',1800,'100gr'),
('Vainilla',500,'C/u'),('Budin',1300,'100gr'),('Brownie',2000,'C/u'),
('Marmolado Hojaldre',2000,'C/u'),('Pan dulce',1300,'100gr'),
('Palmeritas',1800,'100gr'),('Galletas en gral',1600,'100gr'),
('Semoladas',1200,'100gr'),('Bizcochitos de grasa',800,'100gr'),
('Babyscuit',1200,'100gr'),('Tostadas',1200,'100gr'),
('Bizcocho negro',1100,'C/u'),('Polvorón',1200,'100gr'),
('Pan',2300,'kg'),('Pan sanguchero',350,'C/u'),('Tortilla',300,'C/u'),
('Factura',500,'C/u'),('Tortas',16000,'kg'),('Tartas',16000,'C/u'),
('Masas finas',24000,'kg');

-- Cantidades mínimas por categoría
UPDATE producto SET cantidad_minima = 5 WHERE id_producto IN (1,2,3,4,5,6,7,9,11,12,20,23,24,25,27);
UPDATE producto SET cantidad = 12 WHERE id_producto IN (1,2,3,4,5,6,7,9,11,12,20,23,24,25,27);
UPDATE producto SET cantidad_minima = 5 WHERE id_producto IN (8,10,13,14,15,16,17,18,19,21);
UPDATE producto SET cantidad = 10 WHERE id_producto IN (8,10,13,14,15,16,17,18,19,21);
UPDATE producto SET cantidad_minima = 10 WHERE id_producto IN (22,24,25,26,28);
UPDATE producto SET cantidad = 20 WHERE id_producto IN (22,24,25,26,28);

-- ======================================================
-- INSERTS: PROVEEDOR
-- ======================================================
INSERT INTO proveedor (nombre, telefono, email, direccion, cuit, fecha_registro)
VALUES ('Distribuidora Norte','3814455667','contacto@distribuidoranorte.com',
        'Calle Falsa 123','30-12345678-9','2025-10-28');

-- ======================================================
-- INSERTS: CLIENTE
-- ======================================================
INSERT INTO cliente (nombre, apellido, telefono, email, direccion, fecha_registro, cantidad_compra, ultima_compra)
VALUES ('Juan','Pérez','3811234567','juan.perez@email.com',
        'Av. Aconquija 123','2025-10-28',1,'2025-10-28');

-- ======================================================
-- INSERTS: USUARIO
-- ======================================================
INSERT INTO usuario (nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol)
VALUES ('usuario','usu_apellido','123456','usuario@gmail.com','3819876543','Dueño');

INSERT INTO usuario (nombre_usuario, apellido_usuario, contrasena, email, nro_telefono, rol)
VALUES ('usuario encargado','usu_apellido','123456','usuario@gmail.com','3819876543','Encargado');

-- ======================================================
-- MODIFICACION DE 100G A Gr
-- ======================================================
UPDATE producto
SET unidad_medida = 'Gr'
WHERE unidad_medida = '100gr';

-- ======================================================
-- PROCEDIMIENTO DE EliminarYReordenarProductos
-- ======================================================
-- ======================================================
-- PROCEDIMIENTO DE EliminarYReordenarProductos
-- ======================================================

DROP PROCEDURE IF EXISTS EliminarYReordenarProducto;

CREATE PROCEDURE EliminarYReordenarProducto(IN p_id_a_eliminar INT)
BEGIN
    -- Eliminar el producto con el ID dado
    DELETE FROM producto WHERE id_producto = p_id_a_eliminar;

    -- Reordenar los IDs para cerrar el hueco
    UPDATE producto 
    SET id_producto = id_producto - 1 
    WHERE id_producto > p_id_a_eliminar;

    -- Reiniciar el autoincremento
    ALTER TABLE producto AUTO_INCREMENT = 1;
END;

-- ======================================================
-- BORRADO LÓGICO (los registros no se borran, se marcan como inactivos)
-- ======================================================
ALTER TABLE producto
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
    ADD COLUMN eliminado_en DATETIME NULL,
    ADD COLUMN eliminado_por INT NULL;

ALTER TABLE insumo
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
    ADD COLUMN eliminado_en DATETIME NULL,
    ADD COLUMN eliminado_por INT NULL;

ALTER TABLE cliente
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
    ADD COLUMN eliminado_en DATETIME NULL,
    ADD COLUMN eliminado_por INT NULL;

ALTER TABLE usuario
    ADD COLUMN activo TINYINT(1) NOT NULL DEFAULT 1,
    ADD COLUMN eliminado_en DATETIME NULL,
    ADD COLUMN eliminado_por INT NULL;

-- ======================================================
-- AUDITORÍA (quién creó, editó, eliminó o restauró cada registro)
-- ======================================================
CREATE TABLE auditoria (
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
) ENGINE=InnoDB;
