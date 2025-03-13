import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
const url = import.meta.env.VITE_API_BASE_URL;
import ProfesionalConfigComponent from "../components/dashboard/ProfesionalConfigComponent";

// Tipos de datos
interface UserData {
  nombre: string;
  correo_electronico: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
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

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="parent">
      <div className="div1">
        <SearchNavbar
          profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
          profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")}
        />
      </div>
      <div className="div2">
        <Sidebar />
      </div>
      <ProfesionalConfigComponent/>
    </div>
  );
};

export default Dashboard;
