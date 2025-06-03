export interface Turno {
    id_turno: number;
    fecha_turno: string;
    hora_turno: string;
    estado_turno: string;
    motivo_cancelacion?: string;
    meet_url?: string;
    meet_creado_en?: string;
    google_event_id_paciente?: string;
    google_event_id_profesional?: string;
    nombre_usuario: string;
    correo_usuario: string;
    telefono_usuario?: string;
    nombre_profesional: string;
    correo_profesional: string;
    valor_sesion?: number;
    monto?: number;
    monto_a_mostrar?: number;
    metodo_pago?: string;
    estado_pago?: string;
    id_transaccion?: string;
    fecha_pago?: string;
    tiene_pago_registrado?: string;
}

export interface DetallesTurno {
    id_turno: number;
    fecha_turno: string;
    hora_turno: string;
    estado: string;
    motivo_cancelacion?: string;
    meet_url?: string;
    meet_creado_en?: string;
    google_event_id_paciente?: string;
    google_event_id_profesional?: string;
    nombre_usuario: string;
    correo_usuario: string;
    telefono_usuario?: string;
    id_google_usuario?: string;
    nombre_profesional: string;
    correo_profesional: string;
    telefono_profesional?: string;
    valor: number;
    valor_sesion?: number;
    monto?: number;
    monto_a_mostrar?: number;
    metodo_pago?: string;
    estado_pago?: string;
    id_transaccion?: string;
    fecha_pago?: string;
    tiene_pago_registrado?: string;
}

export interface Filtros {
    estado: string;
    fecha_desde: string;
    fecha_hasta: string;
}
