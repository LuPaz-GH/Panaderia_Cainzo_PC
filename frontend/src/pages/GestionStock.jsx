// src/pages/GestionStock.jsx
import React, { useState, useEffect } from "react";
import Tabla from "../component/Table";
//import { useTableActions } from "../hook/useTableActions"; 

// Usamos la API de Productos, ya que el stock se guarda en la tabla 'producto'
const API_URL = "http://localhost:3000/api/productos/";

function GestionStock() {
    const [stock, setStock] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const moduleName = "Actualizar Stock"; 
    const { allButtons, handleActionClick } = useTableActions(moduleName);

    // Mapeamos las columnas a los campos de la tabla 'producto' en la BD
    const columns = [
        "id_producto", "nombre", "cantidad", "cantidad_minima", 
        "precio_unitario", "unidad_medida", "descripcion"
    ];

    // FUNCIÓN PARA OBTENER LOS DATOS DE STOCK (GET /api/productos)
    const obtenerStock = async () => {
        setIsLoading(true);
        try {
            const respuesta = await fetch(API_URL);
            
            if (!respuesta.ok) {
                throw new Error(`Error HTTP: ${respuesta.status}`);
            }

            const datos = await respuesta.json();
            // Usamos los datos de productos como stock
            setStock(datos);
        } catch (error) {
            console.error("Error al obtener el stock/productos:", error.message);
            alert("Error al cargar los datos de Stock. Verifique el backend.");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        obtenerStock();
    }, []);

    // LÓGICA DEL BOTÓN AGREGAR (POST) - Reusa el flujo de crear un Producto completo
    const handleAddStock = async () => {
        // Pedimos todos los datos necesarios para crear un producto
        const nuevoProductoData = {
            nombre: prompt("Ingrese nombre del nuevo producto/stock:"), 
            descripcion: prompt("Ingrese descripción:"),
            cantidad: parseFloat(prompt("Ingrese cantidad inicial:") || "0"),
            precio_unitario: parseFloat(prompt("Ingrese precio unitario:") || "0"),
            unidad_medida: prompt("Ingrese unidad de medida (ej. kg, C/u):"),
            cantidad_minima: parseFloat(prompt("Ingrese cantidad mínima de stock:") || "0"),
        };
        
        if (!nuevoProductoData.nombre || nuevoProductoData.precio_unitario <= 0) {
            alert("Creación cancelada o datos inválidos.");
            return;
        }

        try {
            const respuesta = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevoProductoData),
            });

            if (!respuesta.ok) {
                const errorData = await respuesta.json();
                throw new Error(errorData.message || `Error HTTP: ${respuesta.status}`);
            }
            
            const nuevoProductoDB = await respuesta.json(); 
            // Añadimos el nuevo producto a la vista de Stock
            setStock([...stock, nuevoProductoDB]);
            alert(`Stock para producto ${nuevoProductoDB.nombre} creado exitosamente.`);

        } catch (error) { 
            console.error("Error al agregar stock/producto:", error.message);
            alert(`Error al crear el registro: ${error.message}`);
        }
    };

    // LÓGICA DE ACCIONES DE FILA (Eliminar/Editar)
    const handleLocalActionClick = async (actionName, rowData) => { 
        
        if (actionName === "Editar") {
            // Edición de Stock: Solo pedimos cantidad y cantidad_minima
            const nuevaCantidad = prompt(`Ajustando Stock para ID: ${rowData.id_producto} (${rowData.nombre}). Ingrese nueva cantidad actual:`, rowData.cantidad);
            const nuevaCantidadMinima = prompt(`Ajustando Stock para ID: ${rowData.id_producto} (${rowData.nombre}). Ingrese nueva cantidad mínima:`, rowData.cantidad_minima);

            if (nuevaCantidad === null || isNaN(parseFloat(nuevaCantidad))) {
                alert("Edición cancelada o cantidad inválida.");
                return;
            }

            const datosAEnviar = {
                cantidad: parseFloat(nuevaCantidad),
                cantidad_minima: parseFloat(nuevaCantidadMinima),
            };

            try {
                // LLAMADA A LA API (PUT)
                const respuesta = await fetch(`${API_URL}${rowData.id_producto}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datosAEnviar),
                });

                if (!respuesta.ok) {
                    throw new Error(`Error HTTP: ${respuesta.status}`);
                }

                const productoActualizadoDB = await respuesta.json();
                
                // ACTUALIZACIÓN DEL ESTADO (Frontend)
                setStock(stock.map(p => 
                    p.id_producto === rowData.id_producto ? productoActualizadoDB : p
                ));
                
                alert(`Stock de ${rowData.nombre} actualizado a ${productoActualizadoDB.cantidad} correctamente.`);

            } catch (error) {
                console.error("Error al editar el stock:", error);
                alert("Hubo un error al intentar editar el stock.");
            }
        } 
        else if (actionName === "Eliminar") {
            // Lógica de eliminación (Reutilizamos la de Productos)
            if (window.confirm(`¿Estás seguro de BORRAR el producto del stock ID: ${rowData.id_producto} (${rowData.nombre})?`)) {
                
                try {
                    const respuesta = await fetch(`${API_URL}${rowData.id_producto}`, {
                        method: 'DELETE',
                    });

                    if (respuesta.status === 204) {
                        const newStock = stock.filter(p => p.id_producto !== rowData.id_producto);
                        setStock(newStock); 
                        alert(`Producto ID: ${rowData.id_producto} eliminado del stock.`);
                    } else if (respuesta.status === 404) {
                         alert("Error: El producto no fue encontrado.");
                    } else {
                        throw new Error(`Error HTTP: ${respuesta.status}`);
                    }

                } catch (error) {
                    console.error("Error al eliminar:", error);
                    alert("Hubo un error al intentar eliminar el registro.");
                }
            }
        } 
        else if (actionName === "Agregar") {
             handleAddStock();
        }
        else {
             handleActionClick(actionName, rowData);
        }
    };

    if (isLoading) {
        return <p className="text-center p-5">Cargando datos de stock...</p>;
    }
    
    return (
        <>
        <Tabla 
            columns={columns} 
            data={stock} 
            title={"📦 GESTIÓN DE STOCK (Productos Finales)"} 
            actions={allButtons} 
            onActionClick={handleLocalActionClick} 
            onAddClick={handleAddStock} 
        />
        </>
    );
}

export default GestionStock;