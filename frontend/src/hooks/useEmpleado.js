import empleadoService from "../services/empleadoService.js";
import useListado from "./useListado";

export const useEmpleado = (opciones) => {
  const l = useListado(empleadoService, opciones);
  return {
    empleado: l.items,
    isLoading: l.isLoading,
    cargandoInicial: l.cargandoInicial,
    error: l.error,
    clearError: l.clearError,
    fetchEmpleados: l.cargar,
    createEmpleado: l.crear,
    updateEmpleado: l.actualizar,
    deleteEmpleado: l.eliminar,
    searchEmpleado: l.buscar,
    paginacion: l.paginacion,
    setPagina: l.setPagina,
    setLimite: l.setLimite,
  };
};

export default useEmpleado;
