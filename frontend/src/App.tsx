import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
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
import "./index.css";
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <HelmetProvider>
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
          <Route path="/profesional/:id" element={<ProfessionalDetails />} /> {/* Nueva ruta */}
          <Route path="/dashboard/profesional/config_profesional" element={<DashboardProfesionalConfig/>} />
        </Routes>
      </Router>
    </HelmetProvider>
  );
};

export default App;
