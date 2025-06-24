import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfessionalCard from "./ProfessionalCard";
import "../../styles/Paginacion.css";
import LoadingSpinner from "../LoadingSpinner";
const url = import.meta.env.VITE_API_BASE_URL;

interface Professional {
  id_profesional: number;
  nombre: string;
  foto_perfil_url: string;
  especialidades: string;
  disponibilidad: string;
  valor: number;
}

interface ProfessionalListProps {
  selectedEspecialidad: string;
  selectedDisponibilidad: string;
  selectedOrden: string;
}

const ProfessionalList: React.FC<ProfessionalListProps> = ({
  selectedEspecialidad,
  selectedDisponibilidad,
  selectedOrden,
}) => {
  const [professionals, setProfessionals] = useState<Professional[]>([]);
  const [filteredProfessionals, setFilteredProfessionals] = useState<Professional[]>([]);
  const [currentPage, setCurrentPage] = useState(1); // Página actual
  const [totalPages, setTotalPages] = useState(1); // Total de páginas
  const [loading, setLoading] = useState(false);
  const [randomSeed, setRandomSeed] = useState(() => Math.floor(Math.random() * 1000));

  useEffect(() => {
    // Solo generar nuevo seed si NO hay orden por precio
    if (!selectedOrden || (selectedOrden !== "asc" && selectedOrden !== "desc")) {
      setRandomSeed(Math.floor(Math.random() * 1000));
    }
    setCurrentPage(1);
  }, [selectedEspecialidad, selectedDisponibilidad, selectedOrden]);

  useEffect(() => {
    const fetchProfessionals = async () => {
      setLoading(true); // ⏳ Empieza la carga
      try {
        const response = await axios.get(`${url}/api/profesionales`, {
          params: {
            page: currentPage,
            limit: 12,
            seed: randomSeed, // 🔹 Añade el seed aleatorio
            especialidad: selectedEspecialidad || undefined,
            disponibilidad: selectedDisponibilidad || undefined,
            orden: selectedOrden || undefined,
          },
        });
        setProfessionals(response.data.professionals);
        setTotalPages(response.data.totalPages);
      } catch (error) {
        console.error("Error al obtener profesionales:", error);
      } finally {
        setLoading(false); // ✅ Termina la carga
      }
    };

    fetchProfessionals();
  }, [currentPage, randomSeed]);
  
  useEffect(() => {
    let filtered = professionals;

    // Filtrar por especialidad
    if (selectedEspecialidad) {
      filtered = filtered.filter((prof) =>
        (prof.especialidades ? prof.especialidades.split(", ") : []).includes(selectedEspecialidad)
      );

    }

    // Filtrar por disponibilidad
    if (selectedDisponibilidad) {
      filtered = filtered.filter((prof) => prof.disponibilidad === selectedDisponibilidad);
    }

    // Ordenar por precio
    if (selectedOrden === "asc") {
      filtered = [...filtered].sort((a, b) => a.valor - b.valor);
    } else if (selectedOrden === "desc") {
      filtered = [...filtered].sort((a, b) => b.valor - a.valor);
    }

    setFilteredProfessionals(filtered);
  }, [selectedEspecialidad, selectedDisponibilidad, selectedOrden, professionals]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
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

    return fileId ? `https://lh3.googleusercontent.com/d/${fileId}=s220` : "https://definicion.de/wp-content/uploads/2019/07/perfil-de-usuario.png";
  };

  return (
    <div className="container mt-4 p-3">
      <div className="row g-4">
        {loading ? (
          <div className="d-flex justify-content-center my-4">
            <LoadingSpinner />
          </div>
        ) : (
          filteredProfessionals.map((prof) => (
            <div key={prof.id_profesional} className="col-6 col-md-6 col-lg-3">
              <ProfessionalCard
                id={prof.id_profesional}
                name={prof.nombre}
                image={getGoogleDriveImageUrl(prof.foto_perfil_url)}
                specialties={prof.especialidades ? prof.especialidades.split(", ") : []}
                availability={prof.disponibilidad || "No especificado"}
                price={`${prof.valor || 0}`}
              />
            </div>
          ))
        )}

      </div>

      {/* Paginación */}
      <div className="d-flex justify-content-center mt-4">
        <nav>
          <ul className="pagination pagination-sm"> {/* pagination-sm para un tamaño más pequeño */}
            {/* Botón "Anterior" */}
            <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage - 1)}
              >
                &laquo; {/* Icono de flecha izquierda */}
              </button>
            </li>

            {/* Mostrar solo 3 páginas a la vez */}
            {[...Array(totalPages)].map((_, index) => {
              const pageNumber = index + 1;

              // Mostrar solo las páginas cercanas a la página actual
              if (
                pageNumber === 1 || // Siempre mostrar la primera página
                pageNumber === totalPages || // Siempre mostrar la última página
                (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1) // Mostrar páginas cercanas
              ) {
                return (
                  <li
                    key={pageNumber}
                    className={`page-item ${currentPage === pageNumber ? "active" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(pageNumber)}
                    >
                      {pageNumber}
                    </button>
                  </li>
                );
              }

              // Mostrar "..." para indicar páginas ocultas
              if (pageNumber === currentPage - 2 || pageNumber === currentPage + 2) {
                return (
                  <li key={pageNumber} className="page-item disabled">
                    <span className="page-link">...</span>
                  </li>
                );
              }

              return null;
            })}

            {/* Botón "Siguiente" */}
            <li className={`page-item ${currentPage === totalPages ? "disabled" : ""}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(currentPage + 1)}
              >
                &raquo; {/* Icono de flecha derecha */}
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default ProfessionalList;