import React from "react";
import { Modal, Button, Row, Col, Card, Badge } from "react-bootstrap";
import { DetallesTurno } from "./types/Turnos";

interface ModalDetallesTurnoProps {
    show: boolean;
    onHide: () => void;
    turno: DetallesTurno | null;
}

export const ModalDetallesTurno: React.FC<ModalDetallesTurnoProps> = ({
    show,
    onHide,
    turno
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

    const formatearMontoSimple = (monto: any) => {
        if (monto === null || monto === undefined) return '-';

        // Convertir string a número si es necesario
        const montoNumerico = typeof monto === 'string' ? parseFloat(monto) : monto;

        if (typeof montoNumerico !== 'number' || isNaN(montoNumerico)) return '-';

        return `$${montoNumerico.toFixed(2)}`;
    };

    return (
        <Modal show={show} onHide={onHide} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>
                    <i className="bi bi-calendar-check me-2"></i>
                    Detalles del Turno #{turno?.id_turno}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {turno && (
                    <Row>
                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">Información del Turno</h6>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Fecha:</strong> {formatearFecha(turno.fecha_turno)}</p>
                                    <p><strong>Hora:</strong> {formatearHora(turno.hora_turno)}</p>
                                    <p><strong>Estado:</strong> {getEstadoBadge(turno.estado)}</p>
                                    {turno.motivo_cancelacion && (
                                        <p><strong>Motivo Cancelación:</strong> {turno.motivo_cancelacion}</p>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">Paciente</h6>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Nombre:</strong> {turno.nombre_usuario}</p>
                                    <p><strong>Email:</strong> {turno.correo_usuario}</p>
                                    <p><strong>Teléfono:</strong> {turno.telefono_usuario || 'No registrado'}</p>
                                    <p><strong>Tipo de cuenta:</strong> {turno.id_google_usuario ?
                                        <Badge bg="info">Google</Badge> : <Badge bg="secondary">Email</Badge>
                                    }</p>
                                </Card.Body>
                            </Card>
                        </Col>

                        <Col md={6}>
                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">Profesional</h6>
                                </Card.Header>
                                <Card.Body>
                                    <p><strong>Nombre:</strong> {turno.nombre_profesional}</p>
                                    <p><strong>Email:</strong> {turno.correo_profesional}</p>
                                    <p><strong>Valor Sesión:</strong> ${turno.valor}</p>
                                </Card.Body>
                            </Card>

                            <Card className="mb-3">
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">Información de Pago</h6>
                                </Card.Header>
                                <Card.Body>
                                    {turno.monto ? (
                                        <>
                                            <p><strong>Monto:</strong> {formatearMontoSimple(turno.monto)}</p>
                                            <p><strong>Método:</strong> {turno.metodo_pago}</p>
                                            <p><strong>Estado:</strong> {getEstadoBadge(turno.estado_pago!)}</p>
                                            <p><strong>ID Transacción:</strong>
                                                <code className="ms-2">{turno.id_transaccion}</code>
                                            </p>
                                            {turno.fecha_pago && (
                                                <p><strong>Fecha Pago:</strong> {formatearFecha(turno.fecha_pago)}</p>
                                            )}
                                        </>
                                    ) : (
                                        <p className="text-muted">No hay información de pago registrada</p>
                                    )}
                                </Card.Body>
                            </Card>

                            <Card>
                                <Card.Header className="bg-light">
                                    <h6 className="mb-0">Meet & Calendario</h6>
                                </Card.Header>
                                <Card.Body>
                                    <div className="mb-2">
                                        <strong>Meet URL:</strong> {turno.meet_url ?
                                            <Badge bg="success" className="ms-2">Creado</Badge> :
                                            <Badge bg="secondary" className="ms-2">No creado</Badge>
                                        }
                                    </div>

                                    <div className="mb-3">
                                        <strong>Evento Google Calendar:</strong> {turno.google_event_id_profesional ?
                                            <Badge bg="success" className="ms-2">✓ Creado por el profesional</Badge> :
                                            <Badge bg="warning" className="ms-2">✗ No creado</Badge>
                                        }
                                        {turno.google_event_id_profesional && (
                                            <div className="mt-1">
                                                <small className="text-muted">ID: {turno.google_event_id_profesional}</small>
                                            </div>
                                        )}
                                    </div>

                                    {turno.meet_url && (
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            onClick={() => window.open(turno.meet_url, '_blank')}
                                        >
                                            <i className="bi bi-camera-video me-1"></i>
                                            Abrir Meet
                                        </Button>
                                    )}
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onHide}>
                    Cerrar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};