import React from "react";
import Tabla from "../component/Table";
import useCliente from "../hooks/useCliente";
import { useState } from "react";
import ModalCliente from "../component/ModalCliente";
import Paginacion from "../component/Paginacion";
import eliminarConConfirmacion from "../component/avisos/eliminarConConfirmacion";

function GestionCliente() {
  const {
    cliente,
    cargandoInicial,
    error,
    clearError,
    crearCliente,
    updateCliente,
    deleteCliente,
    searchCliente,
    fetchCliente,
    paginacion,
    setPagina,
    setLimite,
  } = useCliente({ paginado: true });

  const columns = [
    "id_cliente",
    "nombre",
    "apellido",
    "telefono",
    "email",
    "direccion",
    "fecha_registro",
    "cantidad_compra",
    "ultima_compra",
  ];

  // Usamos las clases de App.css para mantener el color de los botones
  const actions = [
    { name: "Editar", className: "btn-editar" },
    { name: "Eliminar", className: "btn-eliminar" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onAddClick = () => {
    setShowModal(true);
  };

  // Solo la primera vez: después la tabla se queda en pantalla mientras busca o cambia de página
  if (cargandoInicial) {
    return <p className="text-center p-5 text-white fs-2">Cargando clientes...</p>;
  }

  const handleActionClick = async (action, row) => {
    if (action === "Eliminar") {
      await eliminarConConfirmacion({
        tipo: "cliente",
        etiqueta: "Cliente",
        id: row.id_cliente,
        nombre: `${row.nombre} ${row.apellido}`,
        eliminar: () => deleteCliente(row.id_cliente),
        recargar: fetchCliente,
      });
    }

    if (action === "Editar") {
      setEditingCliente(row);
      setShowModal(true);
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        
        {/* CABECERA: TÍTULO BLANCO Y BUSCADOR PREMIUM */}
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">
            👥 GESTIÓN DE CLIENTES
          </h2>

          <div className="search-container-premium" style={{ width: "400px" }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input-premium w-100"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setSearchTerm(v);
                searchCliente(v);
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

        {/* CONTENEDOR NEGRO TRANSPARENTE PARA LA TABLA */}
        <div className="tabla-container-pro shadow-lg">
          <Tabla
            columns={columns}
            data={cliente}
            title="" /* Vacío para evitar el estilo blanco por defecto */
            actions={actions}
            onAddClick={onAddClick}
            onActionClick={handleActionClick}
          />
          <Paginacion paginacion={paginacion} onCambiarPagina={setPagina} onCambiarLimite={setLimite} />
        </div>
      </div>

      {showModal && (
        <ModalCliente
          onClose={() => {
            setShowModal(false);
            setEditingCliente(null); 
          }}
          onCreate={crearCliente}
          onUpdate={updateCliente}
          editingCliente={editingCliente}
        />
      )}
    </div>
  );
}

export default GestionCliente;