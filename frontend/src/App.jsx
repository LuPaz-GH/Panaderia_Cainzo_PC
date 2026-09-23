// App.jsx
import { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './App.css'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage';
import Body from './component/Body';
import GestionEmpleado from './pages/GestionEmpleado';
import GestionProductos from './pages/GestionProductos';
import GestionStock from './pages/GestionStock';
import GestionCliente from './pages/GestionClientes';
import GestionInsumos from './pages/GestionInsumos';
import Navbar from './component/Nav';
import SideMenu from './component/SideMenu'; 


import Ventas from "./pages/Ventas.jsx";
import RecuperarCuenta from "./pages/RecuperaciondeCuenta.jsx"; 
import Tablas from "./pages/Tablas.jsx";
import Papelera from "./pages/Papelera.jsx";
import Historial from "./pages/Historial.jsx";

// Componente para el catálogo público con su Navbar
function PublicCatalog() {
  return (
    <>
      <Navbar 
        title={"PANIFICADORA CAINZO"} 
        desc={"INICIO"} 
        item={"LOGIN"} 
      />
      <Body />
    </>
  );
}

function App() {
  return (
    <div>
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
 
        <Route path="/catalogo" element={<PublicCatalog />} />

        <Route path="/login" element={<LoginPage />} />
 
        <Route path="/HomePage" element={<HomePage />} />

        <Route path="/gestion-empleado" element={<SideMenu><GestionEmpleado /></SideMenu>} />

        <Route path="/gestion-productos" element={<SideMenu><GestionProductos /></SideMenu>} />
        
        {/* RUTAS CON LOS NUEVOS COMPONENTES */}
        <Route path="/ventas" element={<SideMenu><Ventas /></SideMenu>} />
        
        {/* Usamos el nombre del componente que importamos: RecuperarCuenta */}
        <Route path="/recuperar-cuenta" element={<SideMenu><RecuperarCuenta /></SideMenu>} />
        
        <Route path="/tablas" element={<SideMenu><Tablas /></SideMenu>} />

        <Route path="/actualizar-stock" element={<SideMenu><GestionStock /></SideMenu>} />

        <Route path='/actualizar-insumos' element={<SideMenu><GestionInsumos /></SideMenu>} />
        
        <Route path='/clientes' element={<SideMenu><GestionCliente /></SideMenu>} />

        <Route path='/papelera' element={<SideMenu><Papelera /></SideMenu>} />

        <Route path='/historial' element={<SideMenu><Historial /></SideMenu>} />

      </Routes>
    </Router>
    </div>
  )
}

export default App