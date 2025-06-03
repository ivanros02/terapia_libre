import React from "react";
import { Card, Table, Badge, Button } from "react-bootstrap";
import { Turno } from "./types/Turnos";

interface TablaTurnosProps {
    turnos: Turno[];
    onVerDetalles: (id_turno: number) => void;
    loadingDetalle: boolean;
}

export const TablaTurnos: React.FC<TablaTurnosProps> = ({
    turnos,
    onVerDetalles,
    loadingDetalle
}) => {
    const getEstadoBadge = (estado: string) => {
        const variants: { [key: string]: string } = {
            'Pendiente': 'warning',
            'Confirmado': 'success',
            'Cancelado': 'danger',
            'Completado': 'primary',
            'Pagado': 'success',
            'Reembolsado': 'info'
        };
        return <Badge bg={variants[estado] || 'secondary'}>{estado}</Badge>;
    };

    const formatearFecha = (fecha: string) => {
        try {
            return new Date(fecha).toLocaleDateString('es-AR', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            });
        } catch (error) {
            return fecha;
        }
    };

    const formatearHora = (hora: string) => {
        try {
            return hora.slice(0, 5); // HH:MM
        } catch (error) {
            return hora;
        }
    };

    const formatearMonto = (turno: Turno) => {
        // Intentar obtener el monto de diferentes fuentes
        let monto = turno.monto_a_mostrar || turno.monto || turno.valor_sesion;

        // Convertir string a número si es necesario
        if (typeof monto === 'string') {
            monto = parseFloat(monto);
        }

        // Verificar si es un número válido
        if (typeof monto !== 'number' || isNaN(monto) || monto <= 0) {
            return <span className="text-muted">Sin precio</span>;
        }

        const montoFormateado = `$${monto.toFixed(2)}`;

        // Indicar si es un pago registrado o estimado
        if (turno.tiene_pago_registrado === 'Si' || turno.estado_pago) {
            return (
                <div>
                    <strong className="text-success">{montoFormateado}</strong>
                    <small className="d-block text-success">
                        {turno.estado_pago || 'Registrado'}
                    </small>
                </div>
            );
        } else {
            return (
                <div>
                    <span>{montoFormateado}</span>
                    <small className="d-block text-muted">Precio sesión</small>
                </div>
            );
        }
    };

    return (
        <Card>
            <Card.Body>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>Fecha/Hora</th>
                            <th>Paciente</th>
                            <th>Profesional</th>
                            <th>Estado Turno</th>
                            <th>Estado Pago</th>
                            <th>Monto</th>
                            <th>Meet</th>
                            <th>Google Calendar</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {turnos && turnos.length > 0 ? (
                            turnos.map((turno) => (
                                <tr key={turno.id_turno}>
                                    <td>
                                        <div>
                                            <strong>{formatearFecha(turno.fecha_turno)}</strong>
                                            <br />
                                            <small className="text-muted">{formatearHora(turno.hora_turno)}</small>
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <strong>{turno.nombre_usuario || 'N/A'}</strong>
                                            <br />
                                            <small className="text-muted">{turno.correo_usuario || 'N/A'}</small>
                                        </div>
                                    </td>
                                    <td>{turno.nombre_profesional || 'N/A'}</td>
                                    <td>{getEstadoBadge(turno.estado_turno)}</td>
                                    <td>{turno.estado_pago ? getEstadoBadge(turno.estado_pago) : '-'}</td>
                                    <td>{formatearMonto(turno)}</td>
                                    <td className="text-center">
                                        {turno.meet_url ? (
                                            <Badge bg="success">
                                                <i className="bi bi-check-circle"></i>
                                            </Badge>
                                        ) : (
                                            <Badge bg="secondary">
                                                <i className="bi bi-x-circle"></i>
                                            </Badge>
                                        )}
                                    </td>
                                    <td className="text-center">
                                        {turno.google_event_id_profesional ? (
                                            <Badge bg="success">
                                                <i className="bi bi-calendar-check"></i>
                                            </Badge>
                                        ) : (
                                            <Badge bg="secondary">
                                                <i className="bi bi-calendar-x"></i>
                                            </Badge>
                                        )}
                                    </td>
                                    <td>
                                        <Button
                                            size="sm"
                                            variant="outline-info"
                                            onClick={() => onVerDetalles(turno.id_turno)}
                                            disabled={loadingDetalle}
                                        >
                                            <i className="bi bi-eye me-1"></i>
                                            Ver
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center text-muted py-4">
                                    No se encontraron turnos con los filtros aplicados
                                </td>
                            </tr>
                        )}
                    </tbody>
                </Table>
            </Card.Body>
        </Card>
    );
};