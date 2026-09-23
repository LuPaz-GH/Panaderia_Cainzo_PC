// controllers/papeleraControllers.js
// Lista lo eliminado (borrado lógico) y permite restaurarlo.
import { ENTIDADES, listarEliminados, restaurar } from "../utils/entidades.js";

const tipoValido = (tipo) => Object.prototype.hasOwnProperty.call(ENTIDADES, tipo);

export const obtenerPapelera = async (req, res) => {
  try {
    const { tipo } = req.params;
    if (!tipoValido(tipo)) {
      return res.status(400).json({ success: false, error: "Tipo de papelera inválido" });
    }
    const resultado = await listarEliminados(tipo, req.query, req.usuario);
    res.json({ success: true, ...resultado });
  } catch (error) {
    console.error("Error al obtener la papelera:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};

export const restaurarRegistro = async (req, res) => {
  try {
    const { tipo, id } = req.params;
    if (!tipoValido(tipo)) {
      return res.status(400).json({ success: false, error: "Tipo de papelera inválido" });
    }
    const { status, body } = await restaurar(tipo, id, req.usuario);
    res.status(status).json(body);
  } catch (error) {
    console.error("Error al restaurar:", error);
    res.status(500).json({ success: false, error: "Error del servidor" });
  }
};
