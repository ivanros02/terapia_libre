import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
import ProfesionalForm from "../../dashboard/configProfesional/ProfesionalForm";
const url = import.meta.env.VITE_API_BASE_URL;
import { BsPencilSquare } from "react-icons/bs";

interface Profesional {
  id_profesional: number;
  nombre: string;
  correo_electronico: string;
  disponibilidad: string;
  valor: number;
  estado: boolean;
  foto_perfil_url: string; // 🔹 Agregamos la URL de la imagen
}

interface ProfesionalCompleto {
  id_profesional: number;
  nombre: string;
  titulo_universitario: string;
  matricula_nacional: string;
  matricula_provincial?: string | null;
  descripcion?: string | null;
  telefono?: string | null;
  disponibilidad: "24 horas" | "48 horas" | "72 horas" | "96 horas";
  correo_electronico: string;
  foto_perfil_url?: string | null;
  valor: number;
  valor_internacional: number;
  creado_en: string;
  especialidades: {
    id_especialidad: number;
    nombre: string;
  }[];
}


const ProfesionalesListaAdmin = () => {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [editingProfesional, setEditingProfesional] = useState<ProfesionalCompleto | null>(null);
  const [showModalEditar, setShowModalEditar] = useState(false);

  const handleEditarProfesional = async (id: number) => {
    try {
      const response = await axios.get(`${url}/api/profesionales/${id}`);
      setEditingProfesional(response.data); // contiene especialidades, valores, etc.
      setShowModalEditar(true);
    } catch (error) {
      console.error("❌ Error al cargar datos del profesional", error);
    }
  };

  const fetchProfesionales = async () => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("⚠️ No hay token disponible");
        return;
      }

      const response = await axios.get(`${url}/api/admin/profesionales`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const profesionalesConEstadoBooleano = response.data.professionals.map((prof: any) => ({
        ...prof,
        estado: prof.estado === 1,
      }));

      setProfesionales(profesionalesConEstadoBooleano);
    } catch (error) {
      console.error("❌ Error al obtener profesionales:", error);
    }
  };

  // 🔹 Llamar a fetchProfesionales cuando se monte el componente
  useEffect(() => {
    fetchProfesionales();
  }, []);

  const toggleEstado = async (id: number, estado: boolean) => {
    try {
      const nuevoEstado = !estado;
      await axios.put(`${url}/api/profesionales/${id}`, { estado: nuevoEstado ? 1 : 0 });

      setProfesionales((prevProfesionales) =>
        prevProfesionales.map((prof) =>
          prof.id_profesional === id ? { ...prof, estado: nuevoEstado } : prof
        )
      );
    } catch (error) {
      console.error("Error updating estado", error);
    }
  };


  const getGoogleDriveImageUrl = (url: string) => {
    if (!url) return "/placeholder.jpg"; // 🔹 Si no hay URL, muestra un placeholder

    let fileId = "";

    // Detectar diferentes formatos de URL de Google Drive
    if (url.includes("/d/")) {
      fileId = url.split("/d/")[1]?.split("/")[0]; // Extraer ID de formato "/d/"
    } else if (url.includes("id=")) {
      fileId = url.split("id=")[1]?.split("&")[0]; // Extraer ID de formato "id="
    }

    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s220` : "/placeholder.jpg";
  };


  return (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Foto</th>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Disponibilidad</th>
            <th>Valor</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesionales.length > 0 ? (
            profesionales.map((prof) => (
              <tr key={prof.id_profesional}>
                <td>{prof.id_profesional}</td>
                <td>
                  <img
                    src={getGoogleDriveImageUrl(prof.foto_perfil_url)}
                    alt={prof.nombre}
                    style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "50%" }}
                  />
                </td>

                <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{prof.nombre}</td>
                <td style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{prof.correo_electronico}</td>
                <td>{prof.disponibilidad}</td>
                <td>${Number(prof.valor).toFixed(2)}</td>
                <td>{prof.estado ? "Activo" : "Inactivo"}</td>
                <td>
                  <Button
                    variant={prof.estado ? "danger" : "success"}
                    onClick={() => toggleEstado(prof.id_profesional, prof.estado)}
                  >
                    {prof.estado ? "Desactivar" : "Activar"}
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="sm"
                    title="Editar profesional"
                    onClick={() => handleEditarProfesional(prof.id_profesional)}
                  >
                    <BsPencilSquare />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8} className="text-center">No hay profesionales registrados</td>
            </tr>
          )}
        </tbody>
      </Table>

      {editingProfesional && (
        <ProfesionalForm
          show={showModalEditar}
          handleClose={() => setShowModalEditar(false)}
          profesional={editingProfesional}
          onSave={() => {
            fetchProfesionales(); // actualiza la tabla
            setShowModalEditar(false);
          }}
          fetchProfesionalData={fetchProfesionales} // o podés dejarlo vacío si no lo usás
        />
      )}


    </>
  );
};

export default ProfesionalesListaAdmin;
