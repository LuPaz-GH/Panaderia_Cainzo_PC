import { pedir, armarQuery } from "./api";

class ProductoService {
  // Sin parámetros trae todos los productos (lo usa Ventas).
  // Con { pagina, limite, buscar } trae una página: devuelve también "paginacion".
  async getAll(params = {}) {
    const result = await pedir(`/producto${armarQuery(params)}`);
    if (!result.success) return { success: false, error: result.error || "Error al obtener productos" };
    return { success: true, data: result.data, paginacion: result.paginacion, total: result.paginacion?.total };
  }

  async create(productData) {
    return pedir("/producto", {
      method: "POST",
      body: JSON.stringify({
        nombre: productData.nombre,
        cantidad: productData.cantidad,
        precio_unitario: productData.precio_unitario,
        unidad_medida: productData.unidad_medida,
        cantidad_minima: productData.cantidad_minima,
      }),
    });
  }

  async update(id, productData) {
    return pedir(`/producto/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: productData.nombre,
        cantidad: productData.cantidad,
        precio_unitario: productData.precio_unitario,
        unidad_medida: productData.unidad_medida,
        cantidad_minima: productData.cantidad_minima,
      }),
    });
  }

  // Borrado lógico: queda en la Papelera
  async delete(id) {
    return pedir(`/producto/${id}`, { method: "DELETE" });
  }
}

export const productoService = new ProductoService();
export default productoService;
