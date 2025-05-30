import React, { useState, useEffect } from "react";
import { Form } from "react-bootstrap";
import axios from "axios";

const url = import.meta.env.VITE_API_BASE_URL;

const EspecialidadSelectEditable: React.FC<{ 
    onChange: (selected: number[]) => void,
    selectedEspecialidades: number[]
}> = ({ onChange, selectedEspecialidades }) => {

    const [especialidades, setEspecialidades] = useState<{ id_especialidad: number; nombre: string }[]>([]);
    const [selected, setSelected] = useState<number[]>([]); // 🔹 Estado local

    // 🔹 Cargar todas las especialidades desde la API
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

    // 🔹 Sincronizar especialidades seleccionadas cuando cambia el modal
    useEffect(() => {
        console.log("Especialidades seleccionadas recibidas (IDs):", selectedEspecialidades);
        if (selectedEspecialidades.length > 0) {
            setSelected(selectedEspecialidades);
        }
    }, [selectedEspecialidades]);
    

    const handleCheckboxChange = (id: number) => {
        const updatedSelection = selected.includes(id)
            ? selected.filter((item) => item !== id) // Quitar si ya estaba seleccionado
            : [...selected, id]; // Agregar si no estaba seleccionado

        setSelected(updatedSelection);
        onChange(updatedSelection); // 🔹 Enviar cambios a `ProfesionalForm.tsx`
    };

    return (
        <Form.Group controlId="formEspecialidades" className="mb-3">
            <Form.Label>Selecciona una o varias especialidades</Form.Label>
            <div>
                {especialidades.length === 0 ? (
                    <p>Cargando especialidades...</p>
                ) : (
                    especialidades.map((esp) => (
                        <Form.Check
                            key={esp.id_especialidad}
                            type="checkbox"
                            label={esp.nombre}
                            value={esp.id_especialidad}
                            onChange={() => handleCheckboxChange(esp.id_especialidad)}
                            checked={selected.includes(esp.id_especialidad)} // 🔹 Se asegura que aparezcan marcadas
                        />
                    ))
                )}
            </div>
        </Form.Group>
    );
};

export default EspecialidadSelectEditable;