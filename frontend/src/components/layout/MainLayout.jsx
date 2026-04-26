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
        return { title: 'BLOQUE 1: MI MARCA', subtitle: 'Inteligencia y Estrategia' };
      default:
        return { title: 'PITERLABS', subtitle: 'Dashboard' };
    }
  };

  const { title, subtitle } = getPageInfo();

  return (
    <div className="flex flex-row h-[100dvh] w-full overflow-hidden bg-bg text-text-main font-syne">

      {/* Desktop spacer — reserves 252px in the flex row so content is pushed right.
          Hidden on mobile since sidebar is a fixed drawer overlay there. */}
      <div className="hidden md:block w-[252px] shrink-0" />

      {/* Sidebar — always fixed for smooth transitions on both mobile and desktop */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile overlay — darkens background when drawer is open */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content — flex-1 fills remaining width on desktop, full width on mobile */}
      <div className="flex-1 flex flex-col min-w-0 bg-bg h-full overflow-hidden">
        <Topbar title={title} subtitle={subtitle} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto w-full p-[20px_16px] md:p-[30px_36px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
