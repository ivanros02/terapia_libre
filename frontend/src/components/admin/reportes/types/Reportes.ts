export interface ReporteData {
    turnos_totales: number;
    turnos_completados: number;
    turnos_cancelados: number;
    ingresos_totales: number;
    ingresos_promedio: number;
    profesionales_activos: number;
    usuarios_nuevos: number;
    tasa_conversion: number;
}

export interface ResumenPeriodo {
    fecha: string;
    turnos: number;
    ingresos: number;
    nuevos_usuarios: number;
}

export interface FiltrosReporte {
    fecha_desde: string;
    fecha_hasta: string;
    tipo_reporte: string;
}