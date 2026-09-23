import VentaService, { ventaService } from "../services/ventaService.js";
import { useState, useEffect, useCallback } from "react";

export const useVenta = () => {
  const [venta, setVentas] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchVenta = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await ventaService.getAll();

      if (result.success) {
        setVentas(result.data);
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError(err.message || "Error al cargar ventas");
    } finally {
      setIsLoading(false);
    }
  }, []);

const crearVenta = useCallback(async (nuevaVenta) => {
  setIsLoading(true);
  const result = await ventaService.createVenta(nuevaVenta);

  if (!result.success) {
    setError(result.error);
  } else {
    await fetchVenta();
  }

  setIsLoading(false);

  return result; 
}, [fetchVenta]);

const clearError = useCallback(() => {
  setError(null);
}, []);


  // Carga inicial
  useEffect(() => {
    fetchVenta();
  }, [fetchVenta]);



  return{
    venta,
    isLoading,
    error,
    fetchVenta,
    clearError,
    crearVenta
  };
};

export default useVenta