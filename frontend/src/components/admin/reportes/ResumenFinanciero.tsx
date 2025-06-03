import React from "react";
import { Card } from "react-bootstrap";
import { ReporteData, FiltrosReporte } from "./types/Reportes";

interface ResumenFinancieroProps {
  reporteData: ReporteData;
  filtros: FiltrosReporte;
  formatearMonto: (monto: number) => string;
  formatearFecha: (fecha: string) => string;
}

export const ResumenFinanciero: React.FC<ResumenFinancieroProps> = ({
  reporteData,
  filtros,
  formatearMonto,
  formatearFecha
}) => {
  return (
    <Card>
      <Card.Header className="bg-light">
        <Card.Title className="mb-0">
          <i className="bi bi-cash-stack me-2"></i>
          Resumen Financiero
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Ingresos Totales:</span>
            <strong className="text-success">{formatearMonto(reporteData.ingresos_totales)}</strong>
          </div>
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Ingreso Promedio:</span>
            <strong className="text-info">{formatearMonto(reporteData.ingresos_promedio)}</strong>
          </div>
        </div>
        <div className="mb-3">
          <div className="d-flex justify-content-between">
            <span>Profesionales Activos:</span>
            <strong className="text-primary">{reporteData.profesionales_activos}</strong>
          </div>
        </div>
        <hr />
        <div className="text-center">
          <small className="text-muted">
            Período: {formatearFecha(filtros.fecha_desde)} - {formatearFecha(filtros.fecha_hasta)}
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};