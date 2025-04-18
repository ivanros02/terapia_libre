import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
const url = import.meta.env.VITE_API_BASE_URL;

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ correo_electronico: string; contrasena: string; nombre: string }>({
    correo_electronico: "",
    contrasena: "",
    nombre: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica si algún campo está vacío
    if (!formData.correo_electronico || !formData.contrasena || !formData.nombre) {
      alert("Todos los campos son obligatorios.");
      return;
    }

    try {
      const response = await axios.post(`${url}/api/auth/registro`, formData);
      alert(response.data.message);
      navigate("/login");
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);
      alert(`Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <Container fluid className="login-container mt-5">
      <Row className="shadow-lg overflow-hidden p-3 align-items-center bg-white rounded" style={{ maxWidth: "900px", width: "100%" }}>
        {/* Sección Izquierda */}
        <Col md={5} className="d-none d-md-flex align-items-center justify-content-center rounded-personalizado h-100" style={{ background: "var(--verde)" }}>
          <Card className="border-0 bg-transparent text-center">
            <Card.Body className="d-flex flex-column align-items-center">
              <h3 className="text-light">ESTAMOS PARA <br /> AYUDARTE</h3>
            </Card.Body>
          </Card>
        </Col>

        {/* Sección Derecha */}
        <Col md={6} className="p-5 h-100 d-flex flex-column justify-content-center">
          <h2 className="fw-bold">Registro de Usuario</h2>
          <p>Si ya tenés una cuenta, <a href="/login">iniciá sesión acá</a></p>

          {/* Formulario */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre y Apellido</Form.Label>
              <Form.Control type="text" name="nombre" placeholder="Ingresá tu nombre y apellido" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" name="correo_electronico" placeholder="Ingresá tu correo electrónico" onChange={handleChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control type="password" name="contrasena" placeholder="Ingresá tu contraseña" onChange={handleChange} required />
            </Form.Group>

            <div className="d-flex justify-content-center">
              {/* Botón Enviar */}
              <button
                type="submit"
                style={{
                  backgroundColor: "var(--verde)",
                  color: "white",
                  borderRadius: "30px",
                  padding: "10px 30px",
                  fontSize: "16px",
                  fontWeight: "bold",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Registrarse
              </button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterComponent;