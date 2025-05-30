import React, { useState, useEffect } from "react";
import { Form, Alert } from "react-bootstrap";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;
import LoadingSpinner from "./LoadingSpinner";

const EspecialidadSelect: React.FC<{ onChange: (selected: number[]) => void }> = ({ onChange }) => {
    const [especialidades, setEspecialidades] = useState<{ id_especialidad: number; nombre: string }[]>([]);
    const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);
    const [loading, setLoading] = useState(true); // ✅ NUEVO
    const [error, setError] = useState<string | null>(null); // ✅ NUEVO

    useEffect(() => {
        const fetchEspecialidades = async () => {
            try {
                setLoading(true);
                const [response] = await Promise.all([
                    axios.get(`${url}/api/especialidades`, { timeout: 10000 })
                ]);
                setEspecialidades(response.data);
                setError(null);
            } catch (error: any) {
                console.error("Error al cargar especialidades:", error);
                setError("No se pudieron cargar las especialidades. Intenta nuevamente más tarde.");
            } finally {
                setLoading(false);
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

            {loading ? (
                <LoadingSpinner />
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : (
                <div className="row">
                    {especialidades.map((esp) => (
                        <div key={esp.id_especialidad} className="col-12 col-md-6 col-lg-6 mb-2">
                            <Form.Check
                                type="checkbox"
                                label={esp.nombre}
                                value={esp.id_especialidad}
                                onChange={() => handleCheckboxChange(esp.id_especialidad)}
                                checked={selectedEspecialidades.includes(esp.id_especialidad)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </Form.Group>

    );
};

export default EspecialidadSelect;
