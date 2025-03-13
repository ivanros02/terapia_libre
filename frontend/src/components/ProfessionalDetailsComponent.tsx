import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom"; // ⬅️ Para la redirección
import CalendarAvailability from "./CalendarAvailability";

interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: string[];
    disponibilidad: string;
    valor: number;
    descripcion: string;
}

interface ProfessionalDetailsComponentProps {
    professional: Professional;
}

const ProfessionalDetailsComponent: React.FC<ProfessionalDetailsComponentProps> = ({ professional }) => {
    const [showModal, setShowModal] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const navigate = useNavigate();

    useEffect(() => {
        // Verificar si hay un token en localStorage para saber si el usuario está autenticado
        const token = localStorage.getItem("token");
        setIsAuthenticated(!!token); // Si hay token, está autenticado
    }, []);

    const handleOpenModal = () => {
        const token = localStorage.getItem("token");

        if (!token) {
            // Guardamos la URL actual antes de redirigir al login
            localStorage.setItem("prevPath", location.pathname);
            navigate("/login");
            return;
        }

        setShowModal(true);
    };

    return (
        <div className="container mt-5">
            <div className="row justify-content-center align-items-stretch">
                {/* Imagen */}
                <div className="col-12 col-md-4 d-flex justify-content-center">
                    <div className="card shadow-lg rounded-4 p-0 h-100" style={{ width: "300px", height: "300px", overflow: "hidden" }}>
                        <img
                            src={professional.foto_perfil_url}
                            alt={professional.nombre}
                            className="w-100 h-100"
                            style={{ objectFit: "cover", maxWidth: "100%", maxHeight: "100%" }}
                        />
                    </div>
                </div>

                {/* Datos */}
                <div className="col-12 col-md-7 mt-4 mt-md-0 d-flex">
                    <div className="card shadow-lg rounded-4 p-4 text-white w-100 h-100" style={{ backgroundColor: "var(--verde)", minHeight: "300px" }}>
                        <p className="small text-light">{`Disponibilidad en ${professional.disponibilidad}`}</p>
                        <h2 className="fw-bold">
                            {professional.nombre} <span className="fw-normal text-light"> ${professional.valor}.-</span>
                        </h2>
                        <p className="fw-semibold">{professional.especialidades.join(" • ")}</p>
                        <p className="text-light">{professional.descripcion}</p>

                        {/* Botón para abrir el modal, con validación de autenticación */}
                        <button className="btn btn-light fw-bold mt-3" onClick={handleOpenModal}>
                            Agendar turno
                        </button>
                    </div>
                </div>
            </div>

            {/* Modal con el Calendario */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Selecciona un turno</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <CalendarAvailability id_profesional={professional.id_profesional} showModal={showModal} />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cerrar
                    </Button>
                    <Button variant="primary" disabled>
                        Confirmar Turno
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default ProfessionalDetailsComponent;