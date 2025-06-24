import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import { toast } from "react-toastify";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;

const AdminLogin = () => {
    const [formData, setFormData] = useState({ correo: "", contrasena: "" });
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/admin/login`, formData);

            localStorage.setItem("adminToken", response.data.token);
            toast.success("Inicio de sesión exitoso 🚀");

            navigate("/admin"); // 🔹 Redirigir al dashboard de admin
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Error en el inicio de sesión");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card className="p-4 shadow-sm">
                <h2 className="text-center">Admin Login</h2>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="email">
                        <Form.Label>Correo</Form.Label>
                        <Form.Control type="email" name="correo" onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group controlId="password" className="mt-3">
                        <Form.Label>Contraseña</Form.Label>
                        <Form.Control type="password" name="contrasena" onChange={handleChange} required />
                    </Form.Group>
                    <Button type="submit" className="mt-3 w-100">Iniciar Sesión</Button>
                </Form>
            </Card>
        </Container>
    );
};

export default AdminLogin;
