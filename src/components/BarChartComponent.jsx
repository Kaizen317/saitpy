import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";
import PropTypes from "prop-types";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const BarChartComponent = ({ data, title, height = "400px" }) => {
  // Convertimos la altura en un número si es necesario
  const chartHeight = typeof height === "string" ? parseInt(height.replace("px", ""), 10) : height;

  return (
    <div
      style={{
        width: "100%",
        height: `${chartHeight}px`, // Usamos la altura ajustada
        padding: "20px",
        marginBottom: "30px",
      }}
    >
      {title && (
        <h3
          style={{
            textAlign: "center",
            fontSize: "22px",
            marginBottom: "15px",
            color: "#444",
            fontFamily: '"Helvetica Neue", Arial, sans-serif',
            letterSpacing: "1px",
            fontWeight: "bold",
          }}
        >
          {title}
        </h3>
      )}

      <Bar
        data={data}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: "top",
              labels: {
                font: {
                  family: '"Helvetica Neue", Arial, sans-serif',
                  size: 15,
                },
                color: "#333",
                padding: 15,
              },
            },
            tooltip: {
              backgroundColor: "rgba(50,50,50,0.8)",
              titleFont: { size: 16, weight: "bold" },
              bodyFont: { size: 14 },
              padding: 12,
              borderColor: "#1e88e5",
              borderWidth: 1,
              callbacks: {
                label: function (context) {
                  return `${context.dataset.label}: ${context.raw}`;
                },
              },
            },
          },
          scales: {
            x: {
              grid: {
                display: false,
              },
              ticks: {
                color: "#333",
                font: {
                  size: 14,
                  family: "Arial, sans-serif",
                },
              },
            },
            y: {
              beginAtZero: true,
              grid: {
                color: "#eee",
              },
              ticks: {
                color: "#333",
                font: {
                  size: 14,
                  family: "Arial, sans-serif",
                },
              },
            },
          },
        }}
      />
    </div>
  );
};

BarChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default BarChartComponent;
