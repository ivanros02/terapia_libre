import { useState } from "react";
import AusenciaList from "./AusenciaList";
import AusenciaForm from "./AusenciaForm";

interface Ausencia {
    id_ausencia: number;
    id_profesional: number;
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
    motivo?: string;
    creado_en?: string;
}

function AusenciaSection() {
    const [editingAusencia, setEditingAusencia] = useState<Ausencia | null>(null);
    const [showModalAusencia, setShowModalAusencia] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // Nuevo estado para forzar actualización

    const fetchAusencias = () => {
        // Incrementar el key para forzar re-render de AusenciaList
        setRefreshKey(prev => prev + 1);
    };

    const handleEditAusencia = (ausencia: Ausencia) => {
        setEditingAusencia(ausencia);
        setShowModalAusencia(true);
    };

    const handleCloseAusencia = () => {
        setShowModalAusencia(false);
        setEditingAusencia(null);
    };

    const handleAddAusencia = () => {
        setEditingAusencia(null);
        setShowModalAusencia(true);
    };

    return (
        <div>
            <AusenciaForm
                show={showModalAusencia}
                handleClose={handleCloseAusencia}
                ausencia={editingAusencia ?? undefined}
                onSave={handleCloseAusencia}
                fetchAusencias={fetchAusencias}
            />
            <AusenciaList
                key={refreshKey} // Agregar key para forzar re-render
                onEdit={handleEditAusencia}
                onAdd={handleAddAusencia}
                fetchAusencias={fetchAusencias}
            />
        </div>
    );
}

export default AusenciaSection;