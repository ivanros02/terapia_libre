import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaSafari, FaChrome, FaFirefox, FaEdge } from "react-icons/fa";

const getBrowserName = (ua: string): string => {
  ua = ua.toLowerCase();
  if (ua.includes("edga") || ua.includes("edgios") || ua.includes("edg/")) return "Edge"; // 🔥 Detecta Edge Android e iOS
  if (ua.includes("firefox")) return "Firefox";
  if (ua.includes("safari") && !ua.includes("chrome")) return "Safari";
  if (ua.includes("chrome")) return "Chrome";
  return "Otro";
};


const getBrowserIcon = (name: string) => {
  switch (name) {
    case "Chrome": return <FaChrome size={40} />;
    case "Safari": return <FaSafari size={40} />;
    case "Firefox": return <FaFirefox size={40} />;
    case "Edge": return <FaEdge size={40} />;
    default: return null;
  }
};

const RetornoPago: React.FC = () => {
  const navigate = useNavigate();
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [navegadorOrigen, setNavegadorOrigen] = useState("Desconocido");
  const [navegadorActual, setNavegadorActual] = useState("Desconocido");

  useEffect(() => {
    const origen = localStorage.getItem("navegador_origen") || "";
    const actual = navigator.userAgent;

    const nombreOrigen = getBrowserName(origen);
    const nombreActual = getBrowserName(actual);

    setNavegadorOrigen(nombreOrigen);
    setNavegadorActual(nombreActual);

    if (nombreOrigen && nombreOrigen !== nombreActual) {
      setMostrarSelector(true);
    } else {
      // Si está en el mismo navegador, redirigir directo
      navigate("/dashboard/usuario");
    }
  }, [navigate]);

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column text-center px-3">
      <h4 className="mb-2">¡Gracias por tu pago!</h4>
      <p className="mb-3">Estamos redirigiéndote a tu panel.</p>

      {mostrarSelector ? (
        <>
          <p className="fw-bold text-danger">
            Detectamos que abriste esta página desde un navegador diferente
          </p>

          <div className="d-flex gap-4 mb-4 justify-content-center">
            <div>
              <p className="mb-1">Navegador original</p>
              {getBrowserIcon(navegadorOrigen)}
              <p className="fw-bold">{navegadorOrigen}</p>
            </div>
            <div>
              <p className="mb-1">Navegador actual</p>
              {getBrowserIcon(navegadorActual)}
              <p className="fw-bold">{navegadorActual}</p>
            </div>
          </div>

          <p className="mb-4">
            Para evitar errores o sesiones incompletas, te recomendamos volver
            manualmente a <strong>{navegadorOrigen}</strong> y abrir la pestaña
            que ya tenías de <code>terapialibre.com.ar</code>.
          </p>

             </>
      ) : (
        <>
          <div className="spinner-border text-primary mt-4" role="status">
            <span className="visually-hidden">Cargando...</span>
          </div>
        </>
      )}
    </div>
  );
};

export default RetornoPago;