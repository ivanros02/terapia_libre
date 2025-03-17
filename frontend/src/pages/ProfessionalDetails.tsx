import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfessionalDetailsComponent from "../components/ProfessionalDetailsComponent"; // Importar el nuevo componente
import Footer from "../layouts/Footer";
import Head from "../layouts/Header";

const url = import.meta.env.VITE_API_BASE_URL;

interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: string[];
    disponibilidad: string;
    valor: number;
    descripcion: string;
}

const ProfessionalDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [professional, setProfessional] = useState<Professional | null>(null);

    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const response = await axios.get(`${url}/api/profesionales/${id}`);
                setProfessional(response.data);
            } catch (error) {
                console.error("Error al obtener los detalles del profesional:", error);
            }
        };

        fetchProfessional();
    }, [id]);

    if (!professional) {
        return <p className="text-center mt-5">Cargando...</p>;
    }

    const menuLinks = [
        { name: "¿Necesito terapia?", href: "/necesito-terapia" },
        { name: "Buscar profesional", href: "/professionals" },
    ];

    return (
        <div className="d-flex flex-column min-vh-100">
            <Head links={menuLinks} />

            {/* Contenedor principal para centrar la card */}
            <main className="flex-grow-1 d-flex justify-content-center align-items-center">
                <div className="container">
                    <ProfessionalDetailsComponent professional={professional} />
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default ProfessionalDetails;
