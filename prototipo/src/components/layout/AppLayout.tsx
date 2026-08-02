import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';
import SystemStatus from './SystemStatus';

/**
 * Moldura do aplicativo.
 *
 * U5: o espaço reservado no fim do conteúdo passou de `pb-20` fixo para
 * `pb-safe-nav`, que soma a altura da barra inferior à área segura do
 * aparelho. Sem isso, o último elemento de cada tela ficava encoberto pela
 * barra de gestos nos celulares sem moldura.
 */
export default function AppLayout() {
  return (
    <div className="min-h-screen max-w-lg mx-auto bg-background relative">
      <SystemStatus />
      <div className="pb-safe-nav">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  );
}
