import React, { useEffect, useState } from "react";
const url = import.meta.env.VITE_API_BASE_URL;

interface Especialidad {
    id_especialidad: number;
    nombre: string;
}

interface EspecialidadFilterProps {
    selectedEspecialidad: string;
    setSelectedEspecialidad: (especialidad: string) => void;
}

const EspecialidadFilter: React.FC<EspecialidadFilterProps> = ({ selectedEspecialidad, setSelectedEspecialidad }) => {
    const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await fetch(`${url}/api/especialidades`);
                if (!response.ok) {
                    throw new Error("Error al obtener especialidades");
                }
                const data: Especialidad[] = await response.json();
                setEspecialidades(data);
            } catch (error) {
                console.error(error);
            }
        };

        fetchEspecialidades();
    }, []);

    return (
        <div className="col-12 col-md-4 mb-3">
            <label className="form-label fw-bold">Especialidad:</label>
            <select
                className="form-select rounded-pill text-dark fw-bold border-0 p-2"
                style={{ background: "rgba(171, 169, 166, 0.7)" }}
                value={selectedEspecialidad}
                onChange={(e) => setSelectedEspecialidad(e.target.value)}
            >
                <option value="">Todos &#x25BC;</option>
                {especialidades.map((especialidad) => (
                    <option key={especialidad.id_especialidad} value={especialidad.nombre}>
                        {especialidad.nombre}
                    </option>
                ))}


            </select>
        </div>
    );
};

export default EspecialidadFilter;
