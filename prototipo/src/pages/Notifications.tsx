import { Link } from 'react-router-dom';
import { Bell, CheckCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { notificationStore, useStoreVersion } from '@/lib/store';
import { useRequireAuth } from '@/lib/session';
import { formatRelativeDate } from '@/lib/formatters';
import EmptyState from '@/components/common/EmptyState';
import AppHeader from '@/components/layout/AppHeader';
import { ListSkeleton } from '@/components/common/StateViews';
import { toast } from 'sonner';

/**
 * Notificações (5.0).
 *
 * Aqui estava o último `window.location.reload()` da versão 4.0: marcar tudo
 * como lido recarregava a página inteira, o que reiniciava a aplicação e, se a
 * sessão já tivesse sido encerrada em outra aba, terminava em tela branca. Com o
 * armazenamento observável basta escrever — a lista se atualiza sozinha.
 */
export default function Notifications() {
  const { user, loading } = useRequireAuth();
  useStoreVersion();

  const notifications = user
    ? notificationStore
        .filter(n => n.recipient_email === user.email)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    : [];
  const unread = notifications.filter(n => !n.read);

  const markAllRead = () => {
    if (unread.length === 0) return;
    const ids = unread.map(n => n.id);
    ids.forEach(id => notificationStore.update(id, { read: true }));
    toast.success(
      ids.length === 1 ? '1 notificação marcada como lida' : `${ids.length} notificações marcadas como lidas`,
      {
        description: 'Você pode desfazer esta ação.',
        action: {
          label: 'Desfazer',
          onClick: () => {
            ids.forEach(id => notificationStore.update(id, { read: false }));
            toast.info('Notificações voltaram para não lidas.');
          },
        },
      }
    );
  };

  if (loading || !user) {
    return (
      <div>
        <AppHeader showBack title="Notificações" />
        <div className="px-4 py-4">
          <ListSkeleton count={3} />
        </div>
      </div>
    );
  }

  return (
    <div>
      <AppHeader showBack title="Notificações" />
      <div className="px-4 py-4">
        {unread.length > 0 && (
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-muted-foreground">
              {unread.length === 1 ? '1 não lida' : `${unread.length} não lidas`}
            </p>
            <Button size="sm" variant="ghost" className="text-xs gap-1 h-7" onClick={markAllRead}>
              <CheckCheck className="w-3 h-3" /> Marcar todas como lidas
            </Button>
          </div>
        )}

        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell className="w-12 h-12" />}
            title="Nenhuma notificação"
            description="Quando algo importante acontecer, você será notificado aqui."
          />
        ) : (
          <div className="space-y-1">
            {notifications.map(n => (
              <Link
                key={n.id}
                to={n.action_url || '#'}
                onClick={() => notificationStore.update(n.id, { read: true })}
                aria-label={`${n.title}. ${n.read ? 'Lida' : 'Não lida'}.`}
                className={`p-3 rounded-xl flex items-start gap-3 transition-colors active:bg-muted ${
                  n.read ? '' : 'bg-primary/5'
                }`}
              >
                {!n.read && <span className="w-2 h-2 rounded-full bg-primary shrink-0 mt-2" aria-hidden="true" />}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${n.read ? '' : 'font-semibold'}`}>{n.title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{n.message}</p>
                  <p className="text-[10px] text-muted-foreground mt-1">{formatRelativeDate(n.created_at)}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground mt-1 shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
