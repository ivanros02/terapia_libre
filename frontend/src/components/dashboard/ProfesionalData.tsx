import { Button } from "react-bootstrap";

interface Profesional {
    id_profesional: number;
    nombre: string;
    titulo_universitario: string;
    matricula_nacional: string;
    matricula_provincial?: string | null;
    descripcion?: string | null;
    telefono?: string | null;
    disponibilidad: "24 horas" | "48 horas" | "72 horas" | "96 horas";
    correo_electronico: string;
    foto_perfil_url?: string | null;
    valor: number;
    valor_internacional: number;
    creado_en: string;
    especialidades: number[];
}

interface ProfesionalDataProps {
    profesional: Profesional | null;
    onEdit: (profesional: Profesional) => void;
    fetchProfesionalData: () => void;
}

function ProfesionalData({ profesional, onEdit }: ProfesionalDataProps) {
    return (
        <div className="container mt-4">
            <h2>Datos del Profesional</h2>
            {profesional ? (
                <div className="card p-3">
                    <p><strong>Nombre:</strong> {profesional.nombre}</p>
                    <p><strong>Título Universitario:</strong> {profesional.titulo_universitario}</p>
                    <p><strong>Matrícula Nacional:</strong> {profesional.matricula_nacional}</p>
                    <p><strong>Descripción:</strong> {profesional.descripcion || "N/A"}</p>
                    <p><strong>Teléfono:</strong> {profesional.telefono}</p>
                    <p><strong>Correo Electrónico:</strong> {profesional.correo_electronico}</p>
                    <p><strong>Disponibilidad:</strong> {profesional.disponibilidad}</p>
                    <Button variant="primary" onClick={() => onEdit(profesional)}>Editar</Button>
                </div>
            ) : (
                <p>Cargando datos...</p>
            )}
        </div>
    );
}

export default ProfesionalData;
