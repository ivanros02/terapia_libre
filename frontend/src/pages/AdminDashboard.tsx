import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import AdminDashboardCompleto from "../components/admin/AdminDashboardCompleto";

const AdminDashboard = () => {
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
        return (
            <div className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status" className="text-primary">
                    <span className="visually-hidden">Cargando panel de administración...</span>
                </Spinner>
            </div>
        );
    }

    // 🔹 Solo renderiza el componente completo - toda la lógica está centralizada
    return <AdminDashboardCompleto />;
};

export default AdminDashboard;