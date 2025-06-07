import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
const url = import.meta.env.VITE_API_BASE_URL;
import ProfesionaDataComponent from "../components/dashboard/ProfesionaDataComponent";
import { getGoogleDriveImageUrl } from "../utils/googleDrive";

import "../styles/DashboardProfesional.css"
import LoadingSpinner from "../components/LoadingSpinner";

// Tipos de datos
interface UserData {
    nombre: string;
    correo_electronico: string;
    foto_perfil_url?: string;
}

const DashboardProfesionalData = () => {
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

    // Detectar si es profesional o usuario
    const esProfesional = localStorage.getItem("esProfesional") === "true";

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const id = localStorage.getItem("id");
                const token = localStorage.getItem("token");

                if (!id || !token) {
                    throw new Error("No se encontró el ID o el token de autenticación.");
                }

                // Determinar la API correcta según el tipo de usuario
                const apiUrl = esProfesional
                    ? `${url}/api/profesionales/${id}`  // Si es profesional, obtiene su info
                    : `${url}/api/auth/usuario/${id}`; // Si es usuario, obtiene su info

                const response = await axios.get(apiUrl, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                setUserData(response.data);
            } catch (error: any) {
                setError(error.message || "Error al obtener los datos.");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [esProfesional]);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }


    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="parent">
            {!isMobile && <div className="div-side-bar"><Sidebar /></div>}
            <div className="div-search-navbar">
                <SearchNavbar
                    profileImage={getGoogleDriveImageUrl(userData?.foto_perfil_url || "")}
                    profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")}
                />
            </div>
            <div className="div-centrado-solo"><ProfesionaDataComponent /></div>
        </div>
    );
};

export default DashboardProfesionalData;
