import { useState } from "react";
import ProfesionalData from "./ProfesionalData";
import ProfesionalForm from "./ProfesionalForm";

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
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
}

interface ProfesionalSectionProps {
    profesional: Profesional | null;
    fetchProfesionalData: () => void;
}

function ProfesionalSection({ profesional, fetchProfesionalData }: ProfesionalSectionProps) {
    const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);
    const [showModalProfesional, setShowModalProfesional] = useState(false);

    const handleEditProfesional = (profesional: Profesional) => {
        setEditingProfesional(profesional);
        setShowModalProfesional(true);
    };

    const handleCloseProfesional = () => setShowModalProfesional(false);

    return (
        <div>
            <ProfesionalData
                profesional={profesional}
                onEdit={handleEditProfesional}
                fetchProfesionalData={fetchProfesionalData}
            />
            {editingProfesional && (
                <ProfesionalForm
                    show={showModalProfesional}
                    handleClose={handleCloseProfesional}
                    profesional={editingProfesional}
                    onSave={() => {
                        fetchProfesionalData();
                        handleCloseProfesional();
                    }}
                    fetchProfesionalData={fetchProfesionalData}
                />
            )}
        </div>
    );
}

export default ProfesionalSection;