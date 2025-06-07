import { Container, Row, Col, Card } from 'react-bootstrap';

const SubscriptionInfo = () => {
    return (
        <Container className="my-4">
            <Card
                style={{
                    backgroundColor: '#61616157',
                    border: 'none',
                    borderRadius: '10px'
                }}
                className="p-3 p-md-4"
            >
                <Row className="align-items-center">
                    <Col xs={12} sm={3} md={2} className="text-center mb-3 mb-sm-0">
                        <img
                            src="/card_payment.png"
                            alt="Pago con tarjeta"
                            className="img-fluid"
                            style={{
                                maxWidth: '60px',
                                height: 'auto'
                            }}
                        />
                    </Col>
                    <Col xs={12} sm={9}>
                        <div className="text-dark" style={{ fontSize: '13px' }}>
                            <p className="mb-1">
                                La plataforma funciona con una suscripción mensual de $42.000 ARS.
                            </p>
                            <p className="mb-1">
                                Al suscribirte, accedés a una prueba gratuita de 30 días sin compromiso.
                            </p>
                            <p className="mb-0">
                                Podés cancelar en cualquier momento antes de que finalice el período de prueba.
                            </p>
                        </div>
                    </Col>
                </Row>
            </Card>
        </Container>
    );
};

export default SubscriptionInfo;