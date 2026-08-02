import { Link, useLocation } from 'react-router-dom';
import { Home, Search, PlusCircle, MessageSquare, User } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { messageStore } from '@/lib/store';

const NAV_ITEMS = [
  { path: '/', icon: Home, label: 'Início' },
  { path: '/marketplace', icon: Search, label: 'Buscar' },
  { path: '/criar-anuncio', icon: PlusCircle, label: 'Vender', highlight: true },
  { path: '/chat', icon: MessageSquare, label: 'Mensagens' },
  { path: '/perfil', icon: User, label: 'Eu' },
];

export default function BottomNav() {
  const location = useLocation();
  const { user } = useAuth();

  const unreadMessages = user ? messageStore.filter(m => m.recipient_email === user.email && !m.read).length : 0;

  return (
    <nav
      aria-label="Navegação principal"
      className="fixed bottom-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-sm border-t safe-area-bottom"
    >
      <div className="max-w-lg mx-auto flex items-end justify-around px-2 pb-1 pt-1">
        {NAV_ITEMS.map(item => {
          const isActive = item.path === '/'
            ? location.pathname === '/'
            : location.pathname.startsWith(item.path);
          const Icon = item.icon;
          const showBadge = item.path === '/chat' && unreadMessages > 0;

          return (
            <Link
              key={item.path}
              to={user ? item.path : (item.path === '/' || item.path === '/marketplace' ? item.path : '/login')}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-1.5 px-3 min-w-[56px] min-h-[44px] rounded-xl transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <div className="relative">
                {item.highlight ? (
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center -mt-4 shadow-lg transition-transform ${
                    isActive ? 'bg-primary text-primary-foreground scale-105' : 'bg-primary/90 text-primary-foreground'
                  }`}>
                    <Icon className="w-5 h-5" />
                  </div>
                ) : (
                  <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
                )}
                {showBadge && (
                  <span
                    className="absolute -top-1 -right-2 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums"
                    aria-label={`${unreadMessages} mensagens não lidas`}
                  >
                    {unreadMessages > 9 ? '9+' : unreadMessages}
                  </span>
                )}
              </div>
              <span className={`text-[10px] font-medium ${item.highlight ? '-mt-0.5' : ''}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
