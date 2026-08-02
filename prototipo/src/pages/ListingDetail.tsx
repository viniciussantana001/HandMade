import { useEffect, useRef, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  MapPin, Eye, User, Shield, ChevronLeft, ChevronRight, MessageSquare, Heart, Flag, Lock, Star,
  Pencil, Pause, Play, BarChart3, Sparkles, Package, Truck, CheckCircle2, Ruler,
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  listingStore, messageStore, favoriteStore, notificationStore, reportStore, reviewStore, useStoreVersion,
} from '@/lib/store';
import { CATEGORIES, CONDITIONS, LISTING_TYPES, UNITS, DELIVERY_OPTIONS } from '@/lib/categories';
import { useAuth } from '@/lib/AuthContext';
import { formatCurrency, formatRelativeDate, formatDecimal } from '@/lib/formatters';
import { imageUrl } from '@/lib/images';
import AppHeader from '@/components/layout/AppHeader';
import SmartImage from '@/components/common/SmartImage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { toast } from 'sonner';

const REPORT_REASONS = [
  { value: 'prohibited', label: 'Material proibido ou perigoso' },
  { value: 'fake', label: 'Anúncio falso ou enganoso' },
  { value: 'wrong_category', label: 'Categoria incorreta' },
  { value: 'offensive', label: 'Conteúdo ofensivo' },
  { value: 'stolen', label: 'Suspeita de material furtado' },
  { value: 'other', label: 'Outro motivo' },
];

/**
 * Detalhe do anúncio.
 *
 * Mudanças na 5.0: o botão de compra leva ao fluxo de pagamento direto
 * (/pagamento/:id) em lugar do diálogo que debitava a carteira; as ações do
 * dono não recarregam a página; e a denúncia passou a ser funcional.
 */
export default function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  useStoreVersion();

  const [currentImage, setCurrentImage] = useState(0);
  const [showReport, setShowReport] = useState(false);
  const [reportReason, setReportReason] = useState('prohibited');
  const [reportDetails, setReportDetails] = useState('');
  const [confirmAction, setConfirmAction] = useState<'pause' | 'reactivate' | null>(null);
  const viewCounted = useRef(false);

  const listing = listingStore.get(id || '');

  // Conta uma visualização por sessão de tela, apenas para quem não é o dono.
  useEffect(() => {
    if (!listing || viewCounted.current) return;
    if (user?.email === listing.created_by) return;
    viewCounted.current = true;
    listingStore.update(listing.id, { views: (listing.views || 0) + 1 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listing?.id, user?.email]);

  if (!listing) {
    return (
      <div>
        <AppHeader showBack title="Anúncio" />
        <div className="px-4 py-20 text-center">
          <div className="w-14 h-14 rounded-2xl bg-muted flex items-center justify-center mx-auto mb-3">
            <Package className="w-7 h-7 text-muted-foreground" />
          </div>
          <p className="text-lg font-bold mb-2">Anúncio não encontrado</p>
          <p className="text-sm text-muted-foreground mb-4 max-w-xs mx-auto">
            Este anúncio pode ter sido removido pelo vendedor ou já foi vendido.
          </p>
          <Button asChild><Link to="/marketplace">Voltar ao marketplace</Link></Button>
        </div>
      </div>
    );
  }

  const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
  const listingType = LISTING_TYPES[listing.listing_type] || LISTING_TYPES.sale;
  const images = listing.images?.length ? listing.images : [];
  const isOwner = user?.email === listing.created_by;
  const isFavorited = user
    ? favoriteStore.filter(f => f.user_email === user.email && f.listing_id === listing.id).length > 0
    : false;
  const isBoosted = Boolean(
    listing.is_boosted && listing.boost_until && new Date(listing.boost_until) > new Date()
  );

  const sellerReviews = reviewStore.filter(r => r.reviewed_email === listing.created_by);
  const sellerRating = sellerReviews.length
    ? sellerReviews.reduce((sum, r) => sum + r.rating, 0) / sellerReviews.length
    : 0;

  const goToCheckout = () => {
    if (!user) {
      navigate('/login', { state: { from: `/anuncio/${listing.id}` } });
      return;
    }
    if (listing.listing_type === 'donation') {
      startChat();
      return;
    }
    navigate(`/pagamento/${listing.id}`);
  };

  const toggleFavorite = () => {
    if (!user) {
      navigate('/login', { state: { from: `/anuncio/${listing.id}` } });
      return;
    }
    const existing = favoriteStore.filter(
      f => f.user_email === user.email && f.listing_id === listing.id
    );
    if (existing.length > 0) {
      const snapshot = { ...existing[0] };
      favoriteStore.delete(existing[0].id);
      toast.success('Removido dos favoritos', {
        action: {
          label: 'Desfazer',
          onClick: () => {
            favoriteStore.upsert(snapshot);
            toast.success('Salvo nos favoritos novamente');
          },
        },
      });
    } else {
      favoriteStore.create({
        user_email: user.email,
        listing_id: listing.id,
        created_at: new Date().toISOString(),
      } as any);
      toast.success('Salvo nos favoritos ♡');
    }
  };

  const startChat = () => {
    if (!user) {
      navigate('/login', { state: { from: `/anuncio/${listing.id}` } });
      return;
    }
    const convId = [user.email, listing.created_by, listing.id].sort().join('_');
    const existing = messageStore.filter(m => m.conversation_id === convId);
    if (existing.length === 0) {
      messageStore.create({
        conversation_id: convId,
        listing_id: listing.id,
        listing_title: listing.title,
        listing_image: listing.images?.[0] || '',
        listing_price: listing.price,
        sender_email: user.email,
        sender_name: user.full_name,
        recipient_email: listing.created_by,
        recipient_name: listing.seller_name,
        content:
          listing.listing_type === 'donation'
            ? `Olá! Tenho interesse na doação "${listing.title}". Ainda está disponível?`
            : `Olá! Tenho interesse no "${listing.title}". Podemos conversar?`,
        read: false,
        created_date: new Date().toISOString(),
      } as any);
      listingStore.update(listing.id, { contacts: (listing.contacts || 0) + 1 });
      notificationStore.create({
        recipient_email: listing.created_by,
        type: 'listing_interest',
        title: 'Novo interesse no anúncio',
        message: `${user.full_name} iniciou uma conversa sobre "${listing.title}".`,
        action_url: `/chat/${convId}`,
        read: false,
        created_at: new Date().toISOString(),
      } as any);
    }
    navigate(`/chat/${convId}`);
  };

  const submitReport = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (reportDetails.trim().length < 10) {
      toast.error('Descreva o problema com pelo menos 10 caracteres');
      return;
    }
    reportStore.create({
      listing_id: listing.id,
      reporter_email: user.email,
      reason: reportReason,
      description: reportDetails.trim(),
      status: 'pending',
      created_at: new Date().toISOString(),
    } as any);
    listingStore.update(listing.id, {
      is_flagged: true,
      report_count: (listing.report_count || 0) + 1,
    });
    toast.success('Denúncia enviada', {
      description: 'Nossa equipe de moderação vai analisar em até 48 horas.',
    });
    setShowReport(false);
    setReportDetails('');
  };

  const togglePause = () => {
    const next = listing.status === 'active' ? 'paused' : 'active';
    listingStore.update(listing.id, { status: next });
    toast.success(next === 'paused' ? 'Anúncio pausado' : 'Anúncio reativado', {
      description:
        next === 'paused'
          ? 'Ele não aparece mais nas buscas.'
          : 'Ele já voltou a aparecer nas buscas.',
      action: {
        label: 'Desfazer',
        onClick: () => {
          listingStore.update(listing.id, { status: listing.status });
          toast.success('Alteração desfeita');
        },
      },
    });
    setConfirmAction(null);
  };

  return (
    <div>
      <AppHeader showBack />

      {/* Galeria */}
      <div className="relative aspect-square bg-muted overflow-hidden">
        {images.length > 0 ? (
          <motion.img
            key={currentImage}
            initial={{ opacity: 0.4 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            src={imageUrl(images[currentImage], 'detail')}
            alt={`${listing.title} — foto ${currentImage + 1} de ${images.length}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center">
            <cat.icon className="w-16 h-16 text-muted-foreground/20 mb-2" />
            <p className="text-xs text-muted-foreground">Sem foto disponível</p>
          </div>
        )}

        {isBoosted && (
          <Badge className="absolute top-3 left-3 bg-warning text-warning-foreground border-0 gap-1">
            <Sparkles className="w-3 h-3" /> Destaque
          </Badge>
        )}

        {images.length > 1 && (
          <>
            <button
              type="button"
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-foreground/60 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
              onClick={() => setCurrentImage(i => (i > 0 ? i - 1 : images.length - 1))}
            >
              <ChevronLeft className="w-5 h-5 text-card" />
            </button>
            <button
              type="button"
              aria-label="Próxima foto"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-foreground/60 backdrop-blur rounded-full flex items-center justify-center active:scale-95 transition-transform"
              onClick={() => setCurrentImage(i => (i < images.length - 1 ? i + 1 : 0))}
            >
              <ChevronRight className="w-5 h-5 text-card" />
            </button>
            {/* /50 sobre foto clara dava 3,39:1; /70 garante 6,58:1. */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-foreground/70 text-card text-[10px] font-medium px-2 py-0.5 rounded-full tabular-nums">
              {currentImage + 1} de {images.length}
            </div>
            <div className="absolute bottom-9 left-2 right-2 flex gap-1.5 justify-center">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentImage(i)}
                  aria-label={`Ver foto ${i + 1}`}
                  aria-current={i === currentImage}
                  className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-opacity ${
                    i === currentImage ? 'border-card' : 'border-transparent opacity-60'
                  }`}
                >
                  <img src={imageUrl(img, 'thumb')} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      <div className="px-4 py-4">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <Badge className={`${listingType.color} border-0 text-xs`}>
            {listingType.emoji} {listingType.label}
          </Badge>
          <Badge className={`${cat.color} border-0 text-xs`}>{cat.label}</Badge>
          {listing.condition && (
            <Badge variant="outline" className="text-xs">{CONDITIONS[listing.condition]}</Badge>
          )}
          {listing.status === 'paused' && (
            <Badge variant="outline" className="text-xs gap-1">
              <Pause className="w-3 h-3" /> Pausado
            </Badge>
          )}
          {listing.status === 'sold' && (
            <Badge className="bg-success/10 text-success border-0 text-xs gap-1">
              <CheckCircle2 className="w-3 h-3" /> Vendido
            </Badge>
          )}
        </div>

        <h1 className="text-xl font-bold leading-tight">{listing.title}</h1>
        <p className="text-2xl font-bold text-primary mt-2 tabular-nums">
          {listing.listing_type === 'donation'
            ? 'Doação — grátis'
            : listing.price === 0
              ? 'A combinar'
              : formatCurrency(listing.price)}
        </p>

        <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground flex-wrap">
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3" />
            {listing.location || 'Localização não informada'}
          </span>
          <span className="flex items-center gap-1"><Eye className="w-3 h-3" />{listing.views || 0}</span>
          <span className="flex items-center gap-1">{formatRelativeDate(listing.created_date)}</span>
        </div>

        {/* Ficha do material */}
        <Card className="p-3 mt-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Sobre o material
          </p>
          <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-sm">
            {listing.quantity && (
              <div>
                <dt className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <Ruler className="w-3 h-3" /> Quantidade
                </dt>
                <dd className="font-medium">
                  {listing.quantity} {UNITS[listing.unit || 'units'] || ''}
                </dd>
              </div>
            )}
            <div>
              <dt className="text-[11px] text-muted-foreground">Condição</dt>
              <dd className="font-medium">{CONDITIONS[listing.condition] || '—'}</dd>
            </div>
          </dl>
          {listing.delivery_options?.length > 0 && (
            <>
              <Separator className="my-2.5" />
              <p className="text-[11px] text-muted-foreground flex items-center gap-1 mb-1.5">
                <Truck className="w-3 h-3" /> Formas de entrega
              </p>
              <ul className="space-y-1">
                {listing.delivery_options.map(option => (
                  <li key={option} className="text-xs flex items-start gap-1.5">
                    <CheckCircle2 className="w-3 h-3 text-success shrink-0 mt-0.5" />
                    {DELIVERY_OPTIONS[option] || option}
                  </li>
                ))}
              </ul>
            </>
          )}
        </Card>

        <Separator className="my-4" />

        {/* Vendedor */}
        <Link to={`/vendedor/${encodeURIComponent(listing.created_by)}`} className="block">
          <Card className="p-3 active:bg-muted transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-primary font-bold">
                  {listing.seller_name?.charAt(0)?.toUpperCase()}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm truncate">{listing.seller_name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {sellerRating > 0 ? (
                    <span className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-warning-strong text-warning-strong" />
                      {formatDecimal(sellerRating)} ({sellerReviews.length})
                    </span>
                  ) : (
                    <span>Membro da HandMade</span>
                  )}
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
            </div>
          </Card>
        </Link>

        <Separator className="my-4" />

        <h2 className="font-semibold text-base mb-2">Descrição</h2>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap leading-relaxed">
          {listing.description}
        </p>

        <Separator className="my-4" />

        {/* Proteção */}
        {listing.listing_type !== 'donation' && (
          <Card className="p-4 bg-primary/5 border-primary/20 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-sm text-primary">Sua compra é protegida</h3>
            </div>
            <ul className="space-y-1.5 text-xs text-muted-foreground">
              <li>✓ Pagamento direto por PIX, cartão ou boleto, com comprovante na hora</li>
              <li>✓ 7 dias para pedir a devolução se o material não chegar como anunciado</li>
              <li>✓ Estorno pelo mesmo método de pagamento usado na compra</li>
            </ul>
          </Card>
        )}

        {/* Ações do comprador */}
        {!isOwner && listing.status === 'active' && (
          <div className="space-y-2">
            <Button className="w-full h-12 text-[15px] gap-2" onClick={goToCheckout}>
              {listing.listing_type === 'donation' ? (
                <><MessageSquare className="w-4 h-4" /> Quero esta doação</>
              ) : (
                <><Lock className="w-4 h-4" /> Comprar com proteção</>
              )}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 h-11 gap-2" onClick={startChat}>
                <MessageSquare className="w-4 h-4" /> Conversar
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="h-11 w-11 shrink-0"
                onClick={toggleFavorite}
                aria-label={isFavorited ? 'Remover dos favoritos' : 'Salvar nos favoritos'}
                aria-pressed={isFavorited}
              >
                <Heart className={`w-4 h-4 ${isFavorited ? 'fill-destructive text-destructive' : ''}`} />
              </Button>
            </div>
          </div>
        )}

        {!isOwner && listing.status !== 'active' && (
          <Card className="p-4 bg-muted text-center">
            <p className="text-sm font-medium">
              {listing.status === 'sold' ? 'Este material já foi vendido' : 'Este anúncio está pausado'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Veja outros materiais parecidos no marketplace.
            </p>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <Link to={`/marketplace?category=${listing.category}`}>
                Ver materiais de {cat.label.toLowerCase()}
              </Link>
            </Button>
          </Card>
        )}

        {/* Ações do dono */}
        {isOwner && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button asChild className="w-full h-11 gap-2">
                <Link to={`/editar-anuncio/${listing.id}`}><Pencil className="w-4 h-4" /> Editar</Link>
              </Button>
              {listing.status === 'active' ? (
                <Button
                  variant="outline"
                  className="w-full h-11 gap-2"
                  onClick={() => setConfirmAction('pause')}
                >
                  <Pause className="w-4 h-4" /> Pausar
                </Button>
              ) : listing.status === 'paused' ? (
                <Button variant="outline" className="w-full h-11 gap-2" onClick={togglePause}>
                  <Play className="w-4 h-4" /> Reativar
                </Button>
              ) : (
                <Button asChild variant="outline" className="w-full h-11 gap-2">
                  <Link to="/meus-anuncios">
                    <BarChart3 className="w-4 h-4" /> Gerenciar
                  </Link>
                </Button>
              )}
            </div>

            {listing.status === 'active' && !isBoosted && (
              <Button
                variant="outline"
                className="w-full h-11 gap-2 border-warning-strong/40 text-warning-strong"
                onClick={() => navigate(`/impulsionar/${listing.id}`)}
              >
                <Sparkles className="w-4 h-4" /> Impulsionar este anúncio
              </Button>
            )}

            <div className="grid grid-cols-2 gap-2 text-center text-xs text-muted-foreground pt-2">
              <div className="p-2.5 bg-muted rounded-xl">
                <p className="text-base font-bold text-foreground tabular-nums">{listing.views || 0}</p>
                <p>Visualizações</p>
              </div>
              <div className="p-2.5 bg-muted rounded-xl">
                <p className="text-base font-bold text-foreground tabular-nums">{listing.contacts || 0}</p>
                <p>Contatos recebidos</p>
              </div>
            </div>
          </div>
        )}

        {!isOwner && (
          <button
            type="button"
            className="flex items-center gap-1.5 text-xs text-muted-foreground mt-6 mx-auto py-2 px-3 rounded-full active:bg-muted transition-colors"
            onClick={() => (user ? setShowReport(true) : navigate('/login'))}
          >
            <Flag className="w-3.5 h-3.5" /> Denunciar anúncio
          </button>
        )}
      </div>

      {/* Denúncia */}
      <Dialog open={showReport} onOpenChange={setShowReport}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>Denunciar anúncio</DialogTitle></DialogHeader>
          <div className="space-y-3 py-1">
            <div>
              <Label className="text-sm">Motivo</Label>
              <RadioGroup value={reportReason} onValueChange={setReportReason} className="mt-2 space-y-1.5">
                {REPORT_REASONS.map(reason => (
                  <Label
                    key={reason.value}
                    className={`flex items-center gap-2.5 p-2.5 border rounded-xl cursor-pointer text-sm ${
                      reportReason === reason.value ? 'border-primary bg-primary/5' : ''
                    }`}
                  >
                    <RadioGroupItem value={reason.value} />
                    {reason.label}
                  </Label>
                ))}
              </RadioGroup>
            </div>
            <div>
              <Label htmlFor="report-details" className="text-sm">Conte o que aconteceu</Label>
              <Textarea
                id="report-details"
                placeholder="Descreva o problema com o máximo de detalhes possível"
                value={reportDetails}
                onChange={e => setReportDetails(e.target.value.slice(0, 500))}
                className="mt-1 h-24 text-sm"
              />
              <p className="text-[10px] text-muted-foreground mt-1 text-right tabular-nums">
                {reportDetails.length}/500
              </p>
            </div>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full h-11" onClick={submitReport}>Enviar denúncia</Button>
            <Button variant="outline" className="w-full" onClick={() => setShowReport(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmAction === 'pause'}
        onOpenChange={open => !open && setConfirmAction(null)}
        title="Pausar este anúncio?"
        description="Ele sai das buscas e da tela inicial, mas continua salvo. Você pode reativá-lo quando quiser."
        confirmLabel="Pausar anúncio"
        onConfirm={togglePause}
      />
    </div>
  );
}
