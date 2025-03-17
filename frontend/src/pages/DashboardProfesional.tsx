import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import PatientHistory from "../components/dashboard/PatientHistory";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import "../styles/DashboardProfesional.css"
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface ProfesionalData {
  nombre: string;
}

interface TurnoHoy {
  nombre_paciente: string;
  hora_turno: string;
}

interface Turno {
  fecha: string;
  paciente: string;
}



// Datos de ejemplo para PatientHistory
const samplePatients = [
  { name: "Agustina Perez", frequency: "Mensual" },
  { name: "Sofia Perez", frequency: "Semanal" },
  { name: "Ana Diaz", frequency: "Quincenal" },
  { name: "Ana Diaz", frequency: "Quincenal" }
];

const sampleSelectedPatient = {
  name: "Agustina Perez",
  gender: "Mujer",
  age: "28 Años 3 Meses",
  lastVisit: "2 de Septiembre",
  observations: "Crisis de ansiedad",
  details: "Pidió una consulta con urgencia, estaba atravesando una crisis laboral que resultó en sintomatología clínica de ataques de pánico."
};

const DashboardProfesional = () => {
  const [profesionalData, setProfesionalData] = useState<ProfesionalData | null>(null);
  const [turnoHoy, setTurnoHoy] = useState<TurnoHoy | null>(null);
  const [proximosTurnos, setProximosTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const id = localStorage.getItem("id");
        const token = localStorage.getItem("token");

        if (!id || !token) {
          throw new Error("No se encontró el ID o el token de autenticación.");
        }

        // 🔹 Obtener datos del profesional
        const profesionalResponse = await axios.get(`${url}/api/profesionales/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setProfesionalData(profesionalResponse.data);

        // 🔹 Obtener turno del día
        const turnoResponse = await axios.get(`${url}/api/profesionales/${id}/turno-hoy`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (turnoResponse.data) {
          setTurnoHoy({
            nombre_paciente: turnoResponse.data.nombre_paciente,
            hora_turno: turnoResponse.data.hora_turno,
          });
        } else {
          setTurnoHoy(null); // No hay turno hoy
        }

        // 🔹 Obtener próximos turnos
        const proximosTurnosResponse = await axios.get(`${url}/api/profesionales/${id}/proximos-turnos`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const turnosFormateados: Turno[] = proximosTurnosResponse.data.map((turno: any) => ({
          fecha: turno.fecha_turno,
          paciente: turno.nombre_paciente,
        }));

        setProximosTurnos(turnosFormateados);

      } catch (error: any) {
        console.error("Error en el dashboard:", error);
        setError(error.response?.data?.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Cargando...</div>;
  

  const eventos = proximosTurnos.map(t => t.fecha); // Extraer solo la fecha
  return (
    <div className="parent">
      <div className="div1">
        <SearchNavbar
          profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
        />
      </div>
      <div className="div2">
        <Sidebar />
      </div>
      <div className="div3">
        <DashboardCard
          name={profesionalData?.nombre || "Profesional"}
          patientName={turnoHoy?.nombre_paciente || "Sin paciente hoy"}
          appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
          sessionLink="https://tusitio.com/sesion"
          newPatients={3}
          progress={51}
        />
      </div>
      <div className="div4">
        <PatientHistory patients={samplePatients} selectedPatient={sampleSelectedPatient} />
      </div>
      <div className="div5">
        <CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} />
      </div>
    </div>
  );
};

export default DashboardProfesional;