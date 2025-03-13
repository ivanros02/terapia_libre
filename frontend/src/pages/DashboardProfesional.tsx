import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import PatientHistory from "../components/dashboard/PatientHistory";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface ProfesionalData {
  nombre: string;
  correo_electronico: string;
  especialidades: string[];
  // Agrega más campos si es necesario
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

// Datos de ejemplo para CalendarioTurnos
const eventosEjemplo: string[] = ["2025-03-05", "2025-03-10", "2025-03-15"];
const turnosEjemplo = [
  { fecha: "2025-03-08", paciente: "Agustina Perez" },
  { fecha: "2025-03-12", paciente: "Sofia Perez" },
  { fecha: "2025-03-20", paciente: "Ana Diaz" },
  { fecha: "2025-03-20", paciente: "Ana Diaz" }
];

const DashboardProfesional = () => {
  const [profesionalData, setProfesionalData] = useState<ProfesionalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfesionalData = async () => {
      try {
        const id = localStorage.getItem("id"); // Obtener el ID del localStorage
        const token = localStorage.getItem("token"); // Obtener el token

        if (!id || !token) {
          throw new Error("No se encontró el ID o el token de autenticación.");
        }

        // Hacer la solicitud a la API
        const response = await axios.get(`${url}/api/profesionales/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el header
          },
        });
        setProfesionalData(response.data); // Guardar los datos del profesional
      } catch (error: any) {
        setError(error.message || "Error al obtener los datos del profesional.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfesionalData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga
  }

  if (error) {
    return <div>Error: {error}</div>; // Mostrar un mensaje de error
  }

  return (
    <div className="parent">
      <div className="div1">
        <SearchNavbar
          profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
          profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
        />
      </div>
      <div className="div2">
        <Sidebar />
      </div>
      <div className="div3">
        <DashboardCard
          name={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
          patientName="Agustina Perez"
          appointmentTime="04:00 PM"
          sessionLink="https://tusitio.com/sesion"
          newPatients={3}
          progress={51}
        />
      </div>
      <div className="div4">
        <PatientHistory patients={samplePatients} selectedPatient={sampleSelectedPatient} />
      </div>
      <div className="div5">
        <CalendarioTurnos eventos={eventosEjemplo} proximosTurnos={turnosEjemplo} />
      </div>
    </div>
  );
};

export default DashboardProfesional;