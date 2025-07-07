import { Form, Row, Col } from "react-bootstrap";
import { preventInvalidNumberInput } from "../../../utils/formValidation";
import { BaseFormData } from "../../../types/FormData";

interface ValuesSectionProps {
  formData: Pick<BaseFormData, 'valor' | 'valor_internacional' | 'cbu' | 'cuit' | 'condicion_fiscal'>;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => void;
}

const ValuesSection = ({ formData, onChange }: ValuesSectionProps) => {
  return (
    <>
      <Row>
        <Col xs={12} md={8}>
          <Form.Group controlId="formValorNacional" className="mb-3">
            <Form.Control
              type="number"
              name="valor"
              placeholder="Valor Nacional"
              value={formData.valor}
              onChange={onChange}
              onKeyDown={preventInvalidNumberInput}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group controlId="formValorInternacional" className="mb-3">
            <Form.Control
              type="number"
              name="valor_internacional"
              placeholder="Valor Internacional"
              value={formData.valor_internacional}
              onChange={onChange}
              onKeyDown={preventInvalidNumberInput}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={8}>
          <Form.Group controlId="formCbu" className="mb-3">
            <Form.Control
              type="number"
              name="cbu"
              placeholder="CBU/CVU"
              value={formData.cbu || ""}
              onChange={onChange}
              onKeyDown={preventInvalidNumberInput}
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={4}>
          <Form.Group controlId="formCuit" className="mb-3">
            <Form.Control
              type="text"
              name="cuit"
              placeholder="CUIT"
              value={formData.cuit || ""}
              onChange={onChange}
            />
          </Form.Group>
        </Col>
      </Row>
      <Row>
        <Col xs={12} md={8}>
          <Form.Group controlId="formCondicionFiscal" className="mb-3">
            <Form.Select
              name="condicion_fiscal"
              value={formData.condicion_fiscal || ""}
              onChange={onChange}
            >
              <option value="">Condición fiscal</option>
              <option value="responsable_inscripto">Responsable Inscripto</option>
              <option value="monotributista">Monotributista</option>
              <option value="exento">Exento</option>
              <option value="consumidor_final">Consumidor Final</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </>
  );
};

export default ValuesSection;