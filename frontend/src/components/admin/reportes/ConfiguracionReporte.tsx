import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { FiltrosReporte } from "./types/Reportes";

interface ConfiguracionReporteProps {
  filtros: FiltrosReporte;
  onFiltrosChange: (filtros: FiltrosReporte) => void;
  onGenerar: () => void;
  loading: boolean;
}

export const ConfiguracionReporte: React.FC<ConfiguracionReporteProps> = ({
  filtros,
  onFiltrosChange,
  onGenerar,
  loading
}) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h6 className="mb-3">
          <i className="bi bi-calendar-range me-2"></i>
          Configuración del Reporte
        </h6>
        <Row>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => onFiltrosChange({...filtros, fecha_desde: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => onFiltrosChange({...filtros, fecha_hasta: e.target.value})}
              />
            </Form.Group>
          </Col>
          <Col md={3}>
            <Form.Group>
              <Form.Label>Tipo de Reporte</Form.Label>
              <Form.Select
                value={filtros.tipo_reporte}
                onChange={(e) => onFiltrosChange({...filtros, tipo_reporte: e.target.value})}
              >
                <option value="general">General</option>
                <option value="financiero">Financiero</option>
                <option value="turnos">Solo Turnos</option>
                <option value="usuarios">Solo Usuarios</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={3} className="d-flex align-items-end">
            <Button onClick={onGenerar} disabled={loading} className="w-100">
              {loading ? (
                <>
                  <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                  Generando...
                </>
              ) : (
                <>
                  <i className="bi bi-graph-up me-1"></i>
                  Generar Reporte
                </>
              )}
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};