import insumoService from "../services/insumoService";
import useListado from "./useListado";

export const useInsumo = (opciones) => {
  const l = useListado(insumoService, opciones);
  return {
    insumo: l.items,
    isLoading: l.isLoading,
    cargandoInicial: l.cargandoInicial,
    error: l.error,
    clearError: l.clearError,
    fetchInsumos: l.cargar,
    crearInsumo: l.crear,
    updateInsumo: l.actualizar,
    deleteInsumo: l.eliminar,
    searchInsumo: l.buscar,
    paginacion: l.paginacion,
    setPagina: l.setPagina,
    setLimite: l.setLimite,
  };
};

export default useInsumo;
