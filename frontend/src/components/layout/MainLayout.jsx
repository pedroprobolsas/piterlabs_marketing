import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const location = useLocation();
  
  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'CENTRO DE OPERACIONES', subtitle: 'Vista General de Impacto' };
      case '/clientes':
        return { title: 'MIS CLIENTES', subtitle: 'PostgreSQL Sync via Crisolweb' };
      case '/cerebro':
        return { title: 'BLOQUE 1: CEREBRO', subtitle: 'Inteligencia y Estrategia' };
      default:
        return { title: 'PITERLABS', subtitle: 'Dashboard' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex h-screen w-full overflow-hidden bg-bg text-text-main font-syne">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 bg-bg">
        <Topbar title={title} subtitle={subtitle} />
        <main className="flex-1 overflow-y-auto p-[30px_36px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
