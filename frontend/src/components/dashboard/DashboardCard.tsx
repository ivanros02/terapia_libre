import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container } from "react-bootstrap";
import imagen from "/quienes_somos.png"; // Asegúrate de importar la imagen correctamente
import "../../styles/DashboardCard.css";

interface DashboardCardProps {
    name: string;
    patientName: string;
    appointmentTime: string;
    newPatients: number;
}


const DashboardCard: React.FC<DashboardCardProps> = ({ name, patientName, appointmentTime, newPatients }) => {
    const esProfesional = localStorage.getItem("esProfesional") === "true";
   
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
                    

                    {/* Imagen decorativa RESPONSIVA */}
                    <img
                        src={imagen}
                        alt="Imagen decorativa"
                        className="imagen-decorativa"
                    />
                </Card>


            </div>
        </Container>
    );
};

export default DashboardCard;
