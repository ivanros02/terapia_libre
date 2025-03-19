import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importamos useNavigate
import { House, Calendar, MessageCircle, Settings, LogOut } from "lucide-react";
import { useSocket } from "../../context/SocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/SideBar.css";
import axios from 'axios';
import { Link } from "react-router-dom"; // 👈 Importamos Link

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // 👈 Hook para redirigir
  const socket = useSocket();
  const [hasNewMessages, setHasNewMessages] = useState(false);
  const [chatId] = useState<number | null>(null);
  const userId = localStorage.getItem("id");
  // Obtener si es profesional o usuario
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

  // Función para marcar los mensajes como leídos al entrar a la pantalla de mensajes
  const handleMessagesClick = () => {
    setHasNewMessages(false);
    navigate("/messages");
  };

  // 🔹 Escuchar eventos de notificación de mensajes en todo momento
  useEffect(() => {
    if (socket && userId) {
      console.log("📡 Sidebar escuchando notificaciones para usuario:", userId);

      socket.on("notification", (data) => {
        console.log("🔔 Notificación recibida en Sidebar:", data);

        if (data.senderId !== parseInt(userId)) {
          console.log("✅ Activando el punto rojo en el sidebar...");
          setHasNewMessages((prev) => {
            console.log("🔴 Estado previo de hasNewMessages:", prev);
            return true;
          });
        }
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [socket, userId]);



  useEffect(() => {
    if (chatId !== null && userId) {
      const marcarMensajesComoLeidos = async () => {
        try {
          await axios.put(`${import.meta.env.VITE_API_BASE_URL}/api/chat/${chatId}/marcar-leidos`, {
            userId: parseInt(userId),
          });
          console.log("✅ Mensajes marcados como leídos en el chat", chatId);
        } catch (error) {
          console.error("❌ Error al marcar los mensajes como leídos:", error);
        }
      };

      marcarMensajesComoLeidos();
    }
  }, [chatId, userId]); // 🔹 `c

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
        <img src="/logo.png" alt="Logo" />
      </div>
    </div>
  );
};

export default Sidebar;
