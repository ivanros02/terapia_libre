import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // 👈 Importamos useNavigate
import { useSocket } from "../../context/SocketContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../../styles/Sidebar.css";
import { Link } from "react-router-dom"; // 👈 Importamos Link
declare global {
  interface Window {
    google?: {
      accounts?: {
        id?: {
          disableAutoSelect?: () => void;
        };
      };
    };
  }
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate(); // 👈 Hook para redirigir
  let socket;
  try {
    socket = useSocket();
  } catch (error) {
    console.warn("⚠️ Sidebar cargado antes de que el SocketProvider esté listo.");
    socket = null;
  }

  //const [hasNewMessages, setHasNewMessages] = useState(false);
  const userId = localStorage.getItem("id");
  const esProfesional = localStorage.getItem("esProfesional") === "true";
  const homeRoute = esProfesional ? "/dashboard/profesional" : "/dashboard/usuario";
  const configRoute = esProfesional ? "/dashboard/profesional/config_profesional" : "/dashboard/usuario/config_usuario";


  // Función para cerrar sesión
  const handleLogout = async () => {
    const isGoogle = localStorage.getItem("isGoogleLogin") === "true";
    const googleToken = localStorage.getItem("google_token");

    if (isGoogle && googleToken) {
      try {
        await fetch(`https://oauth2.googleapis.com/revoke?token=${googleToken}`, {
          method: "POST",
          headers: {
            "Content-type": "application/x-www-form-urlencoded",
          },
        });
      } catch (error) {
        console.warn("Error al revocar token de Google:", error);
      }
    }

    // Limpiar todo
    localStorage.clear();
    navigate("/login");
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
  /*
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
  */

  // 🔹 Marcar mensajes como leídos al hacer clic en el botón de mensajes
  /*
  const handleMessagesClick = async () => {
    setHasNewMessages(false);
    navigate("/messages");
  };
  */

  return (
    <div className="sidebar">
      <ul className="nav">
        <li className="nav-item">
          <button onClick={handleHomeClick} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <img src="/sidebar/home.png" alt="Home" width="24" height="24" />
          </button>
        </li>

        <li className="nav-item">
          <Link to="/dashboard/calendario" className="nav-link text-white py-3">
            <img src="/sidebar/calendar.png" alt="Home" width="24" height="24" />
          </Link>
        </li>

        {/* 
        <li className="nav-item position-relative">
          <button onClick={handleMessagesClick} className="nav-link text-white py-3 bg-transparent border-0 w-100 position-relative">
            <img src="/sidebar/chat.png" alt="Home" width="24" height="24" />
            {hasNewMessages && (
              <span
                className="position-absolute top-0 start-100 translate-middle p-2 bg-danger border border-light rounded-circle"
                style={{ width: "10px", height: "10px", display: "inline-block" }}
              />
            )}
          </button>
        </li>
        */}

        <li className="nav-item">
          <button onClick={handleConfigClick} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <img src="/sidebar/config.png" alt="Home" width="24" height="24" />
          </button>
        </li>
        <li className="nav-item">
          <button onClick={handleLogout} className="nav-link text-white py-3 bg-transparent border-0 w-100">
            <img src="/sidebar/out.png" alt="Home" width="24" height="24" />
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
