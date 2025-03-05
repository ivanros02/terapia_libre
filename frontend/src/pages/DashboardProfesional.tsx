import SearchNavbar from "../components/dashboard/SearchNavbar";
import Sidebar from "../components/dashboard/Sidebar";
import DashboardCard from "../components/dashboard/DashboardCard";
import PatientHistory from "../components/dashboard/PatientHistory";
import CalendarioTurnos from "../components/dashboard/CalendarioTurnos";

//PatientHistory
const samplePatients = [
  { name: "Agustina Perez", frequency: "Mensual" },
  { name: "Sofia Perez", frequency: "Semanal" },
  { name: "Ana Diaz", frequency: "Quincenal" },
  { name: "Ana Diaz", frequency: "Quincenal" }
];

//PatientHistory
const sampleSelectedPatient = {
  name: "Agustina Perez",
  gender: "Mujer",
  age: "28 Años 3 Meses",
  lastVisit: "2 de Septiembre",
  observations: "Crisis de ansiedad",
  details: "Pidió una consulta con urgencia, estaba atravesando una crisis laboral que resultó en sintomatología clínica de ataques de pánico."
};

//CalendarioTurnos
const eventosEjemplo: string[] = ["2025-03-05", "2025-03-10", "2025-03-15"];
const turnosEjemplo = [
  { fecha: "2025-03-08", paciente: "Agustina Perez" },
  { fecha: "2025-03-12", paciente: "Sofia Perez" },
  { fecha: "2025-03-20", paciente: "Ana Diaz" }
];

const DashboardProfesional = () => {
  return (
    <div className="parent">
      <div className="div1"><SearchNavbar
        profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
        profileName="Marcos"
      /></div>
      <div className="div2"><Sidebar /></div>
      <div className="div3"><DashboardCard
        name="Marcos"
        patientName="Agustina Perez"
        appointmentTime="04:00 PM"
        sessionLink="https://tusitio.com/sesion"
        newPatients={3}
        progress={51}
      /></div>
      <div className="div4"><PatientHistory patients={samplePatients} selectedPatient={sampleSelectedPatient} /></div>
      <div className="div5"><CalendarioTurnos eventos={eventosEjemplo} proximosTurnos={turnosEjemplo} /></div>
    </div>

    /* 
     <div className="dashboard">
      <Sidebar />
      <SearchNavbar
        profileImage="https://fcb-abj-pre.s3.amazonaws.com/img/jugadors/MESSI.jpg"
        profileName="Marcos"
      />
      <DashboardCard
        name="Marcos"
        patientName="Agustina Perez"
        appointmentTime="04:00 PM"
        sessionLink="https://tusitio.com/sesion"
        newPatients={3}
        progress={51}
      />
      <PatientHistory patients={samplePatients} selectedPatient={sampleSelectedPatient} />;
      <CalendarioTurnos eventos={eventosEjemplo} proximosTurnos={turnosEjemplo} />
    </div>
    */

  );
};

export default DashboardProfesional;
