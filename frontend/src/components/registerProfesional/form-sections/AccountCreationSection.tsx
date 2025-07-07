import { Form, Row, Col } from "react-bootstrap";

interface AccountCreationSectionProps {
  formData: {
    correo_electronico: string;
    contrasena: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const AccountCreationSection = ({ formData, onChange }: AccountCreationSectionProps) => {
  return (
    <>
      <h5>Creación de cuenta</h5>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="formEmail" className="mb-3">
            <Form.Control
              type="email"
              name="correo_electronico"
              placeholder="Correo electrónico"
              value={formData.correo_electronico}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="formPassword" className="mb-3">
            <Form.Control
              type="password"
              name="contrasena"
              placeholder="Contraseña"
              value={formData.contrasena}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default AccountCreationSection;