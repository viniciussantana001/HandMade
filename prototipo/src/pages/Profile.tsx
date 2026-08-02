import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Package, ShoppingBag, Heart, Bell, HelpCircle, FileText, Shield, LogOut, ChevronRight, Star,
  Edit, Moon, Sun, CheckCircle2, KeyRound, LayoutDashboard, Sparkles, Receipt, Lock, Landmark,
  LineChart,
} from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';
import { useLogout, useRequireAuth } from '@/lib/session';
import { useTheme } from '@/lib/ThemeContext';
import { PLANS } from '@/lib/plans';
import { listingStore, orderStore, reviewStore, useStoreVersion } from '@/lib/store';
import { imageUrl } from '@/lib/images';
import { formatDecimal } from '@/lib/formatters';
import AppHeader from '@/components/layout/AppHeader';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { LoadingScreen } from '@/components/common/StateViews';
import { Switch } from '@/components/ui/switch';

/**
 * Perfil do usuário.
 *
 * Mudanças na 5.0: a entrada "Minha Carteira" foi removida (B3) e substituída
 * por "Meus pagamentos"; o encerramento de sessão usa `useLogout`, que navega
 * antes de limpar o estado e elimina a tela branca do bug B1.
 */
export default function Profile() {
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  const logout = useLogout();
  const { theme, toggleTheme } = useTheme();
  useStoreVersion();
  const [confirmLogout, setConfirmLogout] = useState(false);

  if (loading) return <LoadingScreen label="Carregando o perfil…" />;
  if (!user) return null;

  const plan = PLANS[user.subscription_plan as keyof typeof PLANS] || PLANS.free;

  const listings = listingStore.filter(l => l.created_by === user.email);
  const orders = orderStore.filter(o => o.buyer_email === user.email || o.seller_email === user.email);
  const reviews = reviewStore.filter(r => r.reviewed_email === user.email);
  const avgRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;

  const accountLinks = [
    { label: 'Painel', icon: LayoutDashboard, path: '/dashboard' },
    { label: 'Meus anúncios', icon: Package, path: '/meus-anuncios' },
    { label: 'Compras e vendas', icon: ShoppingBag, path: '/meus-pedidos' },
    { label: 'Meus pagamentos', icon: Receipt, path: '/meus-pagamentos' },
    { label: 'Favoritos', icon: Heart, path: '/favoritos' },
    { label: 'Notificações', icon: Bell, path: '/notificacoes' },
  ];

  const sellerLinks = [
    { label: 'Planos e taxas', icon: Sparkles, path: '/planos' },
    { label: 'Tributos e obrigações', icon: Landmark, path: '/tributos' },
    { label: 'Plano de negócio', icon: LineChart, path: '/plano-de-negocio' },
    { label: 'Como funciona', icon: HelpCircle, path: '/como-funciona' },
  ];

  const legalLinks = [
    { label: 'Privacidade e dados', icon: Lock, path: '/privacidade' },
    { label: 'Termos de Uso', icon: FileText, path: '/termos' },
    { label: 'Política de Privacidade', icon: Shield, path: '/politica-de-privacidade' },
    { label: 'Central de ajuda', icon: HelpCircle, path: '/ajuda' },
  ];

  return (
    <div>
      <AppHeader title="Meu Perfil" />
      <div className="px-4 py-4">
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-16 w-16">
            {user.avatar_url ? (
              <AvatarImage src={imageUrl(user.avatar_url, 'avatar')} alt={user.full_name} />
            ) : null}
            <AvatarFallback className="bg-primary/10 text-primary text-xl font-bold">
              {user.full_name?.charAt(0)?.toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-lg truncate">{user.full_name}</h2>
            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {user.account_type === 'company' ? 'Empresa' : 'Pessoa Física'}
              </Badge>
              {user.subscription_plan !== 'free' && (
                <Badge className="bg-warning text-warning-foreground text-[10px] border-0">★ {plan.name}</Badge>
              )}
              {avgRating > 0 && (
                <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
                  <Star className="w-3 h-3 fill-warning-strong text-warning-strong" />
                  {formatDecimal(avgRating)} ({reviews.length})
                </span>
              )}
            </div>
          </div>
          <Button asChild variant="outline" size="icon" className="h-9 w-9">
            <Link to="/perfil/editar" aria-label="Editar perfil">
              <Edit className="w-4 h-4" />
            </Link>
          </Button>
        </div>

        {/* Resumo da atividade */}
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Card className="p-2.5 text-center">
            <p className="text-lg font-bold tabular-nums">{listings.filter(l => l.status === 'active').length}</p>
            <p className="text-[10px] text-muted-foreground">anúncios ativos</p>
          </Card>
          <Card className="p-2.5 text-center">
            <p className="text-lg font-bold tabular-nums">{orders.length}</p>
            <p className="text-[10px] text-muted-foreground">negociações</p>
          </Card>
          <Card className="p-2.5 text-center">
            <p className="text-lg font-bold tabular-nums">
              {avgRating > 0 ? formatDecimal(avgRating) : '—'}
            </p>
            <p className="text-[10px] text-muted-foreground">avaliação</p>
          </Card>
        </div>

        <Card className={`p-3 mb-4 ${user.subscription_plan === 'free' ? 'bg-muted' : 'bg-warning/10 border-warning-strong/30'}`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold">Plano {plan.name}</p>
              <p className="text-xs text-muted-foreground">Taxa de {plan.fee_percent}% por venda</p>
            </div>
            <Button asChild size="sm" variant="outline" className="text-xs h-8">
              <Link to="/planos">Ver planos</Link>
            </Button>
          </div>
        </Card>

        <Card className="p-3 mb-4 border-primary/15 bg-primary/5">
          <div className="flex items-start gap-3">
            {user.auth_provider === 'google' ? (
              <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            ) : (
              <KeyRound className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            )}
            <div className="flex-1">
              <p className="text-sm font-semibold">
                {user.auth_provider === 'google' ? 'Login com Google' : 'Login por e-mail e senha'}
              </p>
              <p className="text-xs text-muted-foreground mt-0.5">
                {user.email_verified ? 'E-mail verificado.' : 'E-mail pendente de verificação.'}
              </p>
            </div>
            {user.email_verified && (
              <Badge className="bg-success/10 text-success border-0 text-[10px]">Verificado</Badge>
            )}
          </div>
        </Card>

        <LinkGroup title="Minha conta" links={accountLinks} />
        <Separator className="my-2" />
        <LinkGroup title="Vender na HandMade" links={sellerLinks} />
        <Separator className="my-2" />

        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
            Aparência
          </p>
          <div className="flex items-center justify-between p-3 rounded-xl">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sun className="w-5 h-5 text-warning-strong" />
              )}
              <span className="text-sm font-medium">Modo escuro</span>
            </div>
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              aria-label="Alternar modo escuro"
            />
          </div>
        </div>

        <Separator className="my-2" />
        <LinkGroup title="Privacidade e ajuda" links={legalLinks} />

        <Button
          variant="outline"
          className="w-full h-12 text-destructive border-destructive/30 mt-4 gap-2"
          onClick={() => setConfirmLogout(true)}
        >
          <LogOut className="w-4 h-4" /> Sair da conta
        </Button>

        <p className="text-[10px] text-muted-foreground text-center mt-4">
          HandMade 5.0 · protótipo acadêmico · Etec Euro Albino de Souza
        </p>
      </div>

      <ConfirmDialog
        open={confirmLogout}
        onOpenChange={setConfirmLogout}
        title="Sair da sua conta?"
        description="Seus anúncios e pedidos continuam salvos. Você volta para a tela de login e pode entrar novamente quando quiser."
        confirmLabel="Sair da conta"
        destructive
        onConfirm={logout}
      />
    </div>
  );
}

function LinkGroup({
  title,
  links,
}: {
  title: string;
  links: { label: string; icon: typeof Package; path: string }[];
}) {
  return (
    <div className="space-y-0.5 mb-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-1 mb-2">
        {title}
      </p>
      {links.map(link => (
        <Link
          key={link.path + link.label}
          to={link.path}
          className="flex items-center gap-3 p-3 rounded-xl active:bg-muted transition-colors"
        >
          <link.icon className="w-5 h-5 text-muted-foreground shrink-0" />
          <span className="flex-1 text-sm font-medium">{link.label}</span>
          <ChevronRight className="w-4 h-4 text-muted-foreground shrink-0" />
        </Link>
      ))}
    </div>
  );
}
