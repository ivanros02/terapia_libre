import React from "react";
import { Row, Col, Card } from "react-bootstrap";
import { ReporteData } from "./types/Reportes";

interface MetricasPrincipalesProps {
  reporteData: ReporteData;
  formatearMonto: (monto: number) => string;
}

export const MetricasPrincipales: React.FC<MetricasPrincipalesProps> = ({
  reporteData,
  formatearMonto
}) => {
  return (
    <Row className="mb-4">
      <Col md={3}>
        <Card className="text-center border-primary h-100">
          <Card.Body>
            <div className="display-6 text-primary mb-2">
              <i className="bi bi-calendar-check"></i>
            </div>
            <h5>Turnos Totales</h5>
            <h3 className="text-primary">{reporteData.turnos_totales}</h3>
            <small className="text-muted">En el período seleccionado</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-success h-100">
          <Card.Body>
            <div className="display-6 text-success mb-2">
              <i className="bi bi-check-circle"></i>
            </div>
            <h5>Tasa de Conversión</h5>
            <h3 className="text-success">{reporteData.tasa_conversion.toFixed(1)}%</h3>
            <small className="text-muted">Turnos completados</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-warning h-100">
          <Card.Body>
            <div className="display-6 text-warning mb-2">
              <i className="bi bi-currency-dollar"></i>
            </div>
            <h5>Ingresos Totales</h5>
            <h3 className="text-warning">{formatearMonto(reporteData.ingresos_totales)}</h3>
            <small className="text-muted">Pagos completados</small>
          </Card.Body>
        </Card>
      </Col>
      <Col md={3}>
        <Card className="text-center border-info h-100">
          <Card.Body>
            <div className="display-6 text-info mb-2">
              <i className="bi bi-graph-up"></i>
            </div>
            <h5>Ingreso Promedio</h5>
            <h3 className="text-info">{formatearMonto(reporteData.ingresos_promedio)}</h3>
            <small className="text-muted">Por transacción</small>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};