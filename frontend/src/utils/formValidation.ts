interface FormData {
  [key: string]: any;
}

const requiredFields = [
  "nombre",
  "telefono",
  "correo_electronico",
  "contrasena",
  "titulo_universitario",
  "cuit",
  "descripcion",
  "valor",
  "valor_internacional",
  "cbu",
];

export const validateForm = (formData: FormData): boolean => {
  for (const field of requiredFields) {
    const fieldValue = formData[field];

    if (!fieldValue || 
        (typeof fieldValue === 'string' && fieldValue.trim() === "") ||
        (typeof fieldValue === 'number' && fieldValue === 0)) {
      return false;
    }
  }

  return true;
};

export const preventInvalidNumberInput = (e: React.KeyboardEvent) => {
  if (e.key === '.' || e.key === ',' || e.key === 'e' || e.key === '-' || e.key === '+') {
    e.preventDefault();
  }
};