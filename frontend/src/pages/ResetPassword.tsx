import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;

const ResetPassword = () => {
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${url}/api/auth/reset-password`, { token, newPassword: password });
            setMessage(response.data.message);
        } catch (error) {
            setMessage("Error al restablecer la contraseña.");
        }
    };

    return (
        <div className="reset-password-container">
            <h2>Restablecer Contraseña</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Restablecer</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default ResetPassword;
