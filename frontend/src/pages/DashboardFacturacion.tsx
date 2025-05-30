import { useEffect, useState } from "react";
import DashboardResumen from "../components/dashboard/DashboardResumen"; // o ruta correspondiente
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import LoadingSpinner from "../components/LoadingSpinner";
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface ProfesionalData {
    nombre: string;
}


const DashboardFacturacion = () => {
    const [profesionalData, setProfesionalData] = useState<ProfesionalData | null>(null);
    const [loading, setLoading] = useState(true);
    const [, setError] = useState<string | null>(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);


    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const id = localStorage.getItem("id");
                if (!id) {
                    throw new Error("No se encontró el ID del profesional.");
                }

                // 🔹 Obtener datos del profesional
                const profesionalResponse = await axios.get(`${url}/api/profesionales/${id}`);
                setProfesionalData(profesionalResponse.data);


            } catch (error: any) {
                setError(error.response?.data?.message || "Error al cargar los datos");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (loading) return <LoadingSpinner />;

    return (
        <div className="parent">
            {/* Sidebar solo en pantallas grandes */}
            {!isMobile && <div className="div-side-bar"><Sidebar /></div>}

            <div className="div-search-navbar">
                <SearchNavbar
                    profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
                    profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
                />
            </div>

            <div className="div-centrado-solo" style={{backgroundColor: "#F8F8F8", borderRadius: "25px", marginTop: "-7rem"}}>
                <h1 style={{color:"var(--verde)",fontSize:"32px",fontWeight:"900", paddingLeft:"5rem"}}>FACTURACIÓN Y ESTADÍSTICAS</h1>
                    <DashboardResumen />
            </div>
        </div>
    );
};

export default DashboardFacturacion;