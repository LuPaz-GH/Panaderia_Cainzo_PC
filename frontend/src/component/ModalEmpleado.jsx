import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { avisar, notificar } from "./avisos/Avisos";

function ModalUsuario({ onClose, onCreate, onUpdate, editingUsuario }) {
  const [formData, setFormData] = useState({
    nombre_usuario: "",
    apellido_usuario: "",
    contrasena: "",
    email: "",
    nro_telefono: "",
    rol: "",
  });

  useEffect(() => {
    if (editingUsuario) {
      setFormData({
        nombre_usuario: editingUsuario.nombre_usuario || "",
        apellido_usuario: editingUsuario.apellido_usuario || "",
        contrasena: "", // La contraseña no se muestra; vacía = no cambiarla
        email: editingUsuario.email || "",
        nro_telefono: editingUsuario.nro_telefono || "",
        rol: editingUsuario.rol || "",
      });
    }
  }, [editingUsuario]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // La tabla se recarga sola después de guardar (no hace falta recargar la página)
  const handleSubmit = async () => {
    const nombre = `${formData.nombre_usuario} ${formData.apellido_usuario}`.trim();
    if (editingUsuario) {
      const result = await onUpdate(editingUsuario.id_usuario, formData);
      if (result.success) {
        notificar({ tipo: "editar", titulo: "Empleado actualizado", mensaje: nombre });
        onClose();
      } else {
        avisar({ tipo: "error", titulo: "No se pudo actualizar", mensaje: result.error });
      }
      return;
    }

    const result = await onCreate(formData);
    if (result.success) {
      notificar({ tipo: "exito", titulo: "Empleado creado", mensaje: nombre });
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
              {editingUsuario ? "✏️ Editar Usuario" : "👥 Agregar Usuario"}
            </h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* BODY CON TODOS TUS CAMPOS INTEGRADOS */}
          <div className="modal-body p-4 pt-0">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Nombre</label>
                <input
                  name="nombre_usuario"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.nombre_usuario}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Apellido</label>
                <input
                  name="apellido_usuario"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.apellido_usuario}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Email</label>
                <input
                  type="email"
                  name="email"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Teléfono</label>
                <input
                  name="nro_telefono"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.nro_telefono}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Contraseña</label>
                <input
                  name="contrasena"
                  type="password"
                  className="form-control bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px" }}
                  value={formData.contrasena}
                  onChange={handleChange}
                  placeholder={editingUsuario ? "Dejala vacía para no cambiarla" : ""}
                />
              </div>

              <div className="col-md-12">
                <label className="form-label fw-bold" style={{color: "#caa26e"}}>Rol</label>
                <select
                  name="rol"
                  className="form-select bg-dark text-white border-secondary p-3"
                  style={{ borderRadius: "12px", appearance: "auto" }}
                  value={formData.rol}
                  onChange={handleChange}
                >
                  <option value="" className="bg-dark text-muted">Seleccione un rol</option>
                  <option value="Dueño" className="bg-dark">Dueño</option>
                  <option value="Encargado" className="bg-dark">Encargado</option>
                  <option value="Empleado" className="bg-dark">Empleado</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer border-0 p-4 pt-0">
            <button className="btn btn-outline-light px-4" onClick={onClose} style={{borderRadius: "12px"}}>
              Cancelar
            </button>
            <button className="btn btn-primary px-4 fw-bold shadow" onClick={handleSubmit} style={{borderRadius: "12px"}}>
              {editingUsuario ? "Guardar Cambios" : "Guardar Usuario"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalUsuario;