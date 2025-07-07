import { Form } from "react-bootstrap";

interface DescriptionSectionProps {
  formData: {
    descripcion: string;
  };
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
  descripcionAviso: string;
  maxCaracteres: number;
}

const DescriptionSection = ({ formData, onChange, descripcionAviso, maxCaracteres }: DescriptionSectionProps) => {
  return (
    <>
      <Form.Group controlId="formDescripcion" className="mb-3">
        <Form.Control
          as="textarea"
          rows={3}
          placeholder="Descripción personal"
          name="descripcion"
          value={formData.descripcion}
          onChange={onChange}
        />
      </Form.Group>
      {formData.descripcion && (
        <div className="d-flex justify-content-between">
          <small className="text-muted">
            {formData.descripcion.length} / {maxCaracteres} caracteres
          </small>
          {descripcionAviso && <small className="text-danger">{descripcionAviso}</small>}
        </div>
      )}
    </>
  );
};

export default DescriptionSection;