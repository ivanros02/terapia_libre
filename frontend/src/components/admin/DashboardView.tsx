import React from "react";
import { useEffect, useState } from "react";
import { Row, Col, Card, Alert, Button } from "react-bootstrap";
import axios from "axios";
import { VistaAdmin } from "./AdminDashboardCompleto"; // 🔹 IMPORTAR EL TIPO

const url = import.meta.env.VITE_API_BASE_URL;

interface DashboardStats {
  total_usuarios: number;
  profesionales_activos: number;
  turnos_pendientes: number;
  turnos_confirmados: number;
  turnos_futuros: number;
  pagos_pendientes: number;
  pagos_completados: number;
  ingresos_hoy: number;
  ingresos_semana: number;
}

// 🔹 AGREGAR INTERFACE PARA LAS PROPS
interface DashboardViewProps {
  onNavigateToSection?: (vista: VistaAdmin) => void;
}

// 🔹 ACTUALIZAR LA FUNCIÓN PARA RECIBIR PROPS
const DashboardView = ({ onNavigateToSection }: DashboardViewProps) => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setError("No hay token de administrador");
        return;
      }

      const response = await axios.get(`${url}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStats(response.data);
    } catch (error: any) {
      console.error("Error al obtener estadísticas del dashboard:", error);
      setError(error.response?.data?.message || "Error al cargar estadísticas del dashboard");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 0
    }).format(amount);
  };

  // 🔹 FUNCIONES DE NAVEGACIÓN
  const handleNavigateToCupones = () => {
    if (onNavigateToSection) {
      onNavigateToSection("cupones");
    }
  };

  const handleNavigateToTurnos = () => {
    if (onNavigateToSection) {
      onNavigateToSection("turnos");
    }
  };

  const handleNavigateToPagos = () => {
    if (onNavigateToSection) {
      onNavigateToSection("pagos"); // Para reportes, va a la sección de pagos
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando estadísticas...</span>
        </div>
        <p className="mt-2 text-muted">Obteniendo datos del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Error al cargar el dashboard</Alert.Heading>
        <p>{error}</p>
        <Button variant="outline-danger" onClick={fetchDashboardStats}>
          Intentar nuevamente
        </Button>
      </Alert>
    );
  }

  if (!stats) {
    return (
      <Alert variant="warning" className="m-4">
        No se pudieron cargar las estadísticas del dashboard.
      </Alert>
    );
  }

  return (
    <div>
      {/* Título y acción */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="mb-1">Dashboard Principal</h3>
          <p className="text-muted mb-0">Resumen general del sistema</p>
        </div>
        <Button variant="outline-primary" onClick={fetchDashboardStats} size="sm">
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </Button>
      </div>

      {/* Estadísticas principales */}
      <Row className="g-4 mb-4">
        {/* Usuarios */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-primary border-2">
            <Card.Body className="text-center">
              <div className="display-6 text-primary mb-2">
                <i className="bi bi-people-fill"></i>
              </div>
              <h4 className="mb-1">{stats.total_usuarios.toLocaleString()}</h4>
              <p className="text-muted mb-0">Usuarios Totales</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Profesionales */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-success border-2">
            <Card.Body className="text-center">
              <div className="display-6 text-success mb-2">
                <i className="bi bi-person-badge-fill"></i>
              </div>
              <h4 className="mb-1">{stats.profesionales_activos.toLocaleString()}</h4>
              <p className="text-muted mb-0">Profesionales Activos</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Turnos Futuros */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-info border-2">
            <Card.Body className="text-center">
              <div className="display-6 text-info mb-2">
                <i className="bi bi-calendar-check-fill"></i>
              </div>
              <h4 className="mb-1">{stats.turnos_futuros.toLocaleString()}</h4>
              <p className="text-muted mb-0">Turnos Futuros</p>
            </Card.Body>
          </Card>
        </Col>

        {/* Ingresos Hoy */}
        <Col md={6} lg={3}>
          <Card className="h-100 border-warning border-2">
            <Card.Body className="text-center">
              <div className="display-6 text-warning mb-2">
                <i className="bi bi-currency-dollar"></i>
              </div>
              <h4 className="mb-1">{formatCurrency(stats.ingresos_hoy)}</h4>
              <p className="text-muted mb-0">Ingresos Hoy</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Estadísticas detalladas */}
      <Row className="g-4 mb-4">
        {/* Turnos */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">
                <i className="bi bi-calendar3 me-2"></i>
                Estado de Turnos
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-4">
                  <div className="h5 text-warning">{stats.turnos_pendientes}</div>
                  <small className="text-muted">Pendientes</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-success">{stats.turnos_confirmados}</div>
                  <small className="text-muted">Confirmados</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-info">{stats.turnos_futuros}</div>
                  <small className="text-muted">Futuros</small>
                </div>
              </div>
              <hr />
              <div className="text-center">
                <small className="text-muted">
                  Total de turnos en el sistema
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Pagos */}
        <Col lg={6}>
          <Card className="h-100">
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">
                <i className="bi bi-credit-card me-2"></i>
                Estado de Pagos
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="row text-center">
                <div className="col-4">
                  <div className="h5 text-warning">{stats.pagos_pendientes}</div>
                  <small className="text-muted">Pendientes</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-success">{stats.pagos_completados}</div>
                  <small className="text-muted">Completados</small>
                </div>
                <div className="col-4">
                  <div className="h5 text-primary">{formatCurrency(stats.ingresos_semana)}</div>
                  <small className="text-muted">Esta Semana</small>
                </div>
              </div>
              <hr />
              <div className="text-center">
                <small className="text-muted">
                  Resumen financiero del período
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Acciones rápidas */}
      <Row className="g-4">
        <Col lg={6}>
          <Card>
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">
                <i className="bi bi-lightning-fill me-2"></i>
                Acciones Rápidas
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                {/* 🔹 BOTONES ACTUALIZADOS CON NAVEGACIÓN */}
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={handleNavigateToCupones}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Crear Nuevo Cupón
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={handleNavigateToTurnos}
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Ver Turnos de Hoy
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={handleNavigateToPagos}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Generar Reporte
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={6}>
          <Card>
            <Card.Header className="bg-light">
              <Card.Title className="mb-0">
                <i className="bi bi-gear-fill me-2"></i>
                Estado del Sistema
              </Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Base de Datos</span>
                <span className="badge bg-success">Conectada</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>API Backend</span>
                <span className="badge bg-success">Funcionando</span>
              </div>
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span>Servicios de Pago</span>
                <span className="badge bg-success">Activos</span>
              </div>
              <div className="d-flex justify-content-between align-items-center">
                <span>Última actualización</span>
                <span className="text-muted">{new Date().toLocaleTimeString('es-AR')}</span>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardView;