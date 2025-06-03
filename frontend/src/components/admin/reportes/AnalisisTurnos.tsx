import React from "react";
import { Card, Badge } from "react-bootstrap";
import { ReporteData } from "./types/Reportes";

interface AnalisisTurnosProps {
    reporteData: ReporteData;
}

export const AnalisisTurnos: React.FC<AnalisisTurnosProps> = ({ reporteData }) => {
    return (
        <Card>
            <Card.Header className="bg-light">
                <Card.Title className="mb-0">
                    <i className="bi bi-pie-chart me-2"></i>
                    Análisis de Turnos
                </Card.Title>
            </Card.Header>
            <Card.Body>
                <div className="row text-center">
                    <div className="col-4">
                        <div className="h4 text-primary">{reporteData.turnos_totales}</div>
                        <small className="text-muted">Totales</small>
                    </div>
                    <div className="col-4">
                        <div className="h4 text-success">{reporteData.turnos_completados}</div>
                        <small className="text-muted">Completados</small>
                    </div>
                    <div className="col-4">
                        <div className="h4 text-danger">{reporteData.turnos_cancelados}</div>
                        <small className="text-muted">Cancelados</small>
                    </div>
                </div>
                <hr />
                <div className="text-center">
                    <Badge bg="success" className="me-2">
                        Tasa de éxito: {reporteData.turnos_totales > 0 ?
                            ((reporteData.turnos_completados / reporteData.turnos_totales) * 100).toFixed(1) : 0}%
                    </Badge>
                    <Badge bg="danger">
                        Tasa de cancelación: {reporteData.turnos_totales > 0 ?
                            ((reporteData.turnos_cancelados / reporteData.turnos_totales) * 100).toFixed(1) : 0}%
                    </Badge>
                </div>
            </Card.Body>
        </Card>
    );
};