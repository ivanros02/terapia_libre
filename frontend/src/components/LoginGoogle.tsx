import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const url = import.meta.env.VITE_API_BASE_URL;

const LoginGoogle = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        // Obtener los datos del usuario desde Google usando el access_token
        const { access_token } = tokenResponse;
        const profile = await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: {
            Authorization: `Bearer ${access_token}`,
          },
        });

        const { email, name, sub } = profile.data;

        const res = await axios.post(`${url}/api/auth/google-login`, {
          id_google: sub,
          correo_electronico: email,
          nombre: name,
        });

        // Guardar el token de tu backend
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("id", res.data.id);

        // ✅ Guardar el access_token de Google para luego revocar
        localStorage.setItem("google_token", access_token);
        localStorage.setItem("isGoogleLogin", "true");

        // Redirigir
        const prevPath = localStorage.getItem("prevPath") || "/dashboard/usuario";
        localStorage.removeItem("prevPath");
        navigate(prevPath);
      } catch (error: any) {
        console.error("Error en login con Google:", error);

        const message =
          error?.response?.data?.message ||
          "Ocurrió un error al iniciar sesión con Google.";

        toast.error(message, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }

    },
    onError: () => console.log("Login de Google falló"),
    scope: "openid email profile", // asegurate que estos scopes estén
    flow: "implicit", // o "auth-code" si querés intercambiar tokens (más seguro)
  });

  return (
    <button className="btn btn-outline-dark" onClick={() => login()}>
      Iniciar sesión con Google
    </button>
  );
};

export default LoginGoogle;
