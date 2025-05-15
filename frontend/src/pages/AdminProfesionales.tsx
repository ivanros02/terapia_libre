import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Spinner } from "react-bootstrap";
import ProfesionalesListaAdmin from "../components/ProfesionalesListaAdmin";

const AdminProfesionales = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("adminToken");
        if (!token) {
            navigate("/admin-login");
        } else {
            setLoading(false);
        }
    }, [navigate]);

    if (loading) {
        return <Spinner animation="border" className="d-block mx-auto mt-5" />;
    }

    return (
        <Container>
            <h2 className="my-4">Administración de Profesionales</h2>
            <ProfesionalesListaAdmin />
        </Container>
    );
};

export default AdminProfesionales;
