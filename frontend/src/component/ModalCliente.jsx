import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { avisar, notificar } from "./avisos/Avisos";

function ModalCliente({ onClose, onCreate, onUpdate, editingCliente }) {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    telefono: "",
    email: "",
    direccion: "",
    fecha_registro: "",
    cantidad_compra: "",
    ultima_compra: "",
  });

  useEffect(() => {
    if (editingCliente) {
      setFormData({
        nombre: editingCliente.nombre || "",
        apellido: editingCliente.apellido || "",
        telefono: editingCliente.telefono || "",
        email: editingCliente.email || "",
        direccion: editingCliente.direccion || "",
        fecha_registro: editingCliente.fecha_registro?.split("T")[0] || "",
        cantidad_compra: editingCliente.cantidad_compra || "",
        ultima_compra: editingCliente.ultima_compra?.split("T")[0] || "",
      });
    }
  }, [editingCliente]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    const result = editingCliente 
      ? await onUpdate(editingCliente.id_cliente, formData)
      : await onCreate(formData);

    // La tabla se recarga sola después de guardar (no hace falta recargar la página)
    const nombre = `${formData.nombre} ${formData.apellido}`.trim();
    if (result.success) {
      notificar({
        tipo: editingCliente ? "editar" : "exito",
        titulo: editingCliente ? "Cliente actualizado" : "Cliente creado",
        mensaje: nombre,
      });
      onClose();
    } else {
      avisar({ tipo: "error", titulo: editingCliente ? "No se pudo actualizar" : "No se pudo crear", mensaje: result.error });
    }
  };

  return (
    <div
      className="modal d-block"
      style={{
        background: "rgba(0,0,0,0.85)", 
        backdropFilter: "blur(10px)",
        zIndex: 9999
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
              {editingCliente ? "✏️ Editar Cliente" : "➕ Agregar Cliente"}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* BODY CON TODOS TUS CAMPOS INTEGRADOS */}
          <div className="modal-body p-4 pt-0">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Nombre</label>
                <input name="nombre" className="form-control bg-dark text-white border-secondary p-3" value={formData.nombre} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Apellido</label>
                <input name="apellido" className="form-control bg-dark text-white border-secondary p-3" value={formData.apellido} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Teléfono</label>
                <input name="telefono" className="form-control bg-dark text-white border-secondary p-3" value={formData.telefono} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Email</label>
                <input name="email" className="form-control bg-dark text-white border-secondary p-3" value={formData.email} onChange={handleChange} />
              </div>

              <div className="col-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Dirección</label>
                <input name="direccion" className="form-control bg-dark text-white border-secondary p-3" value={formData.direccion} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Fecha De Registro</label>
                <input type="date" name="fecha_registro" className="form-control bg-dark text-white border-secondary p-3" value={formData.fecha_registro} onChange={handleChange} />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Última Compra</label>
                <input type="date" name="ultima_compra" className="form-control bg-dark text-white border-secondary p-3" value={formData.ultima_compra} onChange={handleChange} />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Cantidad de Compra</label>
                <input name="cantidad_compra" className="form-control bg-dark text-white border-secondary p-3" value={formData.cantidad_compra} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 p-4 pt-0">
            <button className="btn btn-outline-light px-4" onClick={onClose} style={{borderRadius: "12px"}}>
              Cancelar
            </button>
            <button className="btn btn-primary px-4 fw-bold shadow" onClick={handleSubmit} style={{borderRadius: "12px"}}>
              {editingCliente ? "Guardar Cambios" : "Guardar Cliente"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalCliente;