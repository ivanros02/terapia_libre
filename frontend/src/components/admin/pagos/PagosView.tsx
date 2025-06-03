import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import axios from "axios";
import PagosHeader from "./PagosHeader";
import TablaPagos from "./TablaPagos";
import FiltrosPagos from "./FiltrosPagos";
import ResumenTotales from "./ResumenTotales";
import ModalReportePDF from "./ModalReportePDF";
import ModalReporteExcel from "./ModalReporteExcel";
import { Pago } from "./types/Pago";
import usePDFGenerator from "./hooks/usePDFGenerator";
import useExcelGenerator from "./hooks/useExcelGenerator";

const url = import.meta.env.VITE_API_BASE_URL;

const PagosView = () => {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filtros, setFiltros] = useState({
    estado: "",
    metodo_pago: "",
    fecha_desde: "",
    fecha_hasta: "",
    tiene_cupon: "" // Agregar nuevo filtro
  });

  // Estados para los modales de reportes
  const [showPdfModal, setShowPdfModal] = useState(false);
  const [showExcelModal, setShowExcelModal] = useState(false);
  const [pdfFiltros, setPdfFiltros] = useState({
    fecha_desde: "",
    fecha_hasta: ""
  });
  const [excelFiltros, setExcelFiltros] = useState({
    fecha_desde: "",
    fecha_hasta: ""
  });

  const { generarReportePDF, loadingPdf } = usePDFGenerator();
  const { generarReporteExcel, loadingExcel } = useExcelGenerator();

  const fetchPagos = async () => {
    try {
      setLoading(true);
      setError("");
      const token = localStorage.getItem("adminToken");

      if (!token) {
        setError("No hay token de administrador disponible");
        return;
      }

      const params = new URLSearchParams();
      if (filtros.estado) params.append('estado', filtros.estado);
      if (filtros.metodo_pago) params.append('metodo_pago', filtros.metodo_pago);
      if (filtros.fecha_desde) params.append('fecha_desde', filtros.fecha_desde);
      if (filtros.fecha_hasta) params.append('fecha_hasta', filtros.fecha_hasta);

      const response = await axios.get(`${url}/api/admin/pagos?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const pagosConvertidos = response.data.pagos?.map((pago: any) => ({
        ...pago,
        monto: typeof pago.monto === 'string' ? parseFloat(pago.monto) : pago.monto || 0
      })) || [];

      setPagos(pagosConvertidos);
    } catch (error: any) {
      console.error("Error al obtener pagos:", error);
      setError(error.response?.data?.message || "Error al cargar la lista de pagos");
    } finally {
      setLoading(false);
    }
  };

  const fetchPagosParaReporte = async (fechaDesde: string, fechaHasta: string) => {
    const token = localStorage.getItem("adminToken");
    const params = new URLSearchParams();
    params.append('estado', 'Pagado');
    if (fechaDesde) params.append('fecha_desde', fechaDesde);
    if (fechaHasta) params.append('fecha_hasta', fechaHasta);

    const response = await axios.get(`${url}/api/admin/pagos?${params}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    return response.data.pagos?.map((pago: any) => ({
      ...pago,
      monto: typeof pago.monto === 'string' ? parseFloat(pago.monto) : pago.monto || 0
    })) || [];
  };

  useEffect(() => {
    fetchPagos();
  }, []);

  const formatearFecha = (fecha: string) => {
    return new Date(fecha).toLocaleDateString('es-AR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatearMonto = (monto: number) => {
    return new Intl.NumberFormat('es-AR', {
      style: 'currency',
      currency: 'ARS',
      minimumFractionDigits: 2
    }).format(monto);
  };

  const calcularTotales = () => {
    const total = pagos.reduce((sum: number, pago: Pago) => sum + pago.monto, 0);
    const pagados = pagos.filter(p => p.estado === 'Pagado').reduce((sum: number, pago: Pago) => sum + pago.monto, 0);
    const pendientes = pagos.filter(p => p.estado === 'Pendiente').reduce((sum: number, pago: Pago) => sum + pago.monto, 0);
    const reembolsados = pagos.filter(p => p.estado === 'Reembolsado').reduce((sum: number, pago: Pago) => sum + pago.monto, 0);

    return { total, pagados, pendientes, reembolsados };
  };

  const limpiarFiltros = () => {
    setFiltros({
      estado: "",
      metodo_pago: "",
      fecha_desde: "",
      fecha_hasta: "",
      tiene_cupon: "" // Incluir en limpiar
    });
    setTimeout(fetchPagos, 100);
  };

  const handleGenerarPDF = async () => {
    const success = await generarReportePDF(pdfFiltros, fetchPagosParaReporte);
    if (success) {
      setShowPdfModal(false);
      setPdfFiltros({ fecha_desde: "", fecha_hasta: "" });
    }
  };

  const handleGenerarExcel = async () => {
    const success = await generarReporteExcel(excelFiltros, fetchPagosParaReporte);
    if (success) {
      setShowExcelModal(false);
      setExcelFiltros({ fecha_desde: "", fecha_hasta: "" });
    }
  };

  const totales = calcularTotales();

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando pagos...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PagosHeader
        totalPagos={pagos.length}
        onShowPdfModal={() => setShowPdfModal(true)}
        onShowExcelModal={() => setShowExcelModal(true)}
        onActualizar={fetchPagos}
      />

      {error && (
        <Alert variant="danger" dismissible onClose={() => setError("")} className="mb-4">
          {error}
        </Alert>
      )}

      <ModalReportePDF
        show={showPdfModal}
        loading={loadingPdf}
        filtros={pdfFiltros}
        onHide={() => setShowPdfModal(false)}
        onFiltrosChange={setPdfFiltros}
        onGenerar={handleGenerarPDF}
      />

      <ModalReporteExcel
        show={showExcelModal}
        loading={loadingExcel}
        filtros={excelFiltros}
        onHide={() => setShowExcelModal(false)}
        onFiltrosChange={setExcelFiltros}
        onGenerar={handleGenerarExcel}
      />

      <ResumenTotales
        totales={totales}
        formatearMonto={formatearMonto}
      />

      <FiltrosPagos
        filtros={filtros}
        onFiltrosChange={setFiltros}
        onFiltrar={fetchPagos}
        onLimpiar={limpiarFiltros}
      />

      <TablaPagos
        pagos={pagos}
        totales={totales}
        formatearFecha={formatearFecha}
        formatearMonto={formatearMonto}
      />
    </div>
  );
};

export default PagosView;