import { pedir, armarQuery } from "./api";

class EmpleadoService {
  // Sin parámetros trae todos (lo usa Ventas). Con { pagina, limite, buscar } trae una página.
  async getAll(params = {}) {
    const result = await pedir(`/usuario${armarQuery(params)}`);
    if (!result.success) return { success: false, error: result.error || "Error al obtener empleados" };
    return { success: true, data: result.data, paginacion: result.paginacion, total: result.paginacion?.total };
  }

  async create(empleadoData) {
    return pedir("/usuario", {
      method: "POST",
      body: JSON.stringify({
        nombre_usuario: empleadoData.nombre_usuario,
        apellido_usuario: empleadoData.apellido_usuario,
        contrasena: empleadoData.contrasena,
        email: empleadoData.email,
        nro_telefono: empleadoData.nro_telefono,
        rol: empleadoData.rol,
      }),
    });
  }

  // Si la contraseña va vacía, el backend deja la que ya tenía
  async update(id_usuario, empleadoData) {
    return pedir(`/usuario/${id_usuario}`, {
      method: "PUT",
      body: JSON.stringify({
        nombre_usuario: empleadoData.nombre_usuario,
        apellido_usuario: empleadoData.apellido_usuario,
        contrasena: empleadoData.contrasena,
        email: empleadoData.email,
        nro_telefono: empleadoData.nro_telefono,
        rol: empleadoData.rol,
      }),
    });
  }

  // Borrado lógico: el empleado ya no puede entrar y queda en la Papelera
  async delete(id_usuario) {
    return pedir(`/usuario/${id_usuario}`, { method: "DELETE" });
  }
}

export const empleadoService = new EmpleadoService();
export default empleadoService;
