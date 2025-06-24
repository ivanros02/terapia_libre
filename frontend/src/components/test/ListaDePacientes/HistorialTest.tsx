// Historial.tsx
import "./Historial.css";

function Historial() {
  return (
    <div className="historial">
      <div className="historial-card">
        <div className="lista-pacientes">
          <h3>Lista de pacientes</h3>
          <div className="paciente">
            <span>DJ</span>
            <div>
              <p>Agustina Perez</p>
              <small>Mensual</small>
            </div>
          </div>
          <div className="paciente">
            <span>SP</span>
            <div>
              <p>Sofia Perez</p>
              <small>Semanal</small>
            </div>
          </div>
          <div className="paciente">
            <span>AD</span>
            <div>
              <p>Ana Díaz</p>
              <small>Quincenal</small>
            </div>
          </div>
        </div>
        
        <div className="historia-clinica">
          <h3>Historia clínica</h3>
          <div className="paciente-info">
            <span>AP</span>
            <div>
              <p>Agustina Perez</p>
              <small>Mujer - 28 Años 3 Meses</small>
            </div>
          </div>
          <div className="consulta-info">
            <p><strong>Última consulta:</strong> 2 de Septiembre</p>
            <p><strong>Observaciones:</strong> Crisis de ansiedad</p>
            <p><strong>Detalles:</strong> Pidió una consulta con urgencia...</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Historial;