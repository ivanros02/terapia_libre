export interface Profesional {
    id_profesional: number;
    nombre: string;
    titulo_universitario: string;
    matricula_nacional: string;
    matricula_provincial?: string | null;
    descripcion?: string | null;
    telefono?: string | null;
    correo_electronico: string;
    foto_perfil_url?: string | null;
    valor: number;
    valor_internacional: number;
    cbu?: string | null;
    cuit?: string | null;
    creado_en: string;
    especialidades: {
        id_especialidad: number;
        nombre: string;
    }[];
}