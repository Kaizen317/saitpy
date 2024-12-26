import React from "react";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import "chart.js/auto";

const LineChartComponent = ({ data, title, height = "400px" }) => {
  // Asegurarse de que height sea un string válido
  const validatedHeight = typeof height === "string" ? height : `${height}px`;

  // Calcular la altura del contenedor
  const containerHeight = `${parseInt(validatedHeight.replace("px", ""), 10) + 200}px`;

  return (
    <div
      style={{
        width: "100%",
        height: containerHeight, // Altura del contenedor más grande que la gráfica
        padding: "20px",
        marginBottom: "30px",
        boxSizing: "border-box",
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

      <div
        style={{
          height: validatedHeight, // Altura exacta de la gráfica
          overflow: "hidden",
        }}
      >
        <Line
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: "top",
                labels: {
                  font: {
                    family: "Helvetica Neue, Arial, sans-serif",
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
            elements: {
              line: {
                tension: 0.4,
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
    </div>
  );
};

LineChartComponent.propTypes = {
  data: PropTypes.object.isRequired,
  title: PropTypes.string,
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default LineChartComponent;
