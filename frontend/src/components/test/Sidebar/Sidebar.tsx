// components/Sidebar.tsx
import './Sidebar.css';

function Sidebar() {
  return (
    <div className="sidebar">
      <nav className="sidebar-nav">
        <button className="nav-item-dashboard">
          <img src="/sidebar/home.svg" alt="Dashboard" />
        </button>
        <button className="nav-item-dashboard">
          <img src="/sidebar/calendar.svg" alt="Calendario" />
        </button>
        <button className="nav-item-dashboard">
          <img src="/sidebar/chats.svg" alt="Pacientes" />
        </button>
        <button className="nav-item-dashboard">
          <img src="/sidebar/estadisticas.svg" alt="Citas" />
        </button>
        <button className="nav-item-dashboard">
          <img src="/sidebar/settings.svg" alt="Configuración" />
        </button>
        <button className="nav-item-dashboard">
          <img src="/sidebar/logout.svg" alt="Salir" />
        </button>
      </nav>
      
      <div className="sidebar-logo">
        <img src="/logo.png" alt="Logo" />
      </div>
    </div>
  );
}

export default Sidebar;