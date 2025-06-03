import React from "react";
import { Card, Table, Badge } from "react-bootstrap";
import { Pago } from "./types/Pago";

interface TablaPagosProps {
  pagos: Pago[];
  totales: any;
  formatearFecha: (fecha: string) => string;
  formatearMonto: (monto: number) => string;
}

export const TablaPagos: React.FC<TablaPagosProps> = ({
  pagos,
  formatearFecha,
  formatearMonto
}) => {
  const getEstadoBadge = (estado: string) => {
    const variants: { [key: string]: string } = {
      'Pagado': 'success',
      'Pendiente': 'warning',
      'Reembolsado': 'info'
    };
    return <Badge bg={variants[estado] || 'secondary'}>{estado}</Badge>;
  };

  const getCuponBadge = (tieneCupon: string, codigoCupon?: string) => {
    if (tieneCupon === 'Si') {
      return (
        <div>
          <Badge bg="success" className="d-block mb-1">
            <i className="bi bi-ticket-perforated me-1"></i>
            Con cupón
          </Badge>
          {codigoCupon && (
            <small className="text-muted">{codigoCupon}</small>
          )}
        </div>
      );
    }
    return <Badge bg="secondary">Sin cupón</Badge>;
  };

  return (
    <Card>
      <Card.Body>
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha Pago</th>
              <th>Fecha Turno</th>
              <th>Usuario</th>
              <th>Profesional</th>
              <th>Monto</th>
              <th>Método</th>
              <th>Estado</th>
              <th>Cupón</th>
              <th>ID Transacción</th>
            </tr>
          </thead>
          <tbody>
            {pagos && pagos.length > 0 ? (
              pagos.map((pago) => (
                <tr key={pago.id_pago}>
                  <td>{pago.id_pago}</td>
                  <td>{formatearFecha(pago.fecha_pago)}</td>
                  <td>
                    <div>
                      <strong>{new Date(pago.fecha_turno).toLocaleDateString('es-AR')}</strong>
                      <br />
                      <small className="text-muted">{pago.hora_turno?.slice(0, 5)}</small>
                    </div>
                  </td>
                  <td>
                    <div>
                      <strong>{pago.nombre_usuario || 'N/A'}</strong>
                      <br />
                      <small className="text-muted">{pago.correo_usuario || 'N/A'}</small>
                    </div>
                  </td>
                  <td>{pago.nombre_profesional || 'N/A'}</td>
                  <td className="text-success">
                    <strong>{formatearMonto(pago.monto)}</strong>
                  </td>
                  <td>
                    <Badge bg="info">{pago.metodo_pago}</Badge>
                  </td>
                  <td>{getEstadoBadge(pago.estado)}</td>
                  <td>{getCuponBadge(pago.tiene_cupon, pago.codigo_cupon)}</td>
                  <td>
                    <code className="small">{pago.id_transaccion}</code>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10} className="text-center text-muted py-4">
                  No se encontraron pagos con los filtros aplicados
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default TablaPagos;