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
  meet_url?: string; // 🔹 URL opcional de Google Meet
  nombre_paciente: string;
  email_paciente: string;  // 🔹 Nuevo campo para el correo del paciente
  nombre_profesional: string; // 🔹 Nuevo campo para el nombre del profesional
  email_profesional: string; // 🔹 Nuevo campo para el correo del profesional
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
          ? `${url}/api/turnos/profesional/${id}`
          : `${url}/api/turnos/usuario/${id}`;

        const response = await axios.get<Turno[]>(turnosUrl, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Ahora TypeScript reconoce que turno es de tipo Turno
        const turnosConCorreos: Turno[] = response.data.map((turno: Turno) => ({
          ...turno,
          email_paciente: turno.email_paciente || "", // 🔹 Asegurar que el correo del paciente esté presente
          email_profesional: turno.email_profesional || "", // 🔹 Asegurar que el correo del profesional esté presente
          nombre_paciente: turno.nombre_paciente || "Paciente Desconocido",
          nombre_profesional: turno.nombre_profesional || "Profesional Desconocido",
        }));
        setTurnos(turnosConCorreos);
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
    <div>
      <SearchNavbar
        profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
        profileName={userData?.nombre || (esProfesional ? "Profesional" : "Usuario")} />
      <Sidebar />
      <GoogleCalendar turnos={turnos} usuarioRol={esProfesional ? "profesional" : "usuario"} />
    </div>

  );
};

export default DashboardCalendar;
