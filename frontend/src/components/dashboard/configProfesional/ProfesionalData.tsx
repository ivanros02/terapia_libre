import { Button } from "react-bootstrap";
import "../../../styles/DisponibilidadList.css"
import { Profesional } from "../../../types/Profesional";

interface ProfesionalDataProps {
    profesional: Profesional | null;
    onEdit: (profesional: Profesional) => void;
    fetchProfesionalData: () => void;
}

function ProfesionalData({ profesional, onEdit }: ProfesionalDataProps) {
    return (
        <div className="container mt-4" style={{ marginBottom: "80px" }}>
            <h2 className="titulo-config">Datos del profesional</h2>

            {profesional ? (
                <div className="card p-4 shadow-sm rounded bg-light">
                    <div className="d-flex flex-column">
                        <p className="parrafo-profesional"><strong>Nombre:</strong> {profesional.nombre}</p>
                        <p className="parrafo-profesional"><strong>Título Universitario:</strong> {profesional.titulo_universitario}</p>
                        <p className="parrafo-profesional"><strong>Matrícula Nacional:</strong> {profesional.matricula_nacional}</p>
                        <p className="parrafo-profesional"><strong>Descripción:</strong> {profesional.descripcion || "N/A"}</p>
                        <p className="parrafo-profesional"><strong>Teléfono:</strong> {profesional.telefono}</p>
                        <p className="parrafo-profesional"><strong>Correo Electrónico:</strong> {profesional.correo_electronico}</p>
                        <p className="parrafo-profesional"><strong>CBU/CVU:</strong> {profesional.cbu || "No registrado"}</p>
                        <p className="parrafo-profesional"><strong>CUIT:</strong> {profesional.cuit || "No registrado"}</p>
                    </div>

                    {/* Botón alineado a la derecha */}
                    <div className="d-flex justify-content-end mt-1 ">
                        <Button className="btn-agregar" onClick={() => onEdit(profesional)}>
                            Editar
                        </Button>
                    </div>
                </div>
            ) : (
                <p className="text-muted">Cargando datos...</p>
            )}
        </div>

    );
}

export default ProfesionalData;
