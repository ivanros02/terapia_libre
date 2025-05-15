import React, { useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moment, { Moment } from "moment";
import "../../styles/CalendarioTurnos.css";

moment.locale("es");

interface Turno {
    fecha: string;
    paciente: string;
}

interface CalendarioTurnosProps {
    eventos: string[]; // Fechas con punto rojo en formato YYYY-MM-DD
    proximosTurnos: Turno[];
}

const CalendarioTurnos: React.FC<CalendarioTurnosProps> = ({
    eventos,
    proximosTurnos,
}) => {
    const [fechaActual, setFechaActual] = useState<Moment>(moment());

    const cambiarMes = (cantidad: number) => {
        setFechaActual(moment(fechaActual).add(cantidad, "months"));
    };

    const generarCalendario = (): Moment[] => {
        const inicioMes = moment(fechaActual).startOf("month");
        const finMes = moment(fechaActual).endOf("month");
        const inicioSemana = moment(inicioMes).startOf("week");
        const finSemana = moment(finMes).endOf("week");

        let dias: Moment[] = [];
        let dia = moment(inicioSemana);

        while (dia.isBefore(finSemana) || dia.isSame(finSemana, "day")) {
            dias.push(moment(dia));
            dia.add(1, "day");
        }

        return dias;
    };

    const diasSemana: string[] = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    const eventosNormalizados = eventos.map(fecha => moment(fecha).format("YYYY-MM-DD"));

    return (
        <Container fluid className="calendario-container">

            <Card className="shadow-sm p-3 rounded-4 card-calendario">
                {/* 🔹 Solo se muestra en pantallas medianas en adelante */}
                <div className="d-none d-md-block">
                    <h1 className="titulo-calendario">Calendario</h1>

                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <Button variant="light" size="sm" onClick={() => cambiarMes(-1)}>
                            <FaChevronLeft />
                        </Button>
                        <h6 className="m-0">{fechaActual.format("MMMM YYYY")}</h6>
                        <Button variant="light" size="sm" onClick={() => cambiarMes(1)}>
                            <FaChevronRight />
                        </Button>
                    </div>

                    <div className="d-flex justify-content-around text-muted small">
                        {diasSemana.map((dia, index) => (
                            <div key={index} className="calendario-dia-header">
                                {dia}
                            </div>
                        ))}
                    </div>

                    <div className="d-flex flex-wrap">
                        {generarCalendario().map((dia, index) => {
                            const esDelMes = dia.month() === fechaActual.month();
                            const tieneEvento = eventosNormalizados.includes(dia.format("YYYY-MM-DD"));

                            return (
                                <div
                                    key={index}
                                    className={`text-center small fw-bold ${esDelMes ? "text-dark" : "text-muted"}`}
                                    style={{ width: "14%", position: "relative", padding: "5px" }}
                                >
                                    {dia.date()}
                                    {tieneEvento && (
                                        <div className="calendario-evento"></div>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    <hr className="my-2" />
                </div>

                {/* 🔹 Siempre visible, incluso en móvil */}
                <div className="d-block">
                    <h6 className="mb-2 proxtitulo">Próximos Turnos</h6>
                    <div className="d-flex flex-column">
                        {proximosTurnos.length > 0 ? (
                            proximosTurnos.map((turno, index) => (
                                <div key={index} className="d-flex align-items-center p-2 rounded mb-1 prox-turno-contenedor">
                                    <div className="rounded-circle text-white text-center proxTurno d-none d-md-flex">
                                        {turno.paciente ? turno.paciente.charAt(0).toUpperCase() : "?"}
                                    </div>
                                    <div className="ms-2 d-flex flex-row flex-md-column justify-content-between w-100">
                                        <span className="fw-bold" style={{ fontSize: "16.39px" }}>{turno.paciente}</span>
                                        <span className="fecha-prox-turno text-end text-md-start">
                                            {moment(turno.fecha).locale("es").format("D [de] MMMM")}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-center text-muted small">No hay turnos programados.</p>
                        )}
                    </div>
                </div>
            </Card>
        </Container>

    );
};

export default CalendarioTurnos;
