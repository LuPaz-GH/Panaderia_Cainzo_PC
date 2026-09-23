// LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { API_URL, guardarSesion } from "../services/api";
import { avisar } from "../component/avisos/Avisos";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [verContraseña, setVerContraseña] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !contrasena) {
      avisar({ tipo: "info", titulo: "Faltan datos", mensaje: "Completá tu email y tu contraseña." });
      return;
    }
    try {
      const response = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, contrasena }),
      });
      const data = await response.json();
      if (!data.success) {
        avisar({
          tipo: "error",
          titulo: "No pudimos iniciar sesión",
          mensaje: data.message === "Credenciales incorrectas" ? "El email o la contraseña no son correctos." : data.message,
        });
        return;
      }
      // Guardar usuario y token (el token identifica quién hace cada cambio)
      guardarSesion(data.data, data.token);
      navigate("/HomePage");
    } catch (error) {
      avisar({
        tipo: "error",
        titulo: "Sin conexión con el servidor",
        mensaje: "Revisá que el backend esté prendido (npm run dev en la carpeta backend).",
      });
    }
  };
  return (
    <section className="login-page">
      <div className="login-card">
        <div className="login-logo" aria-hidden="true">🥐</div>

        <h1 className="login-marca">Panificadora Cainzo</h1>
        <p className="login-subtitulo">¡Qué bueno verte de nuevo!</p>

        <div className="login-separador">Iniciar sesión</div>

        <form onSubmit={handleSubmit}>
          <div className="login-campo">
            <label htmlFor="typeEmailX">Email</label>
            <div className="login-input">
              <span className="icono" aria-hidden="true">✉️</span>
              <input
                type="email"
                id="typeEmailX"
                placeholder="ejemplo@email.com"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="login-campo">
            <label htmlFor="typePasswordX">Contraseña</label>
            <div className="login-input">
              <span className="icono" aria-hidden="true">🔒</span>
              <input
                type={verContraseña ? "text" : "password"}
                id="typePasswordX"
                placeholder="••••••••"
                autoComplete="current-password"
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
              />
              <button
                type="button"
                className="login-ver"
                onClick={() => setVerContraseña(!verContraseña)}
                aria-label={verContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
                title={verContraseña ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {verContraseña ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button className="login-boton" type="submit">
            Ingresar
          </button>
        </form>

        <p className="login-pie">Horneado con amor, todos los días 🌿</p>
      </div>
    </section>
  );
}

export default LoginPage;
