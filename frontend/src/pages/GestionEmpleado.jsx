import React from "react";
import Tabla from "../component/Table";
import ModalUsuario from "../component/ModalEmpleado";
import useEmpleado from "../hooks/useEmpleado";
import Paginacion from "../component/Paginacion";
import eliminarConConfirmacion from "../component/avisos/eliminarConConfirmacion";
import { useState } from "react";

function GestionEmpleado() {
  const {
    empleado,
    cargandoInicial,
    error,
    clearError,
    updateEmpleado,
    createEmpleado,
    deleteEmpleado,
    searchEmpleado,
    fetchEmpleados,
    paginacion,
    setPagina,
    setLimite,
  } = useEmpleado({ paginado: true });

  const columns = [
    "id_usuario",
    "nombre_usuario",
    "apellido_usuario",
    "email",
    "nro_telefono",
    "rol"
  ];

  // Usamos las clases personalizadas para los botones (Editar azul, Eliminar rojo)
  const actions = [
    { name: "Editar", className: "btn-editar" },
    { name: "Eliminar", className: "btn-eliminar" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onAddClick = () => {
    setShowModal(true);
  };

  // Solo la primera vez: después la tabla se queda en pantalla mientras busca o cambia de página
  if (cargandoInicial) {
    return <p className="text-center p-5 text-white fs-2">Cargando empleados...</p>;
  }

  const handleActionClick = async (action, row) => {
    if (action === "Eliminar") {
      await eliminarConConfirmacion({
        tipo: "usuario",
        etiqueta: "Empleado",
        id: row.id_usuario,
        nombre: `${row.nombre_usuario} ${row.apellido_usuario}`,
        nota: "No va a poder iniciar sesión. Vas a poder restaurarlo desde la Papelera.",
        eliminar: () => deleteEmpleado(row.id_usuario),
        recargar: fetchEmpleados,
      });
    }

    if (action === "Editar") {
      setEditingUsuario(row);
      setShowModal(true);
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        
        {/* CABECERA: TÍTULO BLANCO Y BUSCADOR PREMIUM */}
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">👥 GESTIÓN DE EMPLEADOS</h2>
          
          <div className="search-container-premium" style={{ width: "400px" }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input-premium w-100"
              placeholder="Buscar empleado..."
              value={searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setSearchTerm(v);
                searchEmpleado(v);
              }}
            />
          </div>
        </div>

        {error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center mb-4 shadow">
            {error}
            <button className="btn-close" onClick={clearError}></button>
          </div>
        )}

        {/* TABLA EN CONTENEDOR NEGRO TRANSPARENTE */}
        <div className="tabla-container-pro shadow-lg">
          <Tabla
            columns={columns}
            data={empleado}
            title="" 
            actions={actions}
            onAddClick={onAddClick}
            onActionClick={handleActionClick}
          />
          <Paginacion paginacion={paginacion} onCambiarPagina={setPagina} onCambiarLimite={setLimite} />
        </div>
      </div>

      {showModal && (
        <ModalUsuario
          onClose={() => {
            setShowModal(false);
            setEditingUsuario(null); 
          }}
          onCreate={createEmpleado}
          onUpdate={updateEmpleado}
          editingUsuario={editingUsuario}
        />
      )}
    </div>
  );
}

export default GestionEmpleado;