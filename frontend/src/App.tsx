import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // ✅ Importar PayPal
import { SocketProvider } from "./context/SocketContext"; // ✅ Importar el SocketProvider
import Home from "./pages/Home";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy"
import Professionals from "./pages/Professionals";
import Login from "./pages/Login";
import FormProfessionals from "./pages/FormProfessionals";
import Register from "./pages/Register";
import DashboardProfesional from "./pages/DashboardProfesional";
import DashboardUsuario from "./pages/DashboardUsuario";
import DashboardCalendar from "./pages/DashboardCalendar";
import ProfessionalDetails from "./pages/ProfessionalDetails";
import DashboardMensajes from "./pages/DashboardMsg";
import DashboardProfesionalConfig from "./pages/DashboardProfesionalConfig";
import DashboardUsuarioConfig from "./pages/DashboardUsuarioConfig";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./components/AdminLogin";
//import WhatsAppButton from "./components/WhatsAppButton";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import RutaProtegida from "./components/RutaProtegida";
import RegisterProfExitoso from "./pages/RegisterProfExitoso";
import 'bootstrap-icons/font/bootstrap-icons.css';
import RetornoPago from "./pages/RetornoPago";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import DashboardFacturacion from "./pages/DashboardFacturacion";
import DashboardProfesionalData from "./pages/DashboardProfesionalData";
const client_id_paypal = import.meta.env.VITE_PAYPAL_ID_CLIENT;

const App: React.FC = () => {
  return (

    <HelmetProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      {/* ✅ Agregamos el PayPalScriptProvider aquí */}
      <PayPalScriptProvider options={{ clientId: client_id_paypal }}>
        <SocketProvider> {/* ✅ Aquí envolvemos todo con el SocketProvider */}
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/terminos-y-condiciones" element={<Terms />} />
              <Route path="/privacidad" element={<Privacy />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/formProfessionals" element={<FormProfessionals />} />
              <Route path="/dashboard/profesional" element={<RutaProtegida> <DashboardProfesional /> </RutaProtegida>} />
              <Route path="/dashboard/profesionalFacturacion" element={<RutaProtegida> <DashboardFacturacion /> </RutaProtegida>} />
              <Route path="/dashboard/usuario" element={<RutaProtegida> <DashboardUsuario /> </RutaProtegida>} />
              <Route path="/dashboard/calendario" element={<RutaProtegida> <DashboardCalendar /> </RutaProtegida>} />
              <Route path="/messages" element={<RutaProtegida> <DashboardMensajes /> </RutaProtegida>} />
              <Route path="/profesional/:id" element={<ProfessionalDetails />} />
              <Route path="/dashboard/profesional/config_profesional" element={<RutaProtegida> <DashboardProfesionalConfig /> </RutaProtegida>} />
              <Route path="/dashboard/profesional/datos" element={<RutaProtegida> <DashboardProfesionalData /> </RutaProtegida>} />
              <Route path="/dashboard/usuario/config_usuario" element={<RutaProtegida> <DashboardUsuarioConfig /> </RutaProtegida>} />
              <Route path="/retorno-pago" element={<RetornoPago />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
              <Route path="/successfulProfessionalRegister" element={<RegisterProfExitoso />} />
            </Routes>
            {/*<WhatsAppButton /> */}
          </Router>
        </SocketProvider>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
};

export default App;
