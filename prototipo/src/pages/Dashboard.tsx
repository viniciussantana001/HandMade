import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Package, Plus, ArrowRight, Eye, ShoppingBag, MessageSquare, TrendingUp, TrendingDown,
  Sparkles, Star, Lightbulb, Camera, Clock, CheckCircle2, BarChart3, Handshake, Truck,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { listingStore, orderStore, paymentStore, messageStore, reviewStore, useStoreVersion } from '@/lib/store';
import { getGreeting, formatCurrency, formatRelativeDate, formatDecimal, formatPercent } from '@/lib/formatters';
import { PLANS } from '@/lib/plans';
import AppHeader from '@/components/layout/AppHeader';
import SmartImage from '@/components/common/SmartImage';
import { DashboardSkeleton } from '@/components/common/StateViews';
import { CATEGORIES } from '@/lib/categories';

/**
 * Painel do vendedor — redesenhado na 5.0 (U1).
 *
 * A v4.0 mostrava quatro números soltos e o saldo da carteira. Aqui o painel
 * responde, na ordem, às perguntas que o vendedor realmente faz: o que precisa
 * da minha atenção, como estou indo, o que aconteceu, e o que fazer para
 * vender mais.
 */
export default function Dashboard() {
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  useStoreVersion();

  const data = useMemo(() => {
    if (!user) return null;

    const listings = listingStore.filter(l => l.created_by === user.email);
    const orders = orderStore.filter(o => o.buyer_email === user.email || o.seller_email === user.email);
    const sales = orders.filter(o => o.seller_email === user.email);
    const purchases = orders.filter(o => o.buyer_email === user.email);
    const payments = paymentStore.filter(p => p.payee_email === user.email && p.status === 'approved');
    const unread = messageStore.filter(m => m.recipient_email === user.email && !m.read);
    const reviews = reviewStore.filter(r => r.reviewed_email === user.email);

    const activeListings = listings.filter(l => l.status === 'active');
    const pausedListings = listings.filter(l => l.status === 'paused');
    const soldListings = listings.filter(l => l.status === 'sold');
    const boosted = activeListings.filter(l => l.is_boosted && l.boost_until && new Date(l.boost_until) > new Date());

    const completedSales = sales.filter(s => ['completed', 'delivered'].includes(s.status));
    const totalRevenue = payments.reduce((acc, p) => acc + p.net_amount, 0);
    const totalViews = listings.reduce((acc, l) => acc + (l.views || 0), 0);
    const totalContacts = listings.reduce((acc, l) => acc + (l.contacts || 0), 0);
    // Conversão de visualização em contato: mede a qualidade de foto, título e preço.
    const contactRate = totalViews > 0 ? (totalContacts / totalViews) * 100 : 0;
    const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

    // Tendência de vendas: últimos 30 dias contra os 30 anteriores.
    const now = Date.now();
    const last30 = sales.filter(s => now - new Date(s.created_date).getTime() <= 30 * 86400000);
    const prev30 = sales.filter(s => {
      const age = now - new Date(s.created_date).getTime();
      return age > 30 * 86400000 && age <= 60 * 86400000;
    });
    const salesTrend = prev30.length === 0
      ? (last30.length > 0 ? 100 : 0)
      : ((last30.length - prev30.length) / prev30.length) * 100;

    type Action = { key: string; icon: typeof Package; title: string; description: string; link: string; tone: 'urgent' | 'attention' | 'info' };
    const actions: Action[] = [];

    const toShip = sales.filter(s => s.status === 'paid');
    if (toShip.length) actions.push({
      key: 'ship', icon: Truck,
      title: `${toShip.length} venda${toShip.length > 1 ? 's pagas' : ' paga'} aguardando envio`,
      description: 'Combine a entrega ou informe o código de rastreio.',
      link: '/meus-pedidos', tone: 'urgent',
    });

    const toConfirm = purchases.filter(p => p.status === 'shipped');
    if (toConfirm.length) actions.push({
      key: 'confirm', icon: CheckCircle2,
      title: `${toConfirm.length} pedido${toConfirm.length > 1 ? 's' : ''} a caminho`,
      description: 'Confirme o recebimento para liberar o pagamento ao vendedor.',
      link: '/meus-pedidos', tone: 'attention',
    });

    if (unread.length) actions.push({
      key: 'messages', icon: MessageSquare,
      title: `${unread.length} mensagem${unread.length > 1 ? 'ns' : ''} não lida${unread.length > 1 ? 's' : ''}`,
      description: 'Responder rápido aumenta bastante a chance de fechar a venda.',
      link: '/chat', tone: 'attention',
    });

    const pendingPay = purchases.filter(p => p.status === 'pending_payment');
    if (pendingPay.length) actions.push({
      key: 'pending', icon: Clock,
      title: `${pendingPay.length} pagamento${pendingPay.length > 1 ? 's' : ''} pendente${pendingPay.length > 1 ? 's' : ''}`,
      description: 'Há boleto aguardando compensação.',
      link: '/meus-pedidos', tone: 'info',
    });

    type Insight = { key: string; icon: typeof Lightbulb; title: string; description: string; link: string; cta: string };
    const insights: Insight[] = [];

    const noPhoto = activeListings.filter(l => !l.images?.length);
    if (noPhoto.length) insights.push({
      key: 'photos', icon: Camera,
      title: `${noPhoto.length} anúncio${noPhoto.length > 1 ? 's' : ''} sem foto`,
      description: 'Anúncios com foto recebem muito mais contatos. Adicione ao menos uma.',
      link: `/editar-anuncio/${noPhoto[0].id}`, cta: 'Adicionar foto',
    });

    const stale = activeListings.filter(
      l => now - new Date(l.created_date).getTime() > 30 * 86400000 && !(l.contacts || 0)
    );
    if (stale.length) insights.push({
      key: 'stale', icon: TrendingDown,
      title: `${stale.length} anúncio${stale.length > 1 ? 's' : ''} sem contato há mais de 30 dias`,
      description: 'Revise o preço ou impulsione para voltar ao topo das buscas.',
      link: `/impulsionar/${stale[0].id}`, cta: 'Impulsionar',
    });

    if (activeListings.length && !boosted.length) insights.push({
      key: 'boost', icon: Sparkles,
      title: 'Nenhum anúncio em destaque',
      description: 'Um impulso de 7 dias custa R$ 19,90 e costuma triplicar as visualizações.',
      link: `/impulsionar/${activeListings[0].id}`, cta: 'Ver planos de destaque',
    });

    if (pausedListings.length) insights.push({
      key: 'paused', icon: Package,
      title: `${pausedListings.length} anúncio${pausedListings.length > 1 ? 's' : ''} pausado${pausedListings.length > 1 ? 's' : ''}`,
      description: 'Anúncios pausados não aparecem nas buscas. Reative quando quiser.',
      link: '/meus-anuncios', cta: 'Gerenciar',
    });

    if (user.subscription_plan === 'free' && completedSales.length >= 3) insights.push({
      key: 'plan', icon: TrendingUp,
      title: 'O plano Pro já pode valer a pena',
      description: 'Com o seu volume de vendas, a taxa de 3% compensa a mensalidade.',
      link: '/planos', cta: 'Comparar planos',
    });

    if (!activeListings.length) insights.push({
      key: 'first', icon: Plus,
      title: 'Publique seu primeiro anúncio',
      description: 'Leva menos de 3 minutos e a publicação é gratuita.',
      link: '/criar-anuncio', cta: 'Publicar agora',
    });

    const activity = [
      ...sales.slice(0, 5).map(s => ({
        id: `o-${s.id}`, icon: Handshake, text: `Venda de "${s.listing_title}"`,
        detail: formatCurrency(s.amount), date: s.created_date, link: '/meus-pedidos', tone: 'success' as const,
      })),
      ...unread.slice(0, 5).map(m => ({
        id: `m-${m.id}`, icon: MessageSquare, text: `${m.sender_name} enviou uma mensagem`,
        detail: m.listing_title, date: m.created_date, link: `/chat/${m.conversation_id}`, tone: 'info' as const,
      })),
      ...reviews.slice(0, 3).map(r => ({
        id: `r-${r.id}`, icon: Star, text: `Nova avaliação de ${r.rating} estrela${r.rating > 1 ? 's' : ''}`,
        detail: r.comment.slice(0, 60), date: r.created_at, link: '/perfil', tone: 'warning' as const,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 6);

    return {
      activeListings, pausedListings, soldListings, boosted, sales, purchases, completedSales,
      totalRevenue, totalViews, totalContacts, contactRate, avgRating, reviewCount: reviews.length,
      salesTrend, actions, insights, activity, unreadCount: unread.length,
    };
  }, [user]);

  if (loading) return <DashboardSkeleton />;
  if (!user || !data) return null;

  const greeting = getGreeting(user.full_name?.split(' ')[0] || 'Usuário');
  const plan = PLANS[user.subscription_plan as keyof typeof PLANS] || PLANS.free;
  const maxListings = user.subscription_plan === 'free'
    ? (user.account_type === 'company' ? PLANS.free.max_listings_company : PLANS.free.max_listings_individual)
    : user.subscription_plan === 'pro' ? PLANS.pro.max_listings : null;
  const usage = maxListings ? Math.min(100, (data.activeListings.length / maxListings) * 100) : 0;

  return (
    <div>
      <AppHeader />
      <div className="px-4 py-4 space-y-5">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h1 className="text-xl font-bold leading-tight">{greeting.text} {greeting.emoji}</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              {data.actions.length
                ? `${data.actions.length} ite${data.actions.length > 1 ? 'ns pedem' : 'm pede'} sua atenção`
                : 'Tudo em dia por aqui 🌿'}
            </p>
          </div>
          <Button asChild size="sm" className="gap-1">
            <Link to="/criar-anuncio" className="shrink-0"><Plus className="w-4 h-4" /> Anunciar</Link>
          </Button>
        </motion.div>

        {data.actions.length > 0 && (
          <section aria-labelledby="dash-acoes">
            <h2 id="dash-acoes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Precisa da sua atenção
            </h2>
            <div className="space-y-2">
              {data.actions.map((action, i) => {
                const Icon = action.icon;
                const card = action.tone === 'urgent' ? 'border-destructive/30 bg-destructive/5'
                  : action.tone === 'attention' ? 'border-warning-strong/30 bg-warning/5' : 'border-info/30 bg-info/5';
                const chip = action.tone === 'urgent' ? 'text-destructive bg-destructive/10'
                  : action.tone === 'attention' ? 'text-warning-strong bg-warning/10' : 'text-info bg-info/10';
                return (
                  <motion.div key={action.key} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}>
                    <Link to={action.link}>
                      <Card className={`p-3 ${card} active:scale-[0.99] transition-transform`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${chip}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold leading-tight">{action.title}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">{action.description}</p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-muted-foreground shrink-0" />
                        </div>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          </section>
        )}

        <section aria-labelledby="dash-numeros">
          <h2 id="dash-numeros" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Seus números
          </h2>

          <Card className="bg-gradient-to-br from-primary to-primary-deep text-primary-foreground mb-3 overflow-hidden relative">
            <BarChart3 className="absolute -right-3 -bottom-3 w-24 h-24 opacity-10" aria-hidden="true" />
            <CardContent className="p-4">
              <p className="text-xs font-medium">Recebido em vendas concluídas</p>
              <p className="text-3xl font-bold mt-0.5 tabular-nums">{formatCurrency(data.totalRevenue)}</p>
              <div className="flex items-center gap-4 mt-3 text-xs">
                <span className="flex items-center gap-1">
                  <Handshake className="w-3.5 h-3.5" />
                  {data.completedSales.length} venda{data.completedSales.length !== 1 ? 's' : ''}
                </span>
                {data.salesTrend !== 0 && (
                  <span className="flex items-center gap-1">
                    {data.salesTrend > 0 ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    {data.salesTrend > 0 ? '+' : ''}{Math.round(data.salesTrend)}% em 30 dias
                  </span>
                )}
              </div>
              {/* opacity-70 misturava a nota com o verde do painel (3,90:1). */}
              <p className="text-[10px] mt-2 leading-relaxed">
                Valor líquido, já com a taxa de {plan.fee_percent}% descontada. O repasse cai direto na
                sua conta pelo método usado na compra.
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-2.5">
            <MetricCard icon={Package} value={String(data.activeListings.length)} label="anúncios ativos"
              sub={data.pausedListings.length
                ? `${data.pausedListings.length} pausado${data.pausedListings.length > 1 ? 's' : ''}`
                : `${data.soldListings.length} vendido${data.soldListings.length !== 1 ? 's' : ''}`}
              tone="info" link="/meus-anuncios" />
            <MetricCard icon={Eye} value={data.totalViews.toLocaleString('pt-BR')} label="visualizações"
              sub={`${data.totalContacts} contato${data.totalContacts !== 1 ? 's' : ''}`} tone="muted" />
            <MetricCard icon={TrendingUp} value={formatPercent(data.contactRate)} label="taxa de contato"
              sub={data.contactRate >= 5 ? 'acima da média' : data.contactRate > 0 ? 'melhore fotos e preço' : 'sem contatos ainda'}
              tone={data.contactRate >= 5 ? 'success' : 'warning'} />
            <MetricCard icon={Star} value={data.avgRating > 0 ? formatDecimal(data.avgRating) : '—'} label="avaliação média"
              sub={data.reviewCount ? `${data.reviewCount} avaliação${data.reviewCount > 1 ? 'ões' : ''}` : 'ainda sem avaliações'}
              tone="warning" />
          </div>
        </section>

        <Card className={user.subscription_plan === 'pro' ? 'bg-warning/5 border-warning-strong/30'
          : user.subscription_plan === 'enterprise' ? 'bg-success/5 border-success/30' : ''}>
          <CardContent className="p-3.5">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="text-sm font-semibold flex items-center gap-1.5">
                  Plano {plan.name}
                  {user.subscription_plan !== 'free' && (
                    <Badge className="bg-warning text-warning-foreground border-0 text-[9px] px-1.5 py-0">★</Badge>
                  )}
                </span>
                <p className="text-xs text-muted-foreground">Taxa de {plan.fee_percent}% por venda</p>
              </div>
              <Button asChild size="sm" variant="outline" className="text-xs h-8">
                <Link to="/planos">
                  {user.subscription_plan === 'free' ? 'Ver planos' : 'Gerenciar'}
                </Link>
              </Button>
            </div>
            {maxListings && (
              <>
                <Progress value={usage} className="h-1.5" />
                <p className="text-[11px] text-muted-foreground mt-1.5">
                  {data.activeListings.length} de {maxListings} anúncios ativos
                  {usage >= 80 && ' · você está perto do limite do plano'}
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {data.insights.length > 0 && (
          <section aria-labelledby="dash-sugestoes">
            <h2 id="dash-sugestoes" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Lightbulb className="w-3.5 h-3.5" /> Como vender mais
            </h2>
            <div className="space-y-2">
              {data.insights.slice(0, 3).map(insight => {
                const Icon = insight.icon;
                return (
                  <Card key={insight.key} className="p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold leading-tight">{insight.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                        <Button asChild size="sm" variant="outline" className="mt-2 h-7 text-[11px]">
                          <Link to={insight.link}>{insight.cta}</Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </section>
        )}

        {data.activity.length > 0 && (
          <section aria-labelledby="dash-atividade">
            <h2 id="dash-atividade" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              Atividade recente
            </h2>
            <Card>
              <CardContent className="p-0">
                {data.activity.map((item, i) => {
                  const Icon = item.icon;
                  const chip = item.tone === 'success' ? 'text-success bg-success/10'
                    : item.tone === 'warning' ? 'text-warning-strong bg-warning/10' : 'text-info bg-info/10';
                  return (
                    <Link key={item.id} to={item.link}
                      className={`flex items-center gap-3 p-3 active:bg-muted transition-colors ${i < data.activity.length - 1 ? 'border-b' : ''}`}>
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${chip}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.text}</p>
                        <p className="text-[11px] text-muted-foreground truncate">{item.detail}</p>
                      </div>
                      <span className="text-[10px] text-muted-foreground shrink-0">{formatRelativeDate(item.date)}</span>
                    </Link>
                  );
                })}
              </CardContent>
            </Card>
          </section>
        )}

        <section aria-labelledby="dash-atalhos">
          <h2 id="dash-atalhos" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Atalhos
          </h2>
          <div className="grid grid-cols-2 gap-2.5">
            <ShortcutCard icon={Package} label="Meus anúncios" value={`${data.activeListings.length} ativos`} link="/meus-anuncios" />
            <ShortcutCard icon={ShoppingBag} label="Compras e vendas"
              value={`${data.sales.length + data.purchases.length} no total`} link="/meus-pedidos" />
            <ShortcutCard icon={MessageSquare} label="Mensagens"
              value={data.unreadCount ? `${data.unreadCount} não lidas` : 'Tudo lido'} link="/chat"
              highlight={data.unreadCount > 0} />
            <ShortcutCard icon={Sparkles} label="Impulsionar"
              value={data.boosted.length ? `${data.boosted.length} em destaque` : 'Destacar anúncio'} link="/meus-anuncios" />
          </div>
        </section>

        {data.activeListings.length > 0 && (
          <section aria-labelledby="dash-anuncios">
            <div className="flex items-center justify-between mb-2">
              <h2 id="dash-anuncios" className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Seus anúncios
              </h2>
              <Button asChild variant="ghost" size="sm" className="gap-1 text-xs h-7">
                <Link to="/meus-anuncios">Ver todos <ArrowRight className="w-3 h-3" /></Link>
              </Button>
            </div>
            <div className="space-y-2">
              {data.activeListings.slice(0, 3).map(listing => {
                const cat = CATEGORIES[listing.category] || CATEGORIES.outro;
                const isBoosted = listing.is_boosted && listing.boost_until && new Date(listing.boost_until) > new Date();
                return (
                  <Link key={listing.id} to={`/anuncio/${listing.id}`}>
                    <Card className="p-2.5 active:bg-muted transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0">
                          <SmartImage src={listing.images?.[0]} alt={listing.title} slot="thumb"
                            fallback={<cat.icon className="w-4 h-4 text-muted-foreground/30" />} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{listing.title}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            <span className="text-xs font-bold text-primary tabular-nums">
                              {listing.listing_type === 'donation' ? 'Doação' : formatCurrency(listing.price)}
                            </span>
                            {isBoosted && (
                              <Badge className="bg-warning/10 text-warning-strong border-0 text-[9px] px-1.5 py-0 gap-0.5">
                                <Sparkles className="w-2.5 h-2.5" /> Destaque
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-sm font-bold tabular-nums">{listing.views || 0}</p>
                          <p className="text-[9px] text-muted-foreground">views</p>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function MetricCard({ icon: Icon, value, label, sub, tone, link }: {
  icon: typeof Package; value: string; label: string; sub: string;
  tone: 'info' | 'success' | 'warning' | 'muted'; link?: string;
}) {
  const toneClass = {
    info: 'text-info bg-info/10', success: 'text-success bg-success/10',
    warning: 'text-warning-strong bg-warning/10', muted: 'text-muted-foreground bg-muted',
  }[tone];
  const content = (
    <Card className="h-full active:scale-[0.99] transition-transform">
      <CardContent className="p-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-2 ${toneClass}`}>
          <Icon className="w-4 h-4" />
        </div>
        <p className="text-xl font-bold leading-none tabular-nums">{value}</p>
        <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
        <p className="text-[10px] text-muted-foreground/80 mt-0.5 truncate">{sub}</p>
      </CardContent>
    </Card>
  );
  return link ? <Link to={link}>{content}</Link> : content;
}

function ShortcutCard({ icon: Icon, label, value, link, highlight }: {
  icon: typeof Package; label: string; value: string; link: string; highlight?: boolean;
}) {
  return (
    <Link to={link}>
      <Card className={`p-3 active:bg-muted transition-colors ${highlight ? 'border-primary/40 bg-primary/5' : ''}`}>
        <div className="flex items-center gap-2 mb-1.5">
          <Icon className={`w-4 h-4 ${highlight ? 'text-primary' : 'text-muted-foreground'}`} />
          <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto" />
        </div>
        <p className="text-xs font-semibold leading-tight">{label}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5">{value}</p>
      </Card>
    </Link>
  );
}
