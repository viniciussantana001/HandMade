import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Package, Truck, CheckCircle, Clock, ShoppingBag, AlertTriangle, MessageSquare, Receipt, Barcode,
} from 'lucide-react';
import { orderStore, paymentStore, messageStore, notificationStore, useStoreVersion } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';
import { TRANSPORTERS } from '@/lib/categories';
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from '@/lib/payments';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/common/EmptyState';
import SmartImage from '@/components/common/SmartImage';
import ConfirmDialog from '@/components/common/ConfirmDialog';
import { ListSkeleton } from '@/components/common/StateViews';
import type { Order } from '@/lib/types';
import { toast } from 'sonner';

const STATUS_MAP: Record<string, { label: string; color: string; icon: typeof Clock; emoji: string }> = {
  pending_payment: { label: 'Aguardando pagamento', color: 'bg-warning/10 text-warning-strong', icon: Clock, emoji: '⏳' },
  paid: { label: 'Pago — aguardando envio', color: 'bg-info/10 text-info', icon: CheckCircle, emoji: '💳' },
  shipped: { label: 'Enviado — em trânsito', color: 'bg-info/10 text-info', icon: Truck, emoji: '🚚' },
  delivered: { label: 'Entregue — aguardando confirmação', color: 'bg-warning/10 text-warning-strong', icon: Package, emoji: '📦' },
  completed: { label: 'Concluído', color: 'bg-success/10 text-success', icon: CheckCircle, emoji: '✅' },
  disputed: { label: 'Em análise', color: 'bg-destructive/10 text-destructive', icon: AlertTriangle, emoji: '⚠️' },
  refunded: { label: 'Estornado', color: 'bg-muted text-muted-foreground', icon: AlertTriangle, emoji: '↩️' },
  cancelled: { label: 'Cancelado', color: 'bg-muted text-muted-foreground', icon: AlertTriangle, emoji: '❌' },
};

/**
 * Compras e vendas.
 *
 * Mudanças na 5.0: a conclusão do pedido não cria mais lançamentos de carteira
 * — o repasse é feito pelo provedor de pagamento e a tela apenas registra o
 * status. O comprovante de cada pedido é acessível pelo recibo do pagamento.
 */
export default function MyOrders() {
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  const navigate = useNavigate();
  useStoreVersion();

  const [tab, setTab] = useState('purchases');
  const [statusFilter, setStatusFilter] = useState('all');
  const [trackingDialog, setTrackingDialog] = useState<Order | null>(null);
  const [trackingCode, setTrackingCode] = useState('');
  const [carrier, setCarrier] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<Order | null>(null);

  if (loading) {
    return (
      <div>
        <AppHeader title="Minhas negociações" />
        <div className="px-4 py-4"><ListSkeleton count={3} /></div>
      </div>
    );
  }
  if (!user) return null;

  const orders = orderStore.filter(o => o.buyer_email === user.email || o.seller_email === user.email);
  const purchases = orders.filter(o => o.buyer_email === user.email);
  const sales = orders.filter(o => o.seller_email === user.email);
  let currentOrders = tab === 'purchases' ? purchases : sales;

  if (statusFilter === 'active') {
    currentOrders = currentOrders.filter(o => !['completed', 'cancelled', 'refunded'].includes(o.status));
  } else if (statusFilter === 'completed') {
    currentOrders = currentOrders.filter(o => o.status === 'completed');
  } else if (statusFilter === 'cancelled') {
    currentOrders = currentOrders.filter(o => ['cancelled', 'refunded'].includes(o.status));
  }

  const confirmDelivery = () => {
    const order = confirmTarget;
    if (!order) return;
    if (order.buyer_email !== user.email) {
      toast.error('Apenas o comprador pode confirmar o recebimento');
      return;
    }
    if (order.status !== 'shipped') {
      toast.error('Este pedido ainda não foi enviado');
      return;
    }
    const now = new Date().toISOString();
    orderStore.update(order.id, {
      status: 'completed',
      status_history: [...(order.status_history || []), { status: 'completed', date: now }],
    });
    notificationStore.create({
      recipient_email: order.seller_email,
      type: 'order_completed',
      title: 'Repasse liberado',
      message: `${user.full_name} confirmou o recebimento de "${order.listing_title}". O valor de ${formatCurrency(order.seller_amount)} foi liberado para a sua conta.`,
      action_url: '/meus-pagamentos',
      read: false,
      created_at: now,
    } as any);
    toast.success('Recebimento confirmado!', {
      description: 'O repasse ao vendedor foi liberado.',
    });
    setConfirmTarget(null);
  };

  const addTracking = () => {
    if (!trackingDialog) return;
    if (!carrier) {
      toast.error('Selecione a transportadora ou a forma de entrega');
      return;
    }
    if (carrier !== 'Retirada no local' && trackingCode.trim().length < 5) {
      toast.error('Informe um código de rastreio válido');
      return;
    }
    const now = new Date().toISOString();
    orderStore.update(trackingDialog.id, {
      tracking_code: trackingCode.trim() || 'Retirada no local',
      tracking_carrier: carrier,
      status: 'shipped',
      status_history: [...(trackingDialog.status_history || []), { status: 'shipped', date: now }],
    });
    notificationStore.create({
      recipient_email: trackingDialog.buyer_email,
      type: 'order_shipped',
      title: 'Pedido enviado',
      message: `O vendedor informou o envio de "${trackingDialog.listing_title}".`,
      action_url: '/meus-pedidos',
      read: false,
      created_at: now,
    } as any);
    toast.success('Envio confirmado! O comprador foi notificado.');
    setTrackingDialog(null);
    setTrackingCode('');
    setCarrier('');
  };

  const openChat = (order: Order) => {
    const otherEmail = order.buyer_email === user.email ? order.seller_email : order.buyer_email;
    const otherName = order.buyer_email === user.email ? order.seller_name : order.buyer_name;
    const convId = [user.email, otherEmail, order.listing_id].sort().join('_');
    const existing = messageStore.filter(m => m.conversation_id === convId);
    if (existing.length === 0) {
      messageStore.create({
        conversation_id: convId,
        listing_id: order.listing_id,
        listing_title: order.listing_title,
        listing_image: order.listing_image,
        listing_price: order.amount,
        sender_email: user.email,
        sender_name: user.full_name,
        recipient_email: otherEmail,
        recipient_name: otherName,
        content: `Olá! Sobre o pedido "${order.listing_title}".`,
        read: false,
        created_date: new Date().toISOString(),
      } as any);
    }
    navigate(`/chat/${convId}`);
  };

  const getNextStep = (order: Order, isBuyer: boolean) => {
    if (order.status === 'pending_payment') {
      return isBuyer
        ? { text: 'Pague o boleto para o vendedor liberar o envio.', info: 'O material fica reservado até o vencimento.' }
        : { text: 'O comprador gerou um boleto e ainda não pagou.', info: 'Você é avisado assim que o pagamento for compensado.' };
    }
    if (order.status === 'paid') {
      return isBuyer
        ? { text: 'O vendedor foi notificado e está preparando o envio.', info: 'Se não receber o código de rastreio em 5 dias, fale com ele pelo chat.' }
        : { text: 'Pagamento confirmado! Prepare o material para envio.', info: 'Prazo recomendado: 5 dias úteis.' };
    }
    if (order.status === 'shipped') {
      return isBuyer
        ? { text: 'Seu pedido está a caminho.', info: 'Confirme somente depois de conferir o material.' }
        : { text: 'Aguardando o comprador confirmar o recebimento.', info: `Após a confirmação, o repasse de ${formatCurrency(order.seller_amount)} é liberado para a sua conta.` };
    }
    if (order.status === 'completed') {
      return { text: 'Negociação concluída com sucesso. 🎉', info: '' };
    }
    return null;
  };

  return (
    <div>
      <AppHeader title="Minhas negociações" />
      <div className="px-4 py-3">
        <Tabs value={tab} onValueChange={setTab} className="mb-3">
          <TabsList className="w-full">
            <TabsTrigger value="purchases" className="flex-1 gap-1 text-xs">
              <ShoppingBag className="w-3.5 h-3.5" /> Compras ({purchases.length})
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex-1 gap-1 text-xs">
              <Package className="w-3.5 h-3.5" /> Vendas ({sales.length})
            </TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-3 scrollbar-hide">
          {[
            { k: 'all', l: 'Todos' },
            { k: 'active', l: 'Em andamento' },
            { k: 'completed', l: 'Concluídos' },
            { k: 'cancelled', l: 'Cancelados' },
          ].map(f => (
            <button
              key={f.k}
              type="button"
              onClick={() => setStatusFilter(f.k)}
              aria-pressed={statusFilter === f.k}
              className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                statusFilter === f.k
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border'
              }`}
            >
              {f.l}
            </button>
          ))}
        </div>

        {currentOrders.length === 0 ? (
          <EmptyState
            icon={<ShoppingBag className="w-12 h-12" />}
            title={tab === 'purchases' ? 'Nenhuma compra ainda' : 'Nenhuma venda ainda'}
            description={
              tab === 'purchases'
                ? 'Quando você comprar um material, o pedido aparece aqui com o status da entrega.'
                : 'Quando alguém comprar um dos seus anúncios, a venda aparece aqui.'
            }
            action={
              <Button asChild>
                <Link to="/marketplace">Explorar anúncios</Link>
              </Button>
            }
          />
        ) : (
          <div className="space-y-3">
            {currentOrders.map(order => {
              const status = STATUS_MAP[order.status] || STATUS_MAP.pending_payment;
              const isBuyer = order.buyer_email === user.email;
              const nextStep = getNextStep(order, isBuyer);
              const payment = order.payment_id ? paymentStore.get(order.payment_id) : undefined;

              return (
                <Card key={order.id} className="overflow-hidden animate-fade-in">
                  <div className="p-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                        <SmartImage
                          src={order.listing_image}
                          alt={order.listing_title}
                          slot="thumb"
                          fallback={<Package className="w-6 h-6 text-muted-foreground/30" />}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm line-clamp-2 leading-tight">{order.listing_title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isBuyer ? `Vendedor: ${order.seller_name}` : `Comprador: ${order.buyer_name}`} ·{' '}
                          {formatRelativeDate(order.created_date)}
                        </p>
                      </div>
                      <p className="text-primary font-bold text-sm shrink-0 tabular-nums">
                        {formatCurrency(order.amount)}
                      </p>
                    </div>

                    <div className={`${status.color} rounded-lg px-3 py-2 text-xs font-medium mb-2`}>
                      {status.emoji} {status.label}
                    </div>

                    {/* Resumo do pagamento direto */}
                    {payment && (
                      <div className="flex items-center gap-2 mb-2 text-xs text-muted-foreground flex-wrap">
                        <Badge variant="outline" className="text-[10px] gap-1">
                          <Receipt className="w-2.5 h-2.5" />
                          {PAYMENT_METHOD_LABEL[payment.method]}
                        </Badge>
                        <Badge
                          className={`text-[10px] border-0 ${
                            payment.status === 'approved'
                              ? 'bg-success/10 text-success'
                              : payment.status === 'pending'
                                ? 'bg-warning/10 text-warning-strong'
                                : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {PAYMENT_STATUS_LABEL[payment.status]}
                        </Badge>
                        <span className="font-mono text-[10px]">{payment.receipt_code}</span>
                      </div>
                    )}

                    {order.tracking_code && (
                      <p className="text-xs flex items-center gap-1 text-muted-foreground mb-2">
                        <Truck className="w-3 h-3" /> {order.tracking_carrier}: {order.tracking_code}
                      </p>
                    )}

                    {nextStep && (
                      <div className="bg-muted/50 border border-dashed rounded-lg p-3 mb-2">
                        <p className="text-xs font-semibold mb-1">O que fazer agora</p>
                        <p className="text-xs text-muted-foreground">{nextStep.text}</p>
                        {nextStep.info && (
                          <p className="text-[10px] text-muted-foreground mt-1">{nextStep.info}</p>
                        )}
                      </div>
                    )}

                    <div className="flex gap-2 flex-wrap">
                      {isBuyer && order.status === 'shipped' && (
                        <Button size="sm" className="h-9 text-xs gap-1" onClick={() => setConfirmTarget(order)}>
                          <CheckCircle className="w-3.5 h-3.5" /> Confirmar recebimento
                        </Button>
                      )}
                      {!isBuyer && order.status === 'paid' && (
                        <Button size="sm" className="h-9 text-xs gap-1" onClick={() => setTrackingDialog(order)}>
                          <Truck className="w-3.5 h-3.5" /> Informar envio
                        </Button>
                      )}
                      {isBuyer && order.status === 'pending_payment' && payment && (
                        <Button
                          size="sm"
                          className="h-9 text-xs gap-1"
                          onClick={() => navigate(`/pagamento/recibo/${payment.id}`)}
                        >
                          <Barcode className="w-3.5 h-3.5" /> Ver boleto
                        </Button>
                      )}
                      {payment && order.status !== 'pending_payment' && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-9 text-xs gap-1"
                          onClick={() => navigate(`/pagamento/recibo/${payment.id}`)}
                        >
                          <Receipt className="w-3.5 h-3.5" /> Comprovante
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-9 text-xs gap-1"
                        onClick={() => openChat(order)}
                      >
                        <MessageSquare className="w-3.5 h-3.5" /> Conversar
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(confirmTarget)}
        onOpenChange={open => !open && setConfirmTarget(null)}
        title="Confirmar que recebeu o material?"
        description="Confirmar libera o repasse ao vendedor pelo mesmo método de pagamento da compra. Faça isso somente depois de conferir o material — esta ação não pode ser desfeita."
        confirmLabel="Confirmar que recebi"
        onConfirm={confirmDelivery}
      />

      <Dialog open={Boolean(trackingDialog)} onOpenChange={open => !open && setTrackingDialog(null)}>
        <DialogContent className="max-w-sm mx-4 rounded-2xl">
          <DialogHeader><DialogTitle>Informar envio</DialogTitle></DialogHeader>
          <div className="py-2 space-y-3">
            <div>
              <Label>Transportadora ou forma de entrega</Label>
              <Select value={carrier} onValueChange={setCarrier}>
                <SelectTrigger className="mt-1 h-12"><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {TRANSPORTERS.map(t => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {carrier === 'Retirada no local' ? (
              <Card className="p-3 bg-muted">
                <p className="text-xs">
                  O comprador vai retirar pessoalmente. Combine endereço e horário pelo chat.
                </p>
              </Card>
            ) : (
              <div>
                <Label htmlFor="tracking-code">Código de rastreio</Label>
                <Input
                  id="tracking-code"
                  placeholder="Ex.: BR123456789BR"
                  value={trackingCode}
                  onChange={e => setTrackingCode(e.target.value.toUpperCase())}
                  className="mt-1 h-12"
                />
              </div>
            )}
            <p className="text-xs text-muted-foreground">O comprador é notificado automaticamente.</p>
          </div>
          <DialogFooter className="flex-col gap-2">
            <Button className="w-full h-11" onClick={addTracking}>Confirmar envio</Button>
            <Button variant="outline" className="w-full" onClick={() => setTrackingDialog(null)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
