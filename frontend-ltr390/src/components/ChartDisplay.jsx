import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend
);

// Opciones para suavizar animación y mejorar apariencia del gráfico
const chartOptions = {
  responsive: true,
  animation: {
    duration: 500,
    easing: "easeOutQuart",
  },
  scales: {
    x: {
      display: true,
      title: {
        display: true,
        text: "Muestra",
      },
    },
    y: {
      display: true,
      title: {
        display: true,
        text: "Valor",
      },
    },
  },
};


const ChartDisplay = () => {
  const [dataPoints, setDataPoints] = useState([]);
  const [isSaving, setIsSaving] = useState(false); // Estado para controlar si se guardan los datos

  const startSaving = async () => {
    setIsSaving(true);
    try {
      await axios.post("http://localhost:3000/start"); // Endpoint para iniciar el guardado en el servidor
    } catch (error) {
      console.error("Error al iniciar el guardado", error);
    }
  };

  const stopSaving = async () => {
    setIsSaving(false);
    try {
      await axios.post("http://localhost:3000/stop"); // Endpoint para detener el guardado en el servidor
    } catch (error) {
      console.error("Error al detener el guardado", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("http://localhost:3000/data");
        const N = 50;
        setDataPoints(res.data.slice(-N)); //  últimos 50 datos
      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
  
    if (isSaving) {
      fetchData();
      const interval = setInterval(fetchData, 500); // Actualización cada 500ms
      return () => clearInterval(interval);
    }
  }, [isSaving]);
  
  

  const createChartData = (label, key, color) => ({
    labels: dataPoints.map((_, i) => i + 1),
    datasets: [
      {
        label,
        data: dataPoints.map((d) => d[key]),
        borderColor: color,
        fill: false,
        tension: 0.5,
      },
    ],
  });

  return (
    <div style={{ padding: "1rem" }}>
      <h2>📊 Gráficas de Sensor</h2>

      <div style={{ marginBottom: "2rem" }}>
      <Line data={createChartData("ALS Raw", "alsRaw", "orange")} options={chartOptions} />
      </div>
      <div style={{ marginBottom: "2rem" }}>
      <Line data={createChartData("Lux", "lux", "blue")} options={chartOptions} />
      </div>
      <div style={{ marginBottom: "2rem" }}>
      <Line data={createChartData("UV Raw", "uvRaw", "purple")} options={chartOptions} />
      </div>
      

      {/* Botones para controlar el guardado de datos */}
      <div>
        <button
          onClick={startSaving}
          disabled={isSaving}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "green",
            color: "white",
            border: "none",
            marginRight: "10px",
            cursor: isSaving ? "not-allowed" : "pointer",
          }}
        >
          Iniciar Guardado
        </button>
        <button
          onClick={stopSaving}
          disabled={!isSaving}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "red",
            color: "white",
            border: "none",
            cursor: !isSaving ? "not-allowed" : "pointer",
          }}
        >
          Detener Guardado
        </button>
      </div>
    </div>
  );
};

export default ChartDisplay;
