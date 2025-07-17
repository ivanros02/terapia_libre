import { useEffect, useState } from "react";
import { Card } from "react-bootstrap";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import HistorialSesiones from "../components/dashboard/HistorialSesiones";
import { useNavigate } from "react-router-dom";
import "../styles/DashboardProfesional.css"
import LoadingSpinner from "../components/LoadingSpinner";
import { useRef } from "react";
import TablaFacturacion from "../components/dashboard/TablaFacturacion";
import { Modal } from "react-bootstrap";
import CalendarAvailability from "../components/detallesProfesional/CalendarAvailability";
const url = import.meta.env.VITE_API_BASE_URL;

interface TurnoHoy {
  nombre_profesional: string;
  hora_turno: string;
  meet_url: string;
  id_profesional: number;
  fecha_turno: string;
}

interface Turno {
  fecha: string;
  paciente: string;
}

type Terapeuta = {
  id_profesional: number;
  nombre: string;
  correo_electronico: string;
  ultimaConsulta: string;
  valorSesion: string;
  especialidad: string;
  descripcion: string;
};

interface Session {
  id: string;
  date: string;
  time: string;
  patient: string;
  value: number;
  status: 'cancelada' | 'completada' | 'pendiente';
  detail?: string;
}

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
  const [sessions, setSessions] = useState<Session[]>([]);
  const [search, _] = useState('');
  const [expandedSessions, setExpandedSessions] = useState<Set<string>>(new Set());
  const [uploading, setUploading] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);

  const navigate = useNavigate();

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await axios.get(`${url}/api/turnos/usuario/${userId}`);
        const formattedSessions = response.data.map((turno: any) => ({
          id: turno.id_turno,
          date: turno.fecha_turno.split('T')[0].split('-').reverse().join('/'),
          time: turno.hora_turno.slice(0, 5),
          patient: turno.nombre_profesional || 'Sin nombre',
          value: turno.valor || turno.precio,
          status: turno.estado?.toLowerCase() === 'completado' ? 'completada' :
            turno.estado?.toLowerCase() === 'cancelado' ? 'cancelada' : 'pendiente',
          detail: turno.factura_filename ? 'Ver factura' : null
        }));
        setSessions(formattedSessions);
      } catch (error) {
        console.error('Error al cargar sessions:', error);
      }
    };

    if (userId) fetchSessions();
  }, [userId]);

  const toggleExpanded = (sessionId: string) => {
    const newExpanded = new Set(expandedSessions);
    if (newExpanded.has(sessionId)) {
      newExpanded.delete(sessionId);
    } else {
      newExpanded.add(sessionId);
    }
    setExpandedSessions(newExpanded);
  };

  const formatValue = (value: number) => `$${value.toLocaleString()}`;

  const getStatusDisplay = (status: string) => {
    const statusMap = {
      cancelada: 'Cancelada',
      completada: 'Completada',
      pendiente: 'Pendiente'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  const handleFileUpload = (sessionId: string) => {
    setCurrentSessionId(sessionId);
    fileInputRef.current?.click();
  };

  const handleDownloadInvoice = (sessionId: string, sessionDate: string) => {
    const [_, month, year] = sessionDate.split('/');
    const formattedDate = `${year}/${month.padStart(2, '0')}`;
    window.open(`${url}/api/facturas/${formattedDate}/turno_${sessionId}_factura.pdf`, '_blank');
  };

  const formatDateForMobile = (dateString: string) => {
    const [day, month] = dateString.split('/');
    return `${day}/${month}`;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !currentSessionId) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('factura', file);
      formData.append('id_turno', currentSessionId);

      const currentSession = sessions.find(s => s.id === currentSessionId);
      if (currentSession) {
        formData.append('fecha_turno', currentSession.date);
      }

      await axios.post(`${url}/api/turnos/factura/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      window.location.reload();
    } catch (error) {
      console.error('Error al subir factura:', error);
    } finally {
      setUploading(false);
    }
  };

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

  if (loading) return <LoadingSpinner />; // 🔹 Mostrar un spinner de carga mientras se obtienen los datos

  return (
    <div className="parent">
      {/* 🔹 Sidebar solo en pantallas grandes */}
      {!isMobile && <div className="div-side-bar"><Sidebar /></div>}

      <div className="div-search-navbar">
        <SearchNavbar
          profileImage="https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png"
          profileName={userName || "Usuario"} // 🔹 Mostrar el nombre del usuario o un valor por defecto
        />
      </div>

      <div className="div-dashboard-card">
        <DashboardCard
          name={userName || "Usuario"}
          patientName={turnoHoy?.nombre_profesional || "Sin sesion hoy"}
          appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
          newPatients={3}
          terapeuta={terapeuta?.id_profesional}
          fecha_turno={turnoHoy?.fecha_turno || ""}
        />
      </div>

      <div className={isMobile ? "proximos-turnos" : "div-hc-card"}>
        {isMobile ? (
          <TablaFacturacion
            sessions={sessions.filter(session =>
              session.patient?.toLowerCase().includes(search.toLowerCase()) || false
            )}
            isMobile={isMobile}
            uploading={uploading}
            expandedSessions={expandedSessions}
            esProfesional={false}
            toggleExpanded={toggleExpanded}
            formatValue={formatValue}
            getStatusDisplay={getStatusDisplay}
            handleFileUpload={handleFileUpload}
            handleDownloadInvoice={handleDownloadInvoice}
            formatDateForMobile={formatDateForMobile}
          />
        ) : (
          terapeuta && (
            <HistorialSesiones
              sesiones={sesiones}
              terapeuta={terapeuta}
              onCambiarTerapeuta={() => alert("Cambiar terapeuta")}
            />
          )
        )}
      </div>

      {!isMobile && <div className="proximos-turnos">
        <CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} />
      </div>}

      {/* 🔹 Estas tarjetas SOLO aparecen en móviles */}
      {isMobile && (
        <>
          {/* 
          <div className="config-div-movil" onClick={() => navigate('/dashboard/usuario/config_usuario')} style={{ cursor: "pointer" }}>
            <Card
              className="card-movil"
            >
              <img src="/sidebar/settings.svg" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ color: "var(--verde)" }}>CONFIGURACIÓN</span>
            </Card>

          </div>
          */}

          <div className="config-div-movil" onClick={handleShowModal} style={{ cursor: "pointer" }}>
            <Card className="card-movil" style={{ backgroundColor: "var(--naranja)" }}>
              <img src="/sidebar/calendar_white.svg" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ color: "white" }}>AGENDAR TURNO</span>
            </Card>
          </div>

          <div className="chats-div-movil" onClick={() => navigate('/professionals')} style={{ cursor: "pointer" }}>
            <Card
              className="card-movil"
            >
              <img src="/sidebar/perfil_dash_usuario.svg" alt="Home" width="24" height="24" className="mb-2" />
              <span style={{ color: "var(--verde)", fontSize: "11px", fontWeight: "500" }}>CAMBIAR TERAPEUTA</span>
            </Card>
          </div>
        </>
      )}
      {/* 🔹 FIN DE tarjetas SOLO aparecen en móviles */}

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Agendar Turno</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <CalendarAvailability id_profesional={terapeuta?.id_profesional ?? 0} showModal={showModal} />
        </Modal.Body>
      </Modal>

      <input
        ref={fileInputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />

    </div>

  );
};

export default DashboardUsuario;
