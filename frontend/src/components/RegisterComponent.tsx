import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterComponent: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<{ correo_electronico: string; contrasena: string; nombre: string; }>({
    correo_electronico: "",
    contrasena: "",
    nombre: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/api/auth/registro", formData);
      alert(response.data.message);
      navigate("/login");

    } catch (error) {
      alert("Error en el registro");
    }
  };

  return (
    <div className="container" style={{ marginTop: "10rem" }}>
      <h2>Registro de Usuario</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" name="correo_electronico" placeholder="Correo Electrónico" onChange={handleChange} required />
        <input type="nombre" name="nombre" placeholder="nombre" onChange={handleChange} required />
        <input type="password" name="contrasena" placeholder="Contraseña" onChange={handleChange} required />
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default RegisterComponent;
