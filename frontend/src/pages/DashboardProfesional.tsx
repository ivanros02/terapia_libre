import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import PatientHistory from "../components/dashboard/PatientHistory";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import "../styles/DashboardProfesional.css"
import { useNavigate } from "react-router-dom";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const navigate = useNavigate();
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="parent">
      {!isMobile && <div className="div1"><Sidebar /></div>}
      <div className="div2"><SearchNavbar
        profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
        profileName={profesionalData?.nombre || "Profesional"} // Usar el nombre del profesional
      /></div>
      <div className="div3"><DashboardCard
        name={profesionalData?.nombre || "Profesional"}
        patientName={turnoHoy?.nombre_paciente || "Sin paciente hoy"}
        appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
        newPatients={3}
      /></div>
      {!isMobile && <div className="div4"><PatientHistory patients={listaPacientes} selectedPatient={null} /></div>}

      {/* 🔹 Estas tarjetas SOLO aparecen en móviles */}
      {isMobile && (
        <>
          <div className="div8" onClick={() => navigate('/dashboard/calendario')} style={{ cursor: "pointer" }}>
            <Card
              className="shadow-lg border-0 rounded-4 p-3 calendario-card d-flex align-items-center justify-content-center gap-2"
              style={{  display: "flex", flexDirection: "row" }}
            >
              <img src="/sidebar/calendar.png" alt="Calendar" width="24" height="24" />
              <span style={{fontWeight:"bold", fontSize:"14px", color:"var(--verde)"}}>CALENDARIO</span>
            </Card>
          </div>

          <div className="div7" onClick={() => navigate('/dashboard/profesional/config_profesional')} style={{ cursor: "pointer" }}>
            <Card
              className="shadow-lg border-0 rounded-4 text-center p-3 d-flex flex-column align-items-center calendario-card"
              style={{height:"90px",width:"183px"}}
            >
              <img src="/sidebar/config.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{fontWeight:"bold", fontSize:"14px", color: "var(--verde)" }}>CONFIGURACIÓN</span>
            </Card>
          </div>

          <div className="div9" onClick={() => navigate('/messages')} style={{ cursor: "pointer" }}>
            <Card
              className="shadow-lg border-0 rounded-4 text-center p-3 d-flex flex-column align-items-center calendario-card"
              style={{height:"90px",width:"183px"}}
            >
              <img src="/sidebar/chat.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{fontWeight:"bold", fontSize:"14px", color: "var(--verde)" }}>Chats</span>
            </Card>
          </div>

        </>
      )}

      <div className="div5"><CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} /></div>


    </div>
  );
};

export default DashboardProfesional;