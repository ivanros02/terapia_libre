import { Form, Row, Col } from "react-bootstrap";

interface PersonalDataSectionProps {
  formData: {
    foto_perfil_url: string;
    nombre: string;
    telefono: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const PersonalDataSection = ({ formData, onChange }: PersonalDataSectionProps) => {
  return (
    <>
      <Form.Group controlId="formProfilePicture" className="mb-3">
        <h5>Foto de perfil</h5>
        <Form.Control
          type="text"
          name="foto_perfil_url"
          placeholder="Ingrese la URL de su foto de perfil"
          value={formData.foto_perfil_url}
          onChange={onChange}
        />
      </Form.Group>

      <h5>Datos personales</h5>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="formName" className="mb-3">
            <Form.Control
              type="text"
              name="nombre"
              placeholder="Nombre y Apellido"
              value={formData.nombre}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group controlId="formPhone" className="mb-3">
            <Form.Control
              type="text"
              name="telefono"
              placeholder="Teléfono"
              value={formData.telefono}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default PersonalDataSection;