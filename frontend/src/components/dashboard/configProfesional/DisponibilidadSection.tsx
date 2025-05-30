import { useState } from "react";
import DisponibilidadList from "./DisponibilidadList";
import DisponibilidadForm from "./DisponibilidadForm";

interface Disponibilidad {
    id_disponibilidad: number;
    id_profesional: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    creado_en: string;
}

function DisponibilidadSection() {
    const [editingDisponibilidad, setEditingDisponibilidad] = useState<Disponibilidad | null>(null);
    const [showModalDisponibilidad, setShowModalDisponibilidad] = useState(false);

    const fetchDisponibilidades = () => {
        console.log("Actualizando lista de disponibilidades...");
    };

    const handleEditDisponibilidad = (disponibilidad: Disponibilidad) => {
        setEditingDisponibilidad(disponibilidad);
        setShowModalDisponibilidad(true);
    };

    const handleCloseDisponibilidad = () => setShowModalDisponibilidad(false);

    return (
        <div>
            <DisponibilidadForm
                show={showModalDisponibilidad}
                handleClose={handleCloseDisponibilidad}
                disponibilidad={editingDisponibilidad ?? undefined}
                onSave={handleCloseDisponibilidad}
                fetchDisponibilidades={fetchDisponibilidades}
            />
            <DisponibilidadList
                onEdit={handleEditDisponibilidad}
                onAdd={() => setShowModalDisponibilidad(true)}
                fetchDisponibilidades={fetchDisponibilidades}
            />
        </div>
    );
}

export default DisponibilidadSection;