import { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from 'axios';
const url = import.meta.env.VITE_API_BASE_URL;
import { useGoogleAuth } from "./useGoogleAuth";
import { Container, Row, Col } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/GoogleCalendar.css"
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
  google_event_id?: string | null; // 🔹 ID del evento en Google Calendar
}



interface GoogleCalendarProps {
  turnos: Turno[];
  usuarioRol: "profesional" | "usuario";
}

const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ turnos, usuarioRol }) => {
  const { isSignedIn, signIn,  } = useGoogleAuth();
  const [events, ] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetUrl] = useState<string | null>(null);
  const [calendarView, setCalendarView] = useState("timeGridWeek");
  const [headerConfig, setHeaderConfig] = useState({});

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        // 🔹 En móviles: Solo mostrar "prev" y "next"
        setCalendarView("timeGridDay");
        setHeaderConfig({
          left: "prev,next",
          center: "title",
          right: "" // 🔹 No mostrar botones de vista
        });
      } else {
        // 🔹 En pantallas grandes: Mostrar todos los botones
        setCalendarView("timeGridWeek");
        setHeaderConfig({
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,timeGridDay"
        });
      }
    };

    handleResize(); // Ejecutar al montar el componente
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);




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
      subirEventosAGoogleCalendar();
    }
  }, [isSignedIn]);


  const subirEventosAGoogleCalendar = async () => {
    if (!isSignedIn) return;

    try {
      for (const turno of turnos) {
        if (turno.google_event_id) {
          continue; // 🔹 Evita subir eventos duplicados
        }

        const fechaHoraInicio = formatearFechaHora(turno.fecha_turno, turno.hora_turno);
        if (!fechaHoraInicio) continue;

        const horaFin = String(parseInt(turno.hora_turno.slice(0, 2)) + 1).padStart(2, "0") + ":00:00";
        const fechaHoraFin = formatearFechaHora(turno.fecha_turno, horaFin);
        if (!fechaHoraFin) continue;

        // 🔹 Validar emails
        const emailPaciente = esEmailValido(turno.email_paciente) ? turno.email_paciente : null;
        const emailProfesional = esEmailValido(turno.email_profesional) ? turno.email_profesional : null;

        const attendees = [];
        if (emailPaciente) attendees.push({ email: emailPaciente });
        if (emailProfesional) attendees.push({ email: emailProfesional });

        if (attendees.length === 0) {
          continue;
        }

        try {
          const response = await window.gapi.client.calendar.events.insert({
            calendarId: "primary",
            conferenceDataVersion: 1,
            resource: {
              summary: `Sesión de Terapia - ${turno.nombre_paciente || turno.nombre_profesional}`,
              description: `Videollamada con ${turno.nombre_profesional || "Profesional"} el ${turno.fecha_turno} a las ${turno.hora_turno}`,
              start: { dateTime: fechaHoraInicio, timeZone: "America/Argentina/Buenos_Aires" },
              end: { dateTime: fechaHoraFin, timeZone: "America/Argentina/Buenos_Aires" },
              attendees,
              conferenceData: {
                createRequest: {
                  requestId: `meet-${turno.id_turno}`,
                  conferenceSolutionKey: { type: "hangoutsMeet" }
                }
              }
            }
          });

          const googleEventId = response.result.id; // 🔹 Obtener el ID del evento en Google Calendar

          // 🔹 Guardar el Google Event ID en la base de datos
          await axios.post(`${url}/api/turnos/guardar-google-event`, {
            id_turno: turno.id_turno,
            google_event_id: googleEventId
          });

        } catch (error) {
          console.error(`❌ Error al subir evento para ${turno.nombre_paciente}:`, error);
        }
      }
    } catch (error) {
      console.error("❌ Error al subir eventos:", error);
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
        console.log("✅ Meet creado:", meetUrl);

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
      alert("No se pudo abrir la videollamada. Habilita las ventanas emergentes.");
      return;
    }

    // 🔥 Monitoreamos cada 1 segundo si la ventana de Meet se cerró
    const checkPopupClosed = setInterval(() => {
      if (meetWindow.closed) {
        clearInterval(checkPopupClosed);
        console.log("✅ La llamada de Meet ha finalizado.");

        // 🔹 Ejecuta aquí la acción que necesites
        registrarFinDeLlamada(turno);
      }
    }, 1000);
  };

  // 📌 Función para realizar acciones cuando finaliza la llamada
  const registrarFinDeLlamada = async (turno: Turno) => {
    try {
      // 🔥 Llamar al backend para registrar el fin de la llamada
      axios.post(`${url}/google-meet/terminar-llamada`, { id_turno: turno.id_turno })
        .then(() => console.log("✅ Fin de llamada registrado en la base de datos"))
        .catch((error) => console.error("❌ Error al registrar el fin de la llamada:", error));
    } catch (error) {
      console.error("❌ Error al registrar el fin de la llamada:", error);
    }

    // 🔥 Opcional: Actualizar estado o mostrar mensaje al usuario
    alert("La videollamada ha finalizado.");
  };


  const iniciarSesionVideo = async (turno: Turno) => {
    const url = await crearVideollamadaMeet(turno);
    if (url) {
      abrirMeetEnPopup(url, turno);
    }
  };

  const unirseAVideo = (turno: Turno) => {
    if (turno.meet_url) {
      abrirMeetEnPopup(turno.meet_url, turno);
    } else {
      alert("La sesión aún no tiene una videollamada asociada.");
    }
  };



  return (
    <div className="calendar-page d-flex justify-content-center align-items-start mt-5">
      {isSignedIn ? (
        <>
          <Container fluid className="d-flex justify-content-center align-items-center py-3">
            <Row className="w-100 justify-content-center">
              <Col xs={12} md={10} lg={8} className="content-box">
                <div className="d-flex flex-column align-items-center w-100">
                  <h3 className="mb-3 text-center w-100">Agenda</h3>

                  <div className="calendar-wrapper w-100">
                    <FullCalendar
                      plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                      initialView={calendarView}
                      locale="es"
                      headerToolbar={headerConfig} // 🔹 Usa configuración dinámica
                      buttonText={{
                        today: "Hoy",
                        month: "Mes",
                        week: "Semana",
                        day: "Día"
                      }}
                      events={formattedEvents}
                      eventClick={handleEventClick}
                    />
                  </div>
                </div>
              </Col>
            </Row>
          </Container>


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
