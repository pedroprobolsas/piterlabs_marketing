import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import MisClientes from './pages/Clientes/MisClientes';
import Prospectos from './pages/Prospectos/Prospectos';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes" element={<MisClientes />} />
          <Route path="prospectos" element={<Prospectos />} />
          <Route path="pluma" element={<div className="p-4">Módulo Pluma - En Construcción</div>} />
          <Route path="camara" element={<div className="p-4">Módulo Cámara - En Construcción</div>} />
          <Route path="rayo" element={<div className="p-4">Módulo Rayo - En Construcción</div>} />
          <Route path="engranaje" element={<div className="p-4">Módulo Engranaje - En Construcción</div>} />
          <Route path="prospectos" element={<div className="p-4">Módulo Prospectos - En Construcción</div>} />
          <Route path="email" element={<div className="p-4">Módulo Email Mkt - En Construcción</div>} />
          <Route path="settings" element={<div className="p-4">Ajustes - En Construcción</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
