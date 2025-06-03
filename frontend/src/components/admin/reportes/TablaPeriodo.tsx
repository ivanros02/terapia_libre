import React from "react";
import { Card, Table, Badge } from "react-bootstrap";
import { ResumenPeriodo } from "./types/Reportes";

interface TablaPeriodoProps {
  resumenPeriodo: ResumenPeriodo[];
  formatearMonto: (monto: number) => string;
  formatearFecha: (fecha: string) => string;
}

export const TablaPeriodo: React.FC<TablaPeriodoProps> = ({
  resumenPeriodo,
  formatearMonto,
  formatearFecha
}) => {
  return (
    <Card>
      <Card.Header className="bg-light">
        <Card.Title className="mb-0">
          <i className="bi bi-calendar3 me-2"></i>
          Resumen Últimos 7 Días
        </Card.Title>
      </Card.Header>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Turnos</th>
              <th>Ingresos</th>
              <th>Promedio por Turno</th>
            </tr>
          </thead>
          <tbody>
            {resumenPeriodo.map((dia, index) => (
              <tr key={index}>
                <td>{formatearFecha(dia.fecha)}</td>
                <td>
                  <Badge bg={dia.turnos > 0 ? "primary" : "secondary"}>
                    {dia.turnos}
                  </Badge>
                </td>
                <td className="text-success">
                  <strong>{formatearMonto(dia.ingresos)}</strong>
                </td>
                <td className="text-muted">
                  {dia.turnos > 0 ? formatearMonto(dia.ingresos / dia.turnos) : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};