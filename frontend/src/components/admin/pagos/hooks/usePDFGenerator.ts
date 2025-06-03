import { useState } from "react";
import { Pago, IngresoProfesional } from "../types/Pago";

const usePDFGenerator = () => {
  const [loadingPdf, setLoadingPdf] = useState(false);

  // Función auxiliar para formatear fechas correctamente
    const formatearFechaISO = (fechaISO: string): string => {
        // fechaISO viene en formato "YYYY-MM-DD" del input date
        const [year, month, day] = fechaISO.split('-');
        return `${day}/${month}/${year}`;
    };

  const generarReportePDF = async (
    pdfFiltros: { fecha_desde: string; fecha_hasta: string },
    fetchPagosParaReporte: (fechaDesde: string, fechaHasta: string) => Promise<Pago[]>
  ) => {
    if (!pdfFiltros.fecha_desde || !pdfFiltros.fecha_hasta) {
      alert("Por favor, selecciona ambas fechas para generar el reporte");
      return;
    }

    try {
      setLoadingPdf(true);

      // Importar jsPDF dinámicamente
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;

      // Obtener datos específicos para el reporte
      const pagosReporte = await fetchPagosParaReporte(pdfFiltros.fecha_desde, pdfFiltros.fecha_hasta);

      if (pagosReporte.length === 0) {
        alert("No se encontraron pagos en el rango de fechas seleccionado");
        return;
      }

      // Crear nuevo documento PDF
      const doc = new jsPDF();

      // Configuración de fuentes y colores
      const primaryColor = [31, 119, 180] as const;
      const successColor = [40, 167, 69] as const;
      const grayColor = [108, 117, 125] as const;

      let yPosition = 20;

      // HEADER
      doc.setFontSize(20);
      doc.setTextColor(...primaryColor);
      doc.text('REPORTE FINANCIERO DE INGRESOS', 20, yPosition);

      yPosition += 15;
      doc.setFontSize(12);
      doc.setTextColor(...grayColor);
      doc.text(`Período: ${formatearFechaISO(pdfFiltros.fecha_desde)} - ${formatearFechaISO(pdfFiltros.fecha_hasta)}`, 20, yPosition);

      yPosition += 10;
      doc.text(`Generado el: ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`, 20, yPosition);

      // Línea separadora
      yPosition += 10;
      doc.setDrawColor(...grayColor);
      doc.line(20, yPosition, 190, yPosition);
      yPosition += 15;

      // RESUMEN EJECUTIVO
      const totalIngresos = pagosReporte.reduce((sum: number, pago: Pago) => sum + pago.monto, 0);
      const cantidadTransacciones = pagosReporte.length;
      const ingresoPromedio = totalIngresos / cantidadTransacciones;

      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text('RESUMEN EJECUTIVO', 20, yPosition);
      yPosition += 15;

      // Cajas de resumen
      doc.setFontSize(12);
      doc.setTextColor(0, 0, 0);

      // Total de ingresos
      doc.rect(20, yPosition, 50, 25);
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.text('TOTAL DE INGRESOS', 22, yPosition + 8);
      doc.setFontSize(14);
      doc.setTextColor(...successColor);
      doc.text(`$${totalIngresos.toFixed(2)}`, 22, yPosition + 18);

      // Transacciones
      doc.setDrawColor(...grayColor);
      doc.rect(80, yPosition, 50, 25);
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.text('TRANSACCIONES', 82, yPosition + 8);
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text(`${cantidadTransacciones}`, 82, yPosition + 18);

      // Promedio por transacción
      doc.rect(140, yPosition, 50, 25);
      doc.setFontSize(10);
      doc.setTextColor(...grayColor);
      doc.text('PROMEDIO', 142, yPosition + 8);
      doc.setFontSize(14);
      doc.setTextColor(...primaryColor);
      doc.text(`$${ingresoPromedio.toFixed(2)}`, 142, yPosition + 18);

      yPosition += 40;

      // INGRESOS POR PROFESIONAL
      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text('INGRESOS POR PROFESIONAL', 20, yPosition);
      yPosition += 15;

      // Agrupar por profesional
      const ingresoPorProfesional = pagosReporte.reduce((acc: Record<string, IngresoProfesional>, pago: Pago) => {
        if (!acc[pago.nombre_profesional]) {
          acc[pago.nombre_profesional] = {
            total: 0,
            cantidad: 0,
            pagos: []
          };
        }
        acc[pago.nombre_profesional].total += pago.monto;
        acc[pago.nombre_profesional].cantidad += 1;
        acc[pago.nombre_profesional].pagos.push(pago);
        return acc;
      }, {});

      // Ordenar profesionales por ingresos (descendente)
      const profesionalesOrdenados = Object.entries(ingresoPorProfesional)
        .sort(([, a], [, b]) => (b as IngresoProfesional).total - (a as IngresoProfesional).total);

      // Tabla de profesionales
      doc.setFontSize(10);
      doc.setTextColor(0, 0, 0);

      // Headers
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('PROFESIONAL', 22, yPosition + 5);
      doc.text('SESIONES', 100, yPosition + 5);
      doc.text('TOTAL INGRESOS', 140, yPosition + 5);
      yPosition += 12;

      profesionalesOrdenados.forEach(([nombreProfesional, datos]) => {
        const datosTyped = datos as IngresoProfesional;

        if (yPosition > 250) {
          doc.addPage();
          yPosition = 20;
        }

        doc.text(nombreProfesional, 22, yPosition);
        doc.text(`${datosTyped.cantidad}`, 100, yPosition);
        doc.setTextColor(...successColor);
        doc.text(`$${datosTyped.total.toFixed(2)}`, 140, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 8;
      });

      yPosition += 15;

      // DETALLE DE TRANSACCIONES
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(16);
      doc.setTextColor(...primaryColor);
      doc.text('DETALLE DE TRANSACCIONES', 20, yPosition);
      yPosition += 15;

      // Headers de la tabla detallada
      doc.setFontSize(9);
      doc.setTextColor(0, 0, 0);
      doc.setFillColor(240, 240, 240);
      doc.rect(20, yPosition, 170, 8, 'F');
      doc.text('FECHA TURNO', 22, yPosition + 5);
      doc.text('PACIENTE', 60, yPosition + 5);
      doc.text('PROFESIONAL', 100, yPosition + 5);
      doc.text('MÉTODO', 140, yPosition + 5);
      doc.text('MONTO', 165, yPosition + 5);
      yPosition += 12;

      // Ordenar pagos por fecha
      const pagosOrdenados = [...pagosReporte].sort((a, b) =>
        new Date(a.fecha_turno).getTime() - new Date(b.fecha_turno).getTime()
      );

      pagosOrdenados.forEach((pago) => {
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 20;

          // Repetir headers en nueva página
          doc.setFontSize(9);
          doc.setFillColor(240, 240, 240);
          doc.rect(20, yPosition, 170, 8, 'F');
          doc.text('FECHA TURNO', 22, yPosition + 5);
          doc.text('PACIENTE', 60, yPosition + 5);
          doc.text('PROFESIONAL', 100, yPosition + 5);
          doc.text('MÉTODO', 140, yPosition + 5);
          doc.text('MONTO', 165, yPosition + 5);
          yPosition += 12;
        }

        doc.setFontSize(8);
        doc.text(new Date(pago.fecha_turno).toLocaleDateString('es-AR'), 22, yPosition);
        doc.text(pago.nombre_usuario.substring(0, 15), 60, yPosition);
        doc.text(pago.nombre_profesional.substring(0, 15), 100, yPosition);
        doc.text(pago.metodo_pago === 'MercadoPago' ? 'MP' : 'PP', 140, yPosition);
        doc.setTextColor(...successColor);
        doc.text(`$${pago.monto.toFixed(2)}`, 165, yPosition);
        doc.setTextColor(0, 0, 0);
        yPosition += 6;
      });

      // FOOTER
      const pageCount = doc.internal.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(grayColor[0], grayColor[1], grayColor[2]);
        doc.text(`Página ${i} de ${pageCount}`, 20, 290);
        doc.text('Reporte generado automáticamente', 140, 290);
      }

      // Generar blob y descargar
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `reporte-financiero-${pdfFiltros.fecha_desde}-${pdfFiltros.fecha_hasta}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      return true;

    } catch (error) {
      console.error("Error al generar PDF:", error);
      alert("Error al generar el reporte PDF");
      return false;
    } finally {
      setLoadingPdf(false);
    }
  };

  return { generarReportePDF, loadingPdf };
};

export default usePDFGenerator;