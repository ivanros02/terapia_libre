import React, { useState } from "react";
import { Card, Button, Container } from "react-bootstrap";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import moment, { Moment } from "moment";
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
        <Container fluid style={{paddingBottom:"25px"}}>
            <Card className="shadow-sm p-3 rounded-4">
                <h1>Calendario</h1>
                {/* Encabezado con botones de navegación */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <Button variant="light" size="sm" onClick={() => cambiarMes(-1)}>
                        <FaChevronLeft />
                    </Button>
                    <h6 className="m-0">{fechaActual.format("MMMM YYYY")}</h6>
                    <Button variant="light" size="sm" onClick={() => cambiarMes(1)}>
                        <FaChevronRight />
                    </Button>
                </div>

                {/* Días de la semana */}
                <div className="d-flex justify-content-around text-muted small">
                    {diasSemana.map((dia, index) => (
                        <div key={index} style={{ width: "14%", textAlign: "center" }}>
                            {dia}
                        </div>
                    ))}
                </div>

                {/* Días del mes */}
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
                                    <div
                                        style={{
                                            width: "6px",
                                            height: "6px",
                                            backgroundColor: "red",
                                            borderRadius: "50%",
                                            position: "absolute",
                                            bottom: "3px",
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                        }}
                                    ></div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Línea divisoria */}
                <hr className="my-2" />

                {/* Lista de Próximos Turnos */}
                <h6 className="text-muted mb-2">Próximos Turnos</h6>
                <div className="d-flex flex-column">
                    {proximosTurnos.length > 0 ? (
                        proximosTurnos.map((turno, index) => (
                            <div key={index} className="d-flex align-items-center p-2 rounded mb-1 " style={{backgroundColor:"#ece2c6"}}>
                                <div
                                    className="rounded-circle bg-secondary text-white text-center proxTurno"
                                    style={{ width: "30px", height: "30px", lineHeight: "30px", fontSize: "12px" }}
                                >
                                    {turno.paciente ? turno.paciente.charAt(0).toUpperCase() : "?"}
                                </div>
                                <div className="ms-2 ">
                                    <span className="fw-bold" >{turno.paciente}</span>
                                    <br />
                                    <span className="text-muted small">
                                        {moment(turno.fecha).format("DD/MM/YYYY")}
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-muted small">No hay turnos programados.</p>
                    )}
                </div>
            </Card>

        </Container>

    );
};

export default CalendarioTurnos;
