import { useState, useEffect } from "react";
import { RegistrationFormData, createRegistrationFormData } from "../../types/FormData";

export const useFormProfessional = () => {
  const [descripcionAviso, setDescripcionAviso] = useState("");
  const MAX_CARACTERES = 315;

  const [formData, setFormData] = useState<RegistrationFormData>(() => {
    const savedForm = localStorage.getItem("formProfesional");
    return savedForm ? JSON.parse(savedForm) : createRegistrationFormData();
  });

  useEffect(() => {
    localStorage.setItem("formProfesional", JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    if (e.target.type === "file") {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setFormData({ ...formData, foto_perfil_url: file.name });
      }
    } else {
      const { name, value } = e.target;

      if (name === "descripcion") {
        if (value.length > MAX_CARACTERES) {
          setDescripcionAviso(`⚠️ Has alcanzado el límite de ${MAX_CARACTERES} caracteres.`);
          return;
        } else {
          setDescripcionAviso("");
        }
      }

      setFormData({ ...formData, [name]: value });
    }
  };

  const handleEspecialidadChange = (selected: number[]) => {
    setFormData({ ...formData, especialidades: selected });
  };

  const clearForm = () => {
    localStorage.removeItem("formProfesional");
    setFormData(createRegistrationFormData());
  };

  return {
    formData,
    descripcionAviso,
    MAX_CARACTERES,
    handleChange,
    handleEspecialidadChange,
    clearForm,
  };
};