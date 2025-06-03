import { useState, useEffect } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import { ReporteData, ResumenPeriodo, FiltrosReporte } from "./types/Reportes";
import { ReportesHeader } from "./ReportesHeader";
import { ConfiguracionReporte } from "./ConfiguracionReporte";
import { MetricasPrincipales } from "./MetricasPrincipales";
import { DetallesAnalisis } from "./DetallesAnalisis";
import { TablaPeriodo } from "./TablaPeriodo";

const url = import.meta.env.VITE_API_BASE_URL;

const ReportesView = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [reporteData, setReporteData] = useState<ReporteData | null>(null);
  const [resumenPeriodo, setResumenPeriodo] = useState<ResumenPeriodo[]>([]);
  
  const [filtros, setFiltros] = useState<FiltrosReporte>({
    fecha_desde: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 30 días atrás
    fecha_hasta: new Date().toISOString().split('T')[0], // hoy
    tipo_reporte: "general"
  });

  const generarReporte = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");
      
      if (!token) {
        setError("No hay token de administrador disponible");
        return;
      }

      // Obtener estadísticas generales
      const statsResponse = await axios.get(`${url}/api/admin/dashboard-stats`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Obtener turnos del período
      const turnosResponse = await axios.get(`${url}/api/admin/turnos?fecha_desde=${filtros.fecha_desde}&fecha_hasta=${filtros.fecha_hasta}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Obtener pagos del período
      const pagosResponse = await axios.get(`${url}/api/admin/pagos?fecha_desde=${filtros.fecha_desde}&fecha_hasta=${filtros.fecha_hasta}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const turnos = turnosResponse.data.turnos || [];
      const pagos = pagosResponse.data.pagos || [];

      // Calcular métricas del reporte
      const turnosCompletados = turnos.filter((t: any) => t.estado_turno === 'Completado').length;
      const turnosCancelados = turnos.filter((t: any) => t.estado_turno === 'Cancelado').length;
      const ingresosTotales = pagos.filter((p: any) => p.estado === 'Pagado').reduce((sum: number, p: any) => sum + p.monto, 0);
      const ingresos_promedio = pagos.length > 0 ? ingresosTotales / pagos.length : 0;
      const tasa_conversion = turnos.length > 0 ? (turnosCompletados / turnos.length) * 100 : 0;

      setReporteData({
        turnos_totales: turnos.length,
        turnos_completados: turnosCompletados,
        turnos_cancelados: turnosCancelados,
        ingresos_totales: ingresosTotales,
        ingresos_promedio,
        profesionales_activos: statsResponse.data.profesionales_activos || 0,
        usuarios_nuevos: statsResponse.data.total_usuarios || 0,
        tasa_conversion
      });

      // Generar resumen por período (últimos 7 días)
      const resumenDias = [];
      for (let i = 6; i >= 0; i--) {
        const fecha = new Date();
        fecha.setDate(fecha.getDate() - i);
        const fechaStr = fecha.toISOString().split('T')[0];
        
        const turnosDia = turnos.filter((t: any) => t.fecha_turno === fechaStr).length;
        const ingresosDia = pagos.filter((p: any) => 
          p.fecha_pago.startsWith(fechaStr) && p.estado === 'Pagado'
        ).reduce((sum: number, p: any) => sum + p.monto, 0);

        resumenDias.push({
          fecha: fechaStr,
          turnos: turnosDia,
          ingresos: ingresosDia,
          nuevos_usuarios: 0 // Placeholder
        });
      }
      
      setResumenPeriodo(resumenDias);

    } catch (error: any) {
      console.error("Error al generar reporte:", error);
      setError(error.response?.data?.message || "Error al generar el reporte");
    } finally {
      setLoading(false);
    }
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });
  };

  const exportarReporte = () => {
    if (!reporteData) return;

    const csvContent = [
      ['Métrica', 'Valor'],
      ['Período', `${filtros.fecha_desde} a ${filtros.fecha_hasta}`],
      ['Turnos Totales', reporteData.turnos_totales],
      ['Turnos Completados', reporteData.turnos_completados],
      ['Turnos Cancelados', reporteData.turnos_cancelados],
      ['Ingresos Totales', reporteData.ingresos_totales],
      ['Ingreso Promedio', reporteData.ingresos_promedio.toFixed(2)],
      ['Tasa de Conversión', `${reporteData.tasa_conversion.toFixed(1)}%`],
      ['Profesionales Activos', reporteData.profesionales_activos],
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `reporte_${filtros.fecha_desde}_${filtros.fecha_hasta}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  useEffect(() => {
    generarReporte();
  }, []);

  return (
    <div>
      <ReportesHeader
        onExportar={exportarReporte}
        onActualizar={generarReporte}
        loading={loading}
        tieneData={!!reporteData}
      />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
          {error}
        </Alert>
      )}

      <ConfiguracionReporte
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onGenerar={generarReporte}
        loading={loading}
      />

      {reporteData && (
        <>
          <MetricasPrincipales
            reporteData={reporteData}
            formatearMonto={formatearMonto}
          />

          <DetallesAnalisis
            reporteData={reporteData}
            filtros={filtros}
            formatearMonto={formatearMonto}
            formatearFecha={formatearFecha}
          />

          <TablaPeriodo
            resumenPeriodo={resumenPeriodo}
            formatearMonto={formatearMonto}
            formatearFecha={formatearFecha}
          />
        </>
      )}
    </div>
  );
};

export default ReportesView;