import { Modal, Row, Col, Form, Alert, Button } from "react-bootstrap";

interface ModalReportePDFProps {
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

const ModalReportePDF = ({ 
  show, 
  loading, 
  filtros, 
  onHide, 
  onFiltrosChange, 
  onGenerar 
}: ModalReportePDFProps) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="bi bi-file-earmark-pdf me-2 text-danger"></i>
          Generar Reporte Financiero PDF
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="text-muted mb-4">
          Selecciona el rango de fechas para generar un reporte detallado de ingresos con información por profesional y detalle de transacciones.
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
          El reporte incluirá solo los pagos completados en el rango seleccionado e incluirá resumen ejecutivo, ingresos por profesional y detalle de transacciones.
        </Alert>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancelar
        </Button>
        <Button
          variant="danger"
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
              Generar PDF
            </>
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalReportePDF;