import { useEffect, useState } from "react";
import { Table, Button } from "react-bootstrap";
import axios from "axios";
const url = import.meta.env.VITE_API_BASE_URL;

interface Profesional {
  id_profesional: number;
  nombre: string;
  correo_electronico: string;
  disponibilidad: string;
  valor: number;
  estado: boolean;
}

const ProfesionalesListaAdmin = () => {
  const [profesionales, setProfesionales] = useState<Profesional[]>([]);

  useEffect(() => {
    fetchProfesionales();
  }, []);

  const fetchProfesionales = async () => {
    try {
      const response = await axios.get(`${url}/api/profesionales`);
      console.log(response)
      // 🔹 Aseguramos que `estado` sea tratado como número y luego booleano
      
      const profesionalesConEstadoBooleano = response.data.professionals.map((prof: any) => ({
        ...prof,
        estado: prof.estado
        
      }));

      setProfesionales(profesionalesConEstadoBooleano);
    } catch (error) {
      console.error("Error fetching profesionales", error);
    }
  };


  const toggleEstado = async (id: number, estado: boolean) => {
    try {
      const nuevoEstado = !estado; // ✅ Usamos boolean en lugar de number

      console.log(`Enviando estado actualizado para ID ${id}:`, nuevoEstado ? 1 : 0);

      await axios.put(`${url}/api/profesionales/${id}`, { estado: nuevoEstado ? 1 : 0 });

      // Actualizar la lista localmente manteniendo el tipo boolean en el estado de React
      setProfesionales((prevProfesionales) =>
        prevProfesionales.map((prof) =>
          prof.id_profesional === id ? { ...prof, estado: nuevoEstado } : prof
        )
      );
    } catch (error) {
      console.error("Error updating estado", error);
    }
  };





  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>ID</th>
          <th>Nombre</th>
          <th>Correo</th>
          <th>Disponibilidad</th>
          <th>Valor</th>
          <th>Estado</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {profesionales.map((prof) => (
          <tr key={prof.id_profesional}>
            <td>{prof.id_profesional}</td>
            <td>{prof.nombre}</td>
            <td>{prof.correo_electronico}</td>
            <td>{prof.disponibilidad}</td>
            <td>${Number(prof.valor).toFixed(2)}</td>
            <td>{prof.estado ? "Activo" : "Inactivo"}</td>
            <td>
              <Button
                variant={prof.estado ? "danger" : "success"}
                onClick={() => toggleEstado(prof.id_profesional, prof.estado)}
              >
                {prof.estado ? "Desactivar" : "Activar"}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default ProfesionalesListaAdmin;
