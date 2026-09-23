import React, { useState, useEffect } from "react";
import { notificar } from "./avisos/Avisos";

function ModalInsumo({ onClose, onCreate, onUpdate, editingInsumo }) {
  const [form, setForm] = useState({
    nombre_insumo: "",
    proveedor: "",
    cantidad: "",
    cantidad_minima: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingInsumo) {
      setForm({
        nombre_insumo: editingInsumo.nombre_insumo || "",
        proveedor: editingInsumo.proveedor || "",
        cantidad: editingInsumo.cantidad || "",
        cantidad_minima: editingInsumo.cantidad_minima || "",
      });
    }
  }, [editingInsumo]);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    if (!form.nombre_insumo || !form.proveedor) {
      setError("Los campos Nombre y Proveedor son obligatorios.");
      return;
    }
    if (form.cantidad < 0 || form.cantidad_minima < 0) {
      setError("Las cantidades no pueden ser negativas.");
      return;
    }

    const result = editingInsumo 
      ? await onUpdate(editingInsumo.id_insumo, form)
      : await onCreate(form);

    // La tabla se recarga sola después de guardar (no hace falta recargar la página)
    if (result.success) {
      notificar({
        tipo: editingInsumo ? "editar" : "exito",
        titulo: editingInsumo ? "Insumo actualizado" : result.message || "Insumo creado",
        mensaje: form.nombre_insumo,
      });
      onClose();
    } else {
      setError(result.error || "Error en la operación");
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,0.85)", 
        backdropFilter: "blur(10px)",
        zIndex: 9999,
      }}
    >
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div
          className="modal-content border-0 shadow-lg"
          style={{
            borderRadius: "25px",
            backgroundColor: "#151515", 
            color: "white",
          }}
        >
          {/* HEADER */}
          <div className="modal-header border-0 p-4">
            <h5 className="modal-title fw-bold" style={{ color: "#ffffff", fontSize: "1.5rem" }}>
              {editingInsumo ? "✏️ Editar Insumo" : "➕ Agregar Insumo"}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* BODY CON TODOS LOS CAMPOS ORIGINALES */}
          <div className="modal-body p-4 pt-0">
            {error && <div className="alert alert-danger mb-3">{error}</div>}
            
            <div className="row g-3">
              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Nombre del Insumo</label>
                <input
                  type="text"
                  name="nombre_insumo"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={form.nombre_insumo}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Proveedor</label>
                <input
                  type="text"
                  name="proveedor"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={form.proveedor}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Cantidad</label>
                <input
                  type="number"
                  name="cantidad"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={form.cantidad}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Cantidad mínima</label>
                <input
                  type="number"
                  name="cantidad_minima"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={form.cantidad_minima}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 p-4 pt-0">
            <button className="btn btn-outline-light px-4" onClick={onClose} style={{ borderRadius: "12px" }}>
              Cancelar
            </button>
            <button className="btn btn-primary px-4 fw-bold shadow" onClick={handleSubmit} style={{ borderRadius: "12px" }}>
              {editingInsumo ? "Guardar Cambios" : "Agregar Insumo"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalInsumo;