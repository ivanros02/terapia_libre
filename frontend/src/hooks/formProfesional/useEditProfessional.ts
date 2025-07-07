import { useState, useEffect } from "react";
import { EditFormData, createEditFormData } from "../../types/FormData";
import { Profesional } from "../../types/Profesional";

export const useEditProfessional = (profesional: Profesional | null) => {
    const [formData, setFormData] = useState<EditFormData>(() => createEditFormData());
    const [selectedEspecialidades, setSelectedEspecialidades] = useState<number[]>([]);

    useEffect(() => {
        if (profesional) {
            setFormData({
                ...createEditFormData(),
                id_profesional: profesional.id_profesional,
                nombre: profesional.nombre,
                titulo_universitario: profesional.titulo_universitario,
                matricula_nacional: profesional.matricula_nacional,
                matricula_provincial: profesional.matricula_provincial || "",
                cuit: profesional.cuit || "",
                descripcion: profesional.descripcion || "",
                valor: profesional.valor,
                valor_internacional: profesional.valor_internacional,
                foto_perfil_url: profesional.foto_perfil_url || "",
                cbu: profesional.cbu || "",
                condicion_fiscal: profesional.condicion_fiscal || "",
                telefono: profesional.telefono || "",
                correo_electronico: profesional.correo_electronico,
                creado_en: profesional.creado_en,
                especialidades: profesional.especialidades,
            });
            setSelectedEspecialidades(profesional.especialidades.map(e => e.id_especialidad));
        }
    }, [profesional]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleEspecialidadChange = (selected: number[]) => {
        setSelectedEspecialidades(selected);
    };

    return {
        formData,
        selectedEspecialidades,
        handleChange,
        handleEspecialidadChange,
    };
};