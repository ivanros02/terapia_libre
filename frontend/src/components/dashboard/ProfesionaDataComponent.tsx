import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import ProfesionalSection from "./configProfesional/ProfesionalSection";
import SuscripcionInfo from "./SuscripcionInfo";
import { Profesional } from "../../types/Profesional";

const url = import.meta.env.VITE_API_BASE_URL;


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