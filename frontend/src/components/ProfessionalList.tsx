import React, { useEffect, useState } from "react";
import axios from "axios";
import ProfessionalCard from "./ProfessionalCard";

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

  useEffect(() => {
    const fetchProfessionals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/profesionales");
        setProfessionals(response.data);
      } catch (error) {
        console.error("Error al obtener profesionales:", error);
      }
    };

    fetchProfessionals();
  }, []);

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

  return (
    <div className="container mt-4">
      <div className="row g-4">
        {filteredProfessionals.map((prof) => (
          <div key={prof.id_profesional} className="col-12 col-md-6 col-lg-3">
            <ProfessionalCard
              name={prof.nombre}
              image={prof.foto_perfil_url || "default-profile.jpg"}
              specialties={prof.especialidades.split(", ")}
              availability={prof.disponibilidad}
              price={`$${prof.valor}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProfessionalList;
