import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import DisponibilidadSection from "./configProfesional/DisponibilidadSection";
import ProfesionalSection from "./configProfesional/ProfesionalSection";
import SuscripcionInfo from "./SuscripcionInfo";
import AusenciaSection from "./configProfesional/AusenciaSection";

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
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
}

function ProfesionalConfigComponent() {
    const [profesional, setProfesional] = useState<Profesional | null>(null);

    const idProfesional = localStorage.getItem("id");
    
    const fetchProfesionalData = useCallback(async () => {
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

    return (
        <div>
            <DisponibilidadSection />
            <AusenciaSection/>
            
            <ProfesionalSection 
                profesional={profesional}
                fetchProfesionalData={fetchProfesionalData}
            />

            {/* Mostrar la información de la suscripción */}
            {profesional?.correo_electronico && (
                <div className="container">
                    <SuscripcionInfo email={profesional.correo_electronico} />
                </div>
            )}
        </div>
    );
}

export default ProfesionalConfigComponent;