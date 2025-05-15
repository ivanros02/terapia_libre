// src/components/DashboardResumen.tsx
import "../../styles/DashboardResumen.css";

const DashboardResumen = () => {
    const cobros = [
        {
            paciente: "Sofía Martínez",
            fecha: "5/3/2025",
            monto: "$40.000",
            estado: "Pendiente",
            cobrado: "31/3/2025",
            clase: "text-danger",
        },
        {
            paciente: "Juan López",
            fecha: "26/2/2025",
            monto: "$45.000",
            estado: "Acreditado",
            cobrado: "28/2/2025",
        },
        {
            paciente: "Agustina Perez",
            fecha: "26/2/2025",
            monto: "$50.000",
            estado: "Acreditado",
            cobrado: "28/2/2025",
        },
        {
            paciente: "Agustina Perez",
            fecha: "26/2/2025",
            monto: "$50.000",
            estado: "Acreditado",
            cobrado: "28/2/2025",
        },
        {
            paciente: "Agustina Perez",
            fecha: "26/2/2025",
            monto: "$50.000",
            estado: "Acreditado",
            cobrado: "28/2/2025",
        },
    ];


    return (
        <div className="dashboard-grid">
            <div className="total-facturado">
                <h6 className="titulo-total">Total facturado</h6>
                <p className="monto-total">$1.980.000.-</p>
                <p className="subtexto-total">el último mes</p>
            </div>


            <div className="card-base turnos-nuevos">
                <h6 className="titulo-base">Turnos nuevos</h6>
                <p className="numero-base">34</p>
                <p className="titulo-base">por atender</p>
            </div>

            <div className="card-base pacientes-atendidos">
                <h6 className="titulo-base">Pacientes atendidos</h6>
                <p className="numero-base">86</p>
                <p className="titulo-base">el último mes</p>
            </div>

            <div className="card-base total-a-facturar">
                <h6 className="titulo-verde titulo-base">Total a facturar</h6>
                <p className="numero-verde">$2.530.000</p>
                <p className="titulo-verde titulo-base">el último mes</p>
            </div>

            {/* Nueva estructura para suscripción */}
            <div className="contenedor-suscripcion">
                <h6 className="titulo-suscripcion">Tu suscripción</h6>
                <div className="tu-suscripcion">
                    <p><span className="label-bold">Plan:</span> Básico</p>
                    <p><span className="label-bold">Monto:</span> $35.000</p>
                    <p><span className="label-bold">Fecha de inicio:</span> 6/3/2025</p>
                    <p><span className="label-bold">Próximo cobro:</span> 6/4/2025</p>
                    <div className="acciones-suscripcion">
                        <a href="#">Descargar facturas</a><br />
                        <a href="#">Modificar suscripción</a>
                    </div>
                </div>
            </div>


            <div className="ultimos-cobros">
                <h6>Últimos cobros</h6>

                <div className="tabla-scroll">
                    <table className="table">
                        <tbody>
                            {cobros.map((item, index) => {
                                const isFirst = index === 0;
                                const isLast = index === cobros.length - 1;
                                const radiusClass = isFirst
                                    ? "fila-top"
                                    : isLast
                                        ? "fila-bottom"
                                        : "";

                                return (
                                    <tr key={index} className={`${item.clase || ""} ${radiusClass}`}>
                                        <td>{item.paciente}</td>
                                        <td>{item.fecha}</td>
                                        <td>{item.monto}</td>
                                        <td>{item.estado}</td>
                                        <td>{item.cobrado}</td>
                                        <td><a href="#">Detalles</a></td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>


        </div>
    );
};

export default DashboardResumen;
