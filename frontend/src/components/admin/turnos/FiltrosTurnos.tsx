import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { Filtros } from "./types/Turnos";

interface FiltrosTurnosProps {
    filtros: Filtros;
    onFiltrosChange: (filtros: Filtros) => void;
    onFiltrar: () => void;
    onLimpiar: () => void;
}

export const FiltrosTurnos: React.FC<FiltrosTurnosProps> = ({
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
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Estado</Form.Label>
                            <Form.Select
                                value={filtros.estado}
                                onChange={(e) => onFiltrosChange({ ...filtros, estado: e.target.value })}
                            >
                                <option value="">Todos los estados</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Confirmado">Confirmado</option>
                                <option value="Cancelado">Cancelado</option>
                                <option value="Completado">Completado</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Fecha Desde</Form.Label>
                            <Form.Control
                                type="date"
                                value={filtros.fecha_desde}
                                onChange={(e) => onFiltrosChange({ ...filtros, fecha_desde: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Fecha Hasta</Form.Label>
                            <Form.Control
                                type="date"
                                value={filtros.fecha_hasta}
                                onChange={(e) => onFiltrosChange({ ...filtros, fecha_hasta: e.target.value })}
                            />
                        </Form.Group>
                    </Col>
                    <Col md={3} className="d-flex align-items-end">
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