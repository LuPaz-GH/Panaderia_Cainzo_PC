import React, { useState, useEffect } from "react";
import clienteService from "../services/clienteService";
import empleadoService from "../services/empleadoService";
import ventaService from "../services/ventaService";
import productoService from "../services/productosService";
import { avisar, notificar } from "./avisos/Avisos";
function ModalVenta({ onClose }) {
  const [formData, setFormData] = useState({
    id_cliente: "",
    id_usuario: "",
    fecha_venta: "",
    total: "",
    metodo_pago: "Tarjeta Crédito",
  });

  const [clientes, setClientes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [productos, setProductos] = useState([])

  useEffect(() => {
    cargarClientes();
    cargarUsuarios();
    cargarProductos();
  }, []);


  const cargarProductos = async () =>{
    const res = await productoService.getAll()
    if(res.success) setProductos(res.data);
  }

  const cargarClientes = async () => {
    const res = await clienteService.getAll();
    if (res.success) setClientes(res.data);
  };

  const cargarUsuarios = async () => {
    const res = await empleadoService.getAll();
    if (res.success) setUsuarios(res.data);
  };

  // -------------------------------
  // Manejo del form
  // -------------------------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    const res = await ventaService.createVenta(formData);

    if (res.success) {
      notificar({ tipo: "exito", titulo: "Venta registrada" });
      // Se recarga para ver la venta nueva; se espera un momento para que se vea el aviso
      setTimeout(() => window.location.reload(), 1200);
    } else {
      avisar({ tipo: "error", titulo: "No se pudo registrar la venta", mensaje: res.error });
    }
  };

  return (
    <div
      className="modal d-block"
      tabIndex="-1"
      style={{ background: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content" style={{ borderRadius: "12px" }}>
          
          {/* HEADER */}
          <div
            className="modal-header text-white"
            style={{
              background: "linear-gradient(135deg, #0d6efd, #54a0ff)",
            }}
          >
            <h5 className="modal-title fw-bold">Registrar Venta</h5>
            <button className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          {/* BODY */}
          <div className="modal-body p-4">
            <div className="row g-3">

              {/* CLIENTE */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Cliente</label>
                <select
                  name="id_cliente"
                  className="form-select"
                  value={formData.id_cliente}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un cliente</option>
                  {clientes.map((c) => (
                    <option key={c.id_cliente} value={c.id_cliente}>
                      {c.nombre} {c.apellido}
                    </option>
                  ))}
                </select>
              </div>

              {/* USUARIO */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Vendedor / Usuario</label>
                <select
                  name="id_usuario"
                  className="form-select"
                  value={formData.id_usuario}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un usuario</option>
                  {usuarios.map((u) => (
                    <option key={u.id_usuario} value={u.id_usuario}>
                      {u.nombre} {u.apellido} — ({u.rol})
                    </option>
                  ))}
                </select>
              </div>

              {/* PRODUCTO */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Producto</label>
                <select
                  name="id_producto"
                  className="form-select"
                  value={formData.id_producto}
                  onChange={handleChange}
                >
                  <option value="">Seleccione un producto</option>
                  {productos.map((p) => (
                    <option key={p.id_producto} value={p.id_producto}>
                      {p.nombre}
                    </option>
                  ))}
                </select>
              </div>

              {/* FECHA */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Fecha de Venta</label>
                <input
                  type="date"
                  name="fecha_venta"
                  className="form-control"
                  value={formData.fecha_venta}
                  onChange={handleChange}
                />
              </div>

              {/* TOTAL */}
              <div className="col-md-6">
                <label className="form-label fw-semibold">Total</label>
                <input
                  type="number"
                  name="total"
                  className="form-control"
                  value={formData.total}
                  onChange={handleChange}
                />
              </div>

              {/* MÉTODO DE PAGO */}
              <div className="col-12">
                <label className="form-label fw-semibold">Método de Pago</label>
                <select
                  name="metodo_pago"
                  className="form-select"
                  value={formData.metodo_pago}
                  onChange={handleChange}
                >
                  <option>Tarjeta Crédito</option>
                  <option>Tarjeta Débito</option>
                  <option>Transferencia</option>
                  <option>Efectivo</option>
                </select>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="modal-footer">
            <button className="btn btn-outline-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button className="btn btn-primary" onClick={handleSubmit}>
              Registrar Venta
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

export default ModalVenta;
