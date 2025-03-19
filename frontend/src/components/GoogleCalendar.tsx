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
  meet_url?: string; // 🔹 Hacemos meet_url opcional
}

interface GoogleCalendarProps {
  turnos: Turno[];
  usuarioRol: "profesional" | "usuario";
}

const GoogleCalendar: React.FC<GoogleCalendarProps> = ({ turnos, usuarioRol }) => {
  const { isSignedIn, signIn, signOut } = useGoogleAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [selectedTurno, setSelectedTurno] = useState<Turno | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showMeetModal, setShowMeetModal] = useState(false);
  const [meetEmbedded, setMeetEmbedded] = useState(false);
  const [meetUrl, setMeetUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isSignedIn) {
      fetchGoogleEvents();
    }
  }, [isSignedIn]);

  const fetchGoogleEvents = async () => {
    if (!isSignedIn) return;

    try {
      const response = await window.gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 10,
        orderBy: "startTime",
      });

      // ✅ Definimos una interfaz para los eventos de Google Calendar
      interface GoogleCalendarEvent {
        id: string;
        summary: string;
        start: { dateTime?: string; date?: string };
        end: { dateTime?: string; date?: string };
      }

      const items: GoogleCalendarEvent[] = response.result.items || [];

      // ✅ Crear eventos de Google Calendar con IDs únicos
      const googleEvents = items.map((event) => ({
        id: event.id,
        title: event.summary || "Sin título",
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
      }));

      console.log("✅ Eventos de Google Calendar antes de combinar:", googleEvents);

      // ✅ Fusionar eventos de Google con `turnos`
      setEvents((prevEvents) => {
        const uniqueEvents = [...prevEvents, ...formattedEvents].filter((event, index, self) =>
          index === self.findIndex(e => e.id === event.id)
        );
        return uniqueEvents;
      });


    } catch (error) {
      console.error("Error al cargar eventos de Google Calendar:", error);
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

          console.log(`📆 Turno corregido ID ${turno.id_turno} → ${fechaFinal}`);

          return {
            id: `turno-${turno.id_turno}`,
            title: "Turno reservado",
            start: fechaFinal,  // ❌ Antes restaba 3 horas, ahora no.
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

    // 🔹 Convertir fecha y hora en un solo `DateTime`
    const fechaISO = turno.fecha_turno.split("T")[0]; // Extrae solo la fecha (YYYY-MM-DD)
    const fechaHoraInicio = new Date(`${fechaISO}T${turno.hora_turno}`).toISOString();
    const horaFin = String(parseInt(turno.hora_turno.slice(0, 2)) + 1).padStart(2, "0") + ":00:00";
    const fechaHoraFin = new Date(`${fechaISO}T${horaFin}`).toISOString();

    // ✅ Verificar datos correctos antes de enviar a Google
    console.log("📌 Enviando a Google Meet:", { fechaHoraInicio, fechaHoraFin });

    try {
      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        conferenceDataVersion: 1,
        resource: {
          summary: "Sesión de Terapia",
          description: `Videollamada programada para ${turno.fecha_turno} a las ${turno.hora_turno}`,
          start: {
            dateTime: fechaHoraInicio,
            timeZone: "America/Argentina/Buenos_Aires"
          },
          end: {
            dateTime: fechaHoraFin,
            timeZone: "America/Argentina/Buenos_Aires"
          },
          attendees: [
            { email: "correoPaciente@example.com" }, // 📌 Cambia esto por emails reales
            { email: "correoProfesional@example.com" }
          ],
          conferenceData: {
            createRequest: {
              requestId: `meet-${turno.id_turno}`,
              conferenceSolutionKey: { type: "hangoutsMeet" }
            }
          }
        }
      });

      console.log("📌 Respuesta de Google:", response);

      const meetUrl = response.result?.conferenceData?.entryPoints?.[0]?.uri;
      if (meetUrl) {
        console.log("✅ Meet creado:", meetUrl);

        // Guardar la URL en la base de datos
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
    console.log(`📌 Registrando fin de la videollamada para el turno ${turno.id_turno}`);

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
    <div className="container mt-4">
      {isSignedIn ? (
        <>



          <Container fluid className="d-flex justify-content-center align-items-center py-3">
            <Row className="w-100 justify-content-center">
              <Col xs={12} md={10} lg={8}>
                <div className="d-flex gap-2 mb-4">
                  <Button variant="danger" onClick={signOut}>Cerrar sesión</Button>
                  <Button variant="primary" onClick={fetchGoogleEvents}>Cargar eventos</Button>
                </div>

                <h3 className="mb-3">Turnos agendados</h3>

                <FullCalendar
                  plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                  initialView="timeGridWeek"
                  locale="es"
                  events={formattedEvents}
                  eventClick={handleEventClick}
                />
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
        <Button variant="primary" onClick={signIn}>Iniciar sesión con Google</Button>
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
