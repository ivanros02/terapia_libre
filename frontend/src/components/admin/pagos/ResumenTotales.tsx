import { Card, Row, Col } from "react-bootstrap";

interface Totales {
    total: number;
    pagados: number;
    pendientes: number;
    reembolsados: number;
}

interface ResumenTotalesProps {
    totales: Totales;
    formatearMonto: (monto: number) => string;
}

const ResumenTotales = ({ totales, formatearMonto }: ResumenTotalesProps) => {
    return (
        <Row className="mb-4">
            <Col md={3}>
                <Card className="text-center border-primary h-100">
                    <Card.Body>
                        <div className="display-6 text-primary mb-2">
                            <i className="bi bi-cash-stack"></i>
                        </div>
                        <h5 className="text-primary">Total General</h5>
                        <h4 className="mb-0">{formatearMonto(totales.total)}</h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="text-center border-success h-100">
                    <Card.Body>
                        <div className="display-6 text-success mb-2">
                            <i className="bi bi-check-circle-fill"></i>
                        </div>
                        <h5 className="text-success">Pagos Completados</h5>
                        <h4 className="mb-0">{formatearMonto(totales.pagados)}</h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="text-center border-warning h-100">
                    <Card.Body>
                        <div className="display-6 text-warning mb-2">
                            <i className="bi bi-clock-fill"></i>
                        </div>
                        <h5 className="text-warning">Pagos Pendientes</h5>
                        <h4 className="mb-0">{formatearMonto(totales.pendientes)}</h4>
                    </Card.Body>
                </Card>
            </Col>
            <Col md={3}>
                <Card className="text-center border-info h-100">
                    <Card.Body>
                        <div className="display-6 text-info mb-2">
                            <i className="bi bi-arrow-clockwise"></i>
                        </div>
                        <h5 className="text-info">Reembolsados</h5>
                        <h4 className="mb-0">{formatearMonto(totales.reembolsados)}</h4>
                    </Card.Body>
                </Card>
            </Col>
        </Row>
    );
};

export default ResumenTotales;