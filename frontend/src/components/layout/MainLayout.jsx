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
    <div className="flex h-[100dvh] overflow-hidden">

      {/* Spacer — desktop only: reserves 252px so content doesn't go under the fixed sidebar */}
      <div className="hidden md:flex w-[252px] shrink-0" />

      {/* Sidebar — always fixed */}
      <Sidebar isOpen={sidebarOpen} setIsOpen={setSidebarOpen} />

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-bg text-text-main font-syne">
        <Topbar title={title} subtitle={subtitle} toggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-[20px_16px] md:p-[30px_36px] scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
          <Outlet />
        </main>
      </div>

    </div>
  );
}
