import { pedir } from "./api";

class VentaService {
  async getAll() {
    const result = await pedir("/venta");
    if (!result.success) return { success: false, error: result.error || "Error al obtener ventas" };
    return { success: true, data: result.data };
  }

  // Registra la venta, su detalle y descuenta el stock (en una sola transacción)
  async createVenta(nuevaVenta) {
    return pedir("/venta/registrar", {
      method: "POST",
      body: JSON.stringify(nuevaVenta),
    });
  }
}

export const ventaService = new VentaService();
export default ventaService;
