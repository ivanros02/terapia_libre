import React from "react";
import { Row, Col } from "react-bootstrap";
import { ReporteData, FiltrosReporte } from "./types/Reportes";
import { AnalisisTurnos } from "./AnalisisTurnos";
import { ResumenFinanciero } from "./ResumenFinanciero";

interface DetallesAnalisisProps {
  reporteData: ReporteData;
  filtros: FiltrosReporte;
  formatearMonto: (monto: number) => string;
  formatearFecha: (fecha: string) => string;
}

export const DetallesAnalisis: React.FC<DetallesAnalisisProps> = ({
  reporteData,
  filtros,
  formatearMonto,
  formatearFecha
}) => {
  return (
    <Row className="mb-4">
      <Col md={6}>
        <AnalisisTurnos reporteData={reporteData} />
      </Col>
      <Col md={6}>
        <ResumenFinanciero 
          reporteData={reporteData}
          filtros={filtros}
          formatearMonto={formatearMonto}
          formatearFecha={formatearFecha}
        />
      </Col>
    </Row>
  );
};