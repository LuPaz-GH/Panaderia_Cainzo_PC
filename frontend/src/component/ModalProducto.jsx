import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { avisar, notificar } from "./avisos/Avisos";

function ModalProducto({ onClose, onCreate, onUpdate, editingProducto }) {
  // Mantenemos tu estado original con TODOS los campos
  const [formData, setFormData] = useState({
    nombre: "",
    cantidad: "",
    precio_unitario: "",
    unidad_medida: "",
    cantidad_minima: "",
  });

  useEffect(() => {
    if (editingProducto) {
      setFormData({
        nombre: editingProducto.nombre || "",
        cantidad: editingProducto.cantidad || "",
        precio_unitario: editingProducto.precio_unitario || "",
        unidad_medida: editingProducto.unidad_medida || "",
        cantidad_minima: editingProducto.cantidad_minima || "",
      });
    }
  }, [editingProducto]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // La tabla se recarga sola después de guardar (no hace falta recargar la página)
  const handleSubmit = async () => {
    if (editingProducto) {
      const result = await onUpdate(editingProducto.id_producto, formData);
      if (result.success) {
        notificar({ tipo: "editar", titulo: "Producto actualizado", mensaje: formData.nombre });
        onClose();
      } else {
        avisar({ tipo: "error", titulo: "No se pudo actualizar", mensaje: result.error });
      }
      return;
    }

    const result = await onCreate(formData);
    if (result.success) {
      notificar({ tipo: "exito", titulo: result.message || "Producto creado", mensaje: formData.nombre });
      onClose();
    } else {
      avisar({ tipo: "error", titulo: "No se pudo crear", mensaje: result.error });
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{
        background: "rgba(0,0,0,0.85)", 
        backdropFilter: "blur(10px)",
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "25px",
            backgroundColor: "#151515", // Fondo negro premium
            color: "white",
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-0 p-4">
            <h5 className="modal-title fw-bold" style={{ color: "#ffffff", fontSize: "1.5rem" }}>
              {editingProducto ? "✏️ Editar Producto" : "➕ Agregar Producto"}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* BODY CON TODOS TUS CAMPOS RECUPERADOS */}
          <div className="modal-body p-4 pt-0">
            <div className="row g-3">
              {/* Nombre */}
              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Nombre del Producto</label>
                <input
                  name="nombre"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Cañoncito"
                />
              </div>

              {/* Cantidad */}
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.cantidad}
                  onChange={handleChange}
                />
              </div>

              {/* Precio Unitario */}
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Precio Unitario ($)</label>
                <input
                  type="number"
                  name="precio_unitario"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.precio_unitario}
                  onChange={handleChange}
                />
              </div>

              {/* Unidad de medida */}
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Unidad de Medida</label>
                <input
                  name="unidad_medida"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.unidad_medida}
                  onChange={handleChange}
                  placeholder="Ej: C/u o Gr"
                />
              </div>

              {/* Cantidad mínima */}
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Stock Mínimo (Alerta)</label>
                <input
                  type="number"
                  name="cantidad_minima"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.cantidad_minima}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-end gap-2">
            <button
              className="btn btn-outline-light px-4"
              style={{ borderRadius: "12px" }}
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary px-4 fw-bold shadow"
              style={{ borderRadius: "12px", background: "#0d6efd" }}
              onClick={handleSubmit}
            >
              {editingProducto ? "Guardar Cambios" : "Crear Producto"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalProducto;