import clienteService from "../services/clienteService.js";
import useListado from "./useListado";

export const useCliente = (opciones) => {
  const l = useListado(clienteService, opciones);
  return {
    cliente: l.items,
    isLoading: l.isLoading,
    cargandoInicial: l.cargandoInicial,
    error: l.error,
    clearError: l.clearError,
    fetchCliente: l.cargar,
    crearCliente: l.crear,
    updateCliente: l.actualizar,
    deleteCliente: l.eliminar,
    searchCliente: l.buscar,
    paginacion: l.paginacion,
    setPagina: l.setPagina,
    setLimite: l.setLimite,
  };
};

export default useCliente;
