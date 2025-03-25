import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importamos useNavigate
import { House, Calendar, MessageCircle, Settings, LogOut } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/SideBar.css";
import { Link } from "react-router-dom"; // 👈 Importamos Link

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // 👈 Hook para redirigir
  const socket = useSocket();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const userId = localStorage.getItem("id");
  const esProfesional = localStorage.getItem("esProfesional") === "true";
  const homeRoute = esProfesional ? "/dashboard/profesional" : "/dashboard/usuario";
  const configRoute = esProfesional ? "/dashboard/profesional/config_profesional" : "/dashboard/usuario/config_usuario";

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("token"); // Eliminar token
    localStorage.removeItem("id"); // Eliminar ID del usuario
    localStorage.removeItem("esProfesional"); // Eliminar rol
    navigate("/login"); // Redirigir a la página de login
  };

  // Función para navegar correctamente a Home
  const handleHomeClick = () => {
    navigate(homeRoute);
  };

  // Función para navegar correctamente a Config
  const handleConfigClick = () => {
    navigate(configRoute);
  };

  // 🔹 Unir el usuario a su sala personal de Socket.io al cargar la app
  useEffect(() => {
    if (socket && userId) {
      socket.emit("join_user", userId);
    }
  }, [socket, userId]);

  // 🔹 Escuchar notificaciones de nuevos mensajes
  useEffect(() => {
    if (!socket || !userId) return;

    const handleNotification = (data: any) => {
      console.log("🔔 Notificación recibida en Sidebar:", data);
      setHasNewMessages(true);
    };

    socket.on("notification", handleNotification);

    return () => {
      socket.off("notification", handleNotification);
    };
  }, [socket, userId]);

  // 🔹 Marcar mensajes como leídos al hacer clic en el botón de mensajes
  const handleMessagesClick = async () => {
    setHasNewMessages(false);
    navigate("/messages");
  };


  return (
    <div className="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <button onClick={handleHomeClick} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <House size={24} />
          </button>
        </li>

        <li className="nav-item">
          <Link to="/dashboard/calendario" className="nav-link text-white py-3">
            <Calendar size={24} />
          </Link>
        </li>

        <li className="nav-item position-relative">
          <button onClick={handleMessagesClick} className="nav-link text-white py-3 bg-transparent border-0 w-100 position-relative">
            <MessageCircle size={24} />
            {hasNewMessages && (
              <span
                className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
                style={{ width: "10px", height: "10px", display: "inline-block" }}
              />
            )}
          </button>
        </li>

        <li className="nav-item">
          <button onClick={handleConfigClick} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <Settings size={24} />
          </button>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <LogOut size={24} />
          </button>
        </li>
      </ul>
      <div className="sidebar-logo">
        <Link to="/">
          <img src="/logo.png" alt="Logo" style={{ cursor: "pointer" }} />
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;
