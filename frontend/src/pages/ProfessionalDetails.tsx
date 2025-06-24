import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import ProfessionalDetailsComponent from "../components/detallesProfesional/ProfessionalDetailsComponent"; // Importar el nuevo componente
import Footer from "../layouts/Footer";
import Head from "../layouts/Header";
import LegalPopup from "../layouts/LegalPopup";
import VolverLink from "../components/VolverLink";

const url = import.meta.env.VITE_API_BASE_URL;

interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
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
        { name: "¿Necesito terapia? ", href: "/" },
    ];

    return (
        <div className="d-flex flex-column min-vh-100" style={{/* 🔽 Fondo con imagen */
            backgroundImage: "url('/papel.png')", /* Cambiá esto por la ruta real */
            backgroundSize: "cover", /* Ajusta para cubrir todo el área */
            backgroundPosition: "center", /* Centra la imagen */
            backgroundRepeat: "no-repeat",/* Evita que se repita */
        }}>
            <Head links={menuLinks} />
            {/* Este contenedor solo para el enlace */}
                <div style={{ alignSelf: "flex-start", marginLeft: "2.9rem", marginBottom: "0",paddingBottom:"0",paddingTop: "8rem" }}>
                    <VolverLink href="/professionals" />
                </div>
            <h1 className="h1-custom-profs text-center" style={{ paddingTop: "2rem" }}>PROFESIONALES</h1>
            {/* Contenedor principal para centrar la card */}
            <main className="flex-grow-1 d-flex justify-content-center align-items-center p-1" style={{ marginBottom: "100px" }}>

                <div className="container">
                    <ProfessionalDetailsComponent professional={professional} />
                </div>
            </main>

            <Footer />
            <LegalPopup />
        </div>
    );
};

export default ProfessionalDetails;
