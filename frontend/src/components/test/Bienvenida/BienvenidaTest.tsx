// components/Bienvenida.tsx
import "./Bienvenida.css"

// Bienvenida.tsx
function Bienvenida() {
  return (
    <div className="bienvenida">
      <h2 className="titulo-superior">Buen día, Marcos!</h2>
      
      <div className="bienvenida-card">
        <div className="proximo-paciente">
          <h4>Próximo paciente</h4>
          <p>Agustina Perez - 04:00 PM</p>
        </div>
        <div className="pacientes-nuevos">
          <h4>Pacientes Nuevos</h4>
          <span>3</span>
        </div>
        <img 
          src="/tu-imagen.png" 
          alt="Decoración" 
          className="bienvenida-image"
        />
      </div>
    </div>
  );
}

export default Bienvenida;