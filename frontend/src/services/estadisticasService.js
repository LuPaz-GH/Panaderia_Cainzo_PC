import axios from "axios";
import { API_URL as SERVIDOR } from "./api";

const API_URL = `${SERVIDOR}/api/estadisticas`;

export const getDatosEstadisticas = async () => {
    try {
        const response = await axios.get(`${API_URL}/dashboard`);

        return {
            productos: response.data.productos || [],
            insumos: response.data.insumos || [],
            pagos: response.data.pagos || []
        };
    } catch (error) {
        console.error("Error al conectar con el servidor de estadísticas:", error);
        return { productos: [], insumos: [], pagos: [] };
    }
};
