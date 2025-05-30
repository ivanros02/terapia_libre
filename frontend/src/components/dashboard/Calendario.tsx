import { useEffect, useRef, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import esLocale from "@fullcalendar/core/locales/es";
import type { CalendarApi } from "@fullcalendar/core"; // ✅ este es el correcto
import "../../styles/Calendario.css";

interface CalendarioProps {
    events: any[];
    onEventClick?: (info: any) => void;
    fechaInicial?: string;
}

const Calendario = ({ events, onEventClick, fechaInicial  }: CalendarioProps) => {
    const calendarRef = useRef<FullCalendar | null>(null);
    const [calendarView, setCalendarView] = useState("timeGridWeek");
    const [headerConfig, setHeaderConfig] = useState({});

    useEffect(() => {
        const handleResize = () => {
            const isMobile = window.innerWidth < 768;
            const newView = isMobile ? "timeGridDay" : "timeGridWeek";
            const newHeader = isMobile
                ? { left: "prev,next", center: "", right: "title" }
                : {
                    left: "title",
                    center: "dayGridMonth,timeGridWeek,timeGridDay",
                };

            setCalendarView(newView);
            setHeaderConfig(newHeader);

            const calendarApi: CalendarApi | undefined = calendarRef.current?.getApi();
            if (calendarApi && calendarApi.view.type !== newView) {
                calendarApi.changeView(newView);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Container fluid className="d-flex justify-content-center align-items-center py-3">
            <Row className="w-100 justify-content-center">
                <Col xs={12} md={10} lg={8} className="content-box">

                    <div className="d-flex flex-column align-items-center w-100">
                        <div className="calendar-wrapper">
                            <h3 className="calendar-title">Agenda</h3>

                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView={calendarView}
                                locale={esLocale}
                                headerToolbar={headerConfig}
                                initialDate={fechaInicial || new Date().toISOString().split("T")[0]}// ← ESTO es lo que faltaba
                                allDaySlot={false}  // 🔥 Esto elimina la fila "Todo el día"
                                buttonText={{
                                    today: "Hoy",
                                    month: "Mes",
                                    week: "Semana",
                                    day: "Día",
                                }}
                                events={events}
                                eventClick={onEventClick}
                                height="parent"
                                slotMinTime="07:00:00"
                                slotLabelFormat={{
                                    hour: "numeric",
                                    minute: "2-digit",
                                    hour12: true,
                                }}
                                eventClassNames={() => "custom-event"} // agrega clase para el fondo
                                eventContent={(arg) => {
                                    const ampm = arg.timeText.toLowerCase().includes("pm") ? "PM" : "AM";
                                    return (
                                        <div className="custom-event-content">
                                            <div className="custom-event-time">
                                                {arg.timeText} {ampm}
                                                <div className="icon-container">
                                                    <img src="/video-camera-turno.png" alt="Meet icon" className="event-icon" />
                                                </div>
                                            </div>
                                            <div className="custom-event-title">{arg.event.title}</div>
                                        </div>
                                    );
                                }}


                                dayHeaderContent={(arg) => {
                                    const fecha = new Date(arg.date);
                                    const dia = fecha.toLocaleDateString("es-ES", { weekday: "short" }); // lun
                                    const numero = fecha.getDate(); // 28

                                    return (
                                        <div className="encabezado-dia">
                                            <div className="encabezado-dia__nombre">{dia.toUpperCase()}</div>
                                            <div className="encabezado-dia__numero">{numero}</div>
                                        </div>
                                    );
                                }}


                            />

                        </div>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Calendario;
