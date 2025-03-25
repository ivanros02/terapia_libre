import { useEffect, useState } from "react";
import { Table, Button, Pagination } from "react-bootstrap";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL;

interface Profesional {
  id_profesional: number;
  nombre: string;
  correo_electronico: string;
  disponibilidad: string;
  valor: number;
  estado: boolean;
  foto_perfil_url: string; // 🔹 Agregamos la URL de la imagen
}

const ProfesionalesListaAdmin = () => {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const maxPagesToShow = 5; // 🔹 Cantidad de páginas a mostrar en la paginación

  useEffect(() => {
    fetchProfesionales(currentPage);
  }, [currentPage]);

  const fetchProfesionales = async (page: number) => {
    try {
      const token = localStorage.getItem("adminToken");
      if (!token) {
        console.error("⚠️ No hay token disponible");
        return;
      }

      const response = await axios.get(`${url}/api/admin/profesionales?page=${page}&limit=12`, {
        headers: { Authorization: `Bearer ${token}` }, // 🔹 Enviar el token en los headers
      });

      const profesionalesConEstadoBooleano = response.data.professionals.map((prof: any) => ({
        ...prof,
        estado: prof.estado === 1,
      }));

      setProfesionales(profesionalesConEstadoBooleano);
      setTotalPages(response.data.totalPages);
    } catch (error) {

    }
  };



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

  // 🔹 Calcular las páginas a mostrar dinámicamente
  const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
  const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

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

                <td>{prof.nombre}</td>
                <td>{prof.correo_electronico}</td>
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

      {/* 🔹 Paginación Dinámica */}
      <Pagination className="justify-content-center">
        <Pagination.Prev
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        />

        {startPage > 1 && <Pagination.Ellipsis disabled />}

        {[...Array(endPage - startPage + 1)].map((_, index) => {
          const pageNumber = startPage + index;
          return (
            <Pagination.Item
              key={pageNumber}
              active={pageNumber === currentPage}
              onClick={() => setCurrentPage(pageNumber)}
            >
              {pageNumber}
            </Pagination.Item>
          );
        })}

        {endPage < totalPages && <Pagination.Ellipsis disabled />}

        <Pagination.Next
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        />
      </Pagination>
    </>
  );
};

export default ProfesionalesListaAdmin;
