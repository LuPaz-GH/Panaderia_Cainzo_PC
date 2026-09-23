import React, { useState, useEffect } from "react";
import clienteService from "../services/clienteService";
import productoService from "../services/productosService";
import { avisar } from "./avisos/Avisos";

const USUARIOS_URL = "http://localhost:3000/api/usuarios/";

function ModalNuevaVenta({ onClose, onCreateVenta, onUpdateVenta, editingVenta }) {
  const [encabezado, setEncabezado] = useState({
    id_cliente: "",
    id_usuario: "",
    metodo_pago: "Efectivo",
  });

  const [carrito, setCarrito] = useState([]);
  const [totalVenta, setTotalVenta] = useState(0);

  const [clientesDb, setClientesDb] = useState([]);
  const [usuariosDb, setUsuariosDb] = useState([]);
  const [productosDb, setProductosDb] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [error, setError] = useState("");

  const [productoSeleccionado, setProductoSeleccionado] = useState("");
  const [cantidadInput, setCantidadInput] = useState("");

  const [newClientData, setNewClientData] = useState({ nombre: "", apellido: "", telefono: "", direccion: "", email: "" });

  // Función auxiliar para recargar clientes
  const recargarClientes = async () => {
      const clientesRes = await clienteService.getAll();
      if (clientesRes.success) {
          setClientesDb(clientesRes.data);
          return clientesRes.data;
      }
      return [];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await recargarClientes(); // Carga inicial de clientes

        const productosRes = await productoService.getAll();
        if (productosRes.success) setProductosDb(productosRes.data);

        const usuariosRes = await fetch(USUARIOS_URL);
        if (usuariosRes.ok) {
           const data = await usuariosRes.json();
           setUsuariosDb(Array.isArray(data) ? data : (data.data || []));
        }

        if (editingVenta) {
            setEncabezado({
                id_cliente: editingVenta.id_cliente,
                id_usuario: editingVenta.id_usuario,
                metodo_pago: editingVenta.metodo_pago
            });

            if (editingVenta.detalles) {
                const carritoRecuperado = editingVenta.detalles.map(d => ({
                    id_producto: d.id_producto,
                    nombre: d.producto ? d.producto.nombre : "Producto borrado",
                    precio_unitario: parseFloat(d.precio_unitario),
                    cantidad: parseFloat(d.cantidad),
                    unidad: d.producto ? d.producto.unidad_medida : "u",
                    subtotal: parseFloat(d.cantidad) * parseFloat(d.precio_unitario)
                }));
                setCarrito(carritoRecuperado);
                setTotalVenta(parseFloat(editingVenta.total));
            }
        }
      } catch (err) {
        setError("Error cargando listas.");
      } finally {
        setIsLoadingData(false);
      }
    };
    fetchData();
  }, [editingVenta]);

  const handleEncabezadoChange = (e) => setEncabezado({ ...encabezado, [e.target.name]: e.target.value });
  const handleNewClientChange = (e) => setNewClientData({ ...newClientData, [e.target.name]: e.target.value });

  // Manejador para el total manual (type="text" para evitar bloqueo de teclado)
  const handleAmountChange = (e) => {
    const value = e.target.value;
    if (/^[0-9.,]*$/.test(value)) {
        setTotalVenta(value); // Guardamos como string temporalmente para edición
    }
  };

  const agregarProducto = () => {
    if (!productoSeleccionado) return avisar({ tipo: "info", titulo: "Elegí un producto", mensaje: "Seleccioná un producto de la lista." });
    if (!cantidadInput || parseFloat(cantidadInput) <= 0) return avisar({ tipo: "info", titulo: "Cantidad inválida", mensaje: "Ingresá una cantidad mayor a 0." });

    const productoInfo = productosDb.find(p => p.id_producto === parseInt(productoSeleccionado));
    if (!productoInfo) return;

    const nuevoItem = {
        id_producto: productoInfo.id_producto,
        nombre: productoInfo.nombre,
        precio_unitario: parseFloat(productoInfo.precio_unitario),
        cantidad: parseFloat(cantidadInput),
        unidad: productoInfo.unidad_medida,
        subtotal: parseFloat(cantidadInput) * parseFloat(productoInfo.precio_unitario)
    };

    const nuevoCarrito = [...carrito, nuevoItem];
    setCarrito(nuevoCarrito);
    // Actualizamos el total numérico
    setTotalVenta(nuevoCarrito.reduce((acc, item) => acc + item.subtotal, 0));
    setProductoSeleccionado("");
    setCantidadInput("");
  };

  const eliminarDelCarrito = (index) => {
    const nuevoCarrito = carrito.filter((_, i) => i !== index);
    setCarrito(nuevoCarrito);
    setTotalVenta(nuevoCarrito.reduce((acc, item) => acc + item.subtotal, 0));
  };

  const handleSubmit = async () => {
    setError("");
    if (!encabezado.id_usuario) return setError("Seleccione empleado.");
    
    // Convertir total a número seguro
    const totalNumerico = parseFloat(String(totalVenta).replace(',', '.'));
    if (!totalNumerico || totalNumerico <= 0) return setError("El total debe ser mayor a 0.");

    let finalClientId = encabezado.id_cliente;

    // LÓGICA DE CREACIÓN DE CLIENTE
    if (isCreatingClient) {
        if(!newClientData.nombre || !newClientData.apellido) return setError("Nombre y Apellido son obligatorios.");
        
        try {
            const res = await clienteService.create(newClientData);
            
            if (res.success) {
                // 1. Intentar obtener ID directamente
                let nuevoId = res.data.id_cliente || res.data.insertId;

                // 2. Si no viene el ID, recargar lista y buscar por nombre (Plan B infalible)
                if (!nuevoId) {
                    const listaActualizada = await recargarClientes();
                    const encontrado = listaActualizada.find(c => 
                        c.nombre.toLowerCase() === newClientData.nombre.toLowerCase() && 
                        c.apellido.toLowerCase() === newClientData.apellido.toLowerCase()
                    );
                    if (encontrado) nuevoId = encontrado.id_cliente;
                }

                if (nuevoId) {
                    finalClientId = nuevoId;
                    // Ya tenemos el ID, seguimos con la venta
                } else {
                    return setError("Cliente creado pero no se pudo recuperar su ID. Búsquelo en la lista.");
                }
            } else {
                return setError("Error al crear cliente: " + res.error);
            }
        } catch(e) { 
            return setError("Error crítico creando cliente."); 
        }
    } else if (!finalClientId) {
         return setError("Seleccione un cliente existente.");
    }

    // Armar paquete de venta
    const ventaCompleta = {
        id_cliente: finalClientId,
        id_usuario: encabezado.id_usuario,
        metodo_pago: encabezado.metodo_pago,
        detalles: carrito,
        // Si el carrito está vacío pero pusieron total manual, el backend lo calculará como 0 si no mandamos detalles
        // pero en tu lógica actual el backend recalcula el total basado en detalles. 
        // Si permites ventas sin productos (solo monto), deberías ajustar el backend. 
        // Asumimos venta con productos:
    };

    if (editingVenta) {
        const result = await onUpdateVenta(editingVenta.id_venta, ventaCompleta);
        if (result && !result.success) setError(result.error);
    } else {
        const result = await onCreateVenta(ventaCompleta);
        if (result && !result.success) setError(result.error);
    }
  };

  // Estilos
  const primaryColor = '#5c3d2e';
  const secondaryColor = '#d4904e';

  return (
    <div className="modal d-block" style={{ background: "rgba(0,0,0,0.6)", zIndex: 1055 }}>
      <div className="modal-dialog modal-dialog-centered modal-lg">
        <div className="modal-content" style={{ borderRadius: '16px', border: 'none' }}>
          <div className="modal-header" style={{ background: 'linear-gradient(135deg, #fff8f0 0%, #f5e6d3 100%)' }}>
            <h5 className="modal-title fw-bold" style={{ color: primaryColor }}>
                {editingVenta ? "✏️ Editar Venta" : "🛒 Nueva Venta"}
            </h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body p-4" style={{ backgroundColor: '#fffaf5' }}>
            
            <div className="row g-2 mb-3">
                <div className="col-6">
                    <label className="small fw-bold text-muted">Empleado</label>
                    <select className="form-select form-select-sm" name="id_usuario" value={encabezado.id_usuario} onChange={handleEncabezadoChange}>
                        <option value="">-- Seleccionar --</option>
                        {usuariosDb.map(u => <option key={u.id_usuario} value={u.id_usuario}>{u.nombre_usuario} {u.apellido_usuario}</option>)}
                    </select>
                </div>
                <div className="col-6">
                    <label className="small fw-bold text-muted">Cliente</label>
                    {!isCreatingClient ? (
                        <div className="input-group input-group-sm">
                            <select className="form-select" name="id_cliente" value={encabezado.id_cliente} onChange={handleEncabezadoChange}>
                                <option value="">-- Seleccionar --</option>
                                {clientesDb.map(c => <option key={c.id_cliente} value={c.id_cliente}>{c.nombre} {c.apellido}</option>)}
                            </select>
                            <button className="btn btn-outline-primary" onClick={() => setIsCreatingClient(true)} title="Nuevo Cliente">+</button>
                        </div>
                    ) : (
                        <div className="p-2 border rounded bg-white">
                            <div className="d-flex gap-1 mb-1">
                                <input className="form-control form-control-sm" placeholder="Nombre *" name="nombre" onChange={handleNewClientChange}/>
                                <input className="form-control form-control-sm" placeholder="Apellido *" name="apellido" onChange={handleNewClientChange}/>
                            </div>
                            <div className="d-flex gap-1 mb-1">
                                <input className="form-control form-control-sm" placeholder="Teléfono" name="telefono" onChange={handleNewClientChange}/>
                                <input className="form-control form-control-sm" placeholder="Email" name="email" onChange={handleNewClientChange}/>
                            </div>
                            <div className="d-grid">
                                <button className="btn btn-sm btn-outline-secondary py-0" onClick={() => setIsCreatingClient(false)}>Cancelar creación</button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-3 rounded mb-3" style={{backgroundColor: '#fdf3e6', border: '1px dashed #d4904e'}}>
                <div className="row g-2">
                    <div className="col-6"><select className="form-select" value={productoSeleccionado} onChange={(e)=>setProductoSeleccionado(e.target.value)}><option value="">-- Producto --</option>{productosDb.map(p=><option key={p.id_producto} value={p.id_producto}>{p.nombre} (${p.precio_unitario})</option>)}</select></div>
                    <div className="col-3"><input type="number" className="form-control" placeholder="Cant." value={cantidadInput} onChange={(e)=>setCantidadInput(e.target.value)}/></div>
                    <div className="col-3"><button className="btn w-100 text-white" onClick={agregarProducto} style={{backgroundColor: secondaryColor}}>Agregar</button></div>
                </div>
            </div>

            <div className="table-responsive mb-3" style={{maxHeight: '200px'}}>
                <table className="table table-sm table-hover">
                    <thead className="table-light"><tr><th>Producto</th><th>$ Unit</th><th>Cant</th><th>Subtotal</th><th></th></tr></thead>
                    <tbody>
                        {carrito.map((item, i) => (
                            <tr key={i}><td>{item.nombre}</td><td>${item.precio_unitario}</td><td>{item.cantidad} {item.unidad}</td><td>${item.subtotal}</td><td><button className="btn btn-sm text-danger fw-bold" onClick={()=>eliminarDelCarrito(i)}>X</button></td></tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="row align-items-center p-3 rounded bg-dark text-white">
                <div className="col-6">
                    <select className="form-select form-select-sm" name="metodo_pago" value={encabezado.metodo_pago} onChange={handleEncabezadoChange}><option value="Efectivo">Efectivo</option><option value="Tarjeta">Tarjeta</option><option value="Transferencia">Transf.</option></select>
                </div>
                <div className="col-6 text-end">
                    {/* Input Type Text para permitir edición manual libre del total */}
                    <div className="input-group input-group-sm">
                        <span className="input-group-text bg-secondary text-white border-0">$</span>
                        <input 
                            type="text" 
                            className="form-control bg-dark text-white border-0 fw-bold text-end fs-4" 
                            value={totalVenta} 
                            onChange={handleAmountChange}
                        />
                    </div>
                </div>
            </div>
            {error && <div className="alert alert-danger mt-2 small">{error}</div>}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancelar</button>
            <button className="btn btn-success fw-bold px-4" onClick={handleSubmit} disabled={carrito.length===0 && totalVenta==0}>
                {editingVenta ? "Guardar Cambios" : "Confirmar Venta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ModalNuevaVenta;