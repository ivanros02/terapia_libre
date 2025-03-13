import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Asegúrate de instalarlo con `npm install jwt-decode`
import { useNavigate } from "react-router-dom";
const url = import.meta.env.VITE_API_BASE_URL;

const LoginGoogle = () => {
  const navigate = useNavigate();

  const handleSuccess = async (response: CredentialResponse) => {
    if (!response.credential) {
      console.error("No se recibió credencial de Google");
      return;
    }

    const { email, name, sub }: any = jwtDecode(response.credential);

    try {
      const res = await axios.post(`${url}/api/auth/google-login`, {
        id_google: sub,
        correo_electronico: email,
        nombre: name,
      });

      // Guardar el token y el ID en el localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("id", res.data.id);

      // Redirigir a la URL previa si existe
      const prevPath = localStorage.getItem("prevPath") || null;
      if (prevPath) {
        localStorage.removeItem("prevPath"); // Limpiar la variable
        navigate(prevPath);
      } else {
        navigate("/dashboard/usuario");
      }
    } catch (error) {
      console.error("Error en login con Google:", error);
    }
  };


  return (
    <GoogleLogin
      onSuccess={handleSuccess}
      onError={() => console.log("Error en login con Google")}
    />
  );
};

export default LoginGoogle;