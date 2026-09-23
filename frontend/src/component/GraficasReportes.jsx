import React from 'react';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement
} from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const GraficasReportes = ({ datosVentas = [], datosInsumos = [], datosPagos = [] }) => {
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: '#ffffff',
          font: { family: 'Georgia', size: 16, weight: 'bold' },
          padding: 25
        }
      }
    },
    scales: {
      y: { 
        ticks: { color: '#ffffff', font: { size: 14 } }, 
        grid: { color: 'rgba(255, 255, 255, 0.1)' } 
      },
      x: { 
        ticks: { color: '#ffffff', font: { size: 14 } } 
      }
    }
  };

  const dataProductos = {
    labels: datosVentas.length > 0 ? datosVentas.map(d => d.nombre) : ["Cargando..."],
    datasets: [{
      label: 'Unidades',
      data: datosVentas.map(d => d.cantidad),
      backgroundColor: ['#5ff043ff', '#dd0e0eff', '#041cf1ff', '#caa26e', '#ff9f40'],
      borderRadius: 10
    }]
  };

  const dataInsumos = {
    labels: datosInsumos.length > 0 ? datosInsumos.map(i => i.nombre) : ["Cargando..."],
    datasets: [{
      data: datosInsumos.map(i => i.uso),
      backgroundColor: ['#d6b894', '#caa26e', '#5c3d2e', '#f5e6d3', '#8b4513'],
    }]
  };

  const dataPagos = {
    // CORRECCIÓN: Busca 'nombre' o 'metodo_pago' para que no salga vacío
    labels: datosPagos.length > 0 
      ? datosPagos.map(p => p.nombre || p.metodo_pago || "Otro") 
      : ["Sin ventas registradas"],
    datasets: [{
      data: datosPagos.map(p => p.cantidad || 0),
      backgroundColor: ['#334b2aff', '#caa26e', '#5c3d2e'],
      borderWidth: 0
    }]
  };

  return (
    <div className="row g-5 justify-content-center">
      <div className="col-12 col-xl-4" style={{ height: '480px' }}>
        <h3 className="text-center text-white mb-4 fw-bold">📊 Rotación</h3>
        <Bar data={dataProductos} options={options} />
      </div>
      <div className="col-12 col-xl-4" style={{ height: '480px' }}>
        <h3 className="text-center text-white mb-4 fw-bold">🍞 Insumos</h3>
        <Pie data={dataInsumos} options={options} />
      </div>
      <div className="col-12 col-xl-4" style={{ height: '480px' }}>
        <h3 className="text-center text-white mb-4 fw-bold">💳 Pagos</h3>
        <Doughnut data={dataPagos} options={options} />
      </div>
    </div>
  );
};

export default GraficasReportes;