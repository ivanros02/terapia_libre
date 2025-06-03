import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";
import Modal from "react-bootstrap/Modal";
import { gapi } from "gapi-script";
import Button from "react-bootstrap/Button";
import axios from 'axios';
const url = import.meta.env.VITE_API_BASE_URL;
import { useGoogleAuth } from "./useGoogleAuth";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/GoogleCalendar.css"
import { toast } from "react-toastify";
import Calendario from "../components/dashboard/Calendario";

declare global {
  interface Window {
    gapi: any;
  }
}

interface Turno {
  id_turno: number;
  fecha_turno: string;
  hora_turno: string;
  estado: string;
  meet_url?: string; // 🔹 URL opcional de Google Meet
  nombre_paciente: string;
  email_paciente: string;  // 🔹 Correo del paciente
  nombre_profesional: string; // 🔹 Nombre del profesional
  email_profesional: string; // 🔹 Correo del profesional
  google_event_id_profesional?: string | null; // 🔹 Este ya existía, lo dejamos por compatibilidad
  google_event_id_paciente?: string | null; // 🔹_
}



interface GoogleCalendarProps {
  turnos: Turno[];
  usuarioRol: "profesional" | "usuario";
  fechaInicial?: string; // ← nuevo
}

const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ turnos, usuarioRol, fechaInicial }) => {
  const { isSignedIn, signIn, } = useGoogleAuth();
  const [events,] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetUrl] = useState<string | null>(null);

  const formatearFechaHora = (fecha: string, hora: string): string | null => {
    if (!fecha || !hora) return null;

    const fechaISO = fecha.split("T")[0]; // Asegurar que es solo YYYY-MM-DD
    const fechaHora = new Date(`${fechaISO}T${hora}`);

    if (isNaN(fechaHora.getTime())) {
      console.warn(`⚠️ Fecha/Hora inválida: ${fecha} ${hora}`);
      return null;
    }

    return fechaHora.toISOString();
  };

  const esEmailValido = (email: string | undefined | null): boolean => {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Expresión regular para validar emails
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (isSignedIn) {
      verificarPermisos(); // Verificar permisos antes de subir eventos
    }
  }, [isSignedIn]);

  // 🔹 Verificar que el usuario tiene los permisos correctos
  const verificarPermisos = async () => {
    const authInstance = gapi.auth2.getAuthInstance();

    if (!authInstance.isSignedIn.get()) {
      console.error("❌ No estás autenticado en Google.");
      return;
    }

    const user = authInstance.currentUser.get(); // 👈 acá sí existe `user`
    const googleEmail = user.getBasicProfile().getEmail(); // ✅ usalo acá
    const emailDelSistema = localStorage.getItem("correo_electronico");

    if (googleEmail.trim().toLowerCase() !== emailDelSistema?.trim().toLowerCase()) {
      toast.error("🚫 Estás autenticado en Google con una cuenta diferente a la del sistema. Cerrando sesión...");

      await authInstance.signOut();

      setTimeout(() => {
        authInstance.signIn({
          scope: "https://www.googleapis.com/auth/calendar.events",
          prompt: "select_account",
        });
      }, 1000);

      return;
    }

    const grantedScopes = user.getGrantedScopes();

    if (!grantedScopes.includes("https://www.googleapis.com/auth/calendar.events")) {
      console.error("❌ Permisos insuficientes, reautenticando...");
      await signInConPermisos();
    } else {
      await subirEventosAGoogleCalendar(usuarioRol);
    }
  };



  // 🔹 Forzar reautenticación si los permisos son insuficientes
  const signInConPermisos = async () => {
    try {

      await gapi.auth2.getAuthInstance().signIn({
        scope: "https://www.googleapis.com/auth/calendar.events",
        prompt: "consent",
      });
      await verificarPermisos();
    } catch (error) {
      console.error("❌ Error al reautenticar usuario:", error);
    }
  };

  const formatearFechaLegible = (fechaISO: string, hora: string) => {
    try {
      const fecha = parseISO(fechaISO);
      return format(fecha, "EEEE dd 'de' MMMM 'de' yyyy", { locale: es }) + ` a las ${hora}`;
    } catch (error) {
      console.warn("⚠️ Error al formatear la fecha legible:", error);
      return `${fechaISO} a las ${hora}`;
    }
  };

  const subirEventosAGoogleCalendar = async (usuarioRol: "profesional" | "usuario") => {
    if (!isSignedIn) return;

    try {

      for (const turno of turnos) {
        // 🔹 Verificar si el evento ya existe en el Google Calendar del usuario actual
        if (usuarioRol === "profesional" && turno.google_event_id_profesional) continue;
        if (usuarioRol === "usuario" && turno.google_event_id_paciente) continue;



        const fechaHoraInicio = formatearFechaHora(turno.fecha_turno, turno.hora_turno);
        if (!fechaHoraInicio) {
          console.warn(`⚠️ Fecha inicio inválida para el turno ${turno.id_turno}`);
          continue;
        }

        const horaFin = String(parseInt(turno.hora_turno.slice(0, 2)) + 1).padStart(2, "0") + ":00:00";
        const fechaHoraFin = formatearFechaHora(turno.fecha_turno, horaFin);
        if (!fechaHoraFin) {
          console.warn(`⚠️ Fecha fin inválida para el turno ${turno.id_turno}`);
          continue;
        }

        // 🔹 Validar emails antes de asignarlos
        const emailPaciente = esEmailValido(turno.email_paciente) ? turno.email_paciente : null;
        const emailProfesional = esEmailValido(turno.email_profesional) ? turno.email_profesional : null;

        // 🔹 Verificar si hay al menos un email válido antes de continuar
        if (!emailPaciente && !emailProfesional) {
          console.warn(`⚠️ Ambos emails inválidos o faltantes en turno ID ${turno.id_turno}`, turno);
          continue;
        }

        // 🔹 Definir el email según el tipo de usuario y usar solo emails válidos
        let emailUsuario: string | null;
        let campoGoogleEvent: "google_event_id_profesional" | "google_event_id_paciente";

        if (usuarioRol === "profesional") {
          emailUsuario = emailProfesional;
          campoGoogleEvent = "google_event_id_profesional";
        } else {
          emailUsuario = emailPaciente;
          campoGoogleEvent = "google_event_id_paciente";
        }

        // 🔹 Si el usuario es un paciente pero no tiene email, no subimos el evento para él.
        if (usuarioRol === "usuario" && !emailUsuario) {
          console.warn(`⚠️ Paciente sin email en turno ID ${turno.id_turno}, solo se creará evento para el profesional.`);
          continue;
        }



        try {
          const fechaFormateada = formatearFechaLegible(turno.fecha_turno, turno.hora_turno);

          let descripcionEvento = "";
          let attendees: { email: string }[] = [];

          // 🔹 Personalizar descripción y asistentes en base al usuarioRol
          if (usuarioRol === "profesional") {
            descripcionEvento = `Sesión con el paciente ${turno.nombre_paciente || "Desconocido"} el ${fechaFormateada}`;
            if (esEmailValido(turno.email_paciente)) {
              attendees.push({ email: turno.email_paciente });
            }
          } else { // usuarioRol === "usuario"
            descripcionEvento = `Sesión con el profesional ${turno.nombre_profesional || "Desconocido"} el ${fechaFormateada}`;
            if (esEmailValido(turno.email_profesional)) {
              attendees.push({ email: turno.email_profesional });
            }
          }

          if (usuarioRol == "profesional") {
            const response = await window.gapi.client.calendar.events.insert({
              calendarId: "primary",
              conferenceDataVersion: 1,
              resource: {
                summary: "Sesión de Terapia Libre",
                description: descripcionEvento,
                start: { dateTime: fechaHoraInicio, timeZone: "America/Argentina/Buenos_Aires" },
                end: { dateTime: fechaHoraFin, timeZone: "America/Argentina/Buenos_Aires" },
                attendees: attendees.length > 0 ? attendees : undefined,
                conferenceData: { //crea la videollamada
                  createRequest: {
                    requestId: `turno-${turno.id_turno}`,
                    conferenceSolutionKey: { type: "hangoutsMeet" }
                  }
                }
              }
            });

            if (!response.result || !response.result.id) {
              console.error(`❌ No se recibió un Google Event ID para ${usuarioRol} en el turno ${turno.id_turno}`);
              continue;
            }

            const googleEventId = response.result.id;
            const meetUrl = response.result?.conferenceData?.entryPoints?.[0]?.uri;

            await axios.post(`${url}/api/turnos/guardar-google-event`, {
              id_turno: turno.id_turno,
              [campoGoogleEvent]: googleEventId,
              meet_url: meetUrl,
            });

            // 🔹 Notificación de éxito después de subir eventos
            toast.success("Los eventos fueron sincronizados con tu Google Calendar");

          }

        } catch (error: any) {
          console.error(`❌ Error al subir evento para ${usuarioRol} (${emailUsuario}):`, error.response?.data || error);
        }



      }
    } catch (error) {
      console.error("❌ Error general al subir eventos:", error);
    }
  };



  const formattedEvents = [
    ...events.filter(event => event && event.start && event.id),

    ...turnos
      .map((turno) => {
        try {
          if (!turno.fecha_turno || !turno.hora_turno) {
            console.warn("⚠️ Turno con datos inválidos:", turno);
            return null;
          }

          const fechaUTC = new Date(turno.fecha_turno);
          if (isNaN(fechaUTC.getTime())) {
            console.warn("⚠️ Fecha inválida:", turno.fecha_turno);
            return null;
          }

          const horaPartes = turno.hora_turno.split(":");
          if (horaPartes.length < 2) {
            console.warn("⚠️ Hora inválida:", turno.hora_turno);
            return null;
          }

          // ✅ 🔹 Ajustar la hora directamente sin restar 3 horas
          fechaUTC.setHours(parseInt(horaPartes[0], 10), parseInt(horaPartes[1], 10), 0);

          // ✅ 🔹 Verificar la zona horaria correctamente sin restar manualmente
          const fechaFinal = fechaUTC.toISOString();

          // ✅ 🔹 Título dinámico según el tipo de usuario
          const tituloEvento = usuarioRol === "profesional"
            ? `${turno.nombre_paciente || "Desconocido"}`
            : `${turno.nombre_profesional || "Desconocido"}`;

          return {
            id: `turno-${turno.id_turno}`,
            title: tituloEvento,
            start: fechaFinal,
            allDay: false,
            className: "custom-event", // se aplica el estilo
            extendedProps: { ...turno },
          };
        } catch (error) {
          console.error("❌ Error formateando turno:", error, turno);
          return null;
        }
      })
      .filter(event => event !== null)
  ];


  const handleEventClick = async (clickInfo: any) => {
    const turnoData = clickInfo.event.extendedProps;

    try {
      const response = await axios.get(`${url}/google-meet/${turnoData.id_turno}`);
      turnoData.meet_url = response.data.meet_url;
    } catch (error) {
      console.log("No hay Meet para este turno.");
    }

    setSelectedTurno(turnoData);
    setShowModal(true);
  };


  /*
  const crearVideollamadaMeet = async (turno: Turno) => {
    if (!window.gapi || !window.gapi.client) {
      console.error("Google API no está cargada.");
      return;
    }
 
    // 🔹 Validar los correos antes de enviarlos a Google Meet
    const emailPaciente = esEmailValido(turno.email_paciente) ? turno.email_paciente : null;
    const emailProfesional = esEmailValido(turno.email_profesional) ? turno.email_profesional : null;
 
    const attendees = [];
    if (emailPaciente) attendees.push({ email: emailPaciente });
    if (emailProfesional) attendees.push({ email: emailProfesional });
 
    if (attendees.length === 0) {
      console.warn("⚠️ No se agregaron asistentes porque los correos no son válidos.");
      return;
    }
 
    try {
      // 🔹 Crear solo una videollamada sin evento de Google Calendar
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        resource: {
          summary: "Sesión de Terapia",
          description: `Videollamada programada`,
          start: { dateTime: new Date().toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
          end: { dateTime: new Date(Date.now() + 3600000).toISOString(), timeZone: "America/Argentina/Buenos_Aires" },
          attendees,
          conferenceData: {
            createRequest: {
              requestId: `meet-${turno.id_turno}`,
              conferenceSolutionKey: { type: "hangoutsMeet" }
            }
          }
        }
      });
 
      const meetUrl = response.result?.conferenceData?.entryPoints?.[0]?.uri;
      if (meetUrl) {
        // Guardar la URL en la base de datos sin subir a Google Calendar
        await axios.post(`${url}/google-meet/guardar-meet`, {
          id_turno: turno.id_turno,
          meet_url: meetUrl,
        });
 
        return meetUrl;
      } else {
        console.error("❌ No se obtuvo la URL de Meet.");
        return null;
      }
    } catch (error) {
      console.error("❌ Error al crear Meet:", error);
    }
  };
  */


  const abrirMeetEnPopup = (url: string, turno: Turno) => {
    const width = 900;
    const height = 600;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;

    const meetWindow = window.open(
      url,
      "GoogleMeetPopup",
      `width=${width},height=${height},top=${top},left=${left},resizable=yes`
    );

    if (!meetWindow) {
      toast.error("🚫 No se pudo abrir la videollamada. Habilita las ventanas emergentes.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      return;
    }

    const checkPopupClosed = setInterval(() => {
      if (meetWindow.closed) {
        clearInterval(checkPopupClosed);

        registrarFinDeLlamada(turno);
      }
    }, 1000);
  };

  // 📌 Función para realizar acciones cuando finaliza la llamada
  const registrarFinDeLlamada = async (turno: Turno) => {
    try {
      await axios.post(`${url}/google-meet/terminar-llamada`, { id_turno: turno.id_turno });

      toast.success("✅ La videollamada ha finalizado correctamente.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("❌ Error al registrar el fin de la llamada:", error);

      toast.error("❌ Hubo un problema al finalizar la videollamada.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };


  const iniciarSesionVideo = async (turno: Turno) => {
    try {
      const response = await axios.get(`${url}/google-meet/${turno.id_turno}`);
      const meetUrl = response.data.meet_url;

      if (meetUrl) {
        abrirMeetEnPopup(meetUrl, turno);
      } else {
        toast.warning("⚠️ Este turno no tiene una videollamada asociada.");
      }
    } catch (error) {
      toast.error("❌ No se pudo obtener la videollamada.");
    }
  };



  const unirseAVideo = async (turno: Turno) => {
    try {
      const response = await axios.get(`${url}/google-meet/${turno.id_turno}`);
      const meetUrl = response.data.meet_url;

      if (meetUrl) {
        abrirMeetEnPopup(meetUrl, turno);
      } else {
        toast.warning("⚠️ La sesión aún no tiene una videollamada asociada.", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("❌ Error al consultar la videollamada:", error);
      toast.error("❌ No se pudo obtener la videollamada.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  console.log("Fecha URL:", fechaInicial);


  return (
    <div className="calendar-page d-flex justify-content-center align-items-start w-100" style={{ marginTop: "-2rem" }}>
      {usuarioRol === "usuario" || isSignedIn ? (
        <>
          <Calendario
            events={formattedEvents}
            onEventClick={handleEventClick}
            fechaInicial={fechaInicial}
          />



          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Detalles del Turno</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {selectedTurno && (
                <>
                  <p>
                    <strong>Fecha:</strong>{" "}
                    {selectedTurno?.fecha_turno
                      ? new Date(selectedTurno.fecha_turno).toLocaleDateString("es-ES", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })
                      : "Fecha no disponible"}
                  </p>
                  <p><strong>Hora:</strong> {selectedTurno?.hora_turno || "Hora no disponible"}</p>
                  <p><strong>Estado:</strong> {selectedTurno?.estado || "Estado no disponible"}</p>

                </>
              )}
            </Modal.Body>
            <Modal.Footer>
              {selectedTurno && usuarioRol === "profesional" ? (
                <Button variant="success" onClick={() => iniciarSesionVideo(selectedTurno)}>Comenzar Sesión</Button>
              ) : selectedTurno ? (
                <Button variant="primary" onClick={() => unirseAVideo(selectedTurno)}>Unirse</Button>
              ) : null}
            </Modal.Footer>
          </Modal>
        </>
      ) : (
        <Button style={{ marginTop: "7rem" }} variant="primary" onClick={signIn}>Iniciar sesión con Google</Button>
      )}

      <Modal show={showMeetModal} onHide={() => setShowMeetModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Videollamada en curso</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {meetUrl && selectedTurno ? (  // 🔹 Asegurar que `selectedTurno` no sea null
            <>
              <p>Haz clic en el botón para unirte a la videollamada:</p>
              <Button variant="success" onClick={() => abrirMeetEnPopup(meetUrl, selectedTurno)}>
                Unirse a la llamada
              </Button>
            </>
          ) : (
            <p>No se encontró un enlace de videollamada.</p>
          )}
        </Modal.Body>
      </Modal>


    </div>
  );
};

export default GoogleCalendar;
