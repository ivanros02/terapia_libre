import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;

const EspecialidadSelect: React.FC<{ onChange: (selected: number[]) => void }> = ({ onChange }) => {
    const [especialidades, setEspecialidades] = useState<{ id_especialidad: number; nombre: string }[]>([]);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                const response = await axios.get(`${url}/api/especialidades`);
                setEspecialidades(response.data);
            } catch (error) {
                console.error("Error al cargar especialidades:", error);
            }
        };
        fetchEspecialidades();
    }, []);

    const handleCheckboxChange = (id: number) => {
        setSelectedEspecialidades((prev) => {
            const newSelected = prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id];
            onChange(newSelected);
            return newSelected;
        });
    };

    return (
        <Form.Group controlId="formEspecialidades" className="mb-3">
            <Form.Label>Selecciona una o varias especialidades</Form.Label>
            <div>
                {especialidades.map((esp) => (
                    <Form.Check
                        key={esp.id_especialidad}
                        type="checkbox"
                        label={esp.nombre}
                        value={esp.id_especialidad}
                        onChange={() => handleCheckboxChange(esp.id_especialidad)}
                        checked={selectedEspecialidades.includes(esp.id_especialidad)}
                    />
                ))}
            </div>
        </Form.Group>
    );
};

export default EspecialidadSelect;
