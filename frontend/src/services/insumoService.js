import { pedir, armarQuery } from "./api";

class InsumoService {
  // Sin parámetros trae todos. Con { pagina, limite, buscar } trae una página.
  async getAll(params = {}) {
    const result = await pedir(`/insumo${armarQuery(params)}`);
    if (!result.success) return { success: false, error: result.error || "Error al obtener insumos" };
    return { success: true, data: result.data, paginacion: result.paginacion, total: result.paginacion?.total };
  }

  async create(insumoData) {
    return pedir("/insumo", {
      method: "POST",
      body: JSON.stringify({
        nombre_insumo: insumoData.nombre_insumo,
        proveedor: insumoData.proveedor,
        cantidad: insumoData.cantidad,
        cantidad_minima: insumoData.cantidad_minima,
      }),
    });
  }

  async update(id, insumoData) {
    return pedir(`/insumo/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre_insumo: insumoData.nombre_insumo,
        proveedor: insumoData.proveedor,
        cantidad: insumoData.cantidad,
        cantidad_minima: insumoData.cantidad_minima,
      }),
    });
  }

  // Borrado lógico: queda en la Papelera
  async delete(id) {
    return pedir(`/insumo/${id}`, { method: "DELETE" });
  }
}

export const insumoService = new InsumoService();
export default insumoService;
