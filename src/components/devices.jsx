import React, { useState, useEffect } from "react";
import NavBar from "./Navbar";
import {
  TextField,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  IconButton,
  Snackbar,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Alert,
} from "@mui/material";
import { Delete } from "@mui/icons-material";

const DevicesList = () => {
  const [newDevice, setNewDevice] = useState({
    deviceId: "",
    name: "",
    location: "",
  });
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deviceToDelete, setDeviceToDelete] = useState(null);
  const [confirmationInput, setConfirmationInput] = useState("");

  const userId = localStorage.getItem("userId");
  const apiBaseUrl = "https://z9tss4i6we.execute-api.us-east-1.amazonaws.com/devices";

  // Función para cargar dispositivos
  useEffect(() => {
    const fetchDevices = async () => {
      if (!userId) {
        setSnackbarMessage("El usuario no está logueado.");
        setSnackbarOpen(true);
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`${apiBaseUrl}?userId=${userId}`);
        if (!response.ok) {
          const errorData = await response.json();
          setSnackbarMessage(`Error: ${errorData.error || "No se pudieron cargar los dispositivos."}`);
          setSnackbarOpen(true);
          setLoading(false);
          return;
        }
        const data = await response.json();
        setDevices(
          data.devices.map((device) => ({
            ...device,
            status: "off", // Inicialmente todos los dispositivos están apagados
          }))
        );
      } catch (error) {
        setSnackbarMessage("Hubo un error al conectar con el servidor.");
        setSnackbarOpen(true);
      } finally {
        setLoading(false);
      }
    };

    fetchDevices();
  }, [userId]);

  // Manejar cambios en el formulario
  const handleInputChange = (e) => {
    setNewDevice({
      ...newDevice,
      [e.target.name]: e.target.value,
    });
  };

  // Función para agregar un nuevo dispositivo
  const handleAddDevice = async () => {
    const { deviceId, name, location } = newDevice;

    if (!userId) {
      setSnackbarMessage("El usuario no está logueado.");
      setSnackbarOpen(true);
      return;
    }

    if (!deviceId || !name || !location) {
      setSnackbarMessage("Todos los campos son obligatorios.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const payload = {
        userId,
        deviceId,
        name,
        location,
      };

      const response = await fetch(apiBaseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.error || "No se pudo agregar el dispositivo."}`);
        setSnackbarOpen(true);
        return;
      }

      const newDeviceData = await response.json();

      // Agregar el nuevo dispositivo a la lista con el estado inicial
      setDevices((prevDevices) => [
        ...prevDevices,
        { ...newDeviceData, status: "off" },
      ]);

      // Limpiar el formulario
      setNewDevice({ deviceId: "", name: "", location: "" });

      setSnackbarMessage("Dispositivo agregado con éxito.");
      setSnackbarOpen(true);
    } catch (error) {
      setSnackbarMessage("Hubo un error al conectar con el servidor.");
      setSnackbarOpen(true);
    }
  };

  // Manejar encendido/apagado del dispositivo
  const handleDeviceStatus = (deviceId, action) => {
    setDevices((prevDevices) =>
      prevDevices.map((device) =>
        device.deviceId === deviceId
          ? { ...device, status: action === "on" ? "on" : "off" }
          : device
      )
    );
  };

  // Abrir el diálogo para eliminar
  const handleOpenDeleteDialog = (device) => {
    setDeviceToDelete(device);
    setDialogOpen(true);
  };

  // Cerrar el diálogo
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setConfirmationInput("");
  };

  // Función para eliminar un dispositivo
  const handleDeleteDevice = async () => {
    if (confirmationInput !== "confirmar") {
      setSnackbarMessage("Escribe 'confirmar' para eliminar el dispositivo.");
      setSnackbarOpen(true);
      return;
    }

    try {
      const response = await fetch(`${apiBaseUrl}?userId=${userId}&deviceId=${deviceToDelete.deviceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const errorData = await response.json();
        setSnackbarMessage(`Error: ${errorData.error || "No se pudo eliminar el dispositivo."}`);
        setSnackbarOpen(true);
        return;
      }

      setDevices((prevDevices) =>
        prevDevices.filter((device) => device.deviceId !== deviceToDelete.deviceId)
      );

      setSnackbarMessage("Dispositivo eliminado con éxito.");
      setSnackbarOpen(true);
      handleCloseDialog();
    } catch (error) {
      setSnackbarMessage("Hubo un error al eliminar el dispositivo.");
      setSnackbarOpen(true);
    }
  };

  // Cerrar el Snackbar
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <NavBar />
      <div className="container mx-auto px-4 py-6" style={{ marginLeft: "250px" }}>
        <Grid container spacing={2}>
          {/* Formulario (3 columnas) */}
          <Grid item xs={12} md={3}>
            <Card className="shadow-lg" style={{ borderRadius: "16px", padding: "20px" }}>
              <CardContent>
                <Typography
                  variant="h5"
                  style={{
                    textAlign: "center",
                    marginBottom: "20px",
                    fontWeight: "bold",
                    color: "#333",
                  }}
                >
                  Agregar Nuevo Dispositivo
                </Typography>
                <form className="flex flex-col space-y-4">
                  <TextField
                    label="ID de dispositivo"
                    name="deviceId"
                    variant="outlined"
                    fullWidth
                    value={newDevice.deviceId}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Nombre"
                    name="name"
                    variant="outlined"
                    fullWidth
                    value={newDevice.name}
                    onChange={handleInputChange}
                  />
                  <TextField
                    label="Ubicación"
                    name="location"
                    variant="outlined"
                    fullWidth
                    value={newDevice.location}
                    onChange={handleInputChange}
                  />
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={handleAddDevice}
                    style={{
                      backgroundColor: "#70bc7e",
                      color: "white",
                      fontWeight: "bold",
                    }}
                  >
                    Agregar Dispositivo
                  </Button>
                </form>
              </CardContent>
            </Card>
          </Grid>

          {/* Tabla (9 columnas) */}
          <Grid item xs={12} md={9}>
            <TableContainer component={Paper} style={{ borderRadius: "16px", overflow: "hidden" }}>
              <Table>
                <TableHead style={{ backgroundColor: "#70bc7e" }}>
                  <TableRow>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Device ID</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Nombre</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Ubicación</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Username</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Password</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Topic</TableCell>
                    <TableCell style={{ color: "white", fontWeight: "bold" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {devices.map((device) => (
                    <TableRow
                      key={device.deviceId}
                      style={{
                        backgroundColor: device.status === "on" ? "#d4f5d4" : "#f5d4d4",
                      }}
                    >
                      <TableCell>{device.deviceId}</TableCell>
                      <TableCell>{device.name}</TableCell>
                      <TableCell>{device.location}</TableCell>
                      <TableCell>{device.username}</TableCell>
                      <TableCell>{device.password}</TableCell>
                      <TableCell>{device.topic}</TableCell>
                      <TableCell>
                        <div style={{ display: "flex", gap: "10px" }}>
                          <Button
                            variant="contained"
                            size="small"
                            style={{ backgroundColor: "#4CAF50", color: "white" }}
                            onClick={() => handleDeviceStatus(device.deviceId, "on")}
                          >
                            Encender
                          </Button>
                          <Button
                            variant="contained"
                            size="small"
                            style={{ backgroundColor: "#FFC107", color: "white" }}
                            onClick={() => handleDeviceStatus(device.deviceId, "off")}
                          >
                            Apagar
                          </Button>
                          <IconButton
                            size="small"
                            onClick={() => handleOpenDeleteDialog(device)}
                            style={{ backgroundColor: "#F44336", color: "white" }}
                          >
                            <Delete />
                          </IconButton>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
        </Grid>
      </div>

      {/* Snackbar para alertas */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info">
          {snackbarMessage}
        </Alert>
      </Snackbar>

      {/* Dialogo para confirmación */}
      <Dialog open={dialogOpen} onClose={handleCloseDialog}>
        <DialogTitle>Confirmar eliminación</DialogTitle>
        <DialogContent>
          <DialogContentText>
          Escribe <strong>"confirmar"</strong> para eliminar el dispositivo:{" "}
            {deviceToDelete?.name}
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Escribe confirmar"
            fullWidth
            value={confirmationInput}
            onChange={(e) => setConfirmationInput(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} color="primary">
            Cancelar
          </Button>
          <Button
            onClick={handleDeleteDevice}
            color="secondary"
            disabled={confirmationInput.toLowerCase() !== "confirmar"}
          >
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DevicesList;
