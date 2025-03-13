import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";

interface Disponibilidad {
    [key: string]: { hora_inicio: string; hora_fin: string }[];
}

interface CalendarAvailabilityProps {
    id_profesional: number;
    showModal: boolean;
}

const CalendarAvailability: React.FC<CalendarAvailabilityProps> = ({ id_profesional, showModal }) => {
    const [availableDays, setAvailableDays] = useState<string[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [availableTimes, setAvailableTimes] = useState<Disponibilidad>({});

    const url = import.meta.env.VITE_API_BASE_URL;

    useEffect(() => {
        const fetchAvailability = async () => {
            try {
                const response = await axios.get(`${url}/disponibilidad/horas?id_profesional=${id_profesional}`);
                setAvailableDays(Object.keys(response.data));
                setAvailableTimes(response.data);
            } catch (error) {
                console.error("Error al obtener disponibilidad:", error);
            }
        };

        if (showModal) fetchAvailability();
    }, [showModal, id_profesional]);

    // Convertir el día seleccionado a texto con la primera letra en mayúscula
    const obtenerDiaSemana = (fecha: Date): string => {
        return new Intl.DateTimeFormat("es-ES", { weekday: "long" })
            .format(fecha)
            .replace(/^\w/, (c) => c.toUpperCase()); // Corrige la capitalización
    };

    const handleDateChange = async (value: Date | Date[] | null) => {
        if (!value || Array.isArray(value)) return;
        const diaSeleccionado = obtenerDiaSemana(value);
        setSelectedDate(value);

        try {
            const response = await axios.get(`${url}/disponibilidad/horas?id_profesional=${id_profesional}`);
            const disponibilidad = response.data;

            if (!disponibilidad[diaSeleccionado]) {
                setAvailableTimes({});
                return;
            }

            setAvailableTimes({ [diaSeleccionado]: disponibilidad[diaSeleccionado] });
        } catch (error) {
            console.error("Error al obtener disponibilidad:", error);
        }
    };

    return (
        <>
            <Calendar
                onChange={(value) => handleDateChange(value as Date | Date[] | null)}
                value={selectedDate}
                tileDisabled={({ date }) => {
                    const dia = obtenerDiaSemana(date);
                    return !availableDays.includes(dia);
                }}
            />

            {selectedDate && (
                <div className="mt-3">
                    <label className="fw-bold">Horarios disponibles:</label>
                    <select className="form-control" value={selectedTime || ""} onChange={(e) => setSelectedTime(e.target.value)}>
                        <option value="">Selecciona un horario</option>
                        {availableTimes[obtenerDiaSemana(selectedDate) as keyof Disponibilidad]?.map((time, index) => (
                            <option key={index} value={`${time.hora_inicio}-${time.hora_fin}`}>
                                {`${time.hora_inicio} - ${time.hora_fin}`}
                            </option>
                        ))}
                    </select>
                </div>
            )}
        </>
    );
};

export default CalendarAvailability;