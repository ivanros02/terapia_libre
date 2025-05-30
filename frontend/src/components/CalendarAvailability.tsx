import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import "../styles/CalendarAvailability.css";
import ConfirmBookingModal from "./ConfirmBookingModalProps";
const url = import.meta.env.VITE_API_BASE_URL;

interface Disponibilidad {
    [key: string]: { hora_inicio: string; hora_fin: string }[];
}

// 🔹 Nueva interface para ausencias horarias
interface AusenciaHoraria {
    fecha: string;
    hora_inicio: string;
    hora_fin: string;
}

interface CalendarAvailabilityProps {
    id_profesional: number;
    showModal: boolean;
}

interface Professional {
    id_profesional: number;
    nombre: string;
    foto_perfil_url: string;
    especialidades: string[];
    disponibilidad: string;
    valor: number;
    descripcion: string;
    valor_internacional: number;
    correo_electronico: string;
}

const CalendarAvailability: React.FC<CalendarAvailabilityProps> = ({ id_profesional, showModal }) => {
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [availableTimes, setAvailableTimes] = useState<Disponibilidad>({});
    const [selectedDateTime, setSelectedDateTime] = useState<string | null>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [professional, setProfessional] = useState<Professional | null>(null);
    const [ausenciasHorarias, setAusenciasHorarias] = useState<AusenciaHoraria[]>([]);

    // 🔹 Función para convertir horarios a minutos
    const toMinutes = (time: string) => {
        const [hours, minutes] = time.split(':').map(Number);
        return hours * 60 + minutes;
    };

    // 🔹 Función para verificar si un horario está en ausencia
    const isTimeInAbsence = (fecha: string, hora_inicio: string, hora_fin: string): boolean => {
        return ausenciasHorarias.some(ausencia => {
            if (ausencia.fecha !== fecha) return false;

            const inicioHorario = toMinutes(hora_inicio);
            const finHorario = toMinutes(hora_fin);
            const inicioAusencia = toMinutes(ausencia.hora_inicio);
            const finAusencia = toMinutes(ausencia.hora_fin);

            // Verificar si hay solapamiento
            return (inicioHorario < finAusencia && finHorario > inicioAusencia);
        });
    };

    // 🔹 Función para verificar si la ausencia cubre TODO el día de disponibilidad
    const isDayCompletelyUnavailable = (fecha: string): boolean => {
        const horariosDelDia = availableTimes[fecha];
        if (!horariosDelDia || horariosDelDia.length === 0) return false;

        // Encontrar el rango completo de disponibilidad del día
        const iniciosDisponibles = horariosDelDia.map(h => toMinutes(h.hora_inicio));
        const finesDisponibles = horariosDelDia.map(h => toMinutes(h.hora_fin));

        const inicioTotalDisponible = Math.min(...iniciosDisponibles);
        const finTotalDisponible = Math.max(...finesDisponibles);

        // Verificar si alguna ausencia cubre todo el rango de disponibilidad
        return ausenciasHorarias.some(ausencia => {
            if (ausencia.fecha !== fecha) return false;

            const inicioAusencia = toMinutes(ausencia.hora_inicio);
            const finAusencia = toMinutes(ausencia.hora_fin);

            // La ausencia debe cubrir completamente la disponibilidad
            return inicioAusencia <= inicioTotalDisponible && finAusencia >= finTotalDisponible;
        });
    };

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`${url}/disponibilidad/horas?id_profesional=${id_profesional}`);

                if (!response.data || typeof response.data !== "object") {
                    console.error("❌ Respuesta inválida del backend");
                    return;
                }

                // 🔹 Extraer ausenciasHorarias de la respuesta
                const { ausenciasHorarias, ...disponibilidadPorFecha } = response.data;

                setAvailableDays(Object.keys(disponibilidadPorFecha)); // Obtiene las fechas disponibles
                setAvailableTimes(disponibilidadPorFecha); // Asigna los horarios disponibles
                setAusenciasHorarias(ausenciasHorarias || []); // 🔹 Guardar ausencias horarias

                console.log("🔹 Ausencias horarias recibidas:", ausenciasHorarias);

            } catch (error) {
                console.error("Error al obtener disponibilidad:", error);
            }
        };

        if (showModal) fetchAvailability();
    }, [showModal, id_profesional]);






    useEffect(() => {
        const fetchProfessional = async () => {
            try {
                const response = await axios.get(`${url}/api/profesionales/${id_profesional}`);
                setProfessional(response.data);
            } catch (error) {
                console.error("Error al obtener los detalles del profesional:", error);
            }
        };

        fetchProfessional();
    }, [id_profesional]);


    const handleDateChange = (value: Date | Date[] | null) => {
        if (!value || Array.isArray(value)) return;
        setSelectedDate(value);
    };

    const [precioFinal, setPrecioFinal] = useState<number>(0); // 🔹 Precio en ARS (MercadoPago)
    const [precioFinalInternacional, setPrecioFinalInternacional] = useState<number>(0); // 🔹 Precio en USD (PayPal)
    const [profesionalName, setProfesionalName] = useState<string>(""); // 🔹 Nombre del profesional

    const handleSelectTime = (hora_inicio: string, hora_fin: string) => {
        if (selectedDate && professional) {
            // ✅ Convertir la fecha seleccionada a `YYYY-MM-DD`
            const formattedDate = selectedDate.toISOString().split("T")[0];

            if (isTimeInAbsence(formattedDate, hora_inicio, hora_fin)) {
                console.log("⚠️ Horario no disponible por ausencia");
                return; // No hacer nada si está en ausencia
            }

            setSelectedDateTime(`${formattedDate} - ${hora_inicio} a ${hora_fin}`);
            setPrecioFinal(Number(professional.valor) || 0); // 🔹 Precio en ARS para Mercado Pago
            setPrecioFinalInternacional(Number(professional.valor_internacional) || 0); // 🔹 Precio en USD para PayPal
            setProfesionalName(professional.nombre || "");
            setShowConfirmModal(true);
        } else {
            console.error("El profesional aún no está cargado, intenta nuevamente.");
        }
    };




    return (
        <>
            <div className="calendar-container d-flex flex-column flex-md-row justify-content-center align-items-center w-100" style={{ maxWidth: "100%", padding: "20px", margin: "0 auto" }}>
                <div className="calendar-wrapper-details">
                    <Calendar
                        onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                        value={selectedDate}
                        tileDisabled={({ date }) => {
                            const fechaString = date.toISOString().split("T")[0];
                            // Deshabilitar si no está disponible O si está completamente en ausencia
                            return !availableDays.includes(fechaString) || isDayCompletelyUnavailable(fechaString);
                        }}
                        tileClassName={({ date }) => {
                            const fechaString = date.toISOString().split("T")[0];

                            if (isDayCompletelyUnavailable(fechaString)) {
                                return "unavailable-day"; // 🔹 Clase para días completamente no disponibles
                            } else if (availableDays.includes(fechaString)) {
                                return "available-day"; // 🔹 Clase para días disponibles
                            }
                            return "";
                        }}
                        className="custom-calendar"
                    />
                </div>

                <div className="available-times">
                    <h5 className="text-center mb-3">
                        {selectedDate ? selectedDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "Selecciona un día"}
                    </h5>
                    {selectedDate && availableTimes[selectedDate.toISOString().split("T")[0]]?.length > 0 ? (
                        isDayCompletelyUnavailable(selectedDate.toISOString().split("T")[0]) ? (
                            <p className="text-muted text-center">
                                <span style={{ color: '#8e44ad', fontWeight: 'bold' }}>
                                    ⚠️
                                </span>
                            </p>
                        ) : (
                            availableTimes[selectedDate.toISOString().split("T")[0]].map((time, index) => {
                                const fechaSeleccionada = selectedDate.toISOString().split("T")[0];
                                const estaEnAusencia = isTimeInAbsence(fechaSeleccionada, time.hora_inicio, time.hora_fin);

                                return (
                                    <button
                                        key={index}
                                        className={estaEnAusencia ? 'time-unavailable' : ''}
                                        onClick={() => handleSelectTime(time.hora_inicio, time.hora_fin)}
                                        disabled={estaEnAusencia}
                                    >
                                        {`${time.hora_inicio.slice(0, 5)} a ${time.hora_fin.slice(0, 5)}`}
                                        {estaEnAusencia && <span className="ms-2">⚠️</span>}
                                    </button>
                                );
                            })
                        )
                    ) : (
                        <p className="text-muted text-center">No hay horarios disponibles</p>
                    )}
                </div>
            </div>

            {/* Modal de Confirmación */}
            <ConfirmBookingModal
                show={showConfirmModal}
                onHide={() => setShowConfirmModal(false)}
                selectedDateTime={selectedDateTime}
                id_profesional={id_profesional}
                id_usuario={parseInt(localStorage.getItem("id") || "0")}
                precio={precioFinal}  // 🔹 Mercado Pago (ARS)
                precioInternacional={precioFinalInternacional}  // 🔹 PayPal (USD)
                profesionalName={profesionalName} //Nombre profesional
            />

        </>
    );
};

export default CalendarAvailability;