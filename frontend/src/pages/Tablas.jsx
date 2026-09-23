import React, { useState, useEffect } from "react";
import Tabla from "../component/Table";
import { useTableActions } from "../hooks/useTableActions"; 
import GraficasReportes from "../component/GraficasReportes";
import { getDatosEstadisticas } from "../services/estadisticasService";
import { avisar } from "../component/avisos/Avisos";

function Tablas() {
    const moduleName = "Tablas";
    const { allButtons } = useTableActions(moduleName);

    const [datosVentas, setDatosVentas] = useState([]);
    const [datosInsumos, setDatosInsumos] = useState([]);
    const [datosPagos, setDatosPagos] = useState([]);
    const [reporteEnEdicion, setReporteEnEdicion] = useState(null);

    const [reportes, setReportes] = useState([
        { ID: 1, Reporte: "Stock Mínimo", Descripción: "Insumos por debajo del límite crítico", "Fecha Generación": "20/10/2025" },
        { ID: 2, Reporte: "Ventas Mensuales", Descripción: "Resumen de salida de mercadería", "Fecha Generación": "20/10/2025" },
        { ID: 3, Reporte: "Ventas del Día", Descripción: "Detalle de transacciones realizadas hoy", "Fecha Generación": new Date().toLocaleDateString() },
        { ID: 4, Reporte: "Ventas de la Semana", Descripción: "Resumen de ventas de los últimos 7 días", "Fecha Generación": new Date().toLocaleDateString() },
    ]);

    useEffect(() => {
        const cargarDatos = async () => {
            try {
                const res = await getDatosEstadisticas();
                if (res.productos) setDatosVentas(res.productos);
                if (res.insumos) setDatosInsumos(res.insumos);
                if (res.pagos) setDatosPagos(res.pagos);
            } catch (error) {
                console.error("Error al cargar estadísticas:", error);
            }
        };
        cargarDatos();
    }, []);

    const ejecutarDescarga = (reporte) => {
        const nombreBuscado = reporte.Reporte.toLowerCase();
        const esInsumo = nombreBuscado.includes("stock");
        
        let dataOriginal = esInsumo ? datosInsumos : datosVentas;

        if (!dataOriginal || dataOriginal.length === 0) {
            avisar({ tipo: "info", titulo: "Reporte vacío", mensaje: "No hay registros en la base de datos para este reporte." });
            return;
        }

        let dataParaDescargar = dataOriginal;
        
        if (!esInsumo) {
            // Mapeamos los datos EXCLUYENDO el método de pago
            dataParaDescargar = dataOriginal.map(v => ({
                Producto: v.nombre || v.Producto || "Sin nombre",
                Cantidad: v.cantidad || v.Cantidad || 0,
                "Fecha de Venta": v.fecha_venta ? v.fecha_venta.split("T")[0] : new Date().toLocaleDateString()
            }));
        }

        const headers = Object.keys(dataParaDescargar[0]).join(",");
        const rows = dataParaDescargar.map(row => Object.values(row).map(v => `"${v}"`).join(",")).join("\n");
        const csvContent = "sep=,\n" + headers + "\n" + rows;
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        link.href = URL.createObjectURL(blob);
        link.setAttribute("download", `${reporte.Reporte}.csv`);
        link.click();
    };

    const handleLocalActionClick = (actionName, rowData) => {
        if (actionName === "Eliminar") {
            setReportes(reportes.filter(r => r.ID !== rowData.ID));
        } else if (actionName === "Editar") {
            setReporteEnEdicion({ ...rowData });
        } else if (actionName === "Ver" || actionName === "Descargar") {
            ejecutarDescarga(rowData);
        }
    };

    return (
        <div className="p-5" style={{ minHeight: "100vh" }}>
            <div className="container-fluid">
                <h2 className="text-center titulo-analitico mb-5">📊 PANEL ANALÍTICO</h2>
                
                <div className="dark-card-panel mb-5 shadow-lg">
                    <GraficasReportes datosVentas={datosVentas} datosInsumos={datosInsumos} datosPagos={datosPagos} />
                </div>

                <div className="tabla-container-pro shadow-lg">
                    <Tabla 
                        columns={["Reporte", "Descripción", "Fecha Generación"]} 
                        data={reportes} 
                        title={""} 
                        actions={allButtons} 
                        onActionClick={handleLocalActionClick} 
                    />
                </div>
            </div>

            {reporteEnEdicion && (
                <div className="modal d-block" style={{backgroundColor: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(10px)', zIndex: 10000}}>
                    <div className="modal-dialog modal-dialog-centered">
                        <div className="modal-content border-0 shadow-lg" style={{borderRadius: '25px', backgroundColor: '#151515', color: 'white'}}>
                            <div className="modal-header border-0 p-4">
                                <h5 className="modal-title fw-bold" style={{color: '#ffffff'}}>Editar Reporte</h5>
                                <button type="button" className="btn-close btn-close-white" onClick={() => setReporteEnEdicion(null)}></button>
                            </div>
                            <div className="modal-body p-4 pt-0">
                                <label className="form-label text-muted">Descripción del Reporte</label>
                                <input 
                                    type="text" 
                                    className="form-control bg-dark text-white border-secondary p-3" 
                                    style={{borderRadius: '12px'}}
                                    value={reporteEnEdicion.Descripción}
                                    onChange={(e) => setReporteEnEdicion({...reporteEnEdicion, Descripción: e.target.value})}
                                />
                            </div>
                            <div className="modal-footer border-0 p-4 pt-0 d-flex justify-content-between">
                                <button className="btn btn-warning px-4 fw-bold shadow-sm" onClick={() => ejecutarDescarga(reporteEnEdicion)}>📥 Descargar CSV</button>
                                <button className="btn btn-success px-4 shadow-sm" onClick={() => {
                                    setReportes(reportes.map(r => r.ID === reporteEnEdicion.ID ? reporteEnEdicion : r));
                                    setReporteEnEdicion(null);
                                }}>Guardar Cambios</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Tablas;