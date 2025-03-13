import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfessionalCard from "./ProfessionalCard";
import "../styles/Paginacion.css";
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

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get(`${url}/api/profesionales`, {
          params: {
            page: currentPage,
            limit: 12, // Límite de 10 profesionales por página
          },
        });
        setProfessionals(response.data.professionals);
        setTotalPages(response.data.totalPages); // Total de páginas desde el backend
      } catch (error) {
        console.error("Error al obtener profesionales:", error);
      }
    };

    fetchProfessionals();
  }, [currentPage]); // Recargar datos cuando cambie la página

  useEffect(() => {
    let filtered = professionals;

    // Filtrar por especialidad
    if (selectedEspecialidad) {
      filtered = filtered.filter((prof) =>
        prof.especialidades.split(", ").includes(selectedEspecialidad)
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

  return (
    <div className="container mt-4 p-3">
      <div className="row g-4">
        {filteredProfessionals.map((prof) => (
          <div key={prof.id_profesional} className="col-12 col-md-6 col-lg-3">
            <ProfessionalCard
              id={prof.id_profesional} // Pasamos el ID del profesional
              name={prof.nombre}
              image={prof.foto_perfil_url || "default-profile.jpg"}
              specialties={prof.especialidades.split(", ")}
              availability={prof.disponibilidad}
              price={`$${prof.valor}`}
            />
          </div>
        ))}
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