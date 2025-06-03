import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";

interface FiltrosPagosProps {
  filtros: {
    estado: string;
    metodo_pago: string;
    fecha_desde: string;
    fecha_hasta: string;
    tiene_cupon?: string; // Nuevo filtro
  };
  onFiltrosChange: (filtros: any) => void;
  onFiltrar: () => void;
  onLimpiar: () => void;
}

export const FiltrosPagos: React.FC<FiltrosPagosProps> = ({
  filtros,
  onFiltrosChange,
  onFiltrar,
  onLimpiar
}) => {
  return (
    <Card className="mb-4">
      <Card.Body>
        <h6 className="mb-3">
          <i className="bi bi-funnel me-2"></i>
          Filtros de Búsqueda
        </h6>
        <Row>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Estado</Form.Label>
              <Form.Select
                value={filtros.estado}
                onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="Pagado">Pagado</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Reembolsado">Reembolsado</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Método de Pago</Form.Label>
              <Form.Select
                value={filtros.metodo_pago}
                onChange={(e) => onFiltrosChange({ ...filtros, metodo_pago: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="tarjeta">Tarjeta</option>
                <option value="transferencia">Transferencia</option>
                <option value="efectivo">Efectivo</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Con Cupón</Form.Label>
              <Form.Select
                value={filtros.tiene_cupon || ""}
                onChange={(e) => onFiltrosChange({ ...filtros, tiene_cupon: e.target.value })}
              >
                <option value="">Todos</option>
                <option value="Si">Con cupón</option>
                <option value="No">Sin cupón</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => onFiltrosChange({ ...filtros, fecha_desde: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={2}>
            <Form.Group>
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => onFiltrosChange({ ...filtros, fecha_hasta: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={2} className="d-flex align-items-end">
            <div className="d-grid gap-2 w-100">
              <Button onClick={onFiltrar} size="sm">
                <i className="bi bi-search me-1"></i>
                Filtrar
              </Button>
              <Button variant="outline-secondary" onClick={onLimpiar} size="sm">
                <i className="bi bi-x-circle me-1"></i>
                Limpiar
              </Button>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default FiltrosPagos;