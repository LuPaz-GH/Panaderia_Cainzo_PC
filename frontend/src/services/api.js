// services/api.js
// Cosas compartidas por todos los servicios: dirección del backend y datos de la sesión.
import { avisar } from "../component/avisos/Avisos";

// En tu compu usa el backend local; en Netlify usa VITE_API_URL (la dirección de Render)
export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const obtenerSesion = () => {
  try {
    return JSON.parse(localStorage.getItem("usuario"));
  } catch {
    return null;
  }
};

export const esDueno = () => obtenerSesion()?.rol === "Dueño";

export const guardarSesion = (usuario, token) => {
  localStorage.setItem("usuario", JSON.stringify(usuario));
  localStorage.setItem("token", token);
};

export const cerrarSesion = () => {
  localStorage.removeItem("usuario");
  localStorage.removeItem("token");
};

// Encabezados con el token, para que el backend sepa quién hace cada cambio
export const authHeaders = (extra = {}) => {
  const token = localStorage.getItem("token");
  return token ? { ...extra, Authorization: `Bearer ${token}` } : { ...extra };
};

// Arma "?pagina=1&limite=10&buscar=pan" ignorando los valores vacíos
export const armarQuery = (params = {}) => {
  const limpio = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== "");
  return limpio.length ? `?${new URLSearchParams(limpio)}` : "";
};

// Si el backend dice que la sesión venció, se avisa (una sola vez) y se vuelve al login
let avisoSesionMostrado = false;
const sesionVencida = async () => {
  if (avisoSesionMostrado) return;
  avisoSesionMostrado = true;
  cerrarSesion();
  await avisar({
    tipo: "info",
    titulo: "Tu sesión venció",
    mensaje: "Por seguridad, volvé a iniciar sesión para seguir trabajando.",
    textoAceptar: "Ir al inicio de sesión",
  });
  window.location.href = "/login";
};

// fetch que devuelve siempre { success, data, error, ... } y manda el token
export const pedir = async (ruta, opciones = {}) => {
  try {
    const response = await fetch(`${API_URL}${ruta}`, {
      ...opciones,
      headers: authHeaders({ "Content-Type": "application/json", ...(opciones.headers || {}) }),
    });
    if (response.status === 401) {
      sesionVencida();
      // No se resuelve: la página se va al login y así no aparecen otros carteles de error encima
      return new Promise(() => {});
    }
    const data = await response.json().catch(() => null);
    if (!response.ok || !data?.success) {
      return { success: false, error: data?.error || data?.message || `Error HTTP ${response.status}` };
    }
    return data;
  } catch (error) {
    return { success: false, error: error.message || "Error de conexión" };
  }
};
