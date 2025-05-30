import React from "react";
import { Card, Container, Row, Col, ListGroup } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/HistorialSesiones.css";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();

    const handleCambiar = () => {
        if (onCambiarTerapeuta) onCambiarTerapeuta(); // si querés seguir usando esto
        navigate("/professionals");
    };

    return (
        <Container fluid className="historial-container rounded-4 p-4" style={{ backgroundColor: "#f8f9fa" }}>
            <Row className="align-items-start">
                {/* Historial de Sesiones */}
                <Col xs={12} md={6} className="mb-4 ">
                    <h5 className="fw-bold" style={{ fontSize: "24.58px" }}>Historial de sesiones</h5>
                    <ListGroup variant="flush" className="rounded-4 historial-sesiones">

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
                <Col xs={12} md={6} className="d-flex flex-column align-items-md-end d-none d-md-block">
                    {/* Contenedor de título y Card alineados */}
                    <div className="w-100 d-flex flex-column justify-content-start">
                        <div className="d-flex justify-content-between w-100 align-items-center">
                            <h5 className="fw-bold mb-0" style={{ fontSize: "24.58px" }}>Mi terapeuta</h5>
                            {onCambiarTerapeuta && (
                                <a
                                    href="#"
                                    className="text-primary fw-semibold"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleCambiar();
                                    }}
                                >
                                    Cambiar
                                </a>
                            )}
                        </div>

                        {/* Tarjeta alineada correctamente */}
                        <Card className="p-3 shadow-sm rounded-4 border border-light historial-terapeuta-card mt-2">
                            <div className="d-flex align-items-center mb-3">
                                <div className="circle-container">
                                    <div className="circle-inner" style={{ fontSize: "18.43px" }}>
                                        {terapeuta.nombre
                                            .split(" ")
                                            .map(word => word.charAt(0).toUpperCase())
                                            .join("")}
                                    </div>
                                </div>
                                <div className="ms-3">
                                    <h6 className="mb-0 fw-bold">{terapeuta.nombre}</h6>
                                    <p className="text-muted mb-0" style={{ fontSize: "0.9rem" }}>
                                        {terapeuta.especialidad}
                                    </p>
                                </div>
                            </div>

                            <hr className="my-3" />

                            <div className="d-flex align-items-center">
                                <p className="mb-1 fw-bold me-2 " style={{ fontSize: "12.29px" }}>Última consulta:</p>
                                <p className="text-muted mb-2 ms-1" style={{ fontSize: "12.29px" }}>{terapeuta.ultimaConsulta}</p>
                            </div>

                            <div className="d-flex align-items-center">
                                <p className="mb-1 fw-bold" style={{ fontSize: "12.29px" }}>Valor de la sesión:</p>
                                <p className="text-muted mb-2 ms-1" style={{ fontSize: "12.29px" }}>${terapeuta.valorSesion}</p>
                            </div>

                            <div className="d-flex align-items-center">
                                <p className="mb-1 fw-bold" style={{ fontSize: "12.29px" }}>Descripción:</p>
                                <p className="text-muted mb-0 ms-1" style={{ fontSize: "12.29px" }}>{terapeuta.descripcion}</p>
                            </div>



                        </Card>
                    </div>
                </Col>

            </Row>
        </Container>
    );
};

export default HistorialSesiones;