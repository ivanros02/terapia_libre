import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Modal } from "react-bootstrap";
import axios from "axios";
import imagen from "/quienes_somos.png"; // Asegúrate de importar la imagen correctamente
import "../../styles/DashboardCard.css";
import { useEffect, useState } from "react";
import CalendarAvailability from "../CalendarAvailability";
const url = import.meta.env.VITE_API_BASE_URL;

interface DashboardCardProps {
    name: string;
    patientName: string;
    appointmentTime: string;
    newPatients: number;
}

interface TurnoHoy {
    fecha_turno: Date;
    id_profesional: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ name, patientName, appointmentTime, newPatients }) => {
    const esProfesional = localStorage.getItem("esProfesional") === "true";
    const [showModal, setShowModal] = useState(false);
    const [turnoHoy, setTurnoHoy] = useState<TurnoHoy | null>(null);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [, setLoading] = useState(true);

    const [, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    throw new Error("No se encontró el ID del usuario.");
                }

                // 🔹 Obtener todos los turnos del usuario
                const { data: turnos } = await axios.get<TurnoHoy[]>(`${url}/api/turnos/usuario/${id}`);

                if (turnos.length > 0) {
                    // 🔹 Encontrar el turno con la fecha más alta
                    const turnoMasReciente = turnos.reduce((max, turno) =>
                        new Date(turno.fecha_turno) > new Date(max.fecha_turno) ? turno : max,
                        turnos[0] // 🔹 Usar el primer turno como valor inicial
                    );

                    console.log("✅ Turno con fecha más alta:", turnoMasReciente);

                    setTurnoHoy(turnoMasReciente);
                } else {
                    setTurnoHoy(null);
                }

            } catch (error: any) {
                console.error("❌ Error al cargar turnos:", error);
                setError(error.response?.data?.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);




    console.log("📌 ID Profesional enviado:", turnoHoy?.id_profesional ?? 0);


    return (
        <Container fluid>
            {/* 🔹 Se oculta en móvil */}
            <h1 className="d-none d-md-block titulo-card" >
                Buen día, <span style={{ color: "var(--naranja)" }}>{name}!</span>
            </h1>

            {/* Tarjeta principal */}
            <div className="position-relative w-100">
                <Card className={`p-3 shadow-lg rounded-4 border-0 card-responsive 
                ${!esProfesional ? "w-100 text-center extra-padding-margin" : ""}`}>
                    {/* Tarjeta interna: Próximo paciente */}
                    <Card className="p-3 mb-3 rounded-4 border-0 bg-transparent card-interna">
                        <h5 className="fw-bold text-white">
                            {esProfesional ? "Próximo paciente" : "Tu próxima sesión"}
                        </h5>
                        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center">
                            <p className="mb-0 fw-semibold text-white">{patientName}</p>
                            <p className="text-white mb-0" style={{ fontSize: "0.9rem" }}>
                                Hoy - {appointmentTime}
                            </p>
                        </div>
                    </Card>

                    {/* Tarjeta pequeña: Pacientes nuevos */}
                    {esProfesional && (
                        <Card className="p-2 rounded-4 border-0  card-nueva d-none d-md-block">
                            <h6 className="fw-bold mb-1">Pacientes Nuevos</h6>
                            <div className="d-flex align-items-center">
                                <h2 className=" me-3">{newPatients}</h2>
                            </div>
                        </Card>
                    )}

                    {/* Nueva Card para No Profesionales */}
                    {!esProfesional && (
                        <Card
                            className="p-3 rounded-4 border-0 text-white text-center card-interna"
                            style={{ backgroundColor: "var(--naranja)", cursor: "pointer" }}
                            onClick={handleShowModal}
                        >
                            <h5 className="fw-bold"> Agendar nuevo turno</h5>

                        </Card>
                    )}

                    {/* Imagen decorativa RESPONSIVA */}
                    <img
                        src={imagen}
                        alt="Imagen decorativa"
                        className="imagen-decorativa"
                    />
                </Card>

                {/* Modal con CalendarAvailability */}
                <Modal show={showModal} onHide={handleCloseModal} size="lg">
                    <Modal.Header closeButton>
                        <Modal.Title>Agendar Turno</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <CalendarAvailability id_profesional={turnoHoy?.id_profesional ?? 0} showModal={showModal} />
                    </Modal.Body>
                </Modal>


            </div>
        </Container>
    );
};

export default DashboardCard;
