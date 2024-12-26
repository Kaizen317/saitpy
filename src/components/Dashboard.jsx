import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Navbar"; // Importa el componente Sidebar

function Dashboard({ userId }) {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si el usuario está autenticado al cargar el Dashboard
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login"); // Redirigir al login si no hay sesión
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Limpiar el almacenamiento
    localStorage.removeItem("userId"); // Limpiar el userId
    navigate("/login"); // Redirigir al login
  };

  return (
    <div style={{ display: "flex" }}>
      <Sidebar /> {/* Agrega la Sidebar */}
      <div style={{ flex: 1, padding: "20px", marginLeft: "250px" }}>
        {/* Contenido del Dashboard */}
        <h1>Bienvenido al Dashboard</h1>
        <p>Tu ID de usuario es: {userId || localStorage.getItem("userId")}</p>
        <button onClick={handleLogout}>Cerrar Sesión</button>
      </div>
    </div>
  );
}

export default Dashboard;
