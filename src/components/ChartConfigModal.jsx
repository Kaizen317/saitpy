import React, { useState, useEffect } from "react";
import {
  Modal,
  Button,
  Select,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  IconButton,
  Grid,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

// Valores iniciales predeterminados
const initialVariableState = {
  variable: "",
  color: "#36a2eb",
};

const initialState = {
  chartType: "LineChart",
  componentName: "",
  variables: [initialVariableState], // Lista de variables
  colSize: "col6",
  height: 400, // Altura predeterminada del gráfico
};

const ChartConfigModal = ({ open, onClose, onSave, initialData }) => {
  const [formState, setFormState] = useState(initialState);

  const availableVariables = ["Temperatura", "Humedad"]; // Variables disponibles para selección

  useEffect(() => {
    if (open) {
      // Si hay datos iniciales (editar), los cargamos; de lo contrario, usamos los valores predeterminados
      setFormState(initialData || initialState);
    }
  }, [open, initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleVariableChange = (index, field, value) => {
    const updatedVariables = formState.variables.map((variable, i) =>
      i === index ? { ...variable, [field]: value } : variable
    );
    setFormState((prev) => ({ ...prev, variables: updatedVariables }));
  };

  const handleAddVariable = () => {
    setFormState((prev) => ({
      ...prev,
      variables: [...prev.variables, initialVariableState],
    }));
  };

  const handleRemoveVariable = (index) => {
    const updatedVariables = formState.variables.filter((_, i) => i !== index);
    setFormState((prev) => ({ ...prev, variables: updatedVariables }));
  };

  const handleSave = () => {
    onSave(formState); // Guardar los datos del formulario
    setFormState(initialState); // Reiniciar el formulario
  };

  return (
    <Modal open={open} onClose={onClose}>
      <div
        style={{
          padding: "20px",
          backgroundColor: "white",
          margin: "auto",
          maxWidth: "500px",
          borderRadius: "8px",
        }}
      >
        <h2>Configurar Componente</h2>
        <TextField
          label="Nombre del Componente"
          name="componentName"
          fullWidth
          margin="normal"
          value={formState.componentName}
          onChange={handleInputChange}
        />
        <FormControl fullWidth margin="normal">
          <InputLabel>Tipo de Componente</InputLabel>
          <Select
            name="chartType"
            value={formState.chartType}
            onChange={handleInputChange}
          >
            <MenuItem value="LineChart">Gráfico de Líneas</MenuItem>
            <MenuItem value="BarChart">Gráfico de Barras</MenuItem> {/* Nueva opción */}
          </Select>
        </FormControl>

        {formState.variables.map((variable, index) => (
          <Grid container spacing={2} alignItems="center" key={index}>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <InputLabel>Variable</InputLabel>
                <Select
                  value={variable.variable}
                  onChange={(e) =>
                    handleVariableChange(index, "variable", e.target.value)
                  }
                >
                  {availableVariables.map((availableVariable) => (
                    <MenuItem key={availableVariable} value={availableVariable}>
                      {availableVariable}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <TextField
                label="Color"
                type="color"
                fullWidth
                value={variable.color}
                onChange={(e) =>
                  handleVariableChange(index, "color", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={2}>
              <IconButton
                color="error"
                onClick={() => handleRemoveVariable(index)}
                disabled={formState.variables.length === 1} // No eliminar si hay solo una variable
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        ))}

        <Button
          variant="outlined"
          color="primary"
          startIcon={<AddIcon />}
          onClick={handleAddVariable}
          style={{ marginTop: "10px", marginBottom: "10px" }}
        >
          Añadir Variable
        </Button>

        <FormControl fullWidth margin="normal">
          <InputLabel>Tamaño de Columna</InputLabel>
          <Select
            name="colSize"
            value={formState.colSize}
            onChange={handleInputChange}
          >
            <MenuItem value="col2">1/6 (col2)</MenuItem>
            <MenuItem value="col3">1/4 (col3)</MenuItem>
            <MenuItem value="col4">1/3 (col4)</MenuItem>
            <MenuItem value="col6">1/2 (col6)</MenuItem>
            <MenuItem value="col12">Completo (col12)</MenuItem>
          </Select>
        </FormControl>

        {/* Campo para elegir la altura del gráfico */}
        <TextField
  label="Altura del Gráfico (px)"
  name="height"
  type="number"
  fullWidth
  margin="normal"
  value={formState.height || ''} // Aseguramos que haya un valor por defecto
  onChange={(e) =>
    setFormState((prev) => ({
      ...prev,
      height: e.target.value ? parseInt(e.target.value, 10) : '', // Convertimos solo si hay valor
    }))
  }
/>


        <Button
          variant="contained"
          color="primary"
          onClick={handleSave}
          style={{ marginTop: "20px" }}
        >
          Guardar
        </Button>
      </div>
    </Modal>
  );
};

export default ChartConfigModal;
