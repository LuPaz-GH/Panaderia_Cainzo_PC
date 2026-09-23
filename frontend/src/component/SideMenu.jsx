import React from "react";
import { useNavigate } from "react-router-dom";
import { cerrarSesion, esDueno } from "../services/api";

function SideMenu({ children }) {
    const navigate = useNavigate();
    const currentPath = window.location.pathname;

    const menuItems = [
        { name: "Página de Inicio", icon: "🏠", path: "/HomePage" },
        { name: "Gestión de Empleados", icon: "👤", path: "/gestion-empleado" },
        { name: "Gestión de Productos", icon: "🥖", path: "/gestion-productos" },
        { name: "Actualizar Insumos", icon: "🌾", path: "/actualizar-insumos" },
        { name: "Ventas", icon: "💰", path: "/ventas" },
        //{ name: "Recuperar Cuenta", icon: "🔑", path: "/recuperar-cuenta" },
        { name: "Tablas", icon: "📊", path: "/tablas" },
        { name: "Clientes", icon: "👥", path: "/clientes" },
        { name: "Papelera", icon: "🗑️", path: "/papelera" },
        // El historial de cambios solo lo ve el administrador (Dueño)
        ...(esDueno() ? [{ name: "Historial", icon: "📜", path: "/historial" }] : []),
    ];

    const handleNavigation = (path) => {
        navigate(path);
    };

    const handleCerrarSesion = () => {
        cerrarSesion();
        navigate("/login");
    };

    const isMenuItemActive = (path) => {
        return currentPath === path;
    };

    return (
        <div style={{ display: "flex", height: "100vh" }}>

            <div
                style={{
                    width: "250px",
                    height: "100vh",
                    background: "#1f1f1fff",
                    color: "white",
                    padding: "20px 0",
                    position: "fixed",
                    top: 0,
                    left: 0,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    boxShadow: "2px 0 10px rgba(0,0,0,0.2)",
                }}
            >
                <div>
                    <div
                        style={{
                            padding: "0 20px 30px 20px",
                            fontSize: "1.6rem",
                            fontWeight: "bold",
                            color: "#d4904e",
                        }}
                    >
                        🥖 Admin Panel
                    </div>

                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        {menuItems.map((item) => (
                            <li
                                key={item.path}
                                onClick={() => handleNavigation(item.path)}
                                style={{
                                    padding: "12px 20px",
                                    cursor: "pointer",
                                    display: "flex",
                                    alignItems: "center",
                                    fontSize: "1.1rem",
                                    background: isMenuItemActive(item.path)
                                        ? "#d4904e"
                                        : "transparent",
                                    color: isMenuItemActive(item.path)
                                        ? "white"
                                        : "white",
                                    transition: "0.3s",
                                }}
                                onMouseEnter={(e) => {
                                    if (!isMenuItemActive(item.path))
                                        e.currentTarget.style.background =
                                            "#3a3a3a";
                                }}
                                onMouseLeave={(e) => {
                                    if (!isMenuItemActive(item.path))
                                        e.currentTarget.style.background =
                                            "transparent";
                                }}
                            >
                                <span style={{ marginRight: "15px", fontSize: "1.3rem" }}>
                                    {item.icon}
                                </span>
                                {item.name}
                            </li>
                        ))}
                    </ul>
                </div>

                <div style={{ padding: "20px" }}>
                    <button
                        onClick={handleCerrarSesion}
                        style={{
                            width: "100%",
                            background: "transparent",
                            border: "2px solid #d4904e",
                            color: "#d4904e",
                            borderRadius: "10px",
                            padding: "10px 0",
                            fontWeight: "600",
                            fontSize: "1rem",
                            cursor: "pointer",
                            transition: "0.3s",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#d4904e";
                            e.currentTarget.style.color = "white";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = "transparent";
                            e.currentTarget.style.color = "#d4904e";
                        }}
                    >
                        🚪 Cerrar Sesión
                    </button>
                </div>
            </div>


            <main
                style={{
                    marginLeft: "250px",
                    padding: "20px",
                    width: "calc(100% - 250px)",
                    overflowY: "auto",
                }}
            >
                {children}
            </main>
        </div>
    );
}

export default SideMenu;
