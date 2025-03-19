import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import GoogleCalendar from "../components/GoogleCalendar";
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface Turno {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado: string;
}

interface UserData {
  nombre: string;
  correo_electronico: string;
}

const DashboardCalendar = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  const esProfesional = localStorage.getItem("esProfesional") === "true";
  const id = localStorage.getItem("id");
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        if (!id || !token) {
          throw new Error("No se encontró el ID o el token de autenticación.");
        }

        const apiUrl = esProfesional
          ? `${url}/api/profesionales/${id}`
          : `${url}/api/auth/usuario/${id}`;

        const response = await axios.get(apiUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUserData(response.data);
      } catch (error: any) {
        setError(error.message || "Error al obtener los datos.");
      }
    };

    const fetchTurnos = async () => {
      try {
        if (!id || !token) return;

        const turnosUrl = esProfesional
          ? `${url}/api/turnos/profesional/${id}`  // 🔹 Endpoint para profesionales
          : `${url}/api/turnos/usuario/${id}`;   // 🔹 Endpoint para usuarios

        const response = await axios.get(turnosUrl, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("📩 Turnos recibidos del backend:", response.data);
        setTurnos(response.data);
      } catch (error: any) {
        setError(error.message || "Error al obtener los turnos.");
      } finally {
        setLoading(false);
      }
    };


    fetchUserData();
    fetchTurnos();
  }, [id, token]);



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
      <GoogleCalendar turnos={turnos} usuarioRol={esProfesional ? "profesional" : "usuario"} />
    </div>
  );
};

export default DashboardCalendar;
