import { pedir, armarQuery } from "./api";

// tipo: "producto" | "insumo" | "cliente" | "usuario"
export const papeleraService = {
  listar: (tipo, params = {}) => pedir(`/papelera/${tipo}${armarQuery(params)}`),
  restaurar: (tipo, id) => pedir(`/papelera/${tipo}/${id}/restaurar`, { method: "POST" }),
};

export const auditoriaService = {
  listar: (params = {}) => pedir(`/auditoria${armarQuery(params)}`),
  usuarios: () => pedir("/auditoria/usuarios"),
};

export default papeleraService;
