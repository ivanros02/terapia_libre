import React from "react";
import EspecialidadFilter from "./EspecialidadFilter";

interface FilterBarProps {
  selectedEspecialidad: string;
  setSelectedEspecialidad: (especialidad: string) => void;
  selectedDisponibilidad: string;
  setSelectedDisponibilidad: (disponibilidad: string) => void;
  selectedOrden: string;
  setSelectedOrden: (orden: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  selectedEspecialidad,
  setSelectedEspecialidad,
  //selectedDisponibilidad,
  //setSelectedDisponibilidad,
  selectedOrden,
  setSelectedOrden,
}) => {
  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        {/* Especialidad */}
        <EspecialidadFilter selectedEspecialidad={selectedEspecialidad} setSelectedEspecialidad={setSelectedEspecialidad} />

        {/* Disponibilidad 
        
        <div className="col-12 col-md-4 mb-3">
          <label className="form-label fw-bold">Disponibilidad:</label>
          <select
            className="form-select rounded-pill fw-bold text-dark border-0 p-2"
            style={{ background: "rgba(171, 169, 166, 0.7)" }}
            value={selectedDisponibilidad}
            onChange={(e) => setSelectedDisponibilidad(e.target.value)}
          >
            <option value="">Todas las disponibilidades &#x25BC;</option>
            <option value="24 horas">24 Horas</option>
            <option value="48 horas">48 Horas</option>
            <option value="72 horas">72 Horas</option>
            <option value="96 horas">96 Horas</option>
          </select>
        </div>
        */}
        

        {/* Ordenar por */}
        <div className="col-12 col-md-4 mb-3">
          <label className="form-label fw-bold">Ordenar por:</label>
          <select
            className="form-select rounded-pill fw-bold text-dark border-0 p-2"
            style={{ background: "rgba(171, 169, 166, 0.7)" }}
            value={selectedOrden}
            onChange={(e) => setSelectedOrden(e.target.value)}
          >
            <option value="">Sin orden &#x25BC;</option>
            <option value="asc">Menor precio</option>
            <option value="desc">Mayor precio</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
