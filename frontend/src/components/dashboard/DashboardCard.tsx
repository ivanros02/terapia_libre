import { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Modal } from "react-bootstrap";
import imagen from "/quienes_somos.png"; // Asegúrate de importar la imagen correctamente
import CalendarAvailability from "../detallesProfesional/CalendarAvailability";
import "../../styles/DashboardCard.css";
import { Link } from "react-router-dom";
import { format, parseISO } from "date-fns";

interface DashboardCardProps {
    name: string;
    patientName: string;
    appointmentTime: string;
    newPatients: number;
    terapeuta?: number; // ← opcional
    fecha_turno?: string; // ← opcional
}


const DashboardCard: React.FC<DashboardCardProps> = ({ name, patientName, appointmentTime, newPatients, terapeuta, fecha_turno }) => {
    const esProfesional = localStorage.getItem("esProfesional") === "true";
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [showModal, setShowModal] = useState(false);

    const fechaFormateada = fecha_turno
        ? format(parseISO(fecha_turno), "dd/MM")
        : "";



    return (
        <Container fluid>
            {/* 🔹 Título principal - Solo visible en pantallas medianas o más grandes */}
            <h1 className="d-none d-md-block titulo-card" >
                Buen día, <span style={{ color: "var(--naranja)" }}>{name}!</span>
            </h1>

            {/* 🔹 Contenedor interno: tarjeta del próximo paciente + imagen decorativa */}
            <div className="position-relative w-100">
                <Card className="p-3 shadow-lg rounded-4 border-0 card-responsive">
                    {/* 🟢 Tarjeta interna: Información del próximo paciente */}
                    <div
                        className={`contenedor-interno ${!esProfesional ? "centrado-vertical" : ""}`}
                    >


                        <Card className="p-3 mb-3 rounded-4 border-0 bg-transparent card-interna">
                            <h5 className="titulo-card-interna">
                                {esProfesional ? "Próximo paciente" : "Tu próxima sesión"}
                            </h5>

                            {/* 🔸 Detalles del paciente y botón */}
                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start">
                                <p className="mb-0 fw-semibold text-white" style={{ fontSize: "16px" }}>{patientName}</p>
                                <p className="text-white mb-0" style={{ fontSize: "14px" }}>
                                    {fechaFormateada} - {appointmentTime}
                                </p>
                                <Link
                                    to={`/dashboard/calendario?fecha=${fecha_turno || ""}`}
                                    className="btn-ingresar"
                                >
                                    Ingresar a la sesión
                                </Link>

                            </div>
                        </Card>

                        {/* 🧠 Imagen decorativa (cerebro) al lado derecho */}
                        <img
                            src={imagen}
                            alt="Imagen decorativa"
                            className="imagen-decorativa"
                        />


                    </div>

                    {/* 🔹 Tarjeta adicional: Pacientes nuevos (solo en escritorio) */}
                    {esProfesional ? (
                        <Card className="p-2 rounded-4 border-0 card-nueva d-none d-md-block position-relative">
                            <div className="text-center w-100 mt-3">
                                <h6 className="fw-bold mb-1">Pacientes Nuevos</h6>
                            </div>

                            {/* Número + icono en una sola línea */}
                            <div className="d-flex align-items-center justify-content-start ps-3">
                                <h2 className="mb-0">{newPatients}</h2>

                                {/* Badge flotante fuera del card */}
                                <div className="icono-stonks-floating">
                                    <img src="/stonks.png" alt="Stonks" className="img-fluid" />
                                </div>
                            </div>
                        </Card>
                    ) : (
                        // 🔹 Espacio reservado si NO es profesional
                        <div style={{ minHeight: "" }}></div>
                    )}
                </Card>

                {/* ✅ Mover el botón fuera del Card */}
                {!esProfesional && (
                    <div className="btn-agendar-turno mt-3" onClick={handleShowModal}>
                        Agendar un nuevo turno
                    </div>
                )}
            </div>

            {/* Modal con CalendarAvailability */}
            <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Agendar Turno</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CalendarAvailability id_profesional={terapeuta ?? 0} showModal={showModal} />
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default DashboardCard;
