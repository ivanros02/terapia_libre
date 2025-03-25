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

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`${url}/disponibilidad/horas?id_profesional=${id_profesional}`);

                if (!response.data || typeof response.data !== "object") {
                    console.error("❌ Respuesta inválida del backend");
                    return;
                }

                setAvailableDays(Object.keys(response.data)); // Obtiene las fechas disponibles
                setAvailableTimes(response.data); // Asigna los horarios disponibles

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
                <div className="calendar-wrapper">
                    <Calendar
                        onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                        value={selectedDate}
                        tileDisabled={({ date }) => !availableDays.includes(date.toISOString().split("T")[0])} // Cambiado aquí
                        tileClassName={({ date }) => availableDays.includes(date.toISOString().split("T")[0]) ? "available-day" : ""}
                        className="custom-calendar"
                    />
                </div>

                <div className="available-times">
                    <h5 className="text-center mb-3">
                        {selectedDate ? selectedDate.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long" }) : "Selecciona un día"}
                    </h5>
                    {selectedDate && availableTimes[selectedDate.toISOString().split("T")[0]]?.length > 0 ? (
                        availableTimes[selectedDate.toISOString().split("T")[0]].map((time, index) => (
                            <button
                                key={index}
                                className="btn btn-outline-success my-1 w-100"
                                style={{ padding: "14px 20px", fontSize: "16px", borderRadius: "12px" }}
                                onClick={() => handleSelectTime(time.hora_inicio, time.hora_fin)}
                            >
                                {`${time.hora_inicio} - ${time.hora_fin}`}
                            </button>
                        ))
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