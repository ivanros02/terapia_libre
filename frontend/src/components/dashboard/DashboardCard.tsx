import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container } from "react-bootstrap";
import imagen from '/quienes_somos.png'; // Asegúrate de importar la imagen correctamente

interface DashboardCardProps {
    name: string;
    patientName: string;
    appointmentTime: string;
    sessionLink: string;
    newPatients: number;
    progress: number;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ name, patientName, appointmentTime, sessionLink, newPatients, progress }) => {
    return (
        <Container>
            <h1 className="fw-bold">
                Buen día, <span className="text-warning">{name}!</span>
            </h1>

            {/* Tarjeta principal */}
            <div style={{ position: "relative", maxWidth: "100%" }}>
                <Card className="p-3 shadow-lg rounded-4 border-0" style={{ background: "linear-gradient(to bottom right, #92e6a7, #6ec1c6)", maxWidth: "80%" }}>
                    {/* Tarjeta interna: Próximo paciente */}
                    <Card className="p-3 mb-3 rounded-4 border-0" style={{ background: "rgba(255, 255, 255, 0.2)", backdropFilter: "blur(10px)", maxWidth: "50%" }}>
                        <h5 className="fw-bold text-white">Próximo paciente</h5>
                        <div className="d-flex justify-content-start align-items-center">
                            <p className="mb-0 fw-semibold text-white" style={{ marginRight: "3.5rem" }}>{patientName}</p>
                            <p className="text-white mb-0" style={{ fontSize: "0.9rem" }}>Hoy - {appointmentTime}</p>
                        </div>
                        <a href={sessionLink} className="text-white fw-semibold text-decoration-none">
                            Ingresar a la sesión
                        </a>
                    </Card>

                    {/* Tarjeta pequeña: Pacientes nuevos */}
                    <Card className="p-2 rounded-4 border-0 w-50" style={{ background: "rgba(214, 212, 212, 0.58)", backdropFilter: "blur(10px)", maxWidth: "20%" }}>
                        <h6 className="fw-bold mb-1">Pacientes Nuevos</h6>
                        <div className="d-flex align-items-center">
                            <h2 className="fw-bold me-3">{newPatients}</h2>
                            <span className="badge bg-light text-dark p-2 fw-bold">
                                {progress}% <span className="text-success">↗</span>
                            </span>
                        </div>
                    </Card>
                </Card>

                {/* Imagen que sobresale */}
                <img
                    src={imagen}
                    alt="Imagen decorativa"
                    style={{
                        position: "absolute",
                        right: "250px", // Ajusta este valor para que la imagen sobresalga
                        top: "-40px", // Ajusta este valor para que la imagen sobresalga por encima
                        width: "300px", // Ajusta el tamaño de la imagen
                        height: "auto",
                        zIndex: 1,
                    }}
                />
            </div>
        </Container>
    );
};

export default DashboardCard;