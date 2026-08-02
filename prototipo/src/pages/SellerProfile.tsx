import { useParams, Link, useNavigate } from 'react-router-dom';
import AppHeader from '@/components/layout/AppHeader';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Star, ShieldCheck, Calendar, Package, MessageSquare } from 'lucide-react';
import { listingStore, reviewStore } from '@/lib/store';
import ListingCard from '@/components/listings/ListingCard';
import EmptyState from '@/components/common/EmptyState';
import { useAuth } from '@/lib/AuthContext';
import { formatRelativeDate, formatDecimal } from '@/lib/formatters';

export default function SellerProfile() {
  const { email } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const sellerEmail = decodeURIComponent(email || '');

  const sellerListings = listingStore.filter(l => l.created_by === sellerEmail);
  const activeListings = sellerListings.filter(l => l.status === 'active');
  const soldCount = sellerListings.filter(l => l.status === 'sold').length;
  const reviews = reviewStore.filter(r => r.reviewed_email === sellerEmail);
  const avgRating = reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  const seller = sellerListings[0];
  if (!seller) {
    return (
      <div>
        <AppHeader showBack title="Perfil do vendedor" />
        <div className="px-4 py-20 text-center">
          <p className="text-lg font-bold mb-2">Vendedor não encontrado</p>
          <Button asChild><Link to="/marketplace">Voltar ao marketplace</Link></Button>
        </div>
      </div>
    );
  }

  const sellerName = seller.seller_name;
  const initials = sellerName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  const memberSince = sellerListings.reduce((oldest, l) =>
    new Date(l.created_date) < new Date(oldest) ? l.created_date : oldest, sellerListings[0].created_date);
  const isOwn = user?.email === sellerEmail;

  const startChat = () => {
    if (!user) { navigate('/login'); return; }
    const firstActive = activeListings[0] || seller;
    const convId = [user.email, sellerEmail, firstActive.id].sort().join('_');
    navigate(`/chat/${convId}`);
  };

  return (
    <div>
      <AppHeader showBack title="Perfil do vendedor" />

      {/* Header card */}
      <div className="px-4 py-4">
        <Card className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-deep flex items-center justify-center shrink-0">
              <span className="text-primary-foreground font-bold text-xl">{initials}</span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1.5">
                <h1 className="text-lg font-bold truncate">{sellerName}</h1>
                <ShieldCheck className="w-4 h-4 text-primary shrink-0" />
              </div>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" /> {seller.location}
              </p>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                <Calendar className="w-3 h-3" /> Membro desde {formatRelativeDate(memberSince)}
              </p>
            </div>
          </div>

          <Separator className="my-3" />

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold">{activeListings.length}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Ativos</p>
            </div>
            <div>
              <p className="text-lg font-bold">{soldCount}</p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Vendidos</p>
            </div>
            <div>
              <p className="text-lg font-bold flex items-center justify-center gap-0.5">
                {avgRating > 0 ? formatDecimal(avgRating) : '—'}
                {avgRating > 0 && <Star className="w-3.5 h-3.5 fill-warning-strong text-warning-strong" />}
              </p>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wide">Avaliação</p>
            </div>
          </div>

          {!isOwn && (
            <Button className="w-full mt-4 h-11 gap-2" onClick={startChat}>
              <MessageSquare className="w-4 h-4" /> Conversar com {sellerName.split(' ')[0]}
            </Button>
          )}
        </Card>

        <div className="flex items-center gap-2 mt-5 mb-3">
          <Package className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-semibold text-sm">Anúncios ativos ({activeListings.length})</h2>
        </div>

        {activeListings.length === 0 ? (
          <EmptyState icon={<Package className="w-12 h-12" />} title="Sem anúncios ativos" description="Este vendedor não tem anúncios disponíveis no momento." />
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {activeListings.map((l, i) => (
              <ListingCard key={l.id} listing={l} index={i} />
            ))}
          </div>
        )}

        {reviews.length > 0 && (
          <>
            <div className="flex items-center gap-2 mt-6 mb-3">
              <Star className="w-4 h-4 text-muted-foreground" />
              <h2 className="font-semibold text-sm">Avaliações ({reviews.length})</h2>
            </div>
            <div className="space-y-2">
              {reviews.map(r => (
                <Card key={r.id} className="p-3">
                  <div className="flex items-center gap-1 mb-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'fill-warning-strong text-warning-strong' : 'text-muted-foreground/30'}`} />
                    ))}
                    <span className="text-[10px] text-muted-foreground ml-auto">{formatRelativeDate(r.created_at)}</span>
                  </div>
                  <p className="text-xs">{r.comment}</p>
                </Card>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
