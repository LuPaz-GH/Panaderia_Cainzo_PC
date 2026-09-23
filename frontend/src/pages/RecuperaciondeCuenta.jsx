// src/pages/RecuperaciondeCuenta.jsx
import React, { useState } from "react";
import Tabla from "../component/Table";
//import { useTableActions } from "../hook/useTableActions";

function RecuperarCuenta() {
    const moduleName = "Recuperar Cuenta";
    const { allButtons, handleActionClick } = useTableActions(moduleName);
    
    // DATOS INICIALES SIMULADOS (En memoria - no conectados al backend)
    const initialData = [
        { ID: 501, "ID Solicitud": 501, Usuario: "UsuarioA", Email: "a@email.com", "Fecha Solicitud": "2025-10-15", Estado: "Pendiente" },
        { ID: 502, "ID Solicitud": 502, Usuario: "UsuarioB", Email: "b@email.com", "Fecha Solicitud": "2025-10-14", Estado: "Completada" },
        { ID: 503, "ID Solicitud": 503, Usuario: "UsuarioC", Email: "c@email.com", "Fecha Solicitud": "2025-10-14", Estado: "Pendiente" },
    ];
    const [solicitudes, setSolicitudes] = useState(initialData);

    const columns = ["ID Solicitud", "Usuario", "Email", "Fecha Solicitud", "Estado"];

    // LÓGICA DEL BOTÓN AGREGAR (POST)
    const handleAddSolicitud = () => {
        const newId = Math.max(...solicitudes.map(s => s.ID)) + 1;
        const newRequest = {
            ID: newId, 
            "ID Solicitud": newId, 
            Usuario: prompt("Usuario que solicita:"), 
            Email: prompt("Email de contacto:"), 
            "Fecha Solicitud": new Date().toISOString().slice(0, 10), 
            Estado: "Pendiente" 
        };

        if (newRequest.Usuario === null || newRequest.Email === null) {
            alert("Creación cancelada.");
            return;
        }

        setSolicitudes([...solicitudes, newRequest]);
        alert(`Solicitud ID: ${newId} agregada. ¡Revísala!`);
    };

    // LÓGICA DE ACCIONES DE FILA (Eliminar/Editar)
    const handleLocalActionClick = (actionName, rowData) => { 
        
        if (actionName === "Editar") {
            const nuevoEstado = prompt(`Revisando solicitud ID: ${rowData.ID}. Ingrese nuevo estado (Pendiente/Completada/Rechazada):`, rowData.Estado);
            
            if (nuevoEstado === null) {
                alert("Edición cancelada.");
                return;
            }

            // Actualización del estado (Frontend)
            const solicitudesActualizadas = solicitudes.map(s => 
                s.ID === rowData.ID ? { ...s, Estado: nuevoEstado } : s
            );
            setSolicitudes(solicitudesActualizadas);
            
            // Simulación de acción administrativa
            if (nuevoEstado === "Completada") {
                alert(`Solicitud ID: ${rowData.ID} completada. Se envió el enlace de restablecimiento al email ${rowData.Email} (Simulado).`);
            } else {
                alert(`Solicitud ID: ${rowData.ID} actualizada a ${nuevoEstado}.`);
            }
        } 
        else if (actionName === "Eliminar") {
            if (window.confirm(`¿Estás seguro de CERRAR/BORRAR la solicitud ID: ${rowData.ID}?`)) {
                
                // Actualización del estado (Frontend)
                const newSolicitudes = solicitudes.filter(s => s.ID !== rowData.ID);
                setSolicitudes(newSolicitudes); 
                alert(`Solicitud ID: ${rowData.ID} cerrada correctamente.`);
            }
        } 
        else if (actionName === "Agregar") {
             handleAddSolicitud();
        }
        else {
             handleActionClick(actionName, rowData);
        }
    };

    return (
        <>
        <Tabla 
            columns={columns} 
            data={solicitudes} 
            title={"🔑 GESTIÓN DE RECUPERACIÓN DE CUENTAS (SIMULADO)"} 
            actions={allButtons} 
            onActionClick={handleLocalActionClick} 
            onAddClick={handleAddSolicitud} 
        />
        </>
    )
}

export default RecuperarCuenta;