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
  meet_url: string;
}

interface Turno {
  fecha: string;
  paciente: string;
}

interface ListaPacientes {
  name: string; // ✅ Debe llamarse `name` en lugar de `paciente`
  frequency: string; // ✅ Debe llamarse `frequency` en lugar de `frecuencia`
}



const DashboardProfesional = () => {
  const [profesionalData, setProfesionalData] = useState<ProfesionalData | null>(null);
  const [turnoHoy, setTurnoHoy] = useState<TurnoHoy | null>(null);
  const [proximosTurnos, setProximosTurnos] = useState<Turno[]>([]);
  const [listaPacientes, setListaPacientes] = useState<ListaPacientes[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [eventos, setEventos] = useState<string[]>([]);


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

        // 🔹 Obtener el próximo turno más cercano
        const turnoResponse = await axios.get(`${url}/api/turnos/${id}/turno-hoy`);
        const turnoMasCercano = turnoResponse.data || null; // ✅ Manejar el caso `null`

        setTurnoHoy(turnoMasCercano);

        // 🔹 Obtener turnos del profesional
        const turnosResponse = await axios.get(`${url}/api/turnos/profesionalDashboard/${id}`);
        const turnos = Array.isArray(turnosResponse.data) ? turnosResponse.data : [];



        // 🔹 Extraer próximos turnos (máximo 5)
        const proximosTurnos = turnos.map((turno: any) => ({
          fecha: turno.fecha_turno,
          paciente: turno.nombre_paciente,
        }));

        // 🔹 Extraer próximos turnos (máximo 5)
        const listaPacientes = turnos.slice(0, 5).map((turno: any) => ({
          name: turno.nombre_paciente,  // 🔹 Nombre del paciente
          frequency: "Semanal",         // 🔹 Se establece "Semanal" fijo
        }));




        setProximosTurnos(proximosTurnos);
        setListaPacientes(listaPacientes);
        setEventos([...new Set(turnos.map((turno: any) => turno.fecha_turno))]); // ✅ Fechas únicas



      } catch (error: any) {
        setError(error.response?.data?.message || "Error al cargar los datos");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <div>Cargando...</div>;

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
          newPatients={3}
        />
      </div>
      <div className="div4">
        <PatientHistory patients={listaPacientes} selectedPatient={null} />
      </div>
      <div className="div5 calendarioAncho">
        <CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} />
      </div>
    </div>
  );
};

export default DashboardProfesional;