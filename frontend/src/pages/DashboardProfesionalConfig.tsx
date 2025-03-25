import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
const url = import.meta.env.VITE_API_BASE_URL;
import ProfesionalConfigComponent from "../components/dashboard/ProfesionalConfigComponent";
import "../styles/DashboardProfesional.css"

// Tipos de datos
interface UserData {
  nombre: string;
  correo_electronico: string;
}

const Dashboard = () => {
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
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="parent">
      {!isMobile && <div className="div1"><Sidebar /></div>}
      <div className="div2">
        <SearchNavbar
          profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
          profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")}
        />
      </div>
      <div className="div6"><ProfesionalConfigComponent /></div>
    </div>
  );
};

export default Dashboard;
