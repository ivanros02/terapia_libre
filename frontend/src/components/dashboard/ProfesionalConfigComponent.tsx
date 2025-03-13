import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DisponibilidadList from "./DisponibilidadList";
import DisponibilidadForm from "./DisponibilidadForm";
import ProfesionalData from "./ProfesionalData";
import ProfesionalForm from "./ProfesionalForm";

const url = import.meta.env.VITE_API_BASE_URL;

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
}

interface Disponibilidad {
    id_disponibilidad: number;
    id_profesional: number;
    dia_semana: string;
    hora_inicio: string;
    hora_fin: string;
    creado_en: string;
}

function ProfesionalConfigComponent() {
    const [editingDisponibilidad, setEditingDisponibilidad] = useState<Disponibilidad | null>(null);
    const [editingProfesional, setEditingProfesional] = useState<Profesional | null>(null);
    const [showModalDisponibilidad, setShowModalDisponibilidad] = useState(false);
    const [showModalProfesional, setShowModalProfesional] = useState(false);
    const [profesional, setProfesional] = useState<Profesional | null>(null);

    const fetchProfesionalData = useCallback(async () => {
        const idProfesional = localStorage.getItem("id");
        if (!idProfesional) return;

        try {
            const response = await axios.get<Profesional>(`${url}/api/profesionales/${idProfesional}`);
            setProfesional(response.data);
        } catch (error) {
            console.error("Error al obtener datos del profesional", error);
        }
    }, []);

    useEffect(() => {
        fetchProfesionalData();
    }, [fetchProfesionalData]);

    const fetchDisponibilidades = () => {
        console.log("Actualizando lista de disponibilidades...");
    };

    const handleEditDisponibilidad = (disponibilidad: Disponibilidad) => {
        setEditingDisponibilidad(disponibilidad);
        setShowModalDisponibilidad(true);
    };

    const handleEditProfesional = (profesional: Profesional) => {
        setEditingProfesional(profesional);
        setShowModalProfesional(true);
    };

    const handleCloseDisponibilidad = () => setShowModalDisponibilidad(false);
    const handleCloseProfesional = () => setShowModalProfesional(false);

    return (
        <div className="container mt-5">
            <h1 className="mb-4">Gestión de Disponibilidades</h1>
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

            <h1 className="mb-4 mt-5">Gestión de Datos del Profesional</h1>
            <ProfesionalData
                profesional={profesional} // 🔹 Pasa los datos directamente
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

export default ProfesionalConfigComponent;
