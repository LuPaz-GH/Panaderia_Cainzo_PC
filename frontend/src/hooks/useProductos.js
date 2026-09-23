import productoService from "../services/productosService";
import useListado from "./useListado";

// useProductos() trae todos los productos (Ventas).
// useProductos({ paginado: true }) trae de a una página (Gestión de Productos).
export const useProductos = (opciones) => {
  const l = useListado(productoService, opciones);
  return {
    products: l.items,
    isLoading: l.isLoading,
    cargandoInicial: l.cargandoInicial,
    error: l.error,
    clearError: l.clearError,
    fetchProducts: l.cargar,
    crearProducto: l.crear,
    updateProducto: l.actualizar,
    deleteProducto: l.eliminar,
    searchProductos: l.buscar,
    paginacion: l.paginacion,
    setPagina: l.setPagina,
    setLimite: l.setLimite,
  };
};

export default useProductos;
