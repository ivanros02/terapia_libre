// types/FormData.ts

export interface BaseFormData {
  nombre: string;
  titulo_universitario: string;
  matricula_nacional: string;
  matricula_provincial: string;
  cuit: string;
  descripcion: string;
  valor: string | number;
  valor_internacional: string | number;
  foto_perfil_url: string;
  cbu: string;
  condicion_fiscal?: string; // ← Opcional hasta migrar DB
  telefono: string;
}

export interface RegistrationFormData extends BaseFormData {
  correo_electronico: string;
  contrasena: string;
  especialidades: number[];
  condicion_fiscal: string; // ← Obligatorio en registro
}

export interface EditFormData extends BaseFormData {
  id_profesional: number;
  correo_electronico: string;
  creado_en: string;
  especialidades: {
    id_especialidad: number;
    nombre: string;
  }[];
}

// Factory functions
export const createBaseFormData = (): BaseFormData => ({
  nombre: "",
  titulo_universitario: "",
  matricula_nacional: "",
  matricula_provincial: "",
  cuit: "",
  descripcion: "",
  valor: "",
  valor_internacional: "",
  foto_perfil_url: "",
  cbu: "",
  condicion_fiscal: "",
  telefono: "",
});

export const createRegistrationFormData = (): RegistrationFormData => ({
  ...createBaseFormData(),
  correo_electronico: "",
  contrasena: "",
  especialidades: [],
  condicion_fiscal: "", // Obligatorio
});

export const createEditFormData = (): EditFormData => ({
  ...createBaseFormData(),
  id_profesional: 0,
  correo_electronico: "",
  creado_en: "",
  especialidades: [],
  valor: 0,
  valor_internacional: 0,
});