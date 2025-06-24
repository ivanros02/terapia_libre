// components/Calendario.tsx
import './Calendario.css';

function Calendario() {
  return (
    <div className="calendario">
      <h3>Calendario</h3>
      <p>Septiembre 2022</p>
      <div className="calendario-grid">
        <div>L</div>
        <div>M</div>
        <div>X</div>
        <div>J</div>
        <div>V</div>
        <div>S</div>
        <div>D</div>
      </div>
      <h4>Próximos turnos</h4>
      <div className="turno">
        <span>A</span>
        <p>Agustina Perez - 04:00 PM</p>
      </div>
    </div>
  );
}

export default Calendario;