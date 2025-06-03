import { Modal, Row, Col, Form, Alert, Button } from "react-bootstrap";

interface ModalReporteExcelProps {
  show: boolean;
  loading: boolean;
  filtros: {
    fecha_desde: string;
    fecha_hasta: string;
  };
  onHide: () => void;
  onFiltrosChange: (filtros: { fecha_desde: string; fecha_hasta: string }) => void;
  onGenerar: () => void;
}

const ModalReporteExcel = ({ 
  show, 
  loading, 
  filtros, 
  onHide, 
  onFiltrosChange, 
  onGenerar 
}: ModalReporteExcelProps) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-file-earmark-excel me-2 text-success"></i>
          Generar Reporte Financiero Excel
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Selecciona el rango de fechas para generar un reporte detallado de ingresos en Excel con múltiples hojas: resumen ejecutivo, ingresos por profesional, detalle de transacciones y análisis temporal.
        </p>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Desde</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_desde}
                onChange={(e) => onFiltrosChange({ ...filtros, fecha_desde: e.target.value })}
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Fecha Hasta</Form.Label>
              <Form.Control
                type="date"
                value={filtros.fecha_hasta}
                onChange={(e) => onFiltrosChange({ ...filtros, fecha_hasta: e.target.value })}
              />
            </Form.Group>
          </Col>
        </Row>
        <Alert variant="info" className="small">
          <i className="bi bi-info-circle me-1"></i>
          El reporte incluirá solo los pagos completados en el rango seleccionado y contendrá:
          <ul className="mb-0 mt-2">
            <li>Resumen ejecutivo con métricas principales</li>
            <li>Análisis detallado por profesional</li>
            <li>Detalle completo de todas las transacciones</li>
            <li>Análisis temporal por día</li>
          </ul>
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="success"
          onClick={onGenerar}
          disabled={loading || !filtros.fecha_desde || !filtros.fecha_hasta}
        >
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
              Generando...
            </>
          ) : (
            <>
              <i className="bi bi-download me-1"></i>
              Generar Excel
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalReporteExcel;
