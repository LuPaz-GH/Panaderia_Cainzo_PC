// component/avisos/eliminarConConfirmacion.js
// Flujo común de "Eliminar": tarjeta de confirmación → borrado lógico → notificación con "Deshacer".
import { confirmar, avisar, notificar } from "./Avisos";
import papeleraService from "../../services/papeleraService";

/**
 * tipo:      "producto" | "insumo" | "cliente" | "usuario" (para restaurar desde la papelera)
 * etiqueta:  "Producto", "Insumo", "Cliente", "Empleado"
 * id, nombre: del registro
 * eliminar:  () => Promise<{ success, error }>
 * recargar:  () => void  (vuelve a cargar la tabla)
 * nota:      texto opcional debajo del nombre
 */
export const eliminarConConfirmacion = async ({ tipo, etiqueta, id, nombre, eliminar, recargar, nota }) => {
  const ok = await confirmar({
    tipo: "peligro",
    titulo: `¿Eliminar este ${etiqueta.toLowerCase()}?`,
    destacado: nombre,
    nota: nota || "Vas a poder restaurarlo desde la Papelera.",
    textoAceptar: "Sí, eliminar",
    textoCancelar: "Cancelar",
  });
  if (!ok) return;

  const result = await eliminar();
  if (!result.success) {
    await avisar({ tipo: "error", titulo: "No se pudo eliminar", mensaje: result.error });
    return;
  }

  notificar({
    tipo: "peligro",
    titulo: `${etiqueta} eliminado`,
    mensaje: nombre,
    accion: {
      texto: "Deshacer",
      onClick: async () => {
        const r = await papeleraService.restaurar(tipo, id);
        if (r.success) {
          recargar();
          notificar({ tipo: "restaurar", titulo: `${etiqueta} restaurado`, mensaje: nombre });
        } else {
          avisar({ tipo: "error", titulo: "No se pudo deshacer", mensaje: r.error });
        }
      },
    },
  });
};

export default eliminarConConfirmacion;
