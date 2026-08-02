import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Plus, Eye, Sparkles, Pause, Play, Trash2, MessageSquare, Package, Pencil, CheckCircle2, Clock,
} from 'lucide-react';
import { listingStore, useStoreVersion } from '@/lib/store';
import { CATEGORIES } from '@/lib/categories';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency, formatRelativeDate, formatDateBR } from '@/lib/formatters';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/common/EmptyState';
import SmartImage from '@/components/common/SmartImage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ListSkeleton } from '@/components/common/StateViews';
import type { Listing } from '@/lib/types';
import { toast } from 'sonner';

/**
 * Gestão de anúncios do vendedor.
 *
 * Mudanças na 5.0: o impulsionamento virou uma rota própria com pagamento
 * direto (antes era um diálogo que consumia saldo da carteira); as ações de
 * pausar, reativar e excluir não recarregam mais a página — a store notifica a
 * tela — e a exclusão oferece "desfazer".
 */
export default function MyListings() {
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  const navigate = useNavigate();
  useStoreVersion();

  const [tab, setTab] = useState('active');
  const [pendingDelete, setPendingDelete] = useState<Listing | null>(null);

  const listings = useMemo(
    () => (user ? listingStore.filter(l => l.created_by === user.email) : []),
    [user]
  );

  if (loading) {
    return (
      <div>
        <AppHeader title="Meus Anúncios" />
        <div className="px-4 py-4"><ListSkeleton count={4} /></div>
      </div>
    );
  }
  if (!user) return null;

  const counts = {
    active: listings.filter(l => l.status === 'active').length,
    paused: listings.filter(l => l.status === 'paused').length,
    sold: listings.filter(l => l.status === 'sold').length,
  };

  const filtered = listings.filter(l => l.status === tab);
  const isBoosted = (l: Listing) =>
    Boolean(l.is_boosted && l.boost_until && new Date(l.boost_until) > new Date());

  const pause = (listing: Listing) => {
    listingStore.update(listing.id, { status: 'paused' });
    toast.success('Anúncio pausado', {
      description: 'Ele não aparece mais nas buscas.',
      action: {
        label: 'Desfazer',
        onClick: () => {
          listingStore.update(listing.id, { status: 'active' });
          toast.success('Anúncio reativado');
        },
      },
    });
  };

  const reactivate = (listing: Listing) => {
    listingStore.update(listing.id, { status: 'active' });
    toast.success('Anúncio reativado', { description: 'Ele já voltou a aparecer nas buscas.' });
  };

  const markAsSold = (listing: Listing) => {
    listingStore.update(listing.id, { status: 'sold' });
    toast.success('Anúncio marcado como vendido', {
      action: {
        label: 'Desfazer',
        onClick: () => {
          listingStore.update(listing.id, { status: 'active' });
          toast.success('Anúncio reativado');
        },
      },
    });
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    // Guarda a cópia completa para permitir a restauração pelo "desfazer".
    const snapshot = { ...pendingDelete };
    listingStore.delete(snapshot.id);
    toast.success('Anúncio excluído', {
      action: {
        label: 'Desfazer',
        onClick: () => {
          listingStore.upsert(snapshot);
          toast.success('Anúncio restaurado');
        },
      },
    });
    setPendingDelete(null);
  };

  const emptyCopy = {
    active: { title: 'Nenhum anúncio ativo', description: 'Publique seu primeiro anúncio e comece a vender. É gratuito.' },
    paused: { title: 'Nenhum anúncio pausado', description: 'Anúncios pausados ficam fora das buscas e podem ser reativados quando quiser.' },
    sold: { title: 'Nenhum anúncio vendido', description: 'Quando você concluir uma venda, o anúncio aparece aqui.' },
  }[tab as 'active' | 'paused' | 'sold'];

  return (
    <div>
      <AppHeader title="Meus Anúncios" />
      <div className="px-4 py-3">
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs text-muted-foreground">
            {listings.length} anúncio{listings.length !== 1 ? 's' : ''} no total
          </p>
          <Button asChild size="sm" className="gap-1">
            <Link to="/criar-anuncio"><Plus className="w-4 h-4" /> Novo</Link>
          </Button>
        </div>

        <Tabs value={tab} onValueChange={setTab} className="mb-3">
          <TabsList className="w-full">
            <TabsTrigger value="active" className="flex-1 text-xs">Ativos ({counts.active})</TabsTrigger>
            <TabsTrigger value="paused" className="flex-1 text-xs">Pausados ({counts.paused})</TabsTrigger>
            <TabsTrigger value="sold" className="flex-1 text-xs">Vendidos ({counts.sold})</TabsTrigger>
          </TabsList>
        </Tabs>

        {filtered.length === 0 ? (
          <EmptyState
            icon={<Package className="w-12 h-12" />}
            title={emptyCopy.title}
            description={emptyCopy.description}
            action={
              tab === 'active' ? (
                <Button asChild><Link to="/criar-anuncio">Criar anúncio</Link></Button>
              ) : undefined
            }
          />
        ) : (
          <div className="space-y-3">
            {filtered.map(listing => {
              const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
              const boosted = isBoosted(listing);
              return (
                <Card key={listing.id} className="p-3 animate-fade-in">
                  <div className="flex items-start gap-3">
                    <Link to={`/anuncio/${listing.id}`} className="w-16 h-16 rounded-xl overflow-hidden shrink-0">
                      <SmartImage
                        src={listing.images?.[0]}
                        alt={listing.title}
                        slot="thumb"
                        fallback={<cat.icon className="w-5 h-5 text-muted-foreground/30" />}
                      />
                    </Link>

                    <div className="flex-1 min-w-0">
                      <Link to={`/anuncio/${listing.id}`}>
                        <p className="font-medium text-sm leading-tight line-clamp-2">{listing.title}</p>
                      </Link>
                      <p className="text-primary font-bold text-sm mt-0.5 tabular-nums">
                        {listing.listing_type === 'donation' ? 'Doação' : formatCurrency(listing.price)}
                      </p>
                      <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                        <Badge className={`${cat.color} text-[10px] border-0 px-1.5 py-0`}>{cat.label}</Badge>
                        {boosted && (
                          <Badge className="bg-warning/10 text-warning-strong text-[10px] gap-0.5 px-1.5 py-0 border-0">
                            <Sparkles className="w-2.5 h-2.5" /> Destaque
                          </Badge>
                        )}
                        {listing.status === 'paused' && (
                          <Badge variant="outline" className="text-[10px] px-1.5 py-0 gap-0.5">
                            <Pause className="w-2.5 h-2.5" /> Pausado
                          </Badge>
                        )}
                        {listing.status === 'sold' && (
                          <Badge className="bg-success/10 text-success text-[10px] px-1.5 py-0 border-0 gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" /> Vendido
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1.5 text-[10px] text-muted-foreground">
                        <span className="flex items-center gap-0.5"><Eye className="w-3 h-3" />{listing.views || 0}</span>
                        <span className="flex items-center gap-0.5"><MessageSquare className="w-3 h-3" />{listing.contacts || 0}</span>
                        <span className="flex items-center gap-0.5"><Clock className="w-3 h-3" />{formatRelativeDate(listing.created_date)}</span>
                      </div>
                      {boosted && listing.boost_until && (
                        <p className="text-[10px] text-warning-strong mt-1">
                          Em destaque até {formatDateBR(listing.boost_until)}
                        </p>
                      )}
                    </div>
                  </div>

                  {listing.status !== 'sold' && (
                    <div className="flex items-center gap-1.5 mt-3 pt-3 border-t">
                      <Button asChild size="sm" variant="outline" className="w-full h-8 text-[11px] gap-1">
                        <Link to={`/editar-anuncio/${listing.id}`} className="flex-1">
                          <Pencil className="w-3 h-3" /> Editar
                        </Link>
                      </Button>

                      {listing.status === 'active' && !boosted && (
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-[11px] gap-1"
                          onClick={() => navigate(`/impulsionar/${listing.id}`)}
                        >
                          <Sparkles className="w-3 h-3" /> Impulsionar
                        </Button>
                      )}

                      {listing.status === 'active' ? (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0"
                          aria-label="Pausar anúncio"
                          title="Pausar"
                          onClick={() => pause(listing)}
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1 h-8 text-[11px] gap-1"
                          onClick={() => reactivate(listing)}
                        >
                          <Play className="w-3 h-3" /> Reativar
                        </Button>
                      )}

                      {listing.status === 'active' && (
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 shrink-0 text-success"
                          aria-label="Marcar como vendido"
                          title="Marcar como vendido"
                          onClick={() => markAsSold(listing)}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </Button>
                      )}

                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-8 w-8 shrink-0 text-destructive"
                        aria-label="Excluir anúncio"
                        title="Excluir"
                        onClick={() => setPendingDelete(listing)}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        onOpenChange={open => !open && setPendingDelete(null)}
        title="Excluir este anúncio?"
        description={`"${pendingDelete?.title || ''}" sai do ar imediatamente. Você poderá desfazer a exclusão pelo aviso que aparece em seguida.`}
        confirmLabel="Excluir anúncio"
        destructive
        onConfirm={confirmDelete}
      />
    </div>
  );
}
