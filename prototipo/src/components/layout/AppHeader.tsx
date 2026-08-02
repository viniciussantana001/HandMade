import { Link, useNavigate } from 'react-router-dom';
import { Bell, ChevronLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { notificationStore } from '@/lib/store';

interface AppHeaderProps {
  title?: string;
  showBack?: boolean;
  transparent?: boolean;
}

export default function AppHeader({ title, showBack, transparent }: AppHeaderProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const unreadNotifs = user ? notificationStore.filter(n => n.recipient_email === user.email && !n.read).length : 0;

  return (
    <header className={`sticky top-0 z-40 px-4 py-3 flex items-center justify-between ${
      transparent ? '' : 'bg-card/95 backdrop-blur-sm border-b'
    }`}>
      <div className="flex items-center gap-2">
        {showBack ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 -ml-2"
            onClick={() => navigate(-1)}
            aria-label="Voltar"
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
        ) : null}
        {title ? (
          <h1 className="text-lg font-bold">{title}</h1>
        ) : (
          <Link to="/" className="flex items-center gap-1.5">
            <div className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">H</span>
            </div>
            <span className="font-bold text-lg">HandMade</span>
          </Link>
        )}
      </div>
      <div className="flex items-center gap-1">
        {user && (
          <>
            {/*
              asChild funde o botão no próprio <Link>: sai um único <a> com a
              aparência de botão. O tabIndex={-1} que existia aqui só fazia
              sentido enquanto havia dois controles aninhados — mantê-lo agora
              tiraria o link da ordem de tabulação.
            */}
            <Button asChild variant="ghost" size="icon" className="h-9 w-9 relative">
              <Link to="/notificacoes" aria-label={`Notificações${unreadNotifs > 0 ? `: ${unreadNotifs} não lidas` : ''}`}>
                <Bell className="w-[18px] h-[18px]" />
                {unreadNotifs > 0 && (
                  <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[9px] font-bold rounded-full flex items-center justify-center tabular-nums">
                    {unreadNotifs > 9 ? '9+' : unreadNotifs}
                  </span>
                )}
              </Link>
            </Button>
            <Link to="/perfil" aria-label="Meu perfil">
              <Avatar className="h-8 w-8">
                {user.avatar_url ? <AvatarImage src={user.avatar_url} alt={user.full_name} /> : null}
                <AvatarFallback className="bg-primary/10 text-primary text-xs font-bold">
                  {user.full_name?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
            </Link>
          </>
        )}
        {!user && (
          <Button asChild size="sm" variant="outline">
            <Link to="/login">Entrar</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
