import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { PayPalScriptProvider } from "@paypal/react-paypal-js"; // ✅ Importar PayPal
import Home from "./pages/Home";
import Professionals from "./pages/Professionals";
import Login from "./pages/Login";
import FormProfessionals from "./pages/FormProfessionals";
import Register from "./pages/Register";
import DashboardProfesional from "./pages/DashboardProfesional";
import DashboardUsuario from "./pages/DashboardUsuario";
import DashboardProfesionalCalendar from "./pages/DashboardProfesionalCalendar";
import ProfessionalDetails from "./pages/ProfessionalDetails";
import DashboardMensajes from "./pages/DashboardMsg";
import DashboardProfesionalConfig from "./pages/DashboardProfesionalConfig";
import AdminProfesionales from "./pages/AdminProfesionales";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
      {/* ✅ Agregamos el PayPalScriptProvider aquí */}
      <PayPalScriptProvider options={{ clientId: "ASuvwaL7zuIKfyr5_OppnnQGrKqyvWDPkSn2BSHYTSR8wHbxOQPZE1JzVQ2Oj8ECpJSJ2XF-0ADkTk4l" }}>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/professionals" element={<Professionals />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/formProfessionals" element={<FormProfessionals />} />
            <Route path="/dashboard/profesional" element={<DashboardProfesional />} />
            <Route path="/dashboard/usuario" element={<DashboardUsuario />} />
            <Route path="/dashboard/profesional/calendario_profesional" element={<DashboardProfesionalCalendar/>} />
            <Route path="/messages" element={<DashboardMensajes />} />
            <Route path="/profesional/:id" element={<ProfessionalDetails />} />
            <Route path="/dashboard/profesional/config_profesional" element={<DashboardProfesionalConfig/>} />
            <Route path="/admin" element={<AdminProfesionales/>} />
          </Routes>
        </Router>
      </PayPalScriptProvider>
    </HelmetProvider>
  );
};

export default App;
