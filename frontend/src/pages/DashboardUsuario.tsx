import { useEffect, useState } from "react";
import { Card, Modal } from "react-bootstrap";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import HistorialSesiones from "../components/dashboard/HistorialSesiones";
import { useNavigate } from "react-router-dom";
import CalendarAvailability from "../components/CalendarAvailability";
import "../styles/DashboardProfesional.css"
const url = import.meta.env.VITE_API_BASE_URL;

interface TurnoHoy {
  nombre_profesional: string;
  hora_turno: string;
  meet_url: string;
  id_profesional: number;
}

interface Turno {
  fecha: string;
  paciente: string;
}

type Terapeuta = {
  id_profesional : number;
  nombre: string;
  correo_electronico: string;
  ultimaConsulta: string;
  valorSesion: string;
  especialidad: string;
  descripcion: string;
};


const DashboardUsuario = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [turnoHoy, setTurnoHoy] = useState<TurnoHoy | null>(null);
  const [proximosTurnos, setProximosTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [eventos, setEventos] = useState<string[]>([]);
  const [sesiones, setSesiones] = useState([]);
  const [terapeuta, setTerapeuta] = useState<Terapeuta | null>(null);
  const userId = localStorage.getItem("id"); // 🔹 Obtener el ID almacenado en localStorage
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const historialResponse = await axios.get(`${url}/api/turnos/usuario/${userId}/historial`);


        const sesionesFormateadas = historialResponse.data.map((sesion: any) => ({
          fecha: new Date(sesion.fecha_turno).toLocaleDateString("es-ES"), // Formato legible de fecha
          hora: sesion.hora_turno,
          valor: parseFloat(sesion.monto).toFixed(2),
        }));

        setSesiones(sesionesFormateadas);

        const terapeutaResponse = await axios.get(`${url}/api/turnos/usuario/${userId}/terapeuta`);
        const terapeutaData = terapeutaResponse.data;
        
        // 🔹 Transformar `ultimaConsulta` a un formato legible
        if (!terapeutaData) {
          setTerapeuta({
            id_profesional: 0,
            nombre: "No disponible",
            correo_electronico: "No disponible",
            ultimaConsulta: "No disponible",
            valorSesion: "No disponible",
            especialidad: "No disponible",
            descripcion: "No disponible"
          });
          return;
        }

        const ultimaConsultaFormateada = terapeutaData.ultimaConsulta
          ? new Date(terapeutaData.ultimaConsulta).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          : "No disponible";

        setTerapeuta({
          ...terapeutaData,
          ultimaConsulta: ultimaConsultaFormateada,
          valorSesion: terapeutaData.valor + "/ USD" + terapeutaData.valor_internacional
        });


      } catch (error) {
        console.error("Error al obtener datos:", error);
      }
    };
    fetchData();
  }, [userId]);



  useEffect(() => {
    const fetchUserData = async () => {
      try {

        if (!userId) return;

        const token = localStorage.getItem("token"); // 🔹 Obtener el token de autenticación
        const response = await axios.get(`${url}/api/auth/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // 🔒 Enviar el token en la cabecera
        });

        setUserName(response.data.nombre); // 🔹 Guardar el nombre del usuario en el estado
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const id = localStorage.getItem("id");
        if (!id) {
          throw new Error("No se encontró el ID del profesional.");
        }

        // 🔹 Obtener el próximo turno más cercano
        const turnoResponse = await axios.get(`${url}/api/turnos/${id}/turnos-hoy-paciente`);
        const turnoMasCercano = turnoResponse.data || null; // ✅ Manejar el caso `null`
      
        setTurnoHoy(turnoMasCercano);

        // 🔹 Obtener turnos del profesional
        const turnosResponse = await axios.get(`${url}/api/turnos/usuarioDashboard/${id}`);
        const turnos = Array.isArray(turnosResponse.data) ? turnosResponse.data : [];



        // 🔹 Extraer próximos turnos (máximo 5)
        const proximosTurnos = turnos.map((turno: any) => ({
          fecha: turno.fecha_turno,
          paciente: turno.nombre_profesional,
        }));

        setProximosTurnos(proximosTurnos);
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
      <div className="div2">
        <SearchNavbar
          profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          profileName={userName || "Usuario"} // 🔹 Mostrar el nombre del usuario o un valor por defecto
        />
      </div>
      <div className="div3">
        <DashboardCard
          name={userName || "Usuario"}
          patientName={turnoHoy?.nombre_profesional || "Sin sesion hoy"}
          appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
          newPatients={3}
        />
      </div>

      {/* 🔹 Estas tarjetas SOLO aparecen en móviles */}
      {isMobile && (
        <>
          <div className="div8">
            <Card
              className="shadow-lg border-0 rounded-4 p-3 calendario-card d-flex align-items-center justify-content-center gap-2"
              style={{ backgroundColor: "var(--naranja)", display: "flex", flexDirection: "row" }}
            >
              <img src="/sidebar/calendar.png" alt="Calendar" width="24" height="24" />
              <span className="text-white" onClick={handleShowModal}>AGENDAR NUEVO TURNO</span>
            </Card>
          </div>




          <div className="div7" onClick={() => navigate('/dashboard/usuario/config_usuario')} style={{ cursor: "pointer" }}>
            <Card
              className="shadow-lg border-0 rounded-4 text-center p-3 d-flex flex-column align-items-center calendario-card"
            >
              <img src="/sidebar/config.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ color: "var(--verde)" }}>CONFIGURACIÓN</span>
            </Card>
          </div>


          <div className="div9" onClick={() => navigate('/messages')} style={{ cursor: "pointer" }}>
            <Card
              className="shadow-lg border-0 rounded-4 text-center p-3 d-flex flex-column align-items-center calendario-card"
            >
              <img src="/sidebar/chat.png" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ color: "var(--verde)" }}>Chats</span>
            </Card>
          </div>


        </>
      )}

      <div className={isMobile ? "div5" : "div4"}>
        {terapeuta && (
          <HistorialSesiones sesiones={sesiones} terapeuta={terapeuta} onCambiarTerapeuta={() => alert("Cambiar terapeuta")} />
        )}
      </div>

      {!isMobile && <div className="div5 calendarioAncho">
        <CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} />
      </div>}


      {/* Modal con CalendarAvailability */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agendar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarAvailability id_profesional={terapeuta?.id_profesional ?? 0} showModal={showModal} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default DashboardUsuario;
