import "bootstrap/dist/css/bootstrap.min.css";
import { Card, Container, Row, Col, ListGroup, Badge } from "react-bootstrap";
import "../../styles/PatientHistory.css";
interface Patient {
    name: string;
    frequency: null | string;
}

interface PatientHistoryProps {
    patients: Patient[];
    selectedPatient: {
        name: string;
        gender: string;
        age: string;
        lastVisit: string;
        observations: string;
        details: string;
    } | null;
}


const PatientHistory: React.FC<PatientHistoryProps> = ({ patients, selectedPatient }) => {
    return (
        <Container fluid className="patient-history-wrapper">
            <Card className="shadow-lg p-3 rounded-4 border-0 patient-history-card">
                <Row>
                    {/* Lista de Pacientes */}
                    <Col md={5} className="border-end">
                        <h5 className="mb-0" style={{fontSize:"24.58px",fontWeight:"500"}}>Lista de pacientes</h5>

                        <ListGroup variant="flush">
                            {patients.map((patient, index) => (
                                <ListGroup.Item key={index} className="d-flex align-items-center border-0">
                                    <div className="circle-container">
                                        <div className="circle-inner">
                                            {patient.name
                                                .split(" ")
                                                .map(word => word.charAt(0).toUpperCase())
                                                .join("")}
                                        </div>
                                    </div>
                                    <div>
                                        <p className="mb-0 nombre-lista" style={{marginLeft:"5px"}}>{patient.name}</p>
                                        <Badge className="transparent-badge">{patient.frequency}</Badge>
                                    </div>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>

                    </Col>

                    {/* Historia Clínica */}
                    <Col md={7} className="p-2" style={{ marginTop: "-1.5vh" }}>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                            <h5 className="fw-bold mb-0" style={{fontSize:"24.58px"}}>Historia clínica</h5>
                            <a href="#" className="text-primary fw-semibold" style={{ fontSize: "0.9rem" }}>Ver todas</a>
                        </div>

                        {selectedPatient ? (
                            <Card className="p-2 shadow-sm rounded-4 border border-light">
                                <div className="d-flex align-items-center mb-1">
                                    <div className="rounded-circle bg-danger text-white d-flex align-items-center justify-content-center me-2"
                                        style={{ width: "40px", height: "40px", fontWeight: "bold", fontSize: "0.9rem" }}>
                                        {selectedPatient.name.substring(0, 2).toUpperCase()}
                                    </div>
                                    <div>
                                        <h6 className="mb-0 fw-bold" style={{ fontSize: "0.9rem" }}>{selectedPatient.name}</h6>
                                        <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{selectedPatient.gender} - {selectedPatient.age}</p>
                                    </div>
                                </div>
                                <hr className="my-2" />
                                <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Última consulta</p>
                                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>{selectedPatient.lastVisit}</p>
                                <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Observaciones</p>
                                <p className="text-muted mb-2" style={{ fontSize: "0.8rem" }}>{selectedPatient.observations}</p>
                                <p className="mb-1 fw-bold" style={{ fontSize: "0.85rem" }}>Detalles</p>
                                <p className="text-muted mb-0" style={{ fontSize: "0.8rem" }}>{selectedPatient.details}</p>
                            </Card>
                        ) : (
                            <p className="text-muted">Seleccione un paciente para ver la historia clínica.</p>
                        )}
                    </Col>

                </Row>
            </Card>
        </Container>
    );
};

export default PatientHistory;
