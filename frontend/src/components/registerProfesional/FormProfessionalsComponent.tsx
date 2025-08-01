import { Card, Form, Container, Modal, Button } from "react-bootstrap";
import "../../styles/FormProfessionalsComponent.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TermsAndConditions from "../TermsAndConditions";
import SubscriptionInfo from "./SubscriptionInfo";
import MercadoPagoCheckout from "./MercadoPagoCheckout";
import { useFormProfessional } from "../../hooks/formProfesional/useFormProfessional";
import { useTermsAndConditions } from "../../hooks/formProfesional/useTermsAndConditions";
import { usePayment } from "../../hooks/formProfesional/usePayment";
import { validateForm } from "../../utils/formValidation";
import PersonalDataSection from "./form-sections/PersonalDataSection";
import AccountCreationSection from "./form-sections/AccountCreationSection";
import ProfessionalDataSection from "./form-sections/ProfessionalDataSection";
import DescriptionSection from "./form-sections/DescriptionSection";
import ValuesSection from "./form-sections/ValuesSection";

const FormProfessionalsComponent = () => {
  const {
    formData,
    descripcionAviso,
    MAX_CARACTERES,
    handleChange,
    handleEspecialidadChange,
    clearForm,
  } = useFormProfessional();

  const {
    termsChecked,
    setTermsChecked,
    showTermsModal,
    termsAccepted,
    openTermsModal,
    closeTermsModal,
    acceptTerms,
  } = useTermsAndConditions();

  const {
    loading,
    showPaymentModal,
    openPaymentModal,
    closePaymentModal,
    handlePaymentSuccess,
    handlePaymentError,
  } = usePayment(formData, clearForm);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!termsChecked) {
      toast.warning("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

    if (!validateForm(formData)) {
      toast.error("Por favor, complete todos los campos obligatorios.");
      return;
    }

    openPaymentModal();
  };

  return (
    <Container fluid className="form-container">
      <div className="form-card">
        <Card
          className="mx-auto my-4 p-4"
          style={{
            maxWidth: "800px",
            backgroundColor: "rgba(255, 255, 255, 0.61)",
            borderRadius: "10px",
          }}
        >
          <Card.Body>
            <Card.Title className="text-center mb-4 form-title">
              Registro de profesionales
            </Card.Title>
            <Form onSubmit={handleSubmit}>
              <PersonalDataSection
                formData={formData}
                onChange={handleChange}
              />

              <AccountCreationSection
                formData={formData}
                onChange={handleChange}
              />

              <ProfessionalDataSection
                formData={formData}
                onChange={handleChange}
                onEspecialidadChange={handleEspecialidadChange}
              />

              <DescriptionSection
                formData={formData}
                onChange={handleChange}
                descripcionAviso={descripcionAviso}
                maxCaracteres={MAX_CARACTERES}
              />

              <ValuesSection
                formData={formData}
                onChange={handleChange}
              />

              <SubscriptionInfo />

              <Form.Group controlId="formTerms" className="mb-3 d-flex justify-content-center mt-3">
                <div className="d-flex align-items-center">
                  <Form.Check
                    type="checkbox"
                    checked={termsChecked}
                    disabled={!termsAccepted}
                    onChange={(e) => setTermsChecked(e.target.checked)}
                    className="me-2"
                  />
                  <span style={{ color: '#242424', fontSize: '0.9rem' }}>
                    He leído y acepto los{' '}
                    <span
                      style={{
                        color: '#242424',
                        cursor: 'pointer',
                        textDecoration: 'underline',
                        fontSize: '0.9rem'
                      }}
                      onClick={openTermsModal}
                    >
                      Términos y Condiciones
                    </span>
                  </span>
                </div>
              </Form.Group>

              <div className="d-flex justify-content-center mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="boton-enviar"
                  style={{
                    width: '100%',
                    maxWidth: '297px',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  {loading ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      whiteSpace: 'nowrap'
                    }}>
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                      Enviando...
                    </div>
                  ) : (
                    "Suscribirme"
                  )}
                </button>
              </div>
            </Form>
          </Card.Body>
        </Card>

        <Modal
          show={showPaymentModal}
          onHide={closePaymentModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Completar Suscripción</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <MercadoPagoCheckout
              userEmail={formData.correo_electronico}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Modal.Body>
        </Modal>
      </div>

      <Modal show={showTermsModal} onHide={closeTermsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Términos y Condiciones</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <TermsAndConditions />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeTermsModal}>
            Cerrar
          </Button>
          <Button
            variant="primary"
            onClick={acceptTerms}
            style={{ backgroundColor: "var(--verde)", borderColor: "var(--verde)" }}
          >
            Aceptar
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default FormProfessionalsComponent;