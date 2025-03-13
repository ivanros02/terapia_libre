import { useState, useEffect } from "react";
import { useGoogleAuth, SCOPES } from "./useGoogleAuth";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import "bootstrap/dist/css/bootstrap.min.css"; // Importar Bootstrap

declare global {
  interface Window {
    gapi: any;
  }
}

const GoogleCalendar = () => {
  const { isSignedIn, signIn, signOut } = useGoogleAuth();
  const [events, setEvents] = useState<any[]>([]);
  const [newEvent, setNewEvent] = useState({ summary: "", date: "" });

  useEffect(() => {
    if (isSignedIn) {
      fetchEvents();
    }
  }, [isSignedIn]);

  const fetchEvents = async () => {
    if (!isSignedIn) return;
    const response = await window.gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    setEvents(response.result.items || []);
  };

  const addEvent = async () => {
    if (!isSignedIn) return;

    const auth = window.gapi.auth2.getAuthInstance();
    if (!auth.currentUser.get().hasGrantedScopes(SCOPES)) {
      console.error("No tienes permisos suficientes para agregar eventos.");
      return;
    }

    try {
      const startDateTime = new Date(newEvent.date);
      const endDateTime = new Date(startDateTime.getTime() + 60 * 60 * 1000);

      const response = await window.gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: {
          summary: newEvent.summary,
          start: {
            dateTime: startDateTime.toISOString(),
            timeZone: "America/Argentina/Buenos_Aires",
          },
          end: {
            dateTime: endDateTime.toISOString(),
            timeZone: "America/Argentina/Buenos_Aires",
          },
        },
      });

      setEvents([...events, response.result]);
      setNewEvent({ summary: "", date: "" });
    } catch (error) {
      console.error("Error al agregar evento", error);
    }
  };

  const handleEventClick = (info: any) => {
    const eventId = info.event.id;
    const updatedSummary = prompt("Nuevo título:", info.event.title) || info.event.title;
    editEvent(eventId, updatedSummary);
  };

  const editEvent = async (eventId: string, updatedSummary: string) => {
    try {
      const updatedEvent = await window.gapi.client.calendar.events.patch({
        calendarId: "primary",
        eventId: eventId,
        resource: { summary: updatedSummary },
      });

      setEvents(events.map((event) => (event.id === eventId ? updatedEvent.result : event)));
    } catch (error) {
      console.error("Error al editar evento", error);
    }
  };

  const deleteEvent = async (eventId: string) => {
    try {
      await window.gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });

      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Error al eliminar evento", error);
    }
  };

  return (
    <div className="container mt-4">
      {isSignedIn ? (
        <>
          <div className="d-flex gap-2 mb-4">
            <button className="btn btn-danger" onClick={signOut}>
              Cerrar sesión
            </button>
            <button className="btn btn-primary" onClick={fetchEvents}>
              Cargar eventos
            </button>
          </div>

          <h3 className="mb-3">Agregar Evento</h3>
          <div className="mb-4">
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Título"
              value={newEvent.summary}
              onChange={(e) => setNewEvent({ ...newEvent, summary: e.target.value })}
            />
            <input
              type="datetime-local"
              className="form-control mb-2"
              value={newEvent.date}
              onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
            />
            <button className="btn btn-success" onClick={addEvent}>
              Agregar
            </button>
          </div>

          <div className="card shadow-sm">
            <div className="card-body">
              <FullCalendar
                plugins={[dayGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                events={events.map((event) => ({
                  id: event.id,
                  title: event.summary,
                  start: event.start.dateTime || event.start.date,
                  end: event.end.dateTime || event.end.date,
                }))}
                editable={true}
                droppable={true}
                eventClick={handleEventClick}
                eventContent={(eventInfo) => (
                  <div className="d-flex justify-content-between align-items-center">
                    <strong>{eventInfo.event.title}</strong>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => deleteEvent(eventInfo.event.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              />
            </div>
          </div>
        </>
      ) : (
        <button className="btn btn-primary" onClick={signIn}>
          Iniciar con Google
        </button>
      )}
    </div>
  );
};

export default GoogleCalendar;