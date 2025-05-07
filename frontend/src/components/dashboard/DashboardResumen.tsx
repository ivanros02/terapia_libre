// src/components/DashboardResumen.tsx
import "../../styles/DashboardResumen.css";

const DashboardResumen = () => {
    return (
        <div className="dashboard-grid">
            <div className="total-facturado">
                <h6 className="titulo-base" style={{fontWeight:"700"}}>Total facturado</h6>
                <p>$1.980.000</p>
                <p>el último mes</p>
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


            <div className="ultimos-cobros">
                <h6>📋 Últimos cobros</h6>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Paciente</th>
                            <th>Fecha</th>
                            <th>Monto</th>
                            <th>Estado</th>
                            <th>Cobrado</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="text-danger"><td>Sofía Martínez</td><td>5/3/2025</td><td>$40.000</td><td>Pendiente</td><td>31/3/2025</td><td><a href="#">Detalles</a></td></tr>
                        <tr><td>Juan López</td><td>26/2/2025</td><td>$45.000</td><td>Acreditado</td><td>28/2/2025</td><td><a href="#">Detalles</a></td></tr>
                        <tr><td>Agustina Perez</td><td>26/2/2025</td><td>$50.000</td><td>Acreditado</td><td>28/2/2025</td><td><a href="#">Detalles</a></td></tr>
                    </tbody>
                </table>
            </div>

            <div className="tu-suscripcion">
                <h6 className="titulo-suscripcion">Tu suscripción</h6>
                <p><span className="label-bold">Plan:</span> Básico</p>
                <p><span className="label-bold">Monto:</span> $35.000</p>
                <p><span className="label-bold">Inicio:</span> 6/3/2025</p>
                <p><span className="label-bold">Próximo cobro:</span> 6/4/2025</p>

                <a href="#">Descargar facturas</a><br />
                <a href="#">Modificar suscripción</a>
            </div>
        </div>
    );
};

export default DashboardResumen;
