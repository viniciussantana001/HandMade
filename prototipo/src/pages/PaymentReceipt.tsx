import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Check,
  Copy,
  Barcode,
  QrCode,
  CreditCard,
  Download,
  ShoppingBag,
  MessageSquare,
  Clock,
  ShieldCheck,
  Share2,
  Package,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { paymentStore, orderStore, useStoreVersion } from '@/lib/store';
import { useAuth } from '@/lib/AuthContext';
import { useRequireAuth } from '@/lib/session';
import { formatCurrency, formatDateTimeBR, formatDateBR } from '@/lib/formatters';
import { PAYMENT_METHOD_LABEL, PAYMENT_STATUS_LABEL, confirmBoletoPayment } from '@/lib/payments';
import AppHeader from '@/components/layout/AppHeader';
import SmartImage from '@/components/common/SmartImage';
import { LoadingScreen } from '@/components/common/StateViews';
import { toast } from 'sonner';

/**
 * Recibo do pagamento direto — etapa 3 do fluxo B3.
 *
 * Mostra o comprovante completo (código, autorização, método, valores e taxa),
 * o código PIX ou a linha digitável quando aplicável, e os próximos passos.
 */
export default function PaymentReceipt() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { loading } = useRequireAuth();
  useStoreVersion();
  const [celebrate, setCelebrate] = useState(true);

  const payment = paymentStore.get(id || '');
  const order = payment ? orderStore.get(payment.order_id) : undefined;

  useEffect(() => {
    const timer = window.setTimeout(() => setCelebrate(false), 2200);
    return () => window.clearTimeout(timer);
  }, []);

  if (loading) return <LoadingScreen label="Carregando o recibo…" />;
  if (!user) return null;

  if (!payment) {
    return (
      <div>
        <AppHeader title="Recibo" />
        <div className="px-4 py-20 text-center">
          <p className="text-lg font-bold mb-2">Recibo não encontrado</p>
          <p className="text-sm text-muted-foreground mb-4">
            Este comprovante pode ter sido removido do armazenamento local do protótipo.
          </p>
          <Button asChild>
            <Link to="/meus-pedidos">Ver meus pedidos</Link>
          </Button>
        </div>
      </div>
    );
  }

  const approved = payment.status === 'approved';
  const pending = payment.status === 'pending';

  const copyToClipboard = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      toast.success(`${label} copiado`);
    } catch {
      toast.error('Não foi possível copiar. Selecione o código manualmente.');
    }
  };

  const downloadReceipt = () => {
    const lines = [
      'HANDMADE — COMPROVANTE DE PAGAMENTO',
      '=========================================',
      `Recibo:          ${payment.receipt_code}`,
      `Status:          ${PAYMENT_STATUS_LABEL[payment.status]}`,
      `Data:            ${formatDateTimeBR(payment.paid_at || payment.created_at)}`,
      `Método:          ${PAYMENT_METHOD_LABEL[payment.method]}`,
      payment.installments && payment.installments > 1 ? `Parcelas:        ${payment.installments}x` : '',
      payment.card_last4 ? `Cartão:          ${payment.card_brand} •••• ${payment.card_last4}` : '',
      payment.authorization_code ? `Autorização:     ${payment.authorization_code}` : '',
      '-----------------------------------------',
      `Material:        ${order?.listing_title || '—'}`,
      `Vendedor:        ${order?.seller_name || payment.payee_email}`,
      `Comprador:       ${order?.buyer_name || payment.payer_email}`,
      '-----------------------------------------',
      `Valor pago:      ${formatCurrency(payment.amount)}`,
      `Taxa HandMade:   ${formatCurrency(payment.platform_fee)} (${payment.fee_percent_applied}%)`,
      `Vendedor recebe: ${formatCurrency(payment.net_amount)}`,
      '=========================================',
      'Documento gerado pelo protótipo HandMade 5.0.',
      'Não possui validade fiscal.',
    ].filter(Boolean);

    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `recibo-${payment.receipt_code}.txt`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success('Comprovante baixado');
  };

  const confirmBoleto = () => {
    const updated = confirmBoletoPayment(payment.id);
    if (updated) {
      toast.success('Pagamento compensado! O vendedor foi avisado.');
    }
  };

  const MethodIcon = payment.method === 'pix' ? QrCode : payment.method === 'boleto' ? Barcode : CreditCard;

  return (
    <div>
      <AppHeader title="Comprovante" />
      <div className="px-4 py-4">
        {/* Cabeçalho de status */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', stiffness: 220, damping: 18 }}
          className="text-center mb-5"
        >
          <div
            className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-3 ${
              approved ? 'bg-success/10' : 'bg-warning/10'
            }`}
          >
            {approved ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.15, type: 'spring', stiffness: 260, damping: 14 }}
              >
                <Check className="w-10 h-10 text-success" strokeWidth={3} />
              </motion.div>
            ) : (
              <Clock className="w-9 h-9 text-warning-strong" />
            )}
          </div>
          <h1 className="text-xl font-bold">
            {approved ? 'Pagamento aprovado!' : 'Boleto gerado'}
          </h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-xs mx-auto">
            {approved
              ? 'O vendedor já foi avisado e vai combinar a entrega ou a retirada com você.'
              : 'Assim que o pagamento for compensado, o vendedor é liberado para o envio.'}
          </p>
          <p className="text-2xl font-bold text-primary mt-3 tabular-nums">
            {formatCurrency(payment.amount)}
          </p>
        </motion.div>

        {/* PIX */}
        {payment.method === 'pix' && payment.pix_code && (
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <QrCode className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Código PIX (copia e cola)</p>
            </div>
            <div className="bg-muted rounded-xl p-3 mb-2">
              <p className="text-[10px] font-mono break-all leading-relaxed text-muted-foreground">
                {payment.pix_code}
              </p>
            </div>
            <Button
              variant="outline"
              className="w-full h-11 gap-2"
              onClick={() => copyToClipboard(payment.pix_code!, 'Código PIX')}
            >
              <Copy className="w-4 h-4" /> Copiar código
            </Button>
          </Card>
        )}

        {/* Boleto */}
        {payment.method === 'boleto' && payment.boleto_line && (
          <Card className="p-4 mb-4">
            <div className="flex items-center gap-2 mb-3">
              <Barcode className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold">Linha digitável</p>
            </div>
            <div className="bg-muted rounded-xl p-3 mb-2">
              <p className="text-xs font-mono break-all leading-relaxed tabular-nums">
                {payment.boleto_line}
              </p>
            </div>
            {payment.boleto_due_date && (
              <p className="text-xs text-muted-foreground mb-2">
                Vencimento: <strong>{formatDateBR(payment.boleto_due_date)}</strong>
              </p>
            )}
            <Button
              variant="outline"
              className="w-full h-11 gap-2 mb-2"
              onClick={() => copyToClipboard(payment.boleto_line!, 'Linha digitável')}
            >
              <Copy className="w-4 h-4" /> Copiar linha digitável
            </Button>
            {pending && (
              <Button className="w-full h-11 gap-2" onClick={confirmBoleto}>
                <Check className="w-4 h-4" /> Simular compensação
              </Button>
            )}
          </Card>
        )}

        {/* Detalhes do comprovante */}
        <Card className="p-4 mb-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Detalhes do pagamento
            </p>
            <Badge
              className={`border-0 text-[10px] ${
                approved ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning-strong'
              }`}
            >
              {PAYMENT_STATUS_LABEL[payment.status]}
            </Badge>
          </div>

          {order && (
            <>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0">
                  <SmartImage
                    src={order.listing_image}
                    alt={order.listing_title}
                    slot="thumb"
                    fallback={<Package className="w-6 h-6 text-muted-foreground/30" />}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium line-clamp-2">{order.listing_title}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Vendedor: {order.seller_name}</p>
                </div>
              </div>
              <Separator className="mb-3" />
            </>
          )}

          <dl className="space-y-2 text-sm">
            <Row label="Recibo" value={payment.receipt_code} mono />
            {payment.authorization_code && (
              <Row label="Autorização" value={payment.authorization_code} mono />
            )}
            <Row
              label="Data e hora"
              value={formatDateTimeBR(payment.paid_at || payment.created_at)}
            />
            <Row
              label="Método"
              value={
                <span className="flex items-center gap-1.5">
                  <MethodIcon className="w-3.5 h-3.5 text-muted-foreground" />
                  {PAYMENT_METHOD_LABEL[payment.method]}
                  {payment.card_last4 && ` •••• ${payment.card_last4}`}
                </span>
              }
            />
            {payment.installments && payment.installments > 1 && (
              <Row
                label="Parcelamento"
                value={`${payment.installments}x de ${formatCurrency(payment.amount / payment.installments)}`}
              />
            )}
          </dl>

          <Separator className="my-3" />

          <dl className="space-y-2 text-sm">
            <Row label="Valor pago" value={formatCurrency(payment.amount)} strong />
            <Row
              label={`Taxa de serviço (${payment.fee_percent_applied}%)`}
              value={formatCurrency(payment.platform_fee)}
              muted
            />
            <Row label="O vendedor recebe" value={formatCurrency(payment.net_amount)} muted />
          </dl>
        </Card>

        <Card className="p-3 mb-4 bg-primary/5 border-primary/20">
          <div className="flex items-start gap-2">
            <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Guarde este comprovante. Em caso de problema com a entrega, você tem 7 dias para pedir
              a devolução do valor pelo mesmo método de pagamento.
            </p>
          </div>
        </Card>

        <div className="space-y-2">
          <Button variant="outline" className="w-full h-11 gap-2" onClick={downloadReceipt}>
            <Download className="w-4 h-4" /> Baixar comprovante
          </Button>
          <Button className="w-full h-12 gap-2" onClick={() => navigate('/meus-pedidos')}>
            <ShoppingBag className="w-4 h-4" /> Acompanhar meu pedido
          </Button>
          {order && (
            <Button
              variant="outline"
              className="w-full h-11 gap-2"
              onClick={() =>
                navigate(
                  `/chat/${[order.buyer_email, order.seller_email, order.listing_id].sort().join('_')}`
                )
              }
            >
              <MessageSquare className="w-4 h-4" /> Falar com o vendedor
            </Button>
          )}
          <Button asChild variant="ghost" className="w-full h-11">
            <Link to="/marketplace" className="block">
              Continuar explorando
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

function Row({
  label,
  value,
  mono,
  strong,
  muted,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
  strong?: boolean;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className={`text-xs ${muted ? 'text-muted-foreground' : 'text-muted-foreground'}`}>{label}</dt>
      <dd
        className={`text-right ${mono ? 'font-mono text-xs' : 'text-sm'} ${
          strong ? 'font-bold' : muted ? 'text-muted-foreground' : 'font-medium'
        } tabular-nums`}
      >
        {value}
      </dd>
    </div>
  );
}
