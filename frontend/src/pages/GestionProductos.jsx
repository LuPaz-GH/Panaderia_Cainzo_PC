import React from "react";
import Tabla from "../component/Table";
import useProductos from "../hooks/useProductos";
import ModalProducto from "../component/ModalProducto";
import Paginacion from "../component/Paginacion";
import eliminarConConfirmacion from "../component/avisos/eliminarConConfirmacion";
import { useState } from "react";

function GestionProductos() {
  const {
    products,
    cargandoInicial,
    error,
    clearError,
    updateProducto,
    crearProducto,
    deleteProducto,
    searchProductos,
    fetchProducts,
    paginacion,
    setPagina,
    setLimite,
  } = useProductos({ paginado: true });

  const columns = [
    "id_producto",
    "nombre",
    "cantidad",
    "precio_unitario",
    "unidad_medida",
    "cantidad_minima",
  ];

  const actions = [
    { name: "Editar", className: "btn-editar" }, 
    { name: "Eliminar", className: "btn-eliminar" },
  ];
  
  const [showModal, setShowModal] = useState(false);
  const [editingProducto, setEditingProducto] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const onAddClick = () => {
    setShowModal(true);
  };

  // Solo la primera vez: después la tabla se queda en pantalla mientras busca o cambia de página
  if (cargandoInicial) {
    return <p className="text-center p-5 text-white fs-2">Cargando productos...</p>;
  }

  const handleActionClick = async (action, row) => {
    if (action === "Eliminar") {
      await eliminarConConfirmacion({
        tipo: "producto",
        etiqueta: "Producto",
        id: row.id_producto,
        nombre: row.nombre,
        eliminar: () => deleteProducto(row.id_producto),
        recargar: fetchProducts,
      });
    }

    if (action === "Editar") {
      setEditingProducto(row);
      setShowModal(true);
    }
  };

  return (
    <div className="p-5" style={{ minHeight: "100vh" }}>
      <div className="container-fluid">
        
        {/* Cabecera Premium */}
        <div className="header-gestion-flex">
          <h2 className="titulo-gestion m-0">
            📦 GESTIÓN DE PRODUCTOS
          </h2>

          <div className="search-container-premium" style={{ width: "400px" }}>
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input-premium w-100"
              placeholder="Buscar producto..."
              value={searchTerm}
              onChange={(e) => {
                const v = e.target.value;
                setSearchTerm(v);
                searchProductos(v);
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

        {/* Tabla en el contenedor negro transparente */}
        <div className="tabla-container-pro shadow-lg">
          <Tabla
            columns={columns}
            data={products}
            title=""  /* Dejar vacío para que no use el estilo blanco de la tabla */
            actions={actions}
            onAddClick={onAddClick}
            onActionClick={handleActionClick}
          />
          <Paginacion paginacion={paginacion} onCambiarPagina={setPagina} onCambiarLimite={setLimite} />
        </div>
      </div>

      {showModal && (
        <ModalProducto
          onClose={() => {
            setShowModal(false);
            setEditingProducto(null);
          }}
          onCreate={crearProducto}
          onUpdate={updateProducto}
          editingProducto={editingProducto}
        />
      )}
    </div>
  );
}

export default GestionProductos;