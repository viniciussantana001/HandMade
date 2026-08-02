import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Receipt, QrCode, CreditCard, Barcode, ArrowUpRight, ArrowDownLeft, Sparkles, ChevronRight, Info,
} from 'lucide-react';
import { paymentStore, orderStore, useStoreVersion } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency, formatRelativeDate } from '@/lib/formatters';
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL } from '@/lib/payments';
import AppHeader from '@/components/layout/AppHeader';
import EmptyState from '@/components/common/EmptyState';
import { ListSkeleton } from '@/components/common/StateViews';
import type { PaymentMethod } from '@/lib/types';

/**
 * Meus pagamentos (B3).
 *
 * Substitui a tela de Carteira: em lugar de saldo, depósito e saque, mostra o
 * histórico de pagamentos diretos — o que você pagou, o que recebeu e o
 * comprovante de cada operação.
 */
export default function MyPayments() {
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  const navigate = useNavigate();
  useStoreVersion();
  const [tab, setTab] = useState('all');

  if (loading) {
    return (
      <div>
        <AppHeader showBack title="Meus pagamentos" />
        <div className="px-4 py-4"><ListSkeleton count={4} /></div>
      </div>
    );
  }
  if (!user) return null;

  const paid = paymentStore.filter(p => p.payer_email === user.email);
  const received = paymentStore.filter(p => p.payee_email === user.email);

  const totalPaid = paid
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.amount, 0);
  const totalReceived = received
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.net_amount, 0);
  const totalFees = received
    .filter(p => p.status === 'approved')
    .reduce((sum, p) => sum + p.platform_fee, 0);

  const list = tab === 'paid' ? paid : tab === 'received' ? received : [...paid, ...received]
    .filter((p, i, arr) => arr.findIndex(x => x.id === p.id) === i)
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const methodIcon = (method: PaymentMethod) =>
    method === 'pix' ? QrCode : method === 'credit_card' ? CreditCard : Barcode;

  return (
    <div>
      <AppHeader showBack title="Meus pagamentos" />
      <div className="px-4 py-4">
        {/* Resumo */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          <Card>
            <CardContent className="p-3">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center mb-2">
                <ArrowDownLeft className="w-4 h-4 text-success" />
              </div>
              <p className="text-lg font-bold tabular-nums leading-none">
                {formatCurrency(totalReceived)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">recebido em vendas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-3">
              <div className="w-8 h-8 rounded-lg bg-info/10 flex items-center justify-center mb-2">
                <ArrowUpRight className="w-4 h-4 text-info" />
              </div>
              <p className="text-lg font-bold tabular-nums leading-none">
                {formatCurrency(totalPaid)}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">pago em compras</p>
            </CardContent>
          </Card>
        </div>

        {totalFees > 0 && (
          <Card className="p-3 mb-3 bg-muted/50">
            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">Taxas de serviço descontadas</p>
              <p className="text-sm font-semibold tabular-nums">{formatCurrency(totalFees)}</p>
            </div>
          </Card>
        )}

        <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-2">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              Na HandMade o pagamento é direto: o valor sai da sua conta para a do vendedor pelo
              método escolhido. Não existe saldo na plataforma, então também não há depósito nem
              saque a fazer.
            </p>
          </div>
        </Card>

        <Tabs value={tab} onValueChange={setTab} className="mb-3">
          <TabsList className="w-full">
            <TabsTrigger value="all" className="flex-1 text-xs">Todos</TabsTrigger>
            <TabsTrigger value="paid" className="flex-1 text-xs">Pagos ({paid.length})</TabsTrigger>
            <TabsTrigger value="received" className="flex-1 text-xs">Recebidos ({received.length})</TabsTrigger>
          </TabsList>
        </Tabs>

        {list.length === 0 ? (
          <EmptyState
            icon={<Receipt className="w-12 h-12" />}
            title="Nenhum pagamento ainda"
            description="Quando você comprar ou vender um material, o comprovante do pagamento aparece aqui."
            action={
              <Button asChild>
                <Link to="/marketplace">Explorar anúncios</Link>
              </Button>
            }
          />
        ) : (
          <Card className="divide-y">
            {list.map(payment => {
              const MethodIcon = methodIcon(payment.method);
              const isIncoming = payment.payee_email === user.email;
              const isBoost = payment.order_id.startsWith('boost_');
              const order = isBoost ? undefined : orderStore.get(payment.order_id);
              const displayAmount = isIncoming ? payment.net_amount : payment.amount;

              return (
                <button
                  key={payment.id}
                  type="button"
                  onClick={() => navigate(`/pagamento/recibo/${payment.id}`)}
                  className="w-full flex items-center gap-3 p-3 text-left active:bg-muted transition-colors"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                      isBoost
                        ? 'bg-warning/10 text-warning-strong'
                        : isIncoming
                          ? 'bg-success/10 text-success'
                          : 'bg-info/10 text-info'
                    }`}
                  >
                    {isBoost ? <Sparkles className="w-5 h-5" /> : <MethodIcon className="w-5 h-5" />}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {isBoost
                        ? 'Impulsionamento de anúncio'
                        : order?.listing_title || 'Pagamento'}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                      <span className="text-[11px] text-muted-foreground">
                        {PAYMENT_METHOD_LABEL[payment.method]}
                      </span>
                      <span className="text-[11px] text-muted-foreground">·</span>
                      <span className="text-[11px] text-muted-foreground">
                        {formatRelativeDate(payment.created_at)}
                      </span>
                      <Badge
                        className={`text-[9px] px-1.5 py-0 border-0 ${
                          payment.status === 'approved'
                            ? 'bg-success/10 text-success'
                            : payment.status === 'pending'
                              ? 'bg-warning/10 text-warning-strong'
                              : payment.status === 'declined'
                                ? 'bg-destructive/10 text-destructive'
                                : 'bg-muted text-muted-foreground'
                        }`}
                      >
                        {PAYMENT_STATUS_LABEL[payment.status]}
                      </Badge>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-mono mt-0.5">
                      {payment.receipt_code}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <p
                      className={`text-sm font-bold tabular-nums ${
                        payment.status !== 'approved'
                          ? 'text-muted-foreground'
                          : isIncoming
                            ? 'text-success'
                            : ''
                      }`}
                    >
                      {isIncoming ? '+' : '−'}
                      {formatCurrency(displayAmount)}
                    </p>
                    {isIncoming && payment.platform_fee > 0 && (
                      <p className="text-[9px] text-muted-foreground">
                        taxa {formatCurrency(payment.platform_fee)}
                      </p>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-muted-foreground ml-auto mt-0.5" />
                  </div>
                </button>
              );
            })}
          </Card>
        )}

        <Separator className="my-4" />

        <Button asChild variant="outline" className="w-full h-11 gap-2">
          <Link to="/tributos" className="block">
            <Receipt className="w-4 h-4" /> Tributos e nota fiscal
          </Link>
        </Button>
      </div>
    </div>
  );
}
