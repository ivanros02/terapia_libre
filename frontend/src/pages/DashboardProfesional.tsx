import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import PatientHistory from "../components/dashboard/PatientHistory";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner";
import { getGoogleDriveImageUrl } from "../utils/googleDrive";
import "../styles/DashboardProfesional.css"
const url = import.meta.env.VITE_API_BASE_URL;

// Tipos de datos
interface ProfesionalData {
  nombre: string;
  foto_perfil_url: string;
}

interface TurnoHoy {
  nombre_paciente: string;
  hora_turno: string;
  meet_url: string;
  fecha_turno: string;
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [nuevosPacientes, setNuevosPacientes] = useState(0);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const id = localStorage.getItem("id");
        if (!id) {
          throw new Error("No se encontró el ID del profesional.");
        }

        // 🔹 Obtener pacientes nuevos
        const nuevosPacientesResponse = await axios.get(`${url}/api/turnos/${id}/nuevos-pacientes?cantidad=5`);
        const nuevosPacientes = nuevosPacientesResponse.data;
        setNuevosPacientes(nuevosPacientes);


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
        const listaPacientes = Array.from(
          new Map(
            turnos.map((turno: any) => [turno.nombre_paciente, {
              name: turno.nombre_paciente,
              frequency: "Semanal",
            }])
          ).values()
        ).slice(0, 5);

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
          profileImage={getGoogleDriveImageUrl(profesionalData?.foto_perfil_url || "")}
          profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
        />
      </div>

      <div className="div-dashboard-card">
        <DashboardCard
          name={profesionalData?.nombre || "Profesional"}
          patientName={turnoHoy?.nombre_paciente || "Sin paciente hoy"}
          appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
          newPatients={nuevosPacientes} // 🆕 dinámico
          fecha_turno={turnoHoy?.fecha_turno || ""}
        />
      </div>

      {/*Historial clinica solo en pantallas grandes*/}
      {!isMobile && <div className="div-hc-card"><PatientHistory patients={listaPacientes} selectedPatient={null} /></div>}

      {/* 🔹 Estas tarjetas SOLO aparecen en móviles */}
      {isMobile && (
        <>
          {/* Tarjeta de "CALENDARIO" */}
          <div className="calendar-div-movil" onClick={() => navigate('/dashboard/calendario')} style={{ cursor: "pointer" }}>
            <Card
              className="card-calendar-movil"
            >
              <img src="/sidebar/calendar.png" alt="Calendar" width="24" height="24" />
              <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--verde)" }}>CALENDARIO</span>
            </Card>
          </div>

          {/* Tarjeta de "CONFIGURACION" */}
          <div className="config-div-movil" onClick={() => navigate('/dashboard/profesional/config_profesional')} style={{ cursor: "pointer" }}>
            <Card
              className="card-movil"

            >
              <img src="/sidebar/config.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--verde)" }}>CONFIGURACIÓN</span>
            </Card>
          </div>

            <div className="chats-div-movil" onClick={() => navigate('/messages')} style={{ cursor: "pointer" }}>
            <Card
              className="card-movil"

            >
              <img src="/sidebar/chat.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ fontWeight: "bold", fontSize: "14px", color: "var(--verde)" }}>Chats</span>
            </Card>
          </div>


        </>
      )}
      {/* 🔹 FIN DE tarjetas SOLO aparecen en móviles */}

      <div className="proximos-turnos"><CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} /></div>


    </div>
  );
};

export default DashboardProfesional;