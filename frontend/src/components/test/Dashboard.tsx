import Sidebar from './Sidebar/Sidebar';
import Search from './Serach/SearchTest';
import Bienvenida from './Bienvenida/BienvenidaTest';
import Historial from './ListaDePacientes/HistorialTest';
import Calendario from './Calendario/CalendarioTest';
import '../../styles/Dashboard/Dashboard.css';

function TestGrid() {
    return (
        <div className="dashboard">
            <Sidebar />
            <Search />
            <Bienvenida />
            <Historial />
            <Calendario />
        </div>

    );
}

export default TestGrid;