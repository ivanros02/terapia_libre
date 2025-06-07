import { useState } from "react";
import ProfesionalData from "./ProfesionalData";
import ProfesionalForm from "./ProfesionalForm";
import { Profesional } from "../../../types/Profesional";

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