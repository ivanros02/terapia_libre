// components/form-sections/PasswordChangeSection.tsx
import { Form, Button } from "react-bootstrap";

interface PasswordChangeSectionProps {
  passwordActual: string;
  nuevaPassword: string;
  confirmarPassword: string;
  mostrarForm: boolean;
  onToggleForm: () => void;
  onPasswordActualChange: (value: string) => void;
  onNuevaPasswordChange: (value: string) => void;
  onConfirmarPasswordChange: (value: string) => void;
}

const PasswordChangeSection = ({
  passwordActual,
  nuevaPassword,
  confirmarPassword,
  mostrarForm,
  onToggleForm,
  onPasswordActualChange,
  onNuevaPasswordChange,
  onConfirmarPasswordChange,
}: PasswordChangeSectionProps) => {
  return (
    <>
      <Button
        variant="outline-secondary"
        className="mb-3"
        onClick={onToggleForm}
      >
        {mostrarForm ? "Cancelar cambio de contraseña" : "¿Cambiar contraseña?"}
      </Button>

      {mostrarForm && (
        <>
          <Form.Group className="mb-3">
            <Form.Label>Contraseña actual</Form.Label>
            <Form.Control
              type="password"
              value={passwordActual}
              onChange={(e) => onPasswordActualChange(e.target.value)}
              placeholder="Ingresá tu contraseña actual"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              value={nuevaPassword}
              onChange={(e) => onNuevaPasswordChange(e.target.value)}
              placeholder="Nueva contraseña"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Confirmar nueva contraseña</Form.Label>
            <Form.Control
              type="password"
              value={confirmarPassword}
              onChange={(e) => onConfirmarPasswordChange(e.target.value)}
              placeholder="Confirmá la nueva contraseña"
            />
          </Form.Group>
        </>
      )}
    </>
  );
};

export default PasswordChangeSection;