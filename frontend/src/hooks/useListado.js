// hooks/useListado.js
// Lógica común de las pantallas de gestión: cargar, buscar, paginar, crear, editar y eliminar.
import { useState, useEffect, useCallback, useRef } from "react";

export const useListado = (service, { paginado = false, limiteInicial = 10 } = {}) => {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [cargandoInicial, setCargandoInicial] = useState(true);
  const [error, setError] = useState(null);
  const [pagina, setPagina] = useState(1);
  const [limite, setLimiteState] = useState(limiteInicial);
  const [busqueda, setBusqueda] = useState("");
  const [paginacion, setPaginacion] = useState(null);

  const cargar = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const params = paginado ? { pagina, limite, buscar: busqueda } : {};
    const result = await service.getAll(params);
    if (result.success) {
      setItems(result.data);
      setPaginacion(result.paginacion || null);
      // Si se eliminó lo último de la última página, volver a la anterior
      if (result.paginacion && pagina > result.paginacion.totalPaginas) {
        setPagina(result.paginacion.totalPaginas);
      }
    } else {
      setError(result.error);
    }
    setIsLoading(false);
    setCargandoInicial(false);
  }, [service, paginado, pagina, limite, busqueda]);

  useEffect(() => {
    cargar();
  }, [cargar]);

  // Búsqueda en el servidor: espera 300 ms después de la última tecla
  const temporizador = useRef();
  const buscar = useCallback((texto) => {
    clearTimeout(temporizador.current);
    temporizador.current = setTimeout(() => {
      setBusqueda((texto || "").trim());
      setPagina(1);
    }, 300);
  }, []);
  useEffect(() => () => clearTimeout(temporizador.current), []);

  const setLimite = useCallback((nuevoLimite) => {
    setLimiteState(nuevoLimite);
    setPagina(1);
  }, []);

  // Ejecuta una operación y, si salió bien, recarga la página actual
  const ejecutar = useCallback(
    async (operacion) => {
      setError(null);
      const result = await operacion();
      if (result.success) {
        await cargar();
      } else {
        setError(result.error);
      }
      return result;
    },
    [cargar]
  );

  const crear = useCallback((datos) => ejecutar(() => service.create(datos)), [ejecutar, service]);
  const actualizar = useCallback((id, datos) => ejecutar(() => service.update(id, datos)), [ejecutar, service]);
  const eliminar = useCallback((id) => ejecutar(() => service.delete(id)), [ejecutar, service]);
  const clearError = useCallback(() => setError(null), []);

  return {
    items,
    isLoading,
    cargandoInicial,
    error,
    clearError,
    cargar,
    buscar,
    pagina,
    setPagina,
    limite,
    setLimite,
    paginacion,
    crear,
    actualizar,
    eliminar,
  };
};

export default useListado;
