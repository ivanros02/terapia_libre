import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import Messages from "../components/dashboard/Messages";
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface UserData {
  nombre: string;
  correo_electronico: string;
}

const DashboardMensajes = () => {
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
          ? `${url}/api/profesionales/${id}` // Si es profesional, obtener desde profesionales
          : `${url}/api/auth/usuario/${id}`; // Si es usuario, obtener desde usuarios

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error: any) {
        setError(error.message || "Error al obtener los datos del usuario.");
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
    <div>
      <SearchNavbar
        profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
        profileName={userData?.nombre || "Usuario"}
      />
      <Sidebar />
      <Messages />
    </div>
  );
};

export default DashboardMensajes;
