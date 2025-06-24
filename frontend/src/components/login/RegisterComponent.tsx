import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Container, Row, Col, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const url = import.meta.env.VITE_API_BASE_URL;

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{
    correo_electronico: string;
    contrasena: string;
    nombre: string;
    telefono: string; // 🔹 Agregado campo teléfono
  }>({
    correo_electronico: "",
    contrasena: "",
    nombre: "",
    telefono: "", // 🔹 Inicializado como string vacío
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Verifica si los campos obligatorios están vacíos
    if (!formData.correo_electronico || !formData.contrasena || !formData.nombre || !formData.telefono) {
      toast.error("Correo, contraseña, nombre y teléfono son obligatorios.", {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    try {
      // Enviar datos incluyendo teléfono (puede estar vacío)
      const dataToSend = {
        ...formData,
        telefono: formData.telefono || null // 🔹 Si está vacío, enviar null
      };

      const response = await axios.post(`${url}/api/auth/registro`, dataToSend);
      toast.success(response.data.message || "Usuario registrado exitosamente 🎉", {
        position: "top-center",
        autoClose: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (error: any) {
      console.error("Error al registrar usuario:", error);

      if (error.message === "Network Error") {
        toast.error("No se pudo conectar al servidor. Verificá tu conexión a Internet.", {
          position: "top-center",
          autoClose: 4000,
        });
      } else {
        toast.error(error.response?.data?.message || "Error inesperado al registrar usuario", {
          position: "top-center",
          autoClose: 4000,
        });
      }
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
          <h2 style={{fontFamily:"var(--fuente-secundaria)"}}>Registrate acá</h2>
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

            {/* 🔹 Campo teléfono opcional */}
            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="tel"
                name="telefono"
                placeholder="Ingresá tu número de teléfono"
                value={formData.telefono}
                onChange={handleChange}
              />
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
                Crear Cuenta
              </button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterComponent;