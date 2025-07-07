import { Form, Row, Col } from "react-bootstrap";
import EspecialidadSelect from "../../EspecialidadSelect";

interface ProfessionalDataSectionProps {
  formData: {
    titulo_universitario: string;
    matricula_provincial: string;
    matricula_nacional: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  onEspecialidadChange: (selected: number[]) => void;
}

const ProfessionalDataSection = ({ formData, onChange, onEspecialidadChange }: ProfessionalDataSectionProps) => {
  return (
    <>
      <h5>Datos profesionales</h5>
      <Row>
        <Col xs={12}>
          <Form.Group controlId="formTitulo" className="mb-3">
            <Form.Control
              type="text"
              name="titulo_universitario"
              placeholder="Titulo"
              value={formData.titulo_universitario}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={6}>
          <Form.Group controlId="formMatriculaProvincial" className="mb-3">
            <Form.Control
              type="text"
              name="matricula_provincial"
              placeholder="Matrícula Provincial"
              value={formData.matricula_provincial}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={6}>
          <Form.Group controlId="formMatriculaNacional" className="mb-3">
            <Form.Control
              type="text"
              name="matricula_nacional"
              placeholder="Matrícula Nacional"
              value={formData.matricula_nacional}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>

      <h5>Especialidades</h5>
      <EspecialidadSelect onChange={onEspecialidadChange} />
    </>
  );
};

export default ProfessionalDataSection;