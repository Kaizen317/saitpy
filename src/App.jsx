import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardConfig from "./components/DashboardConfig";
import DevicesList from "./components/devices"; 

function App() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(storedUserId);
    }
  }, []);

  return (
    <Router>
      <Routes>
         <Route path="/login" element={<Login setUserId={setUserId} />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboardconfig" element={<DashboardConfig />} />
        <Route path="/devices" element={<DevicesList />} />
         <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={!!localStorage.getItem("token")}>
              <Dashboard userId={userId} />
            </ProtectedRoute>
          }
        />

        {/* Redirigir rutas no definidas al login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
