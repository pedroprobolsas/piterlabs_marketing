import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function MainLayout() {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getPageInfo = () => {
    switch (location.pathname) {
      case '/':
        return { title: 'CENTRO DE OPERACIONES', subtitle: 'Vista General de Impacto' };
      case '/clientes':
        return { title: 'MIS CLIENTES', subtitle: 'PostgreSQL Sync via Crisolweb' };
      case '/cerebro':
        return { title: 'B.1 — MI MARCA', subtitle: 'Identidad, Arquetipos y Buyer Persona' };
      case '/pluma':
        return { title: 'B.2 — CREAR GUION', subtitle: 'Narrativa y Producción de Contenido' };
      case '/camara':
        return { title: 'B.3 — PRODUCIR VIDEO', subtitle: 'Frame, Skills y Preview 9:16' };
      default:
        return { title: 'PITERLABS', subtitle: 'Dashboard' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="h-[100dvh] overflow-hidden bg-bg">

      {/* Sidebar — always fixed */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content — margin-left matches sidebar width on desktop */}
      <div className="ml-0 md:ml-[252px] flex flex-col h-full overflow-hidden">
        <Topbar title={title} subtitle={subtitle} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-[20px_16px] md:p-[30px_36px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
