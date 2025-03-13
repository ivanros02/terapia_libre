import { useEffect, useState } from "react";
import axios from "axios";
import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";

const url = import.meta.env.VITE_API_BASE_URL;

const DashboardUsuario = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("id"); // 🔹 Obtener el ID almacenado en localStorage
        if (!userId) return;

        const token = localStorage.getItem("token"); // 🔹 Obtener el token de autenticación
        const response = await axios.get(`${url}/api/auth/usuario/${userId}`, {
          headers: { Authorization: `Bearer ${token}` }, // 🔒 Enviar el token en la cabecera
        });

        setUserName(response.data.nombre); // 🔹 Guardar el nombre del usuario en el estado
      } catch (error) {
        console.error("Error al obtener los datos del usuario:", error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="parent">
      <div className="div1">
        <SearchNavbar
          profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
          profileName={userName || "Usuario"} // 🔹 Mostrar el nombre del usuario o un valor por defecto
        />
      </div>
      <div className="div2">
        <Sidebar />
      </div>
    </div>
  );
};

export default DashboardUsuario;
