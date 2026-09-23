import { pedir, armarQuery } from "./api";

class ClienteService {
  // Sin parámetros trae todos (lo usa Ventas). Con { pagina, limite, buscar } trae una página.
  async getAll(params = {}) {
    const result = await pedir(`/cliente${armarQuery(params)}`);
    if (!result.success) return { success: false, error: result.error || "Error al obtener clientes" };
    return { success: true, data: result.data, paginacion: result.paginacion, total: result.paginacion?.total };
  }

  async create(clientData) {
    return pedir("/cliente", {
      method: "POST",
      body: JSON.stringify({
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        telefono: clientData.telefono,
        email: clientData.email,
        direccion: clientData.direccion,
        fecha_registro: clientData.fecha_registro,
        cantidad_compra: clientData.cantidad_compra,
        ultima_compra: clientData.ultima_compra,
      }),
    });
  }

  async update(id, clientData) {
    return pedir(`/cliente/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre: clientData.nombre,
        apellido: clientData.apellido,
        telefono: clientData.telefono,
        email: clientData.email,
        direccion: clientData.direccion,
        fecha_registro: clientData.fecha_registro,
        cantidad_compra: clientData.cantidad_compra,
        ultima_compra: clientData.ultima_compra,
      }),
    });
  }

  // Borrado lógico: queda en la Papelera
  async delete(id) {
    return pedir(`/cliente/${id}`, { method: "DELETE" });
  }
}

export const clienteService = new ClienteService();
export default clienteService;
