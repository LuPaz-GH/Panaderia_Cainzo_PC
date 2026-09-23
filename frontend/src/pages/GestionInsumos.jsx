import React from "react";
import Tabla from "../component/Table";
import useInsumo from "../hooks/useInsumo";
import ModalInsumo from "../component/ModalInsumo"
import Paginacion from "../component/Paginacion";
import eliminarConConfirmacion from "../component/avisos/eliminarConConfirmacion";
import { useState } from "react";

function GestionInsumos() {
  const {
    insumo,
    cargandoInicial,
    error,
    clearError,
    crearInsumo,
    updateInsumo,
    deleteInsumo,
    searchInsumo,
    fetchInsumos,
    paginacion,
    setPagina,
    setLimite,
  } = useInsumo({ paginado: true });

  const columns = [
    "id_insumo",
    "nombre_insumo",
    "proveedor",
    "cantidad",
    "cantidad_minima",
  ];

  // Usamos las clases que definimos en App.css para los botones
  const actions = [
    { name: "Editar", className: "btn-editar" },
    { name: "Eliminar", className: "btn-eliminar" },
  ];

  const [showModal, setShowModal] = useState(false);
  const [editingInsumo, setEditingInsumo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onAddClick = () => {
    setShowModal(true)
  };

  // Solo la primera vez: después la tabla se queda en pantalla mientras busca o cambia de página
  if (cargandoInicial) {
    return <p className="text-center p-5 text-white fs-2">Cargando insumos...</p>;
  }

  const handleActionClick = async (action, row) => {
    if (action === "Eliminar") {
      await eliminarConConfirmacion({
        tipo: "insumo",
        etiqueta: "Insumo",
        id: row.id_insumo,
        nombre: row.nombre_insumo,
        eliminar: () => deleteInsumo(row.id_insumo),
        recargar: fetchInsumos,
      });
    }

    if (action === "Editar") {
      setEditingInsumo(row);
      setShowModal(true);
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        
        {/* CABECERA: TÍTULO BLANCO Y BUSCADOR PREMIUM ALINEADOS */}
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">
            🍞 GESTIÓN DE INSUMOS
          </h2>

          <div className="search-container-premium" style={{ width: "400px" }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input-premium w-100"
              placeholder="Buscar insumo..."
              value={searchTerm}
              onChange={(e) => {
                const i = e.target.value;
                setSearchTerm(i);
                searchInsumo(i);
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
            data={insumo}
            title=""  /* Dejamos vacío para mantener el estilo negro */
            actions={actions}
            onAddClick={onAddClick}
            onActionClick={handleActionClick}
          />
          <Paginacion paginacion={paginacion} onCambiarPagina={setPagina} onCambiarLimite={setLimite} />
        </div>
      </div>

      {showModal && (
        <ModalInsumo
          onClose={() => {
            setShowModal(false);
            setEditingInsumo(null); 
          }}
          onCreate={crearInsumo}
          onUpdate={updateInsumo}
          editingInsumo={editingInsumo}
        />
      )}
    </div>
  );
}

export default GestionInsumos;