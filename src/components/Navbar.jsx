import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Archivo de estilos
import {
    GridView,
    Assessment,
    Notifications,
    Settings,
    Devices,
    TableChart,
    Psychology,
    AccountCircle,
    ExitToApp,
    ChevronLeft,
    DashboardCustomize, // Importa el icono correctamente
  } from "@mui/icons-material"; // Iconos de Material-UI
  

function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Botón flotante para dispositivos móviles */}
      <button className="sidebar-mobile-toggle" onClick={toggleSidebar}>
        {isOpen ? "✖" : "☰"}
      </button>

      <div className={`sidebar ${isOpen ? "open" : "collapsed"}`}>
        {/* Botón para colapsar/expandir */}
        <div className="sidebar-toggle" onClick={toggleSidebar}>
          <ChevronLeft className="toggle-icon" />
        </div>

        {/* Logo */}
        <div className="sidebar-logo">
          <h2 className="logo-text">SAIT</h2>
        </div>

        {/* Menú */}
        <ul className="sidebar-menu">
          <li>
            <Link to="/dashboard">
              <GridView />
              <span>Panel Principal</span>
            </Link>
          </li>
          <li>
            <Link to="/reports">
              <Assessment />
              <span>Informes</span>
            </Link>
          </li>
          <li>
            <Link to="/alarms">
              <Notifications />
              <span>Alarmas</span>
            </Link>
          </li>
          <li>
          <Link to="/dashboardconfig">
            <DashboardCustomize />
            <span>Configurar Dashboard</span>
          </Link>
        </li>
          <li>
            <Link to="/devices">
              <Devices />
              <span>Dispositivos</span>
            </Link>
          </li>
          <li>
            <Link to="/variables">
              <TableChart />
              <span>Tabla de Variables</span>
            </Link>
          </li>
          <li>
            <Link to="/ai">
              <Psychology />
              <span>IA</span>
            </Link>
          </li>
          <li>
            <Link to="/accounts">
              <AccountCircle />
              <span>Cuentas</span>
            </Link>
          </li>
          <li
            onClick={() => {
              localStorage.clear();
              window.location.href = "/login"; // Redirigir al login
            }}
          >
            <ExitToApp />
            <span>Cerrar Sesión</span>
          </li>
        </ul>
      </div>
    </>
  );
}

export default Sidebar;
