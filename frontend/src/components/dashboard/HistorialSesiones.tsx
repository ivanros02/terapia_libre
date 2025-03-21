import React from "react";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

interface Sesion {
    fecha: string;
    hora: string;
    valor: string;
}

interface Terapeuta {
    nombre: string;
    especialidad: string;
    ultimaConsulta: string;
    valorSesion: string;
    descripcion: string;
}

interface HistorialProps {
    sesiones: Sesion[];
    terapeuta: Terapeuta;
    onCambiarTerapeuta?: () => void;
}

const HistorialSesiones: React.FC<HistorialProps> = ({ sesiones, terapeuta, onCambiarTerapeuta }) => {
    return (
        <Container fluid className="mt-4 rounded-4 p-5" style={{ maxWidth: "80%", backgroundColor: "white" }}>
            <Row className="align-items-start">
                {/* Historial de Sesiones */}
                <Col xs={12} md={6} className="mb-4 ">
                    <h5 className="fw-bold">Historial de sesiones</h5>
                    <ListGroup variant="flush" className="rounded-4">
                        {sesiones.map((sesion, index) => (
                            <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                                <div>
                                    <p className="mb-0 fw-semibold">{sesion.fecha}</p>
                                    <span className="text-muted">{sesion.hora} hs</span>
                                </div>
                                <span className="fw-bold">${sesion.valor}</span>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>

                {/* Información del Terapeuta */}
                <Col xs={12} md={6} className="d-flex flex-column align-items-md-end">

                    <div className="d-flex justify-content-between w-100">
                        <h5 className="fw-bold">Mi terapeuta</h5>
                        {onCambiarTerapeuta && (
                            <a href="#" className="text-primary fw-semibold" onClick={onCambiarTerapeuta}>
                                Cambiar
                            </a>
                        )}
                    </div>

                    <Card className="p-3 shadow-sm rounded-4 border border-light w-100">
                        <div className="d-flex align-items-center mb-3">
                            <div
                                className="rounded-circle bg-light text-dark d-flex align-items-center justify-content-center"
                                style={{ width: "50px", height: "50px", fontWeight: "bold", fontSize: "1rem" }}
                            >
                                {terapeuta.nombre
                                    .split(" ")
                                    .map(word => word.charAt(0).toUpperCase())
                                    .join("")}
                            </div>
                            <div className="ms-3">
                                <h6 className="mb-0 fw-bold">{terapeuta.nombre}</h6>
                                <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                    {terapeuta.especialidad}
                                </p>
                            </div>
                        </div>

                        <hr className="my-2" />

                        <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Última consulta</p>
                        <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>{terapeuta.ultimaConsulta}</p>

                        <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Valor de la sesión</p>
                        <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>${terapeuta.valorSesion}</p>

                        <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Descripción:</p>
                        <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{terapeuta.descripcion}</p>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default HistorialSesiones;