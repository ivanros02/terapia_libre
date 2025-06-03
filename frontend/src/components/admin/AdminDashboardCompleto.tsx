import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, ButtonGroup, Button } from "react-bootstrap";

// Componentes de vistas específicas
import DashboardView from "./DashboardView";
import TurnosView from "./turnos/TurnosView";
import PagosView from "./pagos/PagosView";
import ReportesView from "./reportes/ReportesView";
import ProfesionalesView from "./profesionales/ProfesionalesView";
import PacientesView from "./PacientesView";
import CuponesView from "./cupones/CuponesView";

// Tipos
export type VistaAdmin = "dashboard" | "turnos" | "pagos" | "reportes" | "profesionales" | "usuarios" | "cupones";

const AdminDashboardCompleto = () => {
  const navigate = useNavigate();
  const [vistaActual, setVistaActual] = useState<VistaAdmin>("dashboard");

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    navigate("/admin-login");
  };

  const cambiarVista = (vista: VistaAdmin) => {
    setVistaActual(vista);
  };

  const renderVistaActual = () => {
    switch (vistaActual) {
      case "dashboard":
        return <DashboardView />;
      case "turnos":
        return <TurnosView />;
      case "pagos":
        return <PagosView />;
      case "reportes":
        return <ReportesView />;
      case "profesionales":
        return <ProfesionalesView />;
      case "usuarios":
        return <PacientesView />;
      case "cupones":
        return <CuponesView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <Container fluid className="px-0">
      {/* Header */}
      <div className="bg-white shadow-sm border-bottom px-4 py-3 mb-0">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-0 text-primary fw-bold">Panel de Administración</h2>
            <small className="text-muted">Sistema de gestión integral</small>
          </div>
          <Button 
            variant="outline-danger" 
            size="sm"
            onClick={handleLogout}
            className="d-flex align-items-center gap-2"
          >
            <i className="bi bi-box-arrow-right"></i>
            Cerrar Sesión
          </Button>
        </div>
      </div>

      {/* Navegación */}
      <div className="bg-light border-bottom px-4 py-3">
        <ButtonGroup className="w-100 flex-wrap gap-1">
          <Button
            variant={vistaActual === "dashboard" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("dashboard")}
            className="flex-fill"
          >
            <i className="bi bi-speedometer2 me-1"></i>
            Dashboard
          </Button>
          <Button
            variant={vistaActual === "turnos" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("turnos")}
            className="flex-fill"
          >
            <i className="bi bi-calendar-check me-1"></i>
            Turnos
          </Button>
          <Button
            variant={vistaActual === "pagos" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("pagos")}
            className="flex-fill"
          >
            <i className="bi bi-credit-card me-1"></i>
            Pagos
          </Button>
          <Button
            variant={vistaActual === "reportes" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("reportes")}
            className="flex-fill"
          >
            <i className="bi bi-graph-up me-1"></i>
            Reportes
          </Button>
          <Button
            variant={vistaActual === "profesionales" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("profesionales")}
            className="flex-fill"
          >
            <i className="bi bi-people me-1"></i>
            Profesionales
          </Button>
          <Button
            variant={vistaActual === "usuarios" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("usuarios")}
            className="flex-fill"
          >
            <i className="bi bi-person-lines-fill me-1"></i>
            Usuarios
          </Button>
          <Button
            variant={vistaActual === "cupones" ? "primary" : "outline-primary"}
            onClick={() => cambiarVista("cupones")}
            className="flex-fill"
          >
            <i className="bi bi-tag me-1"></i>
            Cupones
          </Button>
        </ButtonGroup>
      </div>

      {/* Contenido Principal */}
      <div className="p-4">
        {renderVistaActual()}
      </div>
    </Container>
  );
};

export default AdminDashboardCompleto;