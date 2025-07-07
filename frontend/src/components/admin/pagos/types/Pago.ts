export interface Pago {
  id_pago: number;
  monto: number;
  metodo_pago: string;
  estado: string;
  id_transaccion: string;
  fecha_pago: string;
  fecha_turno: string;
  hora_turno: string;
  estado_turno: string;
  nombre_usuario: string;
  correo_usuario: string;
  nombre_profesional: string;
  cbu_profesional?: string | null;    // 🔹 AGREGAR ESTA LÍNEA
  cuit_profesional?: string | null;
  codigo_cupon?: string;
  fecha_uso_cupon?: string;
  tiene_cupon: 'Si' | 'No';
  correo_electronico?: string;
  condicion_fiscal?: string;
  valor?: number;
}

export interface IngresoProfesional {
  total: number;
  cantidad: number;
  pagos: Pago[];
  cbu?: string | null;     // 🔹 AGREGAR ESTA LÍNEA
  cuit?: string | null;    // 🔹 AGREGAR ESTA LÍNEA
  correo_electronico: string;
  condicion_fiscal: string;
  valor: number;
}

export interface Filtros {
  estado: string;
  metodo_pago: string;
  fecha_desde: string;
  fecha_hasta: string;
}

export interface Totales {
  total: number;
  pagados: number;
  pendientes: number;
  reembolsados: number;
}