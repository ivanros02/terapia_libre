// hooks/useExcelGenerator.ts
import { useState } from "react";
import { Pago, IngresoProfesional } from "../types/Pago";

const useExcelGenerator = () => {
    const [loadingExcel, setLoadingExcel] = useState(false);

    const formatearFechaISO = (fechaISO: string): string => {
        const [year, month, day] = fechaISO.split('-');
        return `${day}/${month}/${year}`;
    };

    const generarReporteExcel = async (
        excelFiltros: { fecha_desde: string; fecha_hasta: string },
        fetchPagosParaReporte: (fechaDesde: string, fechaHasta: string) => Promise<Pago[]>
    ) => {
        if (!excelFiltros.fecha_desde || !excelFiltros.fecha_hasta) {
            alert("Por favor, selecciona ambas fechas para generar el reporte");
            return false;
        }

        try {
            setLoadingExcel(true);
            const XLSX = await import('xlsx');
            const pagosReporte = await fetchPagosParaReporte(excelFiltros.fecha_desde, excelFiltros.fecha_hasta);

            if (pagosReporte.length === 0) {
                alert("No se encontraron pagos en el rango de fechas seleccionado");
                return false;
            }

            const workbook = XLSX.utils.book_new();

            // HOJA 1: Resumen Ejecutivo (sin cambios)
            const totalIngresos = pagosReporte.reduce((sum: number, pago: Pago) => sum + pago.monto, 0);
            const cantidadTransacciones = pagosReporte.length;
            const ingresoPromedio = totalIngresos / cantidadTransacciones;

            const resumenData: (string | number)[][] = [
                ['REPORTE FINANCIERO DE INGRESOS'],
                [''],
                [`Período: ${formatearFechaISO(excelFiltros.fecha_desde)} - ${formatearFechaISO(excelFiltros.fecha_hasta)}`],
                [`Generado el: ${new Date().toLocaleDateString('es-AR')} a las ${new Date().toLocaleTimeString('es-AR')}`],
                [''],
                ['RESUMEN EJECUTIVO'],
                [''],
                ['Métrica', 'Valor'],
                ['Total de Ingresos', totalIngresos.toFixed(2)],
                ['Cantidad de Transacciones', cantidadTransacciones.toString()],
                ['Ingreso Promedio', ingresoPromedio.toFixed(2)],
                [''],
                ['DISTRIBUCIÓN POR MÉTODO DE PAGO'],
                [''],
                ['Método', 'Cantidad', 'Monto Total', 'Porcentaje'],
            ];

            const metodosPago = pagosReporte.reduce((acc: Record<string, { cantidad: number; total: number }>, pago) => {
                if (!acc[pago.metodo_pago]) {
                    acc[pago.metodo_pago] = { cantidad: 0, total: 0 };
                }
                acc[pago.metodo_pago].cantidad += 1;
                acc[pago.metodo_pago].total += pago.monto;
                return acc;
            }, {});

            Object.entries(metodosPago).forEach(([metodo, datos]) => {
                const porcentaje = ((datos.total / totalIngresos) * 100).toFixed(2);
                resumenData.push([
                    metodo,
                    datos.cantidad.toString(),
                    datos.total.toFixed(2),
                    `${porcentaje}%`
                ]);
            });

            const wsResumen = XLSX.utils.aoa_to_sheet(resumenData);
            XLSX.utils.book_append_sheet(workbook, wsResumen, 'Resumen Ejecutivo');

            // HOJA 2: Ingresos por Profesional - 🔹 ACTUALIZADA CON CBU Y CUIT
            const ingresoPorProfesional = pagosReporte.reduce((acc: Record<string, IngresoProfesional>, pago: Pago) => {
                if (!acc[pago.nombre_profesional]) {
                    acc[pago.nombre_profesional] = {
                        total: 0,
                        cantidad: 0,
                        pagos: [],
                        cbu: pago.cbu_profesional || 'No registrado',     // 🔹 AGREGAR CBU
                        cuit: pago.cuit_profesional || 'No registrado'    // 🔹 AGREGAR CUIT
                    };
                }
                acc[pago.nombre_profesional].total += pago.monto;
                acc[pago.nombre_profesional].cantidad += 1;
                acc[pago.nombre_profesional].pagos.push(pago);
                return acc;
            }, {});

            const profesionalesData: (string | number)[][] = [
                ['INGRESOS POR PROFESIONAL'],
                [''],
                ['Profesional', 'CUIT', 'CBU', 'Cantidad de Sesiones', 'Total de Ingresos', 'Promedio por Sesión', 'Porcentaje del Total'], // 🔹 AGREGAR COLUMNAS
            ];

            const profesionalesOrdenados = Object.entries(ingresoPorProfesional)
                .sort(([, a], [, b]) => (b as IngresoProfesional).total - (a as IngresoProfesional).total);

            profesionalesOrdenados.forEach(([nombreProfesional, datos]) => {
                const datosTyped = datos as IngresoProfesional;
                const promedioPorSesion = datosTyped.total / datosTyped.cantidad;
                const porcentajeDelTotal = ((datosTyped.total / totalIngresos) * 100).toFixed(2);

                profesionalesData.push([
                    nombreProfesional,
                    datosTyped.cuit || 'No registrado',        // 🔹 AGREGAR CUIT
                    datosTyped.cbu || 'No registrado',         // 🔹 AGREGAR CBU
                    datosTyped.cantidad.toString(),
                    datosTyped.total.toFixed(2),
                    promedioPorSesion.toFixed(2),
                    `${porcentajeDelTotal}%`
                ]);
            });

            const wsProfesionales = XLSX.utils.aoa_to_sheet(profesionalesData);
            XLSX.utils.book_append_sheet(workbook, wsProfesionales, 'Ingresos por Profesional');

            // HOJA 3: Detalle de Transacciones - 🔹 ACTUALIZADA CON CBU Y CUIT
            const transaccionesData: (string | number)[][] = [
                ['DETALLE DE TRANSACCIONES'],
                [''],
                [
                    'ID Pago',
                    'Fecha Pago',
                    'Fecha Turno',
                    'Hora Turno',
                    'Paciente',
                    'Email Paciente',
                    'Profesional',
                    'CUIT Profesional',        // 🔹 AGREGAR COLUMNA
                    'CBU Profesional',         // 🔹 AGREGAR COLUMNA
                    'Monto',
                    'Método de Pago',
                    'Estado',
                    'Tiene Cupón',
                    'Código Cupón',
                    'ID Transacción'
                ]
            ];

            const pagosOrdenados = [...pagosReporte].sort((a, b) =>
                new Date(a.fecha_turno).getTime() - new Date(b.fecha_turno).getTime()
            );

            pagosOrdenados.forEach((pago) => {
                transaccionesData.push([
                    pago.id_pago.toString(),
                    new Date(pago.fecha_pago).toLocaleDateString('es-AR'),
                    new Date(pago.fecha_turno).toLocaleDateString('es-AR'),
                    pago.hora_turno.slice(0, 5),
                    pago.nombre_usuario,
                    pago.correo_usuario,
                    pago.nombre_profesional,
                    pago.cuit_profesional || 'No registrado',  // 🔹 AGREGAR CUIT
                    pago.cbu_profesional || 'No registrado',   // 🔹 AGREGAR CBU
                    pago.monto.toString(),
                    pago.metodo_pago,
                    pago.estado,
                    pago.tiene_cupon,
                    pago.codigo_cupon || '-',
                    pago.id_transaccion
                ]);
            });

            const wsTransacciones = XLSX.utils.aoa_to_sheet(transaccionesData);
            XLSX.utils.book_append_sheet(workbook, wsTransacciones, 'Detalle de Transacciones');

            // HOJA 4: Análisis Temporal (sin cambios)
            const analisisTemporal = pagosReporte.reduce((acc: Record<string, { cantidad: number; total: number }>, pago) => {
                const fecha = new Date(pago.fecha_turno).toLocaleDateString('es-AR');
                if (!acc[fecha]) {
                    acc[fecha] = { cantidad: 0, total: 0 };
                }
                acc[fecha].cantidad += 1;
                acc[fecha].total += pago.monto;
                return acc;
            }, {});

            const temporalData: (string | number)[][] = [
                ['ANÁLISIS TEMPORAL'],
                [''],
                ['Fecha', 'Cantidad de Transacciones', 'Monto Total', 'Promedio Diario'],
            ];

            Object.entries(analisisTemporal)
                .sort(([a], [b]) => {
                    const fechaA = a.split('/');
                    const fechaB = b.split('/');
                    const dateA = new Date(parseInt(fechaA[2]), parseInt(fechaA[1]) - 1, parseInt(fechaA[0]));
                    const dateB = new Date(parseInt(fechaB[2]), parseInt(fechaB[1]) - 1, parseInt(fechaB[0]));
                    return dateA.getTime() - dateB.getTime();
                })
                .forEach(([fecha, datos]) => {
                    const promedioDiario = datos.total / datos.cantidad;
                    temporalData.push([
                        fecha,
                        datos.cantidad.toString(),
                        datos.total.toFixed(2),
                        promedioDiario.toFixed(2)
                    ]);
                });

            const wsTemporal = XLSX.utils.aoa_to_sheet(temporalData);
            XLSX.utils.book_append_sheet(workbook, wsTemporal, 'Análisis Temporal');

            // HOJA 5: Análisis de Cupones (sin cambios)
            const cuponesData: (string | number)[][] = [
                ['ANÁLISIS DE CUPONES'],
                [''],
                ['Métrica', 'Valor'],
            ];

            const pagosConCupon = pagosReporte.filter(p => p.tiene_cupon === 'Si');
            const pagosSinCupon = pagosReporte.filter(p => p.tiene_cupon === 'No');
            const totalConCupon = pagosConCupon.reduce((sum, p) => sum + p.monto, 0);
            const totalSinCupon = pagosSinCupon.reduce((sum, p) => sum + p.monto, 0);

            cuponesData.push(
                ['Total de pagos con cupón', pagosConCupon.length.toString()],
                ['Total de pagos sin cupón', pagosSinCupon.length.toString()],
                ['Monto total con cupón', totalConCupon.toFixed(2)],
                ['Monto total sin cupón', totalSinCupon.toFixed(2)],
                ['Porcentaje de pagos con cupón', `${((pagosConCupon.length / pagosReporte.length) * 100).toFixed(2)}%`],
                [''],
                ['DETALLE DE CUPONES UTILIZADOS'],
                [''],
                ['Código de Cupón', 'Cantidad de Usos', 'Monto Total']
            );

            const cuponesPorCodigo = pagosConCupon.reduce((acc: Record<string, { cantidad: number; total: number }>, pago) => {
                const codigo = pago.codigo_cupon || 'Sin código';
                if (!acc[codigo]) {
                    acc[codigo] = { cantidad: 0, total: 0 };
                }
                acc[codigo].cantidad += 1;
                acc[codigo].total += pago.monto;
                return acc;
            }, {});

            Object.entries(cuponesPorCodigo).forEach(([codigo, datos]) => {
                cuponesData.push([
                    codigo,
                    datos.cantidad.toString(),
                    datos.total.toFixed(2)
                ]);
            });

            const wsCupones = XLSX.utils.aoa_to_sheet(cuponesData);
            XLSX.utils.book_append_sheet(workbook, wsCupones, 'Análisis de Cupones');

            // Aplicar estilos básicos a las hojas
            const worksheets = [wsResumen, wsProfesionales, wsTransacciones, wsTemporal];
            worksheets.forEach(ws => {
                const range = XLSX.utils.decode_range(ws['!ref'] || 'A1');
                const colWidths = [];
                for (let C = range.s.c; C <= range.e.c; ++C) {
                    let maxWidth = 10;
                    for (let R = range.s.r; R <= range.e.r; ++R) {
                        const cell = ws[XLSX.utils.encode_cell({ r: R, c: C })];
                        if (cell && cell.v) {
                            const cellValue = cell.v.toString();
                            maxWidth = Math.max(maxWidth, cellValue.length);
                        }
                    }
                    colWidths.push({ width: Math.min(maxWidth + 2, 50) });
                }
                ws['!cols'] = colWidths;
            });

            // Generar y descargar el archivo
            const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
            const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `reporte-financiero-${excelFiltros.fecha_desde}-${excelFiltros.fecha_hasta}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);

            return true;

        } catch (error) {
            console.error("Error al generar Excel:", error);
            alert("Error al generar el reporte Excel");
            return false;
        } finally {
            setLoadingExcel(false);
        }
    };

    return { generarReporteExcel, loadingExcel };
};

export default useExcelGenerator;