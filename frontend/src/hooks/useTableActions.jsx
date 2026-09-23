// src/hook/useTableActions.jsx
import { useNavigate } from "react-router-dom";

// Define la lista COMPLETA y ORDENADA de todas las acciones
export const ALL_ACTIONS = [
    // Botones de Acción de Datos
    { name: "Editar", className: "btn-warning" },
    { name: "Eliminar", className: "btn-danger" }, 
];

// Función base que maneja la navegación y la simulación de acciones
export const useTableActions = (moduleName) => {
    const navigate = useNavigate();

    const handleActionClick = (actionName, rowData) => {
        const action = ALL_ACTIONS.find(a => a.name === actionName);

        // Si la acción es de navegación (tiene 'path')
        if (action && action.path) {
            if (action.path === -1) {
                navigate(-1); 
            } else {
                navigate(action.path);
            }
        } 
        // Si la acción es de datos (Editar/Eliminar) - La lógica de mutación debe estar en el componente de página
        else if (actionName === "Editar") {
            alert(`[${moduleName}] Editando registro ID: ${rowData.ID}.`);
        } else if (actionName === "Eliminar") {
            // Este caso es simulado, la lógica real de borrado debe estar en el componente de página
            alert(`[${moduleName}] Confirmación de borrado para ID: ${rowData.ID}.`);
        }
    };
    
    const handleAddClick = () => {
        alert(`Navegando a la pantalla de AGREGAR nuevo registro en ${moduleName}.`);
    };

    // Filtramos los botones para la vista actual (excluyendo el botón del propio módulo)
    const allButtons = ALL_ACTIONS.filter(action => action.name !== moduleName);

    return {
        allButtons,
        handleActionClick,
        handleAddClick, 
    };
};