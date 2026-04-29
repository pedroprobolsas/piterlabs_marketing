import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import MisClientes from './pages/Clientes/MisClientes';
import Prospectos from './pages/Prospectos/Prospectos';
import MiMarca from './pages/Cerebro/MiMarca';
import Ideacion from './pages/Cerebro/Ideacion';
import CrearGuion from './pages/Pluma/CrearGuion';
import ProducirVideo from './pages/Camara/ProducirVideo';
import GestionSkills from './pages/Skills/GestionSkills';
import Viralizar from './pages/Rayo/Viralizar';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="clientes"  element={<MisClientes />} />
          <Route path="prospectos" element={<Prospectos />} />
          <Route path="cerebro"   element={<MiMarca />} />
          <Route path="ideas"     element={<Ideacion />} />
          <Route path="pluma"     element={<CrearGuion />} />
          <Route path="camara"    element={<ProducirVideo />} />
          <Route path="rayo"      element={<Viralizar />} />
          <Route path="engranaje" element={<ComingSoon title="PUBLICAR Y MEDIR" />} />
          <Route path="email"     element={<ComingSoon title="EMAIL MARKETING" />} />
          <Route path="settings"  element={<ComingSoon title="AJUSTES" />} />
          <Route path="skills"    element={<GestionSkills />} />
        </Route>
      </Routes>
    </Router>
  );
}

function ComingSoon({ title }) {
  return (
    <div className="flex flex-col items-center justify-center h-[300px] gap-[10px]">
      <div className="font-bebas text-[2rem] tracking-[4px] text-muted">{title}</div>
      <div className="font-jetbrains text-[0.7rem] text-muted">Próximamente</div>
    </div>
  );
}

export default App;
