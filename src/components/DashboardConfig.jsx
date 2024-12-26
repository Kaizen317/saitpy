import React, { useState, useEffect } from "react"; // Importar useEffect
import { Button, Grid, Typography, IconButton } from "@mui/material";
import { Edit, Delete, Add, Save, DashboardCustomize } from "@mui/icons-material";
import ChartConfigModal from "./ChartConfigModal";
import LineChartComponent from "./LineChartComponent";
import BarChartComponent from "./BarChartComponent";
import AddSubdashboardModal from "./AddSubdashboardModal";
import Sidebar from "./Navbar";

const DashboardConfig = () => {
  const [components, setComponents] = useState([]);
  const [subdashboards, setSubdashboards] = useState([]);
  const [activeSubdashboard, setActiveSubdashboard] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [subdashboardModalOpen, setSubdashboardModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingSubdashboardIndex, setEditingSubdashboardIndex] = useState(null);
  const [deletionQueue, setDeletionQueue] = useState([]);

  const userId = localStorage.getItem("userId"); // Obtener el userId del localStorage

  // Función para cargar datos desde el backend
  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!userId) {
        alert("El usuario no está logueado.");
        return;
      }

      try {
        const response = await fetch(
          `https://5kkoyuzfrf.execute-api.us-east-1.amazonaws.com/dashboard?userId=${userId}`
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error al cargar los datos:", errorData);
          alert(`Error: ${errorData.error || "No se pudieron cargar los datos."}`);
          return;
        }

        const data = await response.json();
        console.log("Datos cargados:", data);

        // Procesar los datos obtenidos
        const { dashboards } = data;
        const subdashboardsFromDB = dashboards.map((d) => ({
          id: d.subdashboardId,
          name: d.subdashboardName,
          color: d.subdashboardColor,
        }));
        const componentsFromDB = dashboards.flatMap((d) =>
          d.components.map((comp) => ({
            ...comp,
            subdashboardId: d.subdashboardId,
          }))
        );

        setSubdashboards(subdashboardsFromDB);
        setComponents(componentsFromDB);

        // Seleccionar el primer subdashboard como activo si existe
        if (subdashboardsFromDB.length > 0) {
          setActiveSubdashboard(subdashboardsFromDB[0]);
        }
      } catch (error) {
        console.error("Error en la solicitud:", error);
        alert("Hubo un error al conectar con el servidor.");
      }
    };

    fetchDashboardData(); // Llamar la función al cargar el componente
  }, [userId]);

  const handleAddComponent = (newComponent) => {
    if (!activeSubdashboard) {
      alert("Por favor, selecciona un subdashboard antes de agregar un componente.");
      return;
    }
    newComponent.subdashboardId = activeSubdashboard.id;

    if (editingIndex !== null) {
      const updatedComponents = [...components];
      updatedComponents[editingIndex] = newComponent;
      setComponents(updatedComponents);
      setEditingIndex(null);
    } else {
      setComponents([...components, newComponent]);
    }
    setModalOpen(false);
  };

  const handleEditComponent = (index) => {
    setEditingIndex(index);
    setModalOpen(true);
  };

  const handleDeleteComponent = (index) => {
    const deletedComponent = components[index];
  
    if (!deletedComponent?.subdashboardId) {
      console.error("El componente no tiene un ID válido para eliminar:", deletedComponent);
      alert("Error: Este componente no puede eliminarse porque no tiene un identificador válido.");
      return;
    }
  
    // Agregar el componente a la cola de eliminación
    setDeletionQueue((prev) => [
      ...prev,
      { type: "component", id: deletedComponent.subdashboardId },
    ]);
  
    // Actualizar el estado local para ocultarlo
    setComponents((prev) => prev.filter((_, i) => i !== index));
  };
  const handleDeleteSubdashboard = (index) => {
    const deletedSubdashboard = subdashboards[index];
  
    if (!deletedSubdashboard?.id) {
      console.error("El subdashboard no tiene un ID válido para eliminar:", deletedSubdashboard);
      alert("Error: Este subdashboard no puede eliminarse porque no tiene un identificador válido.");
      return;
    }
  
    // Agregar el subdashboard a la cola de eliminación
    setDeletionQueue((prev) => [
      ...prev,
      { type: "subdashboard", id: deletedSubdashboard.id },
    ]);
  
    // Eliminar del estado local
    setSubdashboards((prev) => prev.filter((_, i) => i !== index));
    setComponents((prev) =>
      prev.filter((comp) => comp.subdashboardId !== deletedSubdashboard.id)
    );
  };
  
  const handleAddSubdashboard = (subdashboard) => {
    if (editingSubdashboardIndex !== null) {
      // Editar un subdashboard existente
      const updatedSubdashboards = [...subdashboards];
      updatedSubdashboards[editingSubdashboardIndex] = {
        ...updatedSubdashboards[editingSubdashboardIndex],
        ...subdashboard,
      };
      setSubdashboards(updatedSubdashboards);
      setEditingSubdashboardIndex(null);
    } else {
      // Crear un nuevo subdashboard
      const newSubdashboard = { id: Date.now(), ...subdashboard };
      setSubdashboards((prev) => [...prev, newSubdashboard]);
      setActiveSubdashboard(newSubdashboard);
    }
    setSubdashboardModalOpen(false);
  };
  
  const handleEditSubdashboard = (index) => {
    setEditingSubdashboardIndex(index);
    setSubdashboardModalOpen(true);
  };
  const handleSaveDashboard = async () => {
    if (!userId) {
      alert("El usuario no está logueado.");
      return;
    }
  
    if (!subdashboards.length && !deletionQueue.length) {
      alert("No hay subdashboards creados ni eliminaciones pendientes para guardar.");
      return;
    }
  
    try {
      // Procesar eliminaciones pendientes
      for (const item of deletionQueue) {
        const deleteResponse = await fetch(
          `https://5kkoyuzfrf.execute-api.us-east-1.amazonaws.com/dashboard?userId=${userId}&type=${item.type}&id=${item.id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
  
        if (!deleteResponse.ok) {
          const errorData = await deleteResponse.json();
          console.error("Error al eliminar:", errorData);
          alert(`Error al eliminar: ${errorData.error || "No se pudo eliminar el elemento."}`);
          return;
        }
      }
  
      // Limpia la cola de eliminaciones después de procesarlas
      setDeletionQueue([]);
  
      // Guardar los datos actualizados (sin eliminaciones)
      const payload = {
        userId,
        subdashboards: subdashboards.map((sub) => ({
          id: sub.id?.toString(),
          name: sub.name?.trim() || "Subdashboard sin nombre",
          color: sub.color || "#FFFFFF",
        })),
        components: components.map((comp) => ({
          subdashboardId: comp.subdashboardId?.toString(),
          chartType: comp.chartType || "Sin tipo de gráfico",
          componentName: comp.componentName?.trim() || "Componente sin nombre",
          variables: (comp.variables || []).map((variable) => ({
            variable: variable.variable?.trim() || "Variable sin nombre",
            color: variable.color || "#000000",
          })),
          colSize: comp.colSize || "col6",
          height: typeof comp.height === "number" ? comp.height : 400,
        })),
      };
  
      console.log("Payload enviado:", JSON.stringify(payload, null, 2));
  
      const response = await fetch(
        "https://5kkoyuzfrf.execute-api.us-east-1.amazonaws.com/dashboards",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(payload),
        }
      );
  
      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error al guardar el panel de control:", errorData);
        alert(`Error: ${errorData.error || "No se pudo guardar el panel de control."}`);
        return;
      }
  
      alert("Panel de control guardado exitosamente.");
    } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Hubo un error al conectar con el servidor.");
    }
  };
  
  const renderComponent = (component, index) => {
    const colSize = parseInt(component.colSize.replace("col", ""), 10) || 12;

    let height = component.height || "400px";
    if (typeof height === "number") {
      height = `${height}px`;
    }

    const containerHeight = `${parseInt(height.replace("px", ""), 10) + 50}px`;

    return (
      <Grid item xs={12} sm={colSize} md={colSize} lg={colSize} key={index}>
        <div
          style={{
            position: "relative",
            padding: "20px",
            backgroundColor: "white",
            border: "1px solid #ccc",
            borderRadius: "8px",
            height: containerHeight,
            maxWidth: colSize === 12 ? "1200px" : "100%",
            margin: colSize === 12 ? "0 auto" : "unset",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              display: "flex",
              gap: "8px",
            }}
          >
            <IconButton
              color="primary"
              onClick={() => handleEditComponent(index)}
              size="small"
            >
              <Edit />
            </IconButton>
            <IconButton
              color="secondary"
              onClick={() => handleDeleteComponent(index)}
              size="small"
            >
              <Delete />
            </IconButton>
          </div>
          <Typography variant="h6" style={{ textAlign: "center", marginBottom: "10px" }}>
            {component.componentName || "Componente sin nombre"}
          </Typography>
          {component.chartType === "LineChart" && (
            <LineChartComponent
              data={{
                labels: ["Ene", "Feb", "Mar", "Abr", "May"],
                datasets: component.variables.map((variable) => ({
                  label: variable.name || variable.variable,
                  data: [20, 40, 60, 80, 100],
                  backgroundColor: variable.color,
                  borderColor: variable.color,
                  borderWidth: 2,
                })),
              }}
              height={height}
            />
          )}
          {component.chartType === "BarChart" && (
            <BarChartComponent
              data={{
                labels: ["Ene", "Feb", "Mar", "Abr", "May"],
                datasets: component.variables.map((variable) => ({
                  label: variable.name || variable.variable,
                  data: [20, 40, 60, 80, 100],
                  backgroundColor: variable.color,
                  borderColor: variable.color,
                  borderWidth: 1,
                })),
              }}
              height={height}
            />
          )}
        </div>
      </Grid>
    );
  };
return (
  <div style={{ display: "flex", flexWrap: "wrap" }}>
    <Sidebar />
    <div style={{ flex: 1, padding: "20px", marginLeft: "250px", maxWidth: "100%" }}>
      <Typography
        variant="h4"
        style={{ marginBottom: "20px", textAlign: "center" }}
      >
        Configurar el panel de control
      </Typography>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", marginBottom: "20px", justifyContent: "center" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            if (!activeSubdashboard) {
              alert("Por favor, selecciona un subdashboard antes de agregar un componente.");
              return;
            }
            setModalOpen(true);
            setEditingIndex(null);
          }}
          startIcon={<Add />}
          disabled={!activeSubdashboard}
        >
          Agregar Componente
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: "#9C27B0", color: "white" }}
          onClick={() => setSubdashboardModalOpen(true)}
          startIcon={<DashboardCustomize />}
        >
          Añadir Navegación
        </Button>
        <Button
          variant="contained"
          style={{ backgroundColor: "#4CAF50", color: "white" }}
          onClick={handleSaveDashboard}
          startIcon={<Save />}
        >
          Guardar Panel de Control
        </Button>
      </div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        {activeSubdashboard ? (
          <Typography variant="h6" style={{ color: activeSubdashboard.color }}>
            Subdashboard activo: {activeSubdashboard.name}
          </Typography>
        ) : (
          <Typography variant="h6" style={{ color: "#888" }}>
            Selecciona un subdashboard para comenzar
          </Typography>
        )}
      </div>
      <div style={{ marginBottom: "20px", display: "flex", flexWrap: "wrap", gap: "10px" }}>
        {subdashboards.map((subdashboard, index) => (
          <div key={subdashboard.id} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <Button
              variant="contained"
              style={{
                backgroundColor: subdashboard.color,
                color: "white",
              }}
              onClick={() => setActiveSubdashboard(subdashboard)}
            >
              {subdashboard.name}
            </Button>
            <IconButton
              color="primary"
              size="small"
              onClick={() => handleEditSubdashboard(index)}
            >
              <Edit />
            </IconButton>
            <IconButton
              color="secondary"
              size="small"
              onClick={() => handleDeleteSubdashboard(index)}
            >
              <Delete />
            </IconButton>
          </div>
        ))}
      </div>
      <Grid container spacing={3}>
        {components
          .filter((component) => component.subdashboardId === activeSubdashboard?.id)
          .map((component, index) => renderComponent(component, index))}
      </Grid>
      <ChartConfigModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingIndex(null);
        }}
        onSave={handleAddComponent}
        initialData={editingIndex !== null ? components[editingIndex] : null}
      />
      <AddSubdashboardModal
        open={subdashboardModalOpen}
        onClose={() => setSubdashboardModalOpen(false)}
        onSave={handleAddSubdashboard}
        initialData={editingSubdashboardIndex !== null ? subdashboards[editingSubdashboardIndex] : null}
      />
    </div>
  </div>
);

};

export default DashboardConfig;
