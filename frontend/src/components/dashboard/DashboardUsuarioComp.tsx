import { useEffect, useState } from "react";
import axios from "axios";

const DashboardUsuarioComp = () => {
  const [usuario, setUsuario] = useState<{ nombre: string; correo_electronico: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsuarioData = async () => {
      try {
        const id = localStorage.getItem("id"); // Obtener el ID del localStorage
        const token = localStorage.getItem("token"); // Obtener el token

        if (!id || !token) {
          throw new Error("No se encontró el ID o el token de autenticación.");
        }

        // Hacer la solicitud a la API para obtener los datos del usuario
        const response = await axios.get(`http://localhost:5000/api/auth/usuario/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Enviar el token en el header
          },
        });

        setUsuario(response.data); // Guardar los datos del usuario
      } catch (error: any) {
        setError(error.message || "Error al obtener los datos del usuario.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsuarioData();
  }, []);

  if (loading) {
    return <div>Cargando...</div>; // Mostrar un mensaje de carga
  }

  if (error) {
    return <div>Error: {error}</div>; // Mostrar un mensaje de error
  }

  return (
    <div className="dashboard-usuario">
      <h1>¡Hola, {usuario?.nombre}! 👋</h1>
      <p>Bienvenido a tu dashboard.</p>
      <p>Correo electrónico: {usuario?.correo_electronico}</p>
    </div>
  );
};

export default DashboardUsuarioComp;