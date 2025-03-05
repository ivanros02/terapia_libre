import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Asegúrate de instalarlo con `npm install jwt-decode`
import { useNavigate } from "react-router-dom";

const LoginGoogle = () => {
  const navigate = useNavigate();
  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) return console.error("No se recibió credencial de Google");

    const { email, name, sub }: any = jwtDecode(response.credential); // Decodifica el token de Google

    try {
      const res = await axios.post("http://localhost:5000/api/auth/google-login", {
        id_google: sub,
        correo_electronico: email,
        nombre: name,
      });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard/usuario");
    } catch (error) {
      console.error("Error en login con Google:", error);
    }
  };

  return <GoogleLogin onSuccess={handleSuccess} onError={() => console.log("Error en login con Google")} />;
};

export default LoginGoogle;
