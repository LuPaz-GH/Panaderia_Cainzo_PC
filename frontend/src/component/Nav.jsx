// Nav.jsx
import React from "react";
import { useNavigate } from "react-router-dom"; 
function Navbar({title,desc,item}) {
    const navigate = useNavigate(); 

    const handleNavigation = (linkText) => {
        // INICIO ahora navega a /catalogo
        if (linkText === "INICIO") {
            navigate("/catalogo"); 
        // LOGIN navega a /login
        } else if (linkText === "LOGIN") {
            navigate("/login");
        } 
    };

    return(
        <nav className="navbar navbar-expand-lg bg-body-tertiary fixed-top">
            <div className="container-fluid">
                {/* Usamos onClick para navegar */}
                <a 
                    className="navbar-brand" 
                    onClick={() => handleNavigation("INICIO")} 
                    style={{cursor: 'pointer'}}
                >
                    {title}
                </a>
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="collapse" 
                    data-bs-target="#navbarSupportedContent" 
                    aria-controls="navbarSupportedContent" 
                    aria-expanded="false" 
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarSupportedContent">
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                        <li className="nav-item">
                            <a 
                                className="nav-link active" 
                                aria-current="page" 
                                onClick={() => handleNavigation("INICIO")}
                                style={{cursor: 'pointer'}}
                            >
                                INICIO
                            </a>
                        </li>
                        <li className="nav-item">
                            <a 
                                className="nav-link" 
                                onClick={() => handleNavigation("LOGIN")}
                                style={{cursor: 'pointer'}}
                            >
                                LOGIN
                            </a>
                        </li>
                    </ul>
                    <form className="d-flex" role="search">
                        <input 
                            className="form-control me-2" 
                            type="search" 
                            placeholder="Buscar" 
                            aria-label="Search"
                        />
                        <button className="btn btn-outline-success" type="submit">Buscar</button>
                    </form>
                </div>
            </div>
        </nav>
    )
}

export default Navbar;