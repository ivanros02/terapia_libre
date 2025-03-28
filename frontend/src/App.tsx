import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // ✅ Importar PayPal
import { SocketProvider } from "./context/SocketContext"; // ✅ Importar el SocketProvider
import Home from "./pages/Home";
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
import AdminProfesionales from "./pages/AdminProfesionales";
import AdminLogin from "./components/AdminLogin";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App: React.FC = () => {
  return (

    <HelmetProvider>
      <ToastContainer position="top-center" autoClose={3000} />
      {/* ✅ Agregamos el PayPalScriptProvider aquí */}
      <PayPalScriptProvider options={{ clientId: "ASuvwaL7zuIKfyr5_OppnnQGrKqyvWDPkSn2BSHYTSR8wHbxOQPZE1JzVQ2Oj8ECpJSJ2XF-0ADkTk4l" }}>
        <SocketProvider> {/* ✅ Aquí envolvemos todo con el SocketProvider */}
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/professionals" element={<Professionals />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/formProfessionals" element={<FormProfessionals />} />
              <Route path="/dashboard/profesional" element={<DashboardProfesional />} />
              <Route path="/dashboard/usuario" element={<DashboardUsuario />} />
              <Route path="/dashboard/calendario" element={<DashboardCalendar />} />
              <Route path="/messages" element={<DashboardMensajes />} />
              <Route path="/profesional/:id" element={<ProfessionalDetails />} />
              <Route path="/dashboard/profesional/config_profesional" element={<DashboardProfesionalConfig />} />
              <Route path="/dashboard/usuario/config_usuario" element={<DashboardUsuarioConfig />} />
              <Route path="/admin" element={<AdminProfesionales />} />
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Routes>
          </Router>
        </SocketProvider>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
};

export default App;
