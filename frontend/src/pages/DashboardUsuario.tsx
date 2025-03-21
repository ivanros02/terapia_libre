import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";
import HistorialSesiones from "../components/dashboard/HistorialSesiones";
import "../styles/DashboardProfesional.css"
const url = import.meta.env.VITE_API_BASE_URL;

interface TurnoHoy {
  nombre_profesional: string;
  hora_turno: string;
  meet_url: string;
}

interface Turno {
  fecha: string;
  paciente: string;
}



const DashboardUsuario = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const [turnoHoy, setTurnoHoy] = useState<TurnoHoy | null>(null);
  const [proximosTurnos, setProximosTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [, setError] = useState<string | null>(null);
  const [eventos, setEventos] = useState<string[]>([]);
  const [sesiones, setSesiones] = useState([]);
  const [terapeuta, setTerapeuta] = useState(null);
  const userId = localStorage.getItem("id"); // 🔹 Obtener el ID almacenado en localStorage

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
        const ultimaConsultaFormateada = terapeutaData.ultimaConsulta
          ? new Date(terapeutaData.ultimaConsulta).toLocaleDateString("es-ES", {
            weekday: "long",
            day: "numeric",
            month: "long",
          })
          : "No disponible"; // Si no hay datos, mostrar "No disponible"

        setTerapeuta({
          ...terapeutaData,
          ultimaConsulta: ultimaConsultaFormateada, // 🔹 Asignar la fecha formateada
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

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="parent">
      <div className="div1">
        <SearchNavbar
          profileImage="https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png"
          profileName={userName || "Usuario"} // 🔹 Mostrar el nombre del usuario o un valor por defecto
        />
      </div>
      <div className="div2">
        <Sidebar />
      </div>
      <div className="div3">
        <DashboardCard
          name={userName || "Usuario"}
          patientName={turnoHoy?.nombre_profesional || "Sin sesion hoy"}
          appointmentTime={turnoHoy ? `${turnoHoy.hora_turno}` : "Sin turnos"}
          newPatients={3}
        />
      </div>
      <div className="divHistorialSesiones">
        {terapeuta && (
          <HistorialSesiones sesiones={sesiones} terapeuta={terapeuta} onCambiarTerapeuta={() => alert("Cambiar terapeuta")} />
        )}
      </div>
      <div className="div5 calendarioAncho">
        <CalendarioTurnos eventos={eventos} proximosTurnos={proximosTurnos} />
      </div>
    </div>
  );
};

export default DashboardUsuario;
