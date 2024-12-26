import React, { useState } from "react";
import "./Login.css";
import logo from "../assets/logo.png";
import Swal from "sweetalert2"; // Importa SweetAlert2
import { useNavigate } from "react-router-dom"; // Importar para redirección

function Login({ setUserId }) {
  const [step, setStep] = useState(1); // Controla el paso del formulario (1 = Login, 2 = Registro)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook de React Router para redirección

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await fetch(
        "https://aet8yzih98.execute-api.us-east-1.amazonaws.com/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
  
      console.log("Response status:", response.status);
      console.log("Response data:", data);
  
      if (response.ok) {
        const token = data.token; // Verifica que el token esté en la respuesta
        const userId = data.userId; // También recibimos el userId del backend
        if (token && userId) {
          localStorage.setItem("token", token); // Guardar el token
          localStorage.setItem("userId", userId); // Guardar el userId
          setUserId(userId); // Actualizar el estado del usuario
          console.log("Token JWT generado:", token); // Mostrar el token en la consola
          Swal.fire({
            icon: "success",
            title: "Usuario logueado con éxito",
            text: "Serás redirigido al Dashboard.",
            confirmButtonText: "Continuar",
          }).then(() => {
            navigate("/dashboard"); // Redirigir al Dashboard
          });
        } else {
          setError("No se recibió un token o userId. Contacta al administrador.");
        }
      } else {
        setError(data.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError("Error al iniciar sesión.");
    }
  };
  
  
  // Manejar envío del formulario de registro
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    try {
      const response = await fetch(
        "https://aet8yzih98.execute-api.us-east-1.amazonaws.com/create_user",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );
      const data = await response.json();
      if (response.ok) {
        // Mostrar alerta de éxito y redirigir al login
        Swal.fire({
          icon: "success",
          title: "Usuario registrado exitosamente",
          text: "Ahora puedes iniciar sesión.",
          confirmButtonText: "Ir al Login",
        }).then(() => {
          setStep(1); // Cambiar al paso de login
        });
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Error al registrar.");
    }
  };

  return (
    <div className="container">
      <div className="info-section">
        <h1 className="title">SAIT</h1>
        <p className="description">
          SAIT es una plataforma de IoT diseñada para monitoreo remoto y
          eficiente.
        </p>
      </div>

      <div className="login-section">
        <form
          className="login-form"
          onSubmit={step === 1 ? handleLoginSubmit : handleRegisterSubmit}
        >
          <div className="logo-container">
            <img src={logo} alt="Logo" className="logo-image" />
          </div>

          {/* Paso 1: Iniciar Sesión */}
          {step === 1 && (
            <>
              <h2 className="form-title">Iniciar Sesión</h2>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">
                Iniciar Sesión
              </button>
              <button
                type="button"
                onClick={() => setStep(2)}
                className="login-button"
              >
                Registrarse
              </button>
            </>
          )}

          {/* Paso 2: Registro */}
          {step === 2 && (
            <>
              <h2 className="form-title">Crear Cuenta</h2>
              <div className="form-group">
                <label>Correo Electrónico</label>
                <input
                  type="email"
                  placeholder="Ingresa tu correo"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Contraseña</label>
                <input
                  type="password"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              <div className="form-group">
                <label>Confirmar Contraseña</label>
                <input
                  type="password"
                  placeholder="Confirma tu contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>
              {error && <p className="error-message">{error}</p>}
              <button type="submit" className="login-button">
                Registrarse
              </button>
              <button
                type="button"
                className="login-button"
                onClick={() => setStep(1)}
              >
                Ir a Login
              </button>
            </>
          )}
        </form>
      </div>
    </div>
  );
}

export default Login;
