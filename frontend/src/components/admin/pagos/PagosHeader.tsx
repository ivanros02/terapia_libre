import { Button } from "react-bootstrap";

interface PagosHeaderProps {
  totalPagos: number;
  onShowPdfModal: () => void;
  onShowExcelModal: () => void;
  onActualizar: () => void;
}

const PagosHeader = ({ 
  totalPagos, 
  onShowPdfModal, 
  onShowExcelModal,
  onActualizar
}: PagosHeaderProps) => {
  return (
    <div className="d-flex justify-content-between align-items-center mb-4">
      <div>
        <h3 className="mb-1">Gestión de Pagos</h3>
        <p className="text-muted mb-0">Total de transacciones: {totalPagos}</p>
      </div>
      <div className="d-flex gap-2">
        <Button
          variant="outline-danger"
          onClick={onShowPdfModal}
          size="sm"
        >
          <i className="bi bi-file-earmark-pdf me-1"></i>
          Reporte PDF
        </Button>
        <Button 
          variant="outline-success" 
          onClick={onShowExcelModal} 
          size="sm"
        >
          <i className="bi bi-file-earmark-excel me-1"></i>
          Reporte Excel
        </Button>
        <Button variant="outline-primary" onClick={onActualizar} size="sm">
          <i className="bi bi-arrow-clockwise me-1"></i>
          Actualizar
        </Button>
      </div>
    </div>
  );
};

export default PagosHeader;